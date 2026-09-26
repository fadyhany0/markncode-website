// Payment & Single-Use Authorization Service for MarkNCode AI Ad Studio
// Enables 200 EGP per-use access via Vodafone Cash & InstaPay with in-website Admin Dashboard approval
import emailjs from '@emailjs/browser';
import { getSiteSettings } from './adminSettingsService';

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

/**
 * Returns all payment orders sorted newest first
 */
export function getAllPaymentOrders(): PaymentOrderData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_ORDERS);
    if (!raw) return [];
    const list = JSON.parse(raw) as PaymentOrderData[];
    return Array.isArray(list) ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
  } catch (e) {
    return [];
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
 * Builds a direct WhatsApp notification link for the admin
 */
export function buildWhatsAppNotificationUrl(
  orderId: string,
  userEmail: string,
  userName: string,
  senderPhone: string,
  paymentMethod: PaymentMethod
): string {
  const origin = window.location.origin;
  const adminUrl = `${origin}/admin`;
  const methodLabel = paymentMethod === 'vodafone_cash' ? 'فودافون كاش 🔴' : 'انستا باي 🟣';

  const text = `🚨 *طلب تفعيل صانع الإعلانات (200 ج.م) - MarkNCode*
━━━━━━━━━━━━━━━━━━━━
👤 *العميل:* ${userName || userEmail}
📧 *البريد:* ${userEmail}
💳 *وسيلة الدفع:* ${methodLabel}
📱 *الرقم المحول منه:* ${senderPhone}
💰 *المبلغ:* 200 جنيه مصري
🔢 *رقم الطلب:* ${orderId}

🔗 *رابط لوحة تحكم الإدارة للتفعيل:*
${adminUrl}

قم بالدخول لصفحة الإدارة وضغط "موافق وتفعيل" لفتح الأداة للعميل فوراً!`;

  return `https://wa.me/201067283396?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a new payment order, stores in central registry, and sends email notification to admin
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

  // 1. Save to central registry and user active session
  saveOrderToRegistry(orderPayload);
  const localRecord: PaymentOrder = {
    cloudId: orderId,
    data: orderPayload,
  };

  try {
    localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${params.userEmail}`, JSON.stringify(localRecord));
    localStorage.setItem(`mnc_order_${orderId}`, JSON.stringify(localRecord));
  } catch (e) {}

  // 2. Broadcast across tabs in real-time
  try {
    const bc = new BroadcastChannel('mnc_payment_sync');
    bc.postMessage({ action: 'NEW_ORDER', order: orderPayload });
    bc.close();
  } catch (e) {}

  // 3. Send Notification Email to hanyfady034@gmail.com
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
 * Checks the status of a payment order for the client
 */
export async function checkPaymentStatus(orderId?: string, userEmail?: string): Promise<PaymentOrderData | null> {
  // 1. Direct approval flags
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
        userEmail: userEmail || '',
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
        userEmail: userEmail || '',
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'rejected',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // 2. Check user-level approved flag
  if (userEmail) {
    const userApprovedFlag = localStorage.getItem(`mnc_approved_user_${userEmail}`);
    if (userApprovedFlag === 'true') {
      return {
        orderId: orderId || 'MANUAL-OK',
        userEmail,
        userName: '',
        amount: 200,
        paymentMethod: 'vodafone_cash',
        senderPhone: '',
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
    }
  }

  // 3. Check central registry
  const all = getAllPaymentOrders();
  if (orderId) {
    const found = all.find((o) => o.orderId === orderId);
    if (found) return found;
  }
  if (userEmail) {
    const foundByUser = all.find((o) => o.userEmail === userEmail);
    if (foundByUser) return foundByUser;
  }

  return null;
}

/**
 * Admin approves payment order from the Admin Dashboard
 */
export function approvePaymentOrder(orderId: string, userEmail?: string): boolean {
  try {
    const all = getAllPaymentOrders();
    const target = all.find((o) => o.orderId === orderId);
    const email = userEmail || target?.userEmail;

    // Update in registry
    if (target) {
      target.status = 'approved';
      target.approvedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }

    // Set fast lookup flags
    localStorage.setItem(`mnc_approved_${orderId}`, 'true');
    localStorage.removeItem(`mnc_rejected_${orderId}`);
    if (email) {
      localStorage.setItem(`mnc_approved_user_${email}`, 'true');
      const activeRaw = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${email}`);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw) as PaymentOrder;
        parsed.data.status = 'approved';
        parsed.data.approvedAt = new Date().toISOString();
        localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${email}`, JSON.stringify(parsed));
      }
    }

    // Broadcast in real time to all open client tabs
    try {
      const bc = new BroadcastChannel('mnc_payment_sync');
      bc.postMessage({ action: 'APPROVED', orderId, userEmail: email });
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
export function rejectPaymentOrder(orderId: string, userEmail?: string): boolean {
  try {
    const all = getAllPaymentOrders();
    const target = all.find((o) => o.orderId === orderId);
    const email = userEmail || target?.userEmail;

    if (target) {
      target.status = 'rejected';
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }

    localStorage.setItem(`mnc_rejected_${orderId}`, 'true');
    localStorage.removeItem(`mnc_approved_${orderId}`);
    if (email) {
      localStorage.removeItem(`mnc_approved_user_${email}`);
      const activeRaw = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${email}`);
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw) as PaymentOrder;
        parsed.data.status = 'rejected';
        localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${email}`, JSON.stringify(parsed));
      }
    }

    try {
      const bc = new BroadcastChannel('mnc_payment_sync');
      bc.postMessage({ action: 'REJECTED', orderId, userEmail: email });
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
export function manualActivateUser(userEmail: string, userName?: string): boolean {
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
    localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${trimmed}`, JSON.stringify({ cloudId: orderId, data: manualOrder }));

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
    localStorage.removeItem(`mnc_approved_user_${userEmail}`);
    localStorage.removeItem(`mnc_approved_${cloudId}`);
    localStorage.removeItem(`${STORAGE_KEY_USER_PREFIX}${userEmail}`);

    const all = getAllPaymentOrders();
    const found = all.find((o) => o.orderId === cloudId || o.userEmail === userEmail);
    if (found) {
      found.status = 'used';
      found.usedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(all));
    }
  } catch (e) {}
}

/**
 * Gets the locally stored payment order for user
 */
export function getLocalPaymentOrder(userEmail: string): PaymentOrder | null {
  try {
    const item = localStorage.getItem(`${STORAGE_KEY_USER_PREFIX}${userEmail}`);
    if (!item) return null;
    return JSON.parse(item) as PaymentOrder;
  } catch (e) {
    return null;
  }
}
