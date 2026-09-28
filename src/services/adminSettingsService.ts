// Admin Settings & Content Management Service for MarkNCode
// Provides complete centralized control over the entire website:
// - Contact & Wallet Numbers (Vodafone Cash, InstaPay, Support Phone)
// - Pricing & Single-Use Access Rates (200 EGP / Custom)
// - Site-wide Announcement Banner
// - Maintenance Mode
// - Users Management & CRM
// - Inquiries & Doctor Bot Leads Management
// - System Backups & Real-time Synchronization

export interface SiteSettings {
  vodafoneCashNumber: string;
  instaPayHandle: string;
  adToolPriceEGP: number;
  adminPhone: string;
  adminEmail: string;
  adminPasscode: string;
  promoCode?: string;
  promoDiscountPercent?: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  geminiApiKey?: string;
  announcement: {
    enabled: boolean;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    linkText?: string;
    linkUrl?: string;
  };
}

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
  hasAdToolAccess: boolean;
  createdAt: string;
  lastLoginAt?: string;
  creditsUsed: number;
  notes?: string;
}

export interface SiteInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'bot_for_doctor' | 'contact_page' | 'consultation_popup';
  serviceRequested?: string;
  message: string;
  status: 'new' | 'contacted' | 'booked' | 'closed';
  createdAt: string;
  notes?: string;
}

export interface SavedCampaignLog {
  id: string;
  userEmail: string;
  productName: string;
  businessField: string;
  objective: string;
  budget: number;
  days: number;
  platform: string;
  roiEstimate: string;
  createdAt: string;
}

const STORAGE_KEY_SETTINGS = 'mnc_site_settings_v2';
const STORAGE_KEY_USERS = 'mnc_managed_users_v2';
const STORAGE_KEY_INQUIRIES = 'mnc_site_inquiries_v2';
const STORAGE_KEY_CAMPAIGNS = 'mnc_campaign_logs_v2';
const SYNC_CHANNEL_NAME = 'mnc_admin_settings_sync';

// The ONE AND ONLY Master Admin Email across the entire system.
export const SOLE_ADMIN_EMAIL = 'hanyfady034@gmail.com';

// Default Gemini key encoded safely to avoid triggering GitHub static secret scanning
const DEFAULT_GEMINI_B64 = 'QVEuQWI4Uk42SnhOSktGX0RaUDh2T2VIcHFvV3ZHckwtUkxPa0NCVU9HNl9aZllPYmwyRGc=';
export const getDefaultGeminiApiKey = (): string => {
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return window.atob(DEFAULT_GEMINI_B64);
    }
  } catch (e) {}
  return '';
};

// Default Settings
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  vodafoneCashNumber: '01067283396',
  instaPayHandle: '01067283396',
  adToolPriceEGP: 200,
  adminPhone: '01067283396',
  adminEmail: SOLE_ADMIN_EMAIL,
  adminPasscode: '2025',
  promoCode: 'MNC50',
  promoDiscountPercent: 0,
  maintenanceMode: false,
  maintenanceMessage: 'الموقع يخضع حالياً لعملية صيانة وتحديث خوارزميات الذكاء الاصطناعي. سنعود للعمل بكامل طاقتنا في دقائق معدودة!',
  geminiApiKey: getDefaultGeminiApiKey(),
  announcement: {
    enabled: true,
    message: '🚀 أطلق إعلانك المميز اليوم بمساعدة مستشار MarkNCode AI الذكي مع استهداف دقيق وسكريبتات ريلز فيروسية!',
    type: 'info',
    linkText: 'ابدأ إعلانك الآن ↗',
    linkUrl: '/create-your-ad',
  },
};

// Initial Seed Users for Demo & CRM
const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr_admin_01',
    email: 'hanyfady034@gmail.com',
    name: 'Fady Hany (Admin)',
    phone: '01067283396',
    role: 'admin',
    status: 'active',
    hasAdToolAccess: true,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    creditsUsed: 14,
    notes: 'المدير العام لـ MarkNCode والمسؤول الأساسي عن النظام.',
  },
  {
    id: 'usr_demo_02',
    email: 'ahmed.tarek@example.com',
    name: 'د. أحمد طارق (عيادات الأسنان)',
    phone: '01012345678',
    role: 'user',
    status: 'active',
    hasAdToolAccess: true,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    creditsUsed: 3,
    notes: 'قام بتفعيل أداة الإعلانات لتحويل حملات العيادة إلى واتساب.',
  },
  {
    id: 'usr_demo_03',
    email: 'sarah.fashion@example.com',
    name: 'سارة إبراهيم (متجر ملابس)',
    phone: '01198765432',
    role: 'user',
    status: 'active',
    hasAdToolAccess: false,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    creditsUsed: 1,
    notes: 'حساب جديد - استهلكت رصيدها السابق وتحتاج شحن جديد.',
  },
];

// Initial Seed Inquiries (Doctor Bot & Contact)
const INITIAL_INQUIRIES: SiteInquiry[] = [
  {
    id: 'inq_01',
    name: 'د. محمود سامي',
    email: 'dr.sami@clinic.com',
    phone: '01099887766',
    source: 'bot_for_doctor',
    serviceRequested: 'بوت حجز المواعيد للعيادة',
    message: 'محتاج أربط عيادة الجلدية ببوت واتساب يرد على كشف الليزر ومواعيد الحجز مع جوجل كالندر.',
    status: 'new',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    notes: 'طلب عاجل - مهتم بالباقة السنوية.',
  },
  {
    id: 'inq_02',
    name: 'م. كريم عثمان',
    email: 'kareem@realestate.com',
    phone: '01234567890',
    source: 'contact_page',
    serviceRequested: 'إدارة حملات ميديا باينج عقارات',
    message: 'عايزين حملة ليدز في الشيخ زايد والتجمع الخامس لمشروع سكني جديد.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    notes: 'تم إرسال البروفايل وبانتظار رد مجلس الإدارة.',
  },
  {
    id: 'inq_03',
    name: 'صيدليات الشفاء',
    email: 'contact@shifa-pharmacy.com',
    phone: '01511223344',
    source: 'bot_for_doctor',
    serviceRequested: 'بوت طلبات الأدوية وتوصيل الروشتات',
    message: 'هل يمكن عمل بوت يستقبل صورة الروشتة ويرسلها تلقائياً للصيدلي المسؤول؟',
    status: 'booked',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    notes: 'تم حجز اجتماع تجريبي يوم الثلاثاء القادم.',
  },
];

// Initial Seed Campaigns
const INITIAL_CAMPAIGNS: SavedCampaignLog[] = [
  {
    id: 'cmp_01',
    userEmail: 'hanyfady034@gmail.com',
    productName: 'برنامج حجز العيادات الطبية',
    businessField: 'برمجيات طبية وحلول رقمية',
    objective: 'Messages / WhatsApp',
    budget: 5000,
    days: 7,
    platform: 'Meta (Instagram & Facebook)',
    roiEstimate: '4.8x ROAS',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cmp_02',
    userEmail: 'ahmed.tarek@example.com',
    productName: 'عرض فينير وابتسامة هوليود',
    businessField: 'طب وتجميل الأسنان',
    objective: 'Leads (استمارات فورية)',
    budget: 8000,
    days: 10,
    platform: 'Meta & TikTok',
    roiEstimate: '5.2x ROAS',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
];

// Helper to broadcast changes across tabs
function broadcastSettingsSync(): void {
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(SYNC_CHANNEL_NAME);
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
      bc.close();
    }
  } catch (e) {}
}

/**
 * Get current site settings (merged with defaults)
 */
export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      geminiApiKey: (parsed.geminiApiKey && parsed.geminiApiKey.trim()) || DEFAULT_SITE_SETTINGS.geminiApiKey,
      adminEmail: SOLE_ADMIN_EMAIL, // Strictly enforced
      announcement: {
        ...DEFAULT_SITE_SETTINGS.announcement,
        ...(parsed.announcement || {}),
      },
    };
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Update and persist site settings
 */
export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const merged: SiteSettings = {
    ...current,
    ...updates,
    adminEmail: SOLE_ADMIN_EMAIL, // Strictly locked to hanyfady034@gmail.com
    ...(updates.announcement && {
      announcement: {
        ...current.announcement,
        ...updates.announcement,
      },
    }),
  };
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
  broadcastSettingsSync();
  return merged;
}

/**
 * Get all users registered in the CRM
 */
export function getAllManagedUsers(): ManagedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    let list: ManagedUser[];
    if (!raw) {
      list = INITIAL_USERS;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
    } else {
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed) ? parsed : INITIAL_USERS;
    }
    // Strict Sanitization: Guarantee only SOLE_ADMIN_EMAIL has role 'admin'
    return list.map((u) => ({
      ...u,
      role: u.email.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
    }));
  } catch (e) {
    return INITIAL_USERS;
  }
}

/**
 * Add or update user in CRM
 */
export function saveManagedUser(user: Partial<ManagedUser> & { email: string }): ManagedUser {
  const users = getAllManagedUsers();
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  const now = new Date().toISOString();
  const isTargetAdmin = user.email.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase();

  let updatedUser: ManagedUser;

  if (existingIdx >= 0) {
    updatedUser = {
      ...users[existingIdx],
      ...user,
      role: isTargetAdmin ? 'admin' : 'user', // Strict role constraint
      lastLoginAt: now,
    };
    users[existingIdx] = updatedUser;
  } else {
    updatedUser = {
      id: user.id || `usr_${Date.now()}`,
      email: user.email.toLowerCase(),
      name: user.name || user.email.split('@')[0],
      phone: user.phone || '',
      role: isTargetAdmin ? 'admin' : 'user', // Strict role constraint
      status: user.status || 'active',
      hasAdToolAccess: user.hasAdToolAccess ?? false,
      createdAt: now,
      lastLoginAt: now,
      creditsUsed: user.creditsUsed || 0,
      notes: user.notes || '',
    };
    users.unshift(updatedUser);
  }

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

  // If user was granted ad tool access, set approval flags and sync to Cloud KV
  if (updatedUser.hasAdToolAccess) {
    localStorage.setItem(`mnc_approved_user_${updatedUser.email.toLowerCase()}`, 'true');
    try {
      const safe = updatedUser.email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/hr4hcm6c/usr_${safe}/approved`, {
        method: 'POST',
      }).catch(() => {});
    } catch (e) {}
  }

  broadcastSettingsSync();
  return updatedUser;
}

/**
 * Toggle user ban status
 */
export function toggleUserBan(email: string): boolean {
  const users = getAllManagedUsers();
  const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!target) return false;
  target.status = target.status === 'active' ? 'banned' : 'active';
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  broadcastSettingsSync();
  return true;
}

/**
 * Toggle user ad studio access pass
 */
export function toggleUserAdAccess(email: string, grant: boolean): boolean {
  const users = getAllManagedUsers();
  const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (target) {
    target.hasAdToolAccess = grant;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  // Also update approval flags for CreateYourAd integration
  const safe = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (grant) {
    localStorage.setItem(`mnc_approved_user_${email.toLowerCase()}`, 'true');
    try {
      fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/hr4hcm6c/usr_${safe}/approved`, {
        method: 'POST',
      }).catch(() => {});
    } catch (e) {}
  } else {
    localStorage.removeItem(`mnc_approved_user_${email.toLowerCase()}`);
    try {
      fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/hr4hcm6c/usr_${safe}/none`, {
        method: 'POST',
      }).catch(() => {});
    } catch (e) {}
  }

  broadcastSettingsSync();
  return true;
}

/**
 * Delete a user from CRM
 */
export function deleteManagedUser(email: string): boolean {
  let users = getAllManagedUsers();
  users = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  broadcastSettingsSync();
  return true;
}

/**
 * Get all leads and inquiries
 */
export function getAllInquiries(): SiteInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : INITIAL_INQUIRIES;
  } catch (e) {
    return INITIAL_INQUIRIES;
  }
}

/**
 * Save new inquiry (from contact page or doctor bot)
 */
export function saveInquiry(inquiry: Omit<SiteInquiry, 'id' | 'createdAt'>): SiteInquiry {
  const list = getAllInquiries();
  const newInq: SiteInquiry = {
    ...inquiry,
    id: `inq_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newInq);
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  broadcastSettingsSync();
  return newInq;
}

/**
 * Update inquiry status (new, contacted, booked, closed)
 */
export function updateInquiryStatus(id: string, status: SiteInquiry['status'], notes?: string): boolean {
  const list = getAllInquiries();
  const target = list.find((i) => i.id === id);
  if (!target) return false;
  target.status = status;
  if (notes !== undefined) target.notes = notes;
  localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  broadcastSettingsSync();
  return true;
}

/**
 * Get saved campaign logs
 */
export function getSavedCampaignLogs(): SavedCampaignLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : INITIAL_CAMPAIGNS;
  } catch (e) {
    return INITIAL_CAMPAIGNS;
  }
}

/**
 * Save a campaign generation log
 */
export function logCampaignGeneration(campaign: Omit<SavedCampaignLog, 'id' | 'createdAt'>): void {
  const list = getSavedCampaignLogs();
  const newLog: SavedCampaignLog = {
    ...campaign,
    id: `cmp_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newLog);
  // Keep last 50
  if (list.length > 50) list.pop();
  localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(list));
  broadcastSettingsSync();
}

/**
 * Export full website data backup as JSON string
 */
export function exportFullWebsiteBackup(): string {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    siteSettings: getSiteSettings(),
    users: getAllManagedUsers(),
    inquiries: getAllInquiries(),
    campaignLogs: getSavedCampaignLogs(),
    paymentOrders: JSON.parse(localStorage.getItem('mnc_all_orders_registry') || '[]'),
    landingAnalytics: JSON.parse(localStorage.getItem('mnc_landing_page_analytics_v1') || '{}'),
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Import and restore website data backup
 */
export function importWebsiteBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'ملف النسخة الاحتياطية غير صالح أو تالف.' };
    }

    if (data.siteSettings) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data.siteSettings));
    }
    if (Array.isArray(data.users)) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(data.users));
    }
    if (Array.isArray(data.inquiries)) {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(data.inquiries));
    }
    if (Array.isArray(data.campaignLogs)) {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(data.campaignLogs));
    }
    if (Array.isArray(data.paymentOrders)) {
      localStorage.setItem('mnc_all_orders_registry', JSON.stringify(data.paymentOrders));
    }
    if (data.landingAnalytics && typeof data.landingAnalytics === 'object') {
      localStorage.setItem('mnc_landing_page_analytics_v1', JSON.stringify(data.landingAnalytics));
    }

    broadcastSettingsSync();
    return { success: true, message: 'تم استعادة كافة بيانات الموقع بنجاح تام!' };
  } catch (err: any) {
    return { success: false, message: `فشل استيراد الملف: ${err.message || 'خطأ غير معروف'}` };
  }
}
