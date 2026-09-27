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

// Cloud key namespaces
const CLOUD_INDEX_KEY = 'mnc_order_ids_v2';
const CLOUD_ORDER_PREFIX = 'ord_';
const CLOUD_STAT_PREFIX = 'stat_';
const CLOUD_USER_PREFIX = 'usr_';
const NTFY_TOPIC = 'mnc_admin_orders_2026';

/**
 * Normalizes email to a URL-safe key (alphanumeric and underscores only)
 */
export function getSafeEmailKey(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Safe Base64URL encoder for UTF-8 strings (browser & Node compatible)
 */
export function toBase64Url(str: string): string {
  try {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    return '';
  }
}

/**
 * Safe Base64URL decoder for UTF-8 strings (browser & Node compatible)
 */
export function fromBase64Url(b64: string): string {
  try {
    let base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return '';
  }
}

/**
 * Serializes payment order to compact URL-safe string
 */
export function serializeOrder(o: PaymentOrderData): string {
  return toBase64Url([
    o.orderId || '',
    o.userEmail || '',
    o.userName || '',
    o.amount || 200,
    o.paymentMethod || 'vodafone_cash',
    o.senderPhone || '',
    o.status || 'pending',
    o.createdAt || new Date().toISOString(),
    o.approvedAt || '',
    o.notes || ''
  ].join('~'));
}

/**
 * Deserializes compact URL-safe string back to payment order
 */
export function deserializeOrder(encoded: string): PaymentOrderData | null {
  try {
    const raw = fromBase64Url(encoded);
    if (!raw) return null;
    const parts = raw.split('~');
    if (parts.length < 7) return null;
    return {
      orderId: parts[0],
      userEmail: parts[1],
      userName: parts[2] || parts[1],
      amount: Number(parts[3]) || ADMIN_CONFIG.amountEGP || 200,
      paymentMethod: (parts[4] as PaymentMethod) || 'vodafone_cash',
      senderPhone: parts[5] || '',
      status: (parts[6] as PaymentStatus) || 'pending',
      createdAt: parts[7] || new Date().toISOString(),
      approvedAt: parts[8] || undefined,
      notes: parts[9] || undefined,
    };
  } catch (e) {
    return null;
  }
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
    promises.push(setCloudValue(`${CLOUD_STAT_PREFIX}${orderId}`, status));
  }
  if (userEmail) {
    promises.push(setCloudValue(`${CLOUD_USER_PREFIX}${getSafeEmailKey(userEmail)}`, status));
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
      const userVal = await getCloudValue(`${CLOUD_USER_PREFIX}${getSafeEmailKey(userEmail)}`);
      if (userVal === 'approved' || userVal === 'rejected' || userVal === 'pending' || userVal === 'used') {
        return userVal as PaymentStatus;
      }
    }
    // 2. Check order key
    if (orderId) {
      const ordVal = await getCloudValue(`${CLOUD_STAT_PREFIX}${orderId}`);
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
    // 1. Fetch Cloud Global Order IDs Index
    const indexStr = (await getCloudValue(CLOUD_INDEX_KEY)) || '';
    const cloudIds = indexStr ? indexStr.split(',').filter(Boolean) : [];

    const fetchedCloudOrders: PaymentOrderData[] = [];

    // 2. Fetch all cloud orders in parallel
    if (cloudIds.length > 0) {
      await Promise.all(
        cloudIds.map(async (id) => {
          try {
            const rawVal = await getCloudValue(`${CLOUD_ORDER_PREFIX}${id}`);
            if (rawVal) {
              const parsed = deserializeOrder(rawVal);
              if (parsed) {
                // Also check if live status was updated separately
                const liveStat = await getCloudValue(`${CLOUD_STAT_PREFIX}${id}`);
                if (liveStat && liveStat !== 'null' && liveStat !== parsed.status) {
                  parsed.status = liveStat as PaymentStatus;
                  if (liveStat === 'approved') {
                    parsed.approvedAt = parsed.approvedAt || new Date().toISOString();
                  }
                }
                fetchedCloudOrders.push(parsed);
              }
            }
          } catch (e) {}
        })
      );
    }

    // 3. Merge with local registry
    const local = getAllPaymentOrders();
    const map = new Map<string, PaymentOrderData>();

    // Local orders first
    for (const o of local) {
      if (o?.orderId) map.set(o.orderId, o);
    }

    // Overwrite/insert with cloud orders (cloud has latest cross-device data)
    for (const o of fetchedCloudOrders) {
      if (o?.orderId) {
        const existing = map.get(o.orderId);
        if (!existing) {
          map.set(o.orderId, o);
        } else {
          map.set(o.orderId, {
            ...existing,
            ...o,
            status: o.status || existing.status,
            approvedAt: o.approvedAt || existing.approvedAt,
          });
        }
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (merged.length > 0) {
      localStorage.setItem(STORAGE_KEY_ALL_ORDERS, JSON.stringify(merged));
    }

    return merged;
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
 * Creates a new payment order, stores in central registry & cloud database, and sends notifications to admin
 */
export async function submitPaymentTransferRequest(params: {
  userEmail: string;
  userName: string;
  senderPhone: string;
  paymentMethod: PaymentMethod;
}): Promise<PaymentOrder> {
  const orderId = `MNC-${Date.now().toString().slice(-6)}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://markncode.com';
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

  // 2. Save FULL ORDER to Cloud KV Store + Update Global Order Index
  try {
    const encodedOrder = serializeOrder(orderPayload);
    await Promise.allSettled([
      // Store full order payload in Cloud KV
      setCloudValue(`${CLOUD_ORDER_PREFIX}${orderId}`, encodedOrder),
      // Store order status
      setCloudValue(`${CLOUD_STAT_PREFIX}${orderId}`, 'pending'),
      // Store user status
      setCloudValue(`${CLOUD_USER_PREFIX}${getSafeEmailKey(params.userEmail)}`, 'pending'),
    ]);

    // Update global order IDs list
    const currentIndex = (await getCloudValue(CLOUD_INDEX_KEY)) || '';
    const ids = currentIndex ? currentIndex.split(',').filter(Boolean) : [];
    if (!ids.includes(orderId)) {
      ids.unshift(orderId);
    }
    const newIndex = ids.slice(0, 35).join(',');
    await setCloudValue(CLOUD_INDEX_KEY, newIndex);
  } catch (err) {
    console.warn('Cloud KV order push error:', err);
  }

  // 3. Broadcast across tabs in real-time
  try {
    const bc = new BroadcastChannel('mnc_payment_sync');
    bc.postMessage({ action: 'NEW_ORDER', order: orderPayload });
    bc.close();
  } catch (e) {}

  // 4. Instant Push Notification via ntfy.sh (Cross-device, instant sound/banner on Admin's phone/PC)
  try {
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': 'New Payment Order (200 EGP)',
        'Priority': 'urgent',
        'Tags': 'moneybag,bell,zap',
      },
      body: `طلب تفعيل جديد بقيمة 200 ج.م\nالعميل: ${params.userName || params.userEmail}\nالموبايل: ${params.senderPhone}\nطريقة الدفع: ${methodLabel}\nرقم الطلب: ${orderId}\nلوحة الإدارة: ${adminDashboardUrl}`,
    }).catch(() => {});
  } catch (e) {}

  // 5. Channel A: FormSubmit Notification Email
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

  // 6. Channel B: EmailJS Notification Email
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
      .catch((err) => {
        console.warn('EmailJS delivery warning:', err);
      });
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
    const now = new Date().toISOString();

    // 1. Update in local registry
    if (target) {
      target.status = 'approved';
      target.approvedAt = now;
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
        parsed.data.approvedAt = now;
        localStorage.setItem(`${STORAGE_KEY_USER_PREFIX}${normEmail}`, JSON.stringify(parsed));
      }
      // Update CRM
      toggleUserAdAccess(normEmail, true);
    }

    // 3. Update Cloud KV Store for cross-device unlock
    const cloudPromises: Promise<boolean>[] = [
      setCloudValue(`${CLOUD_STAT_PREFIX}${orderId}`, 'approved'),
    ];
    if (normEmail) {
      cloudPromises.push(setCloudValue(`${CLOUD_USER_PREFIX}${getSafeEmailKey(normEmail)}`, 'approved'));
    }

    // Update order object in cloud if present
    const rawVal = await getCloudValue(`${CLOUD_ORDER_PREFIX}${orderId}`);
    if (rawVal) {
      const parsed = deserializeOrder(rawVal);
      if (parsed) {
        parsed.status = 'approved';
        parsed.approvedAt = now;
        cloudPromises.push(setCloudValue(`${CLOUD_ORDER_PREFIX}${orderId}`, serializeOrder(parsed)));
      }
    }

    await Promise.allSettled(cloudPromises);

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
    const cloudPromises: Promise<boolean>[] = [
      setCloudValue(`${CLOUD_STAT_PREFIX}${orderId}`, 'rejected'),
    ];
    if (normEmail) {
      cloudPromises.push(setCloudValue(`${CLOUD_USER_PREFIX}${getSafeEmailKey(normEmail)}`, 'rejected'));
    }
    const rawVal = await getCloudValue(`${CLOUD_ORDER_PREFIX}${orderId}`);
    if (rawVal) {
      const parsed = deserializeOrder(rawVal);
      if (parsed) {
        parsed.status = 'rejected';
        cloudPromises.push(setCloudValue(`${CLOUD_ORDER_PREFIX}${orderId}`, serializeOrder(parsed)));
      }
    }

    await Promise.allSettled(cloudPromises);

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
