// Landing Page Visitor Tracking & Analytics Service for MarkNCode
// Real-time Visitor & QR Code Tracking with Ultra-Reliable Cloud Synchronization
// Enables instant live cross-device counting between phones, QR scanners, and Admin dashboard.

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

// Cloud Synchronization Configuration (keyvalue.immanuel.co - unlimited, zero-auth, high-speed KV store)
const CLOUD_KV_BASE = 'https://keyvalue.immanuel.co/api/KeyVal';
const CLOUD_KV_APP_KEY = 'hr4hcm6c';
const COMPACT_KEY = 'mnc_landing_stats_compact_v1';

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

interface CompactCloudStats {
  totalVisits: number;
  qrScans: number;
  uniqueVisitors: number;
  todayVisits: number;
  mobile: number;
  desktop: number;
  tablet: number;
  fb: number;
  ig: number;
  direct: number;
  web: number;
  clkFb: number;
  clkIg: number;
  clkWeb: number;
  clkWa: number;
  clkCall: number;
  clkSrv: number;
  lastScanTs: number;
}

// Compact serializer for URL-safe cloud transmission
function packCompactStats(s: CompactCloudStats): string {
  return [
    s.totalVisits || 0,
    s.qrScans || 0,
    s.uniqueVisitors || 0,
    s.todayVisits || 0,
    s.mobile || 0,
    s.desktop || 0,
    s.tablet || 0,
    s.fb || 0,
    s.ig || 0,
    s.direct || 0,
    s.web || 0,
    s.clkFb || 0,
    s.clkIg || 0,
    s.clkWeb || 0,
    s.clkWa || 0,
    s.clkCall || 0,
    s.clkSrv || 0,
    s.lastScanTs || Date.now(),
  ].join('_');
}

// Compact deserializer
function unpackCompactStats(str: string): CompactCloudStats | null {
  if (!str) return null;
  const p = str.split('_').map((n) => parseInt(n, 10));
  if (p.length < 17 || isNaN(p[0])) return null;
  return {
    totalVisits: p[0] || 0,
    qrScans: p[1] || 0,
    uniqueVisitors: p[2] || 0,
    todayVisits: p[3] || 0,
    mobile: p[4] || 0,
    desktop: p[5] || 0,
    tablet: p[6] || 0,
    fb: p[7] || 0,
    ig: p[8] || 0,
    direct: p[9] || 0,
    web: p[10] || 0,
    clkFb: p[11] || 0,
    clkIg: p[12] || 0,
    clkWeb: p[13] || 0,
    clkWa: p[14] || 0,
    clkCall: p[15] || 0,
    clkSrv: p[16] || 0,
    lastScanTs: p[17] || Date.now(),
  };
}

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
export function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
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
export function detectBrowser(): string {
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
export function detectReferrerSource(customSource?: string): keyof LandingAnalyticsData['referrerStats'] {
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
 * Push new visit details to Cloud Store
 * Ensures visitor data from any mobile phone or QR scan reaches the Admin dashboard
 */
async function pushVisitToCloud(
  visitLog: LandingPageVisitLog,
  isNewUnique: boolean,
  referrer: keyof LandingAnalyticsData['referrerStats'],
  device: 'mobile' | 'desktop' | 'tablet'
): Promise<void> {
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

  // 2. Update Cloud KV compact stats store
  try {
    const res = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}`, {
      cache: 'no-store',
    });
    let current: CompactCloudStats = {
      totalVisits: 0,
      qrScans: 0,
      uniqueVisitors: 0,
      todayVisits: 0,
      mobile: 0,
      desktop: 0,
      tablet: 0,
      fb: 0,
      ig: 0,
      direct: 0,
      web: 0,
      clkFb: 0,
      clkIg: 0,
      clkWeb: 0,
      clkWa: 0,
      clkCall: 0,
      clkSrv: 0,
      lastScanTs: Date.now(),
    };

    if (res.ok) {
      const text = await res.text();
      const clean = text.replace(/"/g, '').trim();
      const parsed = unpackCompactStats(clean);
      if (parsed) current = parsed;
    }

    current.totalVisits += 1;
    if (referrer === 'qr') current.qrScans += 1;
    if (isNewUnique) current.uniqueVisitors += 1;
    current.todayVisits += 1;

    if (device === 'mobile') current.mobile += 1;
    else if (device === 'desktop') current.desktop += 1;
    else if (device === 'tablet') current.tablet += 1;

    if (referrer === 'facebook') current.fb += 1;
    else if (referrer === 'instagram') current.ig += 1;
    else if (referrer === 'website') current.web += 1;
    else if (referrer === 'direct') current.direct += 1;

    current.lastScanTs = Date.now();

    const packed = packCompactStats(current);
    await fetch(`${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}/${packed}`, {
      method: 'POST',
      body: '',
    });
  } catch (e) {
    console.warn('Cloud visit push note:', e);
  }
}

/**
 * Push button click to Cloud Store
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
    const res = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const text = await res.text();
      const clean = text.replace(/"/g, '').trim();
      const parsed = unpackCompactStats(clean);
      if (parsed) {
        if (buttonName === 'facebook') parsed.clkFb += 1;
        else if (buttonName === 'instagram') parsed.clkIg += 1;
        else if (buttonName === 'website') parsed.clkWeb += 1;
        else if (buttonName === 'whatsapp') parsed.clkWa += 1;
        else if (buttonName === 'call') parsed.clkCall += 1;
        else if (buttonName === 'services') parsed.clkSrv += 1;

        parsed.lastScanTs = Date.now();
        const packed = packCompactStats(parsed);
        await fetch(`${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}/${packed}`, {
          method: 'POST',
          body: '',
        });
      }
    }
  } catch (e) {}
}

/**
 * Fetch and synchronize analytics data from Cloud Store across all devices
 * Guarantees visitors from mobile QR scans appear immediately in the Admin Dashboard
 */
export async function syncLandingAnalyticsFromCloud(): Promise<LandingAnalyticsData> {
  const local = getLandingAnalytics();

  try {
    const res = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}`, {
      cache: 'no-store',
    });
    if (!res.ok) return local;

    const text = await res.text();
    const clean = text.replace(/"/g, '').trim();
    const cloud = unpackCompactStats(clean);
    if (!cloud) return local;

    // Merge logic: Take highest count so numbers never regress
    const merged: LandingAnalyticsData = {
      totalVisits: Math.max(local.totalVisits, cloud.totalVisits),
      uniqueVisitors: Math.max(local.uniqueVisitors, cloud.uniqueVisitors),
      todayVisits: Math.max(local.todayVisits, cloud.todayVisits),
      lastUpdated: cloud.lastScanTs ? new Date(cloud.lastScanTs).toISOString() : new Date().toISOString(),
      deviceStats: {
        mobile: Math.max(local.deviceStats.mobile, cloud.mobile),
        desktop: Math.max(local.deviceStats.desktop, cloud.desktop),
        tablet: Math.max(local.deviceStats.tablet, cloud.tablet),
      },
      referrerStats: {
        facebook: Math.max(local.referrerStats.facebook, cloud.fb),
        instagram: Math.max(local.referrerStats.instagram, cloud.ig),
        direct: Math.max(local.referrerStats.direct, cloud.direct),
        website: Math.max(local.referrerStats.website, cloud.web),
        tiktok: local.referrerStats.tiktok || 0,
        google: local.referrerStats.google || 0,
        qr: Math.max(local.referrerStats.qr || 0, cloud.qrScans || 0),
        other: local.referrerStats.other || 0,
      },
      clicks: {
        facebook: Math.max(local.clicks.facebook, cloud.clkFb),
        instagram: Math.max(local.clicks.instagram, cloud.clkIg),
        website: Math.max(local.clicks.website, cloud.clkWeb),
        whatsapp: Math.max(local.clicks.whatsapp, cloud.clkWa),
        call: Math.max(local.clicks.call, cloud.clkCall),
        services: Math.max(local.clicks.services, cloud.clkSrv),
        bot_doctor: local.clicks.bot_doctor || 0,
        ad_tool: local.clicks.ad_tool || 0,
      },
      recentVisits: local.recentVisits || [],
      recentClicks: local.recentClicks || [],
      dailyVisits: local.dailyVisits || {},
    };

    localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(merged));
    broadcastSync();
    return merged;
  } catch (e) {
    console.warn('Cloud sync error, using local data:', e);
    return local;
  }
}

/**
 * Record a visit to the landing page
 * Debounced per tab/session to avoid double counting on fast React strict mode re-mounts
 */
export function recordLandingVisit(customSource?: string): LandingAnalyticsData {
  const now = Date.now();
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Session debounce check (don't recount within 10 seconds on the same tab)
  const lastVisit = sessionStorage.getItem(STORAGE_KEY_SESSION_VISIT);
  if (lastVisit && now - Number(lastVisit) < 10000) {
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

  // Push visit asynchronously to the Cloud Store so Admin Dashboard sees it from any device
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

  // Push click asynchronously to Cloud
  pushClickToCloud(buttonName, label);
}

/**
 * Reset all landing analytics (Admin only)
 */
export async function resetLandingAnalytics(): Promise<void> {
  localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS));
  broadcastSync();

  try {
    const emptyStats: CompactCloudStats = {
      totalVisits: 0,
      qrScans: 0,
      uniqueVisitors: 0,
      todayVisits: 0,
      mobile: 0,
      desktop: 0,
      tablet: 0,
      fb: 0,
      ig: 0,
      direct: 0,
      web: 0,
      clkFb: 0,
      clkIg: 0,
      clkWeb: 0,
      clkWa: 0,
      clkCall: 0,
      clkSrv: 0,
      lastScanTs: Date.now(),
    };
    const packed = packCompactStats(emptyStats);
    await fetch(`${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/${COMPACT_KEY}/${packed}`, {
      method: 'POST',
      body: '',
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
