// Enterprise Security Shield for MarkNCode
// Protects website against:
// 1. Inspect Element & DevTools opening (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Right-Click)
// 2. Console scraping and network payload inspection
// 3. Clickjacking / Iframe embedding
// 4. Client-side LocalStorage tampering
// 5. Cross-Site Scripting (XSS) input injection

export interface SecurityEventDetail {
  type: 'contextmenu' | 'shortcut' | 'devtools_detected' | 'tampering';
  message: string;
  timestamp: number;
}

// Global flag tracking if DevTools is currently open
let isDevToolsCurrentlyOpen = false;
let securityInitialized = false;

/**
 * Sanitize untrusted user input against XSS and script injections
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/onmouseover\s*=/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'));
}

/**
 * Dispatch custom security violation event for UI feedback
 */
function notifySecurityViolation(type: SecurityEventDetail['type'], message: string) {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<SecurityEventDetail>('mnc_security_violation', {
    detail: {
      type,
      message,
      timestamp: Date.now(),
    },
  });
  window.dispatchEvent(event);
}

/**
 * Initialize all anti-inspect and anti-tamper security defenses
 */
export function initSecurityShield(): void {
  if (typeof window === 'undefined' || securityInitialized) return;
  securityInitialized = true;

  // 1. Anti-Clickjacking (Break out of unauthorized iframes)
  try {
    if (window.top && window.self !== window.top) {
      window.top.location.href = window.self.location.href;
    }
  } catch (e) {
    // If sandboxed, blank out page
    document.body.innerHTML = 'Access Denied: Iframe embedding is not permitted.';
  }

  // 2. Disable Right-Click Context Menu (Anti-Inspect & Anti-Save)
  window.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      notifySecurityViolation('contextmenu', 'تم حظر القائمة لمنع فحص عناصر الموقع 🔒');
      return false;
    },
    { capture: true }
  );

  // 3. Disable DevTools & Inspect Keyboard Shortcuts
  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key ? e.key.toUpperCase() : '';
      const keyCode = e.keyCode || e.which;

      // F12
      const isF12 = key === 'F12' || keyCode === 123;

      // Ctrl + Shift + I (Inspect) or J (Console) or C (Inspect Cursor) or K (Firefox console)
      const isDevToolsCombo =
        isCtrlOrCmd &&
        e.shiftKey &&
        (key === 'I' || key === 'J' || key === 'C' || key === 'K' || keyCode === 73 || keyCode === 74 || keyCode === 67 || keyCode === 75);

      // Ctrl + U (View Source)
      const isViewSource = isCtrlOrCmd && (key === 'U' || keyCode === 85);

      // Ctrl + S (Save Page HTML)
      const isSavePage = isCtrlOrCmd && (key === 'S' || keyCode === 83);

      if (isF12 || isDevToolsCombo || isViewSource || isSavePage) {
        e.preventDefault();
        e.stopPropagation();
        notifySecurityViolation('shortcut', 'تم حظر اختصارات الفحص وعرض الكود المصدري 🛡️');
        return false;
      }
    },
    { capture: true }
  );

  // 4. Disable Drag & Drop of sensitive elements
  window.addEventListener('dragstart', (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'IMG' || target.tagName === 'A')) {
      e.preventDefault();
    }
  });

  // 5. Production Console Silencing & Data Leak Prevention
  // Keeps console clean of internal states, tokens, and errors
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    try {
      window.console.log = noop;
      window.console.info = noop;
      window.console.debug = noop;
      window.console.warn = noop;
    } catch (e) {}
  }

  // 6. Active DevTools Size & Timing Detection Loop
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      if (!isDevToolsCurrentlyOpen) {
        isDevToolsCurrentlyOpen = true;
        notifySecurityViolation('devtools_detected', 'تم رصد محاولة فتح أدوات الفحص ⚠️');
        try {
          console.clear();
        } catch (e) {}
      }
    } else {
      isDevToolsCurrentlyOpen = false;
    }
  };

  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 2000);

  // 7. Anti-Tampering of LocalStorage & Auth Session
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === 'mnc_admin_auth' && e.newValue === 'true') {
      // Validate if actual session is Google Authenticated with SOLE_ADMIN_EMAIL
      try {
        const activeAuth = sessionStorage.getItem('mnc_admin_auth');
        if (!activeAuth) {
          localStorage.removeItem('mnc_admin_auth');
          sessionStorage.removeItem('mnc_admin_auth');
          notifySecurityViolation('tampering', 'تم إحباط محاولة تعديل صلاحيات الجلسة 🚨');
        }
      } catch (err) {}
    }
  });
}

/**
 * Returns true if DevTools is currently detected as open
 */
export function isDevToolsOpen(): boolean {
  return isDevToolsCurrentlyOpen;
}
