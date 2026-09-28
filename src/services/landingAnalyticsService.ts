// Landing Page Visitor Tracking & Analytics Service for MarkNCode
// Real-time Visitor & QR Code Tracking with Dual-Layer Cloud Synchronization
// Enables cross-device live counting: mobile phones, QR scans, laptops, and admin dashboard sync seamlessly.

import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export interface LandingPageVisitLog {
  id: string;
  timestamp: string;
  referrer: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  sourceParam?: string;
}

export interface LandingPageClickLog {
  id: string;
  timestamp: string;
  buttonName: 'facebook' | 'instagram' | 'website' | 'whatsapp' | 'call' | 'services' | 'bot_doctor' | 'ad_tool';
  label: string;
}

export interface LandingAnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastUpdated: string;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  referrerStats: {
    facebook: number;
    instagram: number;
    direct: number;
    website: number;
    tiktok: number;
    google: number;
    qr: number;
    other: number;
  };
  clicks: {
    facebook: number;
    instagram: number;
    website: number;
    whatsapp: number;
    call: number;
    services: number;
    bot_doctor: number;
    ad_tool: number;
  };
  recentVisits: LandingPageVisitLog[];
  recentClicks: LandingPageClickLog[];
  dailyVisits: { [dateStr: string]: number };
}

const STORAGE_KEY_ANALYTICS = 'mnc_landing_page_analytics_v1';
const STORAGE_KEY_VISITOR_ID = 'mnc_visitor_uuid_v1';
const STORAGE_KEY_SESSION_VISIT = 'mnc_last_landing_visit_timestamp';
const SYNC_CHANNEL_NAME = 'mnc_landing_analytics_sync';

// Cloud Synchronization Endpoints
const CLOUD_OBJECT_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0e9ec0c7f3866';
const CLOUD_KV_BASE = 'https://keyvalue.immanuel.co/api/KeyVal';
const CLOUD_KV_APP_KEY = 'hr4hcm6c';

// Default initial state
const DEFAULT_ANALYTICS: LandingAnalyticsData = {
  totalVisits: 0,
  uniqueVisitors: 0,
  todayVisits: 0,
  lastUpdated: new Date().toISOString(),
  deviceStats: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  referrerStats: {
    facebook: 0,
    instagram: 0,
    direct: 0,
    website: 0,
    tiktok: 0,
    google: 0,
    qr: 0,
    other: 0,
  },
  clicks: {
    facebook: 0,
    instagram: 0,
    website: 0,
    whatsapp: 0,
    call: 0,
    services: 0,
    bot_doctor: 0,
    ad_tool: 0,
  },
  recentVisits: [],
  recentClicks: [],
  dailyVisits: {},
};

// Helper: Broadcast sync across browser tabs on the same device
function broadcastSync(): void {
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
      bc.postMessage({ type: 'ANALYTICS_UPDATED', timestamp: Date.now() });
      bc.close();
    }
  } catch (e) {}
}

// Helper: Detect Device
function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Helper: Detect Browser
function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Instagram')) return 'Instagram In-App';
  if (ua.includes('FBAN') || ua.includes('FBAV')) return 'Facebook In-App';
  return 'Browser';
}

// Helper: Detect Referrer or Source (Includes Dedicated QR Code detection)
function detectReferrerSource(customSource?: string): keyof LandingAnalyticsData['referrerStats'] {
  if (customSource) {
    const s = customSource.toLowerCase();
    if (s.includes('qr')) return 'qr';
    if (s.includes('fb') || s.includes('face')) return 'facebook';
    if (s.includes('insta') || s.includes('ig')) return 'instagram';
    if (s.includes('tik')) return 'tiktok';
    if (s.includes('site') || s.includes('web')) return 'website';
    if (s.includes('goog')) return 'google';
  }

  if (typeof window === 'undefined') return 'direct';

  // Check URL query parameters for QR code indicators or UTM tags
  const params = new URLSearchParams(window.location.search);
  const utmSource =
    params.get('utm_source')?.toLowerCase() ||
    params.get('ref')?.toLowerCase() ||
    params.get('src')?.toLowerCase() ||
    params.get('source')?.toLowerCase() ||
    params.get('origin')?.toLowerCase();

  if (utmSource) {
    if (utmSource.includes('qr')) return 'qr';
    if (utmSource.includes('fb') || utmSource.includes('facebook')) return 'facebook';
    if (utmSource.includes('insta') || utmSource.includes('instagram')) return 'instagram';
    if (utmSource.includes('tiktok')) return 'tiktok';
    if (utmSource.includes('google')) return 'google';
    if (utmSource.includes('site') || utmSource.includes('markncode')) return 'website';
  }

  // Parameter boolean check (?qr or ?qrcode)
  if (params.has('qr') || params.has('qrcode') || window.location.search.toLowerCase().includes('qr')) {
    return 'qr';
  }

  // Check document.referrer
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'direct';
  if (ref.includes('facebook.com') || ref.includes('fb.com') || ref.includes('m.facebook.com')) return 'facebook';
  if (ref.includes('instagram.com')) return 'instagram';
  if (ref.includes('tiktok.com')) return 'tiktok';
  if (ref.includes('google.com')) return 'google';
  if (ref.includes('markncode.com') || ref.includes(window.location.hostname)) return 'website';

  return 'other';
}

/**
 * Get current analytics data from local storage
 */
export function getLandingAnalytics(): LandingAnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYTICS);
    if (!raw) return { ...DEFAULT_ANALYTICS };
    const parsed = JSON.parse(raw);

    return {
      totalVisits: Number(parsed.totalVisits || 0),
      uniqueVisitors: Number(parsed.uniqueVisitors || 0),
      todayVisits: Number(parsed.todayVisits || 0),
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      deviceStats: {
        mobile: Number(parsed.deviceStats?.mobile || 0),
        desktop: Number(parsed.deviceStats?.desktop || 0),
        tablet: Number(parsed.deviceStats?.tablet || 0),
      },
      referrerStats: {
        facebook: Number(parsed.referrerStats?.facebook || 0),
        instagram: Number(parsed.referrerStats?.instagram || 0),
        direct: Number(parsed.referrerStats?.direct || 0),
        website: Number(parsed.referrerStats?.website || 0),
        tiktok: Number(parsed.referrerStats?.tiktok || 0),
        google: Number(parsed.referrerStats?.google || 0),
        qr: Number(parsed.referrerStats?.qr || 0),
        other: Number(parsed.referrerStats?.other || 0),
      },
      clicks: {
        facebook: Number(parsed.clicks?.facebook || 0),
        instagram: Number(parsed.clicks?.instagram || 0),
        website: Number(parsed.clicks?.website || 0),
        whatsapp: Number(parsed.clicks?.whatsapp || 0),
        call: Number(parsed.clicks?.call || 0),
        services: Number(parsed.clicks?.services || 0),
        bot_doctor: Number(parsed.clicks?.bot_doctor || 0),
        ad_tool: Number(parsed.clicks?.ad_tool || 0),
      },
      recentVisits: Array.isArray(parsed.recentVisits) ? parsed.recentVisits : [],
      recentClicks: Array.isArray(parsed.recentClicks) ? parsed.recentClicks : [],
      dailyVisits: parsed.dailyVisits && typeof parsed.dailyVisits === 'object' ? parsed.dailyVisits : {},
    };
  } catch (e) {
    return { ...DEFAULT_ANALYTICS };
  }
}

/**
 * Push new visit details to Cloud Hub asynchronously
 * Ensures visitor data from any mobile phone or QR scan reaches the Admin dashboard
 */
async function pushVisitToCloud(
  visitLog: LandingPageVisitLog,
  isNewUnique: boolean,
  referrer: keyof LandingAnalyticsData['referrerStats'],
  device: 'mobile' | 'desktop' | 'tablet'
): Promise<void> {
  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Log to Google Analytics 4 if active
  try {
    if (analytics) {
      logEvent(analytics as any, 'landing_page_visit', {
        source: referrer,
        device_category: device,
        is_qr: referrer === 'qr',
      });
    }
  } catch (e) {}

  // 2. Push to Primary Cloud Object Store
  try {
    const res = await fetch(CLOUD_OBJECT_URL, { cache: 'no-store' });
    if (res.ok) {
      const remote = await res.json();
      const data: LandingAnalyticsData = remote.data || { ...DEFAULT_ANALYTICS };

      data.totalVisits = (Number(data.totalVisits) || 0) + 1;
      if (isNewUnique) {
        data.uniqueVisitors = (Number(data.uniqueVisitors) || 0) + 1;
      }
      data.todayVisits = (Number(data.todayVisits) || 0) + 1;

      data.deviceStats = data.deviceStats || { mobile: 0, desktop: 0, tablet: 0 };
      data.deviceStats[device] = (Number(data.deviceStats[device]) || 0) + 1;

      data.referrerStats = data.referrerStats || { ...DEFAULT_ANALYTICS.referrerStats };
      data.referrerStats[referrer] = (Number(data.referrerStats[referrer]) || 0) + 1;

      data.dailyVisits = data.dailyVisits || {};
      data.dailyVisits[todayStr] = (Number(data.dailyVisits[todayStr]) || 0) + 1;

      data.recentVisits = [visitLog, ...(data.recentVisits || [])].slice(0, 50);
      data.lastUpdated = new Date().toISOString();

      await fetch(CLOUD_OBJECT_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'markncode_official_landing_analytics_v1',
          data,
        }),
      });
    }
  } catch (e) {
    console.warn('Primary cloud visit sync note:', e);
  }

  // 3. Increment Atomic KV Counter for high-speed cross-device backup
  try {
    if (referrer === 'qr') {
      const getQr = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/mnc_cloud_qr_visits`);
      const qrVal = await getQr.text();
      const currentQr = parseInt(qrVal.replace(/"/g, '').trim(), 10) || 0;
      await fetch(
        `${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/mnc_cloud_qr_visits/${currentQr + 1}`,
        { method: 'POST', headers: { 'Content-Length': '0' } }
      );
    }
  } catch (e) {}
}

/**
 * Push button click to Cloud Hub asynchronously
 */
async function pushClickToCloud(
  buttonName: 'facebook' | 'instagram' | 'website' | 'whatsapp' | 'call' | 'services' | 'bot_doctor' | 'ad_tool',
  label: string
): Promise<void> {
  try {
    if (analytics) {
      logEvent(analytics as any, 'landing_click', {
        button_name: buttonName,
        label,
      });
    }
  } catch (e) {}

  try {
    const res = await fetch(CLOUD_OBJECT_URL, { cache: 'no-store' });
    if (res.ok) {
      const remote = await res.json();
      const data: LandingAnalyticsData = remote.data || { ...DEFAULT_ANALYTICS };

      data.clicks = data.clicks || { ...DEFAULT_ANALYTICS.clicks };
      data.clicks[buttonName] = (Number(data.clicks[buttonName]) || 0) + 1;

      const clickLog: LandingPageClickLog = {
        id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        buttonName,
        label,
      };
      data.recentClicks = [clickLog, ...(data.recentClicks || [])].slice(0, 50);
      data.lastUpdated = new Date().toISOString();

      await fetch(CLOUD_OBJECT_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'markncode_official_landing_analytics_v1',
          data,
        }),
      });
    }
  } catch (e) {}
}

/**
 * Fetch and synchronize analytics data from Cloud Hub across all devices
 * Called by the Admin Dashboard to guarantee visitors from mobile QR scans appear immediately
 */
export async function syncLandingAnalyticsFromCloud(): Promise<LandingAnalyticsData> {
  const local = getLandingAnalytics();

  try {
    const res = await fetch(CLOUD_OBJECT_URL, { cache: 'no-store' });
    if (!res.ok) return local;

    const remote = await res.json();
    const cloud: LandingAnalyticsData = remote.data;
    if (!cloud || typeof cloud !== 'object') return local;

    // Check optional atomic QR counter
    let atomicQr = 0;
    try {
      const getQr = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/mnc_cloud_qr_visits`);
      if (getQr.ok) {
        const text = await getQr.text();
        atomicQr = parseInt(text.replace(/"/g, '').trim(), 10) || 0;
      }
    } catch (e) {}

    // Merge logic: Take highest count so counts never regress across devices
    const merged: LandingAnalyticsData = {
      totalVisits: Math.max(local.totalVisits, Number(cloud.totalVisits) || 0),
      uniqueVisitors: Math.max(local.uniqueVisitors, Number(cloud.uniqueVisitors) || 0),
      todayVisits: Math.max(local.todayVisits, Number(cloud.todayVisits) || 0),
      lastUpdated: new Date().toISOString(),
      deviceStats: {
        mobile: Math.max(local.deviceStats.mobile, Number(cloud.deviceStats?.mobile) || 0),
        desktop: Math.max(local.deviceStats.desktop, Number(cloud.deviceStats?.desktop) || 0),
        tablet: Math.max(local.deviceStats.tablet, Number(cloud.deviceStats?.tablet) || 0),
      },
      referrerStats: {
        facebook: Math.max(local.referrerStats.facebook, Number(cloud.referrerStats?.facebook) || 0),
        instagram: Math.max(local.referrerStats.instagram, Number(cloud.referrerStats?.instagram) || 0),
        direct: Math.max(local.referrerStats.direct, Number(cloud.referrerStats?.direct) || 0),
        website: Math.max(local.referrerStats.website, Number(cloud.referrerStats?.website) || 0),
        tiktok: Math.max(local.referrerStats.tiktok, Number(cloud.referrerStats?.tiktok) || 0),
        google: Math.max(local.referrerStats.google, Number(cloud.referrerStats?.google) || 0),
        qr: Math.max(local.referrerStats.qr, Number(cloud.referrerStats?.qr) || 0, atomicQr),
        other: Math.max(local.referrerStats.other, Number(cloud.referrerStats?.other) || 0),
      },
      clicks: {
        facebook: Math.max(local.clicks.facebook, Number(cloud.clicks?.facebook) || 0),
        instagram: Math.max(local.clicks.instagram, Number(cloud.clicks?.instagram) || 0),
        website: Math.max(local.clicks.website, Number(cloud.clicks?.website) || 0),
        whatsapp: Math.max(local.clicks.whatsapp, Number(cloud.clicks?.whatsapp) || 0),
        call: Math.max(local.clicks.call, Number(cloud.clicks?.call) || 0),
        services: Math.max(local.clicks.services, Number(cloud.clicks?.services) || 0),
        bot_doctor: Math.max(local.clicks.bot_doctor, Number(cloud.clicks?.bot_doctor) || 0),
        ad_tool: Math.max(local.clicks.ad_tool, Number(cloud.clicks?.ad_tool) || 0),
      },
      recentVisits: mergeRecentVisits(local.recentVisits, cloud.recentVisits || []),
      recentClicks: mergeRecentClicks(local.recentClicks, cloud.recentClicks || []),
      dailyVisits: { ...(cloud.dailyVisits || {}), ...local.dailyVisits },
    };

    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(merged));
    broadcastSync();
    return merged;
  } catch (e) {
    console.warn('Cloud sync offline or skipped, using local data:', e);
    return local;
  }
}

// Helper: Merge visit logs uniquely by ID
function mergeRecentVisits(local: LandingPageVisitLog[], remote: LandingPageVisitLog[]): LandingPageVisitLog[] {
  const map = new Map<string, LandingPageVisitLog>();
  for (const v of local) if (v?.id) map.set(v.id, v);
  for (const v of remote) if (v?.id) map.set(v.id, v);
  return Array.from(map.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);
}

// Helper: Merge click logs uniquely by ID
function mergeRecentClicks(local: LandingPageClickLog[], remote: LandingPageClickLog[]): LandingPageClickLog[] {
  const map = new Map<string, LandingPageClickLog>();
  for (const c of local) if (c?.id) map.set(c.id, c);
  for (const c of remote) if (c?.id) map.set(c.id, c);
  return Array.from(map.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);
}

/**
 * Record a visit to the landing page
 * Debounced per tab/session to avoid double counting on fast React strict mode re-mounts
 */
export function recordLandingVisit(customSource?: string): LandingAnalyticsData {
  const now = Date.now();
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Session debounce check (don't recount within 15 seconds on the same tab)
  const lastVisit = sessionStorage.getItem(STORAGE_KEY_SESSION_VISIT);
  if (lastVisit && now - Number(lastVisit) < 15000) {
    return getLandingAnalytics();
  }
  sessionStorage.setItem(STORAGE_KEY_SESSION_VISIT, String(now));

  const current = getLandingAnalytics();

  // Check unique visitor
  let isNewUniqueVisitor = false;
  let visitorId = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
  if (!visitorId) {
    visitorId = `v_${now}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY_VISITOR_ID, visitorId);
    isNewUniqueVisitor = true;
  }

  const device = detectDevice();
  const browser = detectBrowser();
  const referrer = detectReferrerSource(customSource);

  // Update counts locally
  const newTotalVisits = current.totalVisits + 1;
  const newUniqueVisitors = current.uniqueVisitors + (isNewUniqueVisitor ? 1 : 0);

  const previousTodayVisits = current.dailyVisits[todayStr] || 0;
  const newTodayVisits = previousTodayVisits + 1;
  const updatedDaily = {
    ...current.dailyVisits,
    [todayStr]: newTodayVisits,
  };

  const newDeviceStats = {
    ...current.deviceStats,
    [device]: (current.deviceStats[device] || 0) + 1,
  };

  const newReferrerStats = {
    ...current.referrerStats,
    [referrer]: (current.referrerStats[referrer] || 0) + 1,
  };

  const newVisitLog: LandingPageVisitLog = {
    id: `log_${now}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    referrer,
    device,
    browser,
    sourceParam: customSource || (typeof window !== 'undefined' ? window.location.search : ''),
  };

  const updatedRecentVisits = [newVisitLog, ...current.recentVisits].slice(0, 50);

  const updated: LandingAnalyticsData = {
    ...current,
    totalVisits: newTotalVisits,
    uniqueVisitors: newUniqueVisitors,
    todayVisits: newTodayVisits,
    lastUpdated: new Date().toISOString(),
    deviceStats: newDeviceStats,
    referrerStats: newReferrerStats,
    recentVisits: updatedRecentVisits,
    dailyVisits: updatedDaily,
  };

  try {
    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(updated));
    broadcastSync();
  } catch (e) {}

  // Push visit asynchronously to the Cloud Hub so Admin Dashboard sees it from any device
  pushVisitToCloud(newVisitLog, isNewUniqueVisitor, referrer, device);

  return updated;
}

/**
 * Record a button/link click on the landing page
 */
export function recordLandingClick(
  buttonName: 'facebook' | 'instagram' | 'website' | 'whatsapp' | 'call' | 'services' | 'bot_doctor' | 'ad_tool',
  label: string
): void {
  const current = getLandingAnalytics();
  const now = Date.now();

  const newClicks = {
    ...current.clicks,
    [buttonName]: (current.clicks[buttonName] || 0) + 1,
  };

  const newClickLog: LandingPageClickLog = {
    id: `clk_${now}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    buttonName,
    label,
  };

  const updatedRecentClicks = [newClickLog, ...current.recentClicks].slice(0, 50);

  const updated: LandingAnalyticsData = {
    ...current,
    clicks: newClicks,
    recentClicks: updatedRecentClicks,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(updated));
    broadcastSync();
  } catch (e) {}

  // Push click asynchronously to Cloud Hub
  pushClickToCloud(buttonName, label);
}

/**
 * Reset all landing analytics (Admin only)
 */
export async function resetLandingAnalytics(): Promise<void> {
  localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS));
  broadcastSync();

  try {
    await fetch(CLOUD_OBJECT_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'markncode_official_landing_analytics_v1',
        data: DEFAULT_ANALYTICS,
      }),
    });
    await fetch(`${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/mnc_cloud_qr_visits/0`, {
      method: 'POST',
      headers: { 'Content-Length': '0' },
    });
  } catch (e) {}
}

/**
 * Format a ready-to-share WhatsApp summary report
 */
export function getFormattedAnalyticsReport(data: LandingAnalyticsData): string {
  const mobilePercent =
    data.totalVisits > 0 ? Math.round((data.deviceStats.mobile / data.totalVisits) * 100) : 0;
  const desktopPercent =
    data.totalVisits > 0 ? Math.round((data.deviceStats.desktop / data.totalVisits) * 100) : 0;

  const totalClicks =
    data.clicks.facebook +
    data.clicks.instagram +
    data.clicks.website +
    data.clicks.whatsapp +
    data.clicks.call +
    data.clicks.services;

  const conversionRate =
    data.totalVisits > 0 ? ((totalClicks / data.totalVisits) * 100).toFixed(1) : '0.0';

  return `📊 تقرير إحصائيات لاندنج بيج MarknCode Agency:
━━━━━━━━━━━━━━━━━
👥 إجمالي الزيارات: ${data.totalVisits} زيارة
👤 الزوار الفريدين: ${data.uniqueVisitors} زائر
📅 زيارات اليوم: ${data.todayVisits} زيارة
⚡ معدل التفاعل والتحويل: ${conversionRate}%

📱 الأجهزة:
• الموبايل: ${mobilePercent}% (${data.deviceStats.mobile})
• الكمبيوتر: ${desktopPercent}% (${data.deviceStats.desktop})

🌐 مصادر الزيارات:
• 📱 مسح كود QR: ${data.referrerStats.qr || 0}
• 🔵 فيسبوك: ${data.referrerStats.facebook}
• 📸 إنستجرام: ${data.referrerStats.instagram}
• 🔗 دخول مباشر: ${data.referrerStats.direct}
• 🌐 الموقع الرسمي: ${data.referrerStats.website}

🔥 النقرات على الروابط:
• 🔵 فيسبوك: ${data.clicks.facebook}
• 📸 إنستجرام: ${data.clicks.instagram}
• 🌐 الموقع الرسمي: ${data.clicks.website}
• 💬 واتساب مباشر: ${data.clicks.whatsapp}
• 📞 مكالمات هاتفية: ${data.clicks.call}
• 🛠️ استكشاف الخدمات: ${data.clicks.services}
━━━━━━━━━━━━━━━━━
آخر تحديث: ${new Date().toLocaleTimeString('ar-EG')} - ${new Date().toLocaleDateString('ar-EG')}`;
}
