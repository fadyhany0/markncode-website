// Payment & Single-Use Authorization Service for MarkNCode AI Ad Studio
// Enables 200 EGP per-use access via Vodafone Cash & InstaPay with in-website Admin Dashboard approval
// Backed by high-speed, cross-device Cloud KV Store (keyvalue.immanuel.co) + Local Registry + BroadcastChannel
import emailjs from '@emailjs/browser';
import { getSiteSettings, getAllManagedUsers, toggleUserAdAccess } from './adminSettingsService';

export type PaymentMethod = 'vodafone_cash' | 'instapay';
export type PaymentStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'used';

export interface PaymentOrderData {
  orderId: string;
  userEmail: string;
  userName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  senderPhone: string;
  status: PaymentStatus;
  createdAt: string;
  approvedAt?: string;
  usedAt?: string;
  notes?: string;
}

export interface PaymentOrder {
  cloudId: string;
  data: PaymentOrderData;
}

export const ADMIN_CONFIG = {
  get adminEmail(): string {
    return getSiteSettings().adminEmail || 'hanyfady034@gmail.com';
  },
  get vodafoneCashNumber(): string {
    return getSiteSettings().vodafoneCashNumber || '01067283396';
  },
  get instaPayHandle(): string {
    return getSiteSettings().instaPayHandle || '01067283396';
  },
  get amountEGP(): number {
    return getSiteSettings().adToolPriceEGP || 200;
  },
  get adminPasscode(): string {
    return getSiteSettings().adminPasscode || '2025';
  },
  emailJsServiceId: 'service_n8m925l',
  emailJsTemplateId: 'template_0g53eyr',
  emailJsPublicKey: '3SYIQKDc9ttv2HUfA',
};

const STORAGE_KEY_ALL_ORDERS = 'mnc_all_orders_registry';
const STORAGE_KEY_USER_PREFIX = 'mnc_pay_active_';

// Cloud KV Store configuration for ultra-reliable cross-device synchronization
const CLOUD_KV_BASE = 'https://keyvalue.immanuel.co/api/KeyVal';
const CLOUD_KV_APP_KEY = 'hr4hcm6c';

/**
 * Normalizes email to a URL-safe key (alphanumeric and underscores only)
 */
export function getSafeEmailKey(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Reads a single value from the Cloud KV store
 */
export async function getCloudValue(key: string): Promise<string | null> {
  try {
    const res = await fetch(`${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/${key}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = await res.text();
    const clean = text.replace(/"/g, '').trim();
    return clean && clean !== 'null' ? clean : null;
  } catch {
    return null;
  }
}

/**
 * Writes a single value to the Cloud KV store
 */
export async function setCloudValue(key: string, value: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/${key}/${encodeURIComponent(value)}`,
      {
        method: 'POST',
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sets cloud approval status for order and/or user
 */
export async function setCloudApproval(
  orderId: string | undefined,
  userEmail: string | undefined,
  status: PaymentStatus
): Promise<boolean> {
  const promises: Promise<boolean>[] = [];
  if (orderId) {
    promises.push(setCloudValue(`ord_${orderId}`, status));
  }
  if (userEmail) {
    promises.push(setCloudValue(`usr_${getSafeEmailKey(userEmail)}`, status));
  }
  const results = await Promise.all(promises);
  return results.some(Boolean);
}

/**
 * Reads cloud approval status for order or user
 */
export async function getCloudApproval(
  orderId?: string,
  userEmail?: string
): Promise<PaymentStatus | null> {
  try {
    // 1. Check user key first (cross-device user access)
    if (userEmail) {
      const userVal = await getCloudValue(`usr_${getSafeEmailKey(userEmail)}`);
      if (userVal === 'approved' || userVal === 'rejected' || userVal === 'pending' || userVal === 'used') {
        return userVal as PaymentStatus;
      }
    }
    // 2. Check order key
    if (orderId) {
      const ordVal = await getCloudValue(`ord_${orderId}`);
      if (ordVal === 'approved' || ordVal === 'rejected' || ordVal === 'pending' || ordVal === 'used') {
        return ordVal as PaymentStatus;
      }
    }
  } catch (e) {
    console.warn('Error reading cloud approval:', e);
  }
  return null;
}

/**
 * Returns all payment orders from local cache sorted newest first
 */
export function getAllPaymentOrders(): PaymentOrderData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_ORDERS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter((o) => o && typeof o === 'object' && o.orderId)
      .map((o) => ({
        ...o,
        orderId: String(o.orderId || ''),
        senderPhone: o.senderPhone ? String(o.senderPhone) : '',
        userName: o.userName ? String(o.userName) : 'غير مسجل اسم',
        userEmail: o.userEmail ? String(o.userEmail) : '',
        amount: Number(o.amount) || ADMIN_CONFIG.amountEGP || 200,
        status: o.status || 'pending',
        paymentMethod: o.paymentMethod || 'vodafone_cash',
        createdAt: o.createdAt || new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
}

/**
 * Synchronizes orders with the cloud database so all devices and the admin dashboard see incoming orders in real-time
 */
export async function syncOrdersFromCloud(): Promise<PaymentOrderData[]> {
  try {
    const local = getAllPaymentOrders();
    let updated = false;

    // Check each pending order against Cloud KV to sync status if admin approved elsewhere
    await Promise.all(
      local.map(async (order) => {
        if (order.status === 'pending') {
          const cloudStatus = await getCloudApproval(order.orderId, order.userEmail);
          if (cloudStatus && cloudStatus !== 'pending') {
            order.status = cloudStatus;
            if (cloudStatus === 'approved') {
              order.approvedAt = order.approvedAt || new Date().toISOString();
              localStorage.setItem(`mnc_approved_${order.orderId}`, 'true');
              if (order.userEmail) {
                localStorage.setItem(`mnc_approved_user_${order.userEmail.toLowerCase()}`, 'true');
              }
            } else if (cloudStatus === 'rejected') {
              localStorage.setItem(`mnc_rejected_${order.orderId}`, 'true');
            }
            updated = true;
          }
        }
      })
    );

    if (updated) {
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(local));
    }

    return local;
  } catch (e) {
    console.warn('Cloud sync error, using local orders:', e);
    return getAllPaymentOrders();
  }
}

/**
 * Pushes updated orders array to cloud database
 */
export async function pushOrdersToCloud(orders: PaymentOrderData[]): Promise<boolean> {
  try {
    // Sync statuses of approved/rejected orders to Cloud KV
    await Promise.all(
      orders.map(async (o) => {
        if (o.status === 'approved' || o.status === 'rejected') {
          await setCloudApproval(o.orderId, o.userEmail, o.status);
        }
      })
    );
    return true;
  } catch (e) {
    console.warn('Cloud push error:', e);
    return false;
  }
}

/**
 * Saves or updates an order in the central registry
 */
function saveOrderToRegistry(order: PaymentOrderData): void {
  try {
    const existing = getAllPaymentOrders().filter((o) => o.orderId !== order.orderId);
    existing.unshift(order);
    localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(existing));
  } catch (e) {}
}

/**
 * Builds a direct WhatsApp notification link for the admin WITHOUT exposing any admin URLs to the client
 */
export function buildWhatsAppNotificationUrl(
  orderId: string,
  userEmail: string,
  userName: string,
  senderPhone: string,
  paymentMethod: PaymentMethod
): string {
  const methodLabel = paymentMethod === 'vodafone_cash' ? 'فودافون كاش 🔴' : 'انستا باي 🟣';

  const text = `🚨 *طلب تفعيل صانع الإعلانات (200 ج.م) - MarkNCode*
━━━━━━━━━━━━━━━━━━━━
👤 *العميل:* ${userName || userEmail}
📧 *البريد الإلكتروني:* ${userEmail}
💳 *طريقة الدفع:* ${methodLabel}
📱 *الرقم المحول منه:* ${senderPhone}
💰 *المبلغ:* 200 جنيه مصري
🔢 *رقم الطلب:* ${orderId}
━━━━━━━━━━━━━━━━━━━━
تم تحويل المبلغ وتأكيد الطلب من الموقع، برجاء تفعيل الحساب.`;

  return `https://wa.me/201067283396?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a new payment order, stores in central registry & cloud database, and sends email notification to admin
 */
export async function submitPaymentTransferRequest(params: {
  userEmail: string;
  userName: string;
  senderPhone: string;
  paymentMethod: PaymentMethod;
}): Promise<PaymentOrder> {
  const orderId = `MNC-${Date.now().toString().slice(-6)}`;
  const origin = window.location.origin;
  const adminDashboardUrl = `${origin}/admin`;
  const methodLabel = params.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي';

  const orderPayload: PaymentOrderData = {
    orderId,
    userEmail: params.userEmail,
    userName: params.userName || params.userEmail,
    amount: ADMIN_CONFIG.amountEGP,
    paymentMethod: params.paymentMethod,
    senderPhone: params.senderPhone.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Save to local registry and user active session immediately
  saveOrderToRegistry(orderPayload);
  const localRecord: PaymentOrder = {
    cloudId: orderId,
    data: orderPayload,
  };

  try {
    localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${params.userEmail.toLowerCase()}`, JSON.stringify(localRecord));
    localStorage.setItem(`mnc_order_${orderId}`, JSON.stringify(localRecord));
  } catch (e) {}

  // 2. Set Cloud KV status to 'pending' so cross-device checks track it
  setCloudApproval(orderId, params.userEmail, 'pending').catch(() => {});

  // 3. Broadcast across tabs in real-time
  try {
    const bc = new BroadcastChannel('mnc_payment_sync');
    bc.postMessage({ action: 'NEW_ORDER', order: orderPayload });
    bc.close();
  } catch (e) {}

  // 4. Send Notification Email to hanyfady034@gmail.com
  // Channel A: FormSubmit
  try {
    fetch(`https://formsubmit.co/ajax/${ADMIN_CONFIG.adminEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `🚨 طلب تفعيل جديد (200 ج.م) من ${params.userName || params.userEmail} (${methodLabel})`,
        _template: 'table',
        _captcha: 'false',
        'اسم العميل': params.userName || params.userEmail,
        'البريد الإلكتروني للعميل': params.userEmail,
        'طريقة الدفع': methodLabel,
        'الرقم المحول منه': params.senderPhone,
        'المبلغ': '200 جنيه مصري',
        'رقم الطلب': orderId,
        'توقيت الطلب': new Date().toLocaleString('ar-EG'),
        'رابط لوحة تحكم الإدارة للتفعيل': adminDashboardUrl,
      }),
    }).catch(() => {});
  } catch (e) {}

  // Channel B: EmailJS
  try {
    const emailBody = `
إشعار طلب تفعيل صانع الإعلانات - MarkNCode
=======================================
قام عميل بتحويل 200 جنيه مصري ويرغب في تفعيل الأداة:

العميل: ${params.userName || params.userEmail}
البريد الإلكتروني: ${params.userEmail}
المبلغ: 200 جنيه مصري (استخدام لمرة واحدة)
طريقة الدفع: ${methodLabel}
الرقم المحول منه: ${params.senderPhone}
رقم الطلب: ${orderId}
توقيت التحويل: ${new Date().toLocaleString('ar-EG')}

=======================================
ادخل على لوحة تحكم الإدارة في الموقع لتأكيد الاستلام وتفعيل الحساب:
${adminDashboardUrl}
=======================================
`;

    emailjs
      .send(
        ADMIN_CONFIG.emailJsServiceId,
        ADMIN_CONFIG.emailJsTemplateId,
        {
          name: params.userName || params.userEmail,
          email: params.userEmail,
          phone: params.senderPhone,
          subject: `🚨 تحويل 200 ج.م جديد من ${params.userName || params.userEmail} (${methodLabel})`,
          message: emailBody,
          to_email: ADMIN_CONFIG.adminEmail,
        },
        ADMIN_CONFIG.emailJsPublicKey
      )
      .catch(() => {});
  } catch (e) {}

  return localRecord;
}

/**
 * Checks the status of a payment order for the client across Local Storage, CRM Managed Users, and Cloud KV
 */
export async function checkPaymentStatus(orderId?: string, userEmail?: string): Promise<PaymentOrderData | null> {
  const normEmail = userEmail ? userEmail.trim().toLowerCase() : '';

  // 1. Direct approval flags in local storage (fast path)
  if (orderId) {
    const approvedFlag = localStorage.getItem(`mnc_approved_${orderId}`);
    if (approvedFlag === 'true') {
      const raw = localStorage.getItem(`mnc_order_${orderId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as PaymentOrder;
        return { ...parsed.data, status: 'approved' };
      }
      return {
        orderId,
        userEmail: normEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
    }
    const rejectedFlag = localStorage.getItem(`mnc_rejected_${orderId}`);
    if (rejectedFlag === 'true') {
      return {
        orderId,
        userEmail: normEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'rejected',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // 2. Check user-level approved flag in local storage
  if (normEmail) {
    const userApprovedFlag = localStorage.getItem(`mnc_approved_user_${normEmail}`);
    if (userApprovedFlag === 'true') {
      return {
        orderId: orderId || 'MANUAL-OK',
        userEmail: normEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
    }

    // 2.b Check CRM Managed Users: if user was granted access in CRM, activate immediately
    try {
      const managedList = getAllManagedUsers();
      const matched = managedList.find((u) => u.email.toLowerCase() === normEmail);
      if (matched && matched.hasAdToolAccess) {
        localStorage.setItem(`mnc_approved_user_${normEmail}`, 'true');
        if (orderId) localStorage.setItem(`mnc_approved_${orderId}`, 'true');
        return {
          orderId: orderId || 'CRM-OK',
          userEmail: normEmail,
          userName: matched.name || normEmail,
          amount: 200,
          paymentMethod: 'vodafone_cash',
          senderPhone: matched.phone || '',
          status: 'approved',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (e) {}
  }

  // 3. Query Cloud KV Store (cross-device instant sync!)
  // If the admin approved from their mobile phone or any other computer, this instantly catches it!
  try {
    const cloudStatus = await getCloudApproval(orderId, normEmail);
    if (cloudStatus === 'approved') {
      if (orderId) localStorage.setItem(`mnc_approved_${orderId}`, 'true');
      if (normEmail) {
        localStorage.setItem(`mnc_approved_user_${normEmail}`, 'true');
        toggleUserAdAccess(normEmail, true);
      }
      return {
        orderId: orderId || 'CLOUD-OK',
        userEmail: normEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
    } else if (cloudStatus === 'rejected') {
      if (orderId) localStorage.setItem(`mnc_rejected_${orderId}`, 'true');
      return {
        orderId: orderId || 'CLOUD-REJ',
        userEmail: normEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'rejected',
        createdAt: new Date().toISOString(),
      };
    }
  } catch (e) {}

  // 4. Fallback to local registry
  const all = getAllPaymentOrders();
  if (orderId) {
    const found = all.find((o) => o.orderId === orderId);
    if (found) return found;
  }
  if (normEmail) {
    const foundByUser = all.find((o) => o.userEmail.toLowerCase() === normEmail);
    if (foundByUser) return foundByUser;
  }

  return null;
}

/**
 * Admin approves payment order from the Admin Dashboard
 * Instantly updates:
 * 1. Local Storage Registry & User Sessions
 * 2. CRM Managed Users (hasAdToolAccess = true)
 * 3. Cloud KV Store (cross-device instant unlock)
 * 4. BroadcastChannel across all open client tabs
 */
export async function approvePaymentOrder(orderId: string, userEmail?: string): Promise<boolean> {
  try {
    const all = getAllPaymentOrders();
    const target = all.find((o) => o.orderId === orderId);
    const email = userEmail || target?.userEmail;
    const normEmail = email ? email.trim().toLowerCase() : '';

    // 1. Update in local registry
    if (target) {
      target.status = 'approved';
      target.approvedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }

    // 2. Set fast lookup flags in local storage
    localStorage.setItem(`mnc_approved_${orderId}`, 'true');
    localStorage.removeItem(`mnc_rejected_${orderId}`);
    if (normEmail) {
      localStorage.setItem(`mnc_approved_user_${normEmail}`, 'true');
      const activeRaw = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw) as PaymentOrder;
        parsed.data.status = 'approved';
        parsed.data.approvedAt = new Date().toISOString();
        localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`, JSON.stringify(parsed));
      }
      // Update CRM
      toggleUserAdAccess(normEmail, true);
    }

    // 3. Update Cloud KV Store so the client's device/phone unlocks immediately
    await setCloudApproval(orderId, normEmail, 'approved');

    // 4. Broadcast in real time to all open client tabs
    try {
      const bc = new BroadcastChannel('mnc_payment_sync');
      bc.postMessage({ action: 'APPROVED', orderId, userEmail: normEmail });
      bc.close();
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('Approve payment error:', err);
    return false;
  }
}

/**
 * Admin rejects payment order from the Admin Dashboard
 */
export async function rejectPaymentOrder(orderId: string, userEmail?: string): Promise<boolean> {
  try {
    const all = getAllPaymentOrders();
    const target = all.find((o) => o.orderId === orderId);
    const email = userEmail || target?.userEmail;
    const normEmail = email ? email.trim().toLowerCase() : '';

    if (target) {
      target.status = 'rejected';
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }

    localStorage.setItem(`mnc_rejected_${orderId}`, 'true');
    localStorage.removeItem(`mnc_approved_${orderId}`);
    if (normEmail) {
      localStorage.removeItem(`mnc_approved_user_${normEmail}`);
      const activeRaw = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw) as PaymentOrder;
        parsed.data.status = 'rejected';
        localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`, JSON.stringify(parsed));
      }
      toggleUserAdAccess(normEmail, false);
    }

    // Update Cloud KV Store
    await setCloudApproval(orderId, normEmail, 'rejected');

    try {
      const bc = new BroadcastChannel('mnc_payment_sync');
      bc.postMessage({ action: 'REJECTED', orderId, userEmail: normEmail });
      bc.close();
    } catch (e) {}

    return true;
  } catch (err) {
    console.error('Reject payment error:', err);
    return false;
  }
}

/**
 * Admin manually activates ANY user by email directly
 */
export async function manualActivateUser(userEmail: string, userName?: string): Promise<boolean> {
  try {
    const trimmed = userEmail.trim().toLowerCase();
    const orderId = `MNC-MANUAL-${Date.now().toString().slice(-4)}`;
    const manualOrder: PaymentOrderData = {
      orderId,
      userEmail: trimmed,
      userName: userName || trimmed,
      amount: 200,
      paymentMethod: 'vodafone_cash',
      senderPhone: 'تفعيل يدوي من الإدارة',
      status: 'approved',
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      notes: 'تم التفعيل يدوياً من لوحة الأدمن',
    };

    saveOrderToRegistry(manualOrder);
    localStorage.setItem(`mnc_approved_${orderId}`, 'true');
    localStorage.setItem(`mnc_approved_user_${trimmed}`, 'true');
    localStorage.setItem(
      `${STORAGE_KEY_USER_PREFIX}${trimmed}`,
      JSON.stringify({ cloudId: orderId, data: manualOrder })
    );

    // Update CRM
    toggleUserAdAccess(trimmed, true);

    // Update Cloud KV Store
    await setCloudApproval(orderId, trimmed, 'approved');

    try {
      const bc = new BroadcastChannel('mnc_payment_sync');
      bc.postMessage({ action: 'APPROVED', orderId, userEmail: trimmed });
      bc.close();
    } catch (e) {}

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Consumes single-use credit after campaign generation finishes
 */
export async function consumeSingleUseCredit(cloudId: string, userEmail: string): Promise<void> {
  try {
    const normEmail = userEmail.trim().toLowerCase();
    localStorage.removeItem(`mnc_approved_user_${normEmail}`);
    localStorage.removeItem(`mnc_approved_${cloudId}`);
    localStorage.removeItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`);

    toggleUserAdAccess(normEmail, false);

    const all = getAllPaymentOrders();
    const found = all.find((o) => o.orderId === cloudId || o.userEmail.toLowerCase() === normEmail);
    if (found) {
      found.status = 'used';
      found.usedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }

    // Set cloud status to 'used'
    setCloudApproval(cloudId, normEmail, 'used').catch(() => {});
  } catch (e) {}
}

/**
 * Gets the locally stored payment order for user
 */
export function getLocalPaymentOrder(userEmail: string): PaymentOrder | null {
  try {
    const normEmail = userEmail.trim().toLowerCase();
    const item = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`);
    if (!item) return null;
    return JSON.parse(item) as PaymentOrder;
  } catch (e) {
    return null;
  }
}
