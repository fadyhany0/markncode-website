// Landing Page Visitor Tracking & Analytics Service for MarkNCode
// Tracks total visits, unique visitors, daily counts, device breakdown, referrers, and button clicks.

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

// Helper: Broadcast sync across browser tabs
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

// Helper: Detect Referrer or Source
function detectReferrerSource(customSource?: string): keyof LandingAnalyticsData['referrerStats'] {
  if (customSource) {
    const s = customSource.toLowerCase();
    if (s.includes('fb') || s.includes('face')) return 'facebook';
    if (s.includes('insta') || s.includes('ig')) return 'instagram';
    if (s.includes('tik')) return 'tiktok';
    if (s.includes('site') || s.includes('web')) return 'website';
    if (s.includes('goog')) return 'google';
  }

  if (typeof window === 'undefined') return 'direct';

  // Check URL query parameters
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source')?.toLowerCase() || params.get('ref')?.toLowerCase() || params.get('src')?.toLowerCase();
  if (utmSource) {
    if (utmSource.includes('fb') || utmSource.includes('facebook')) return 'facebook';
    if (utmSource.includes('insta') || utmSource.includes('instagram')) return 'instagram';
    if (utmSource.includes('tiktok')) return 'tiktok';
    if (utmSource.includes('google')) return 'google';
    if (utmSource.includes('site') || utmSource.includes('markncode')) return 'website';
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
 * Get current analytics data
 */
export function getLandingAnalytics(): LandingAnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYTICS);
    if (!raw) return { ...DEFAULT_ANALYTICS };
    const parsed = JSON.parse(raw);
    
    // Ensure all required properties exist
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

  // Update counts
  const newTotalVisits = current.totalVisits + 1;
  const newUniqueVisitors = current.uniqueVisitors + (isNewUniqueVisitor ? 1 : 0);
  
  // Calculate today visits accurately from dailyVisits dictionary
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

  return updated;
}

/**
 * Record a button click on the landing page
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
}

/**
 * Reset all landing analytics (Admin only)
 */
export function resetLandingAnalytics(): void {
  localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS));
  broadcastSync();
}

/**
 * Format a ready-to-share WhatsApp summary report
 */
export function getFormattedAnalyticsReport(data: LandingAnalyticsData): string {
  const mobilePercent = data.totalVisits > 0 
    ? Math.round((data.deviceStats.mobile / data.totalVisits) * 100) 
    : 0;
  const desktopPercent = data.totalVisits > 0 
    ? Math.round((data.deviceStats.desktop / data.totalVisits) * 100) 
    : 0;

  const totalClicks = 
    data.clicks.facebook +
    data.clicks.instagram +
    data.clicks.website +
    data.clicks.whatsapp +
    data.clicks.call +
    data.clicks.services;

  const conversionRate = data.totalVisits > 0 
    ? ((totalClicks / data.totalVisits) * 100).toFixed(1) 
    : '0.0';

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
• فيسبوك: ${data.referrerStats.facebook}
• إنستجرام: ${data.referrerStats.instagram}
• دخول مباشر: ${data.referrerStats.direct}
• الموقع الرسمي: ${data.referrerStats.website}

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
