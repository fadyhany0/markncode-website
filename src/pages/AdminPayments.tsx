import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  FlashOn as QuickActivateIcon,
  WhatsApp as WhatsAppIcon,
  Security as SecurityIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  MedicalServices as DoctorIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Announcement as AnnouncementIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Launch as LaunchIcon,
  ExitToApp as LogoutIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PaymentOrderData,
  getAllPaymentOrders,
  approvePaymentOrder,
  rejectPaymentOrder,
  manualActivateUser,
} from '../services/paymentApprovalService';
import {
  SiteSettings,
  ManagedUser,
  SiteInquiry,
  SavedCampaignLog,
  SOLE_ADMIN_EMAIL,
  getSiteSettings,
  updateSiteSettings,
  getAllManagedUsers,
  saveManagedUser,
  toggleUserBan,
  toggleUserAdAccess,
  deleteManagedUser,
  getAllInquiries,
  updateInquiryStatus,
  getSavedCampaignLogs,
  exportFullWebsiteBackup,
  importWebsiteBackup,
} from '../services/adminSettingsService';

const AdminPayments: React.FC = () => {
  const { user, signOut, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Admin privilege is strictly and exclusively granted ONLY when logged in via Google OAuth with hanyfady034@gmail.com
  const isGoogleAdmin = Boolean(
    user &&
    user.isGoogleAuth === true &&
    user.email?.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase()
  );

  // Authentication & Passcode Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mnc_admin_auth') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [showPasscodeForm, setShowPasscodeForm] = useState<boolean>(false);

  // Auto-authenticate when verified via Google OAuth with hanyfady034@gmail.com
  useEffect(() => {
    if (isGoogleAdmin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mnc_admin_auth', 'true');
    }
  }, [isGoogleAdmin]);

  // Main Tab Navigation
  const [activeTab, setActiveTab] = useState<number>(0);

  // Live Data States
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings);
  const [orders, setOrders] = useState<PaymentOrderData[]>([]);
  const [usersList, setUsersList] = useState<ManagedUser[]>([]);
  const [inquiriesList, setInquiriesList] = useState<SiteInquiry[]>([]);
  const [campaignLogs, setCampaignLogs] = useState<SavedCampaignLog[]>([]);

  // Payment Orders Tab States
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Users Tab States
  const [userSearch, setUserSearch] = useState<string>('');
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [userForm, setUserForm] = useState<Partial<ManagedUser>>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    hasAdToolAccess: true,
  });

  // CMS Settings Local Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(getSiteSettings);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState<boolean>(false);

  // Manual Quick Activation Modal
  const [quickActivateModalOpen, setQuickActivateModalOpen] = useState<boolean>(false);
  const [quickEmailInput, setQuickEmailInput] = useState<string>('');
  const [quickNameInput, setQuickNameInput] = useState<string>('');

  // Inquiries Filter
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'booked'>('all');

  // Notifications
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // Load and refresh all system data
  const refreshAllData = () => {
    setOrders(getAllPaymentOrders());
    setUsersList(getAllManagedUsers());
    setInquiriesList(getAllInquiries());
    setCampaignLogs(getSavedCampaignLogs());
    const currentSettings = getSiteSettings();
    setSiteSettings(currentSettings);
  };

  useEffect(() => {
    refreshAllData();

    // Cross-tab real-time synchronization
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('mnc_payment_sync');
      bc.onmessage = () => refreshAllData();
    } catch (e) {}

    let bcSettings: BroadcastChannel | null = null;
    try {
      bcSettings = new BroadcastChannel('mnc_admin_settings_sync');
      bcSettings.onmessage = () => refreshAllData();
    } catch (e) {}

    const handleStorage = () => refreshAllData();
    window.addEventListener('storage', handleStorage);

    // Auto-refresh interval every 3 seconds
    const interval = setInterval(refreshAllData, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
      if (bcSettings) bcSettings.close();
    };
  }, []);

  // Sync settingsForm when siteSettings updates from external
  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Authentication submission
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = (siteSettings.adminPasscode || '2025').trim();
    if (passcodeInput.trim() === correctCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mnc_admin_auth', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('رمز المرور غير صحيح. يرجى إدخال رمز المرور الإداري المعتمد.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mnc_admin_auth');
    setIsAuthenticated(false);
    navigate('/home');
  };

  const showToast = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  // Payment Actions
  const handleApproveOrder = (order: PaymentOrderData) => {
    const ok = approvePaymentOrder(order.orderId, order.userEmail);
    if (ok) {
      refreshAllData();
      showToast(`✅ تم اعتماد وتفعيل الحساب للعميل (${order.userName || order.userEmail}) بنجاح!`);
    }
  };

  const handleRejectOrder = (order: PaymentOrderData) => {
    const ok = rejectPaymentOrder(order.orderId, order.userEmail);
    if (ok) {
      refreshAllData();
      showToast(`❌ تم رفض طلب التحويل رقم ${order.orderId}`);
    }
  };

  const handleQuickActivate = () => {
    if (!quickEmailInput.trim() || !quickEmailInput.includes('@')) {
      alert('يرجى كتابة بريد إلكتروني صحيح للعميل');
      return;
    }
    const ok = manualActivateUser(quickEmailInput, quickNameInput);
    if (ok) {
      // Also register in CRM
      saveManagedUser({
        email: quickEmailInput,
        name: quickNameInput || quickEmailInput.split('@')[0],
        hasAdToolAccess: true,
      });
      refreshAllData();
      setQuickActivateModalOpen(false);
      setQuickEmailInput('');
      setQuickNameInput('');
      showToast(`⚡ تم تفعيل أداة الإعلانات للبريد (${quickEmailInput}) فوراً!`);
    }
  };

  // User CRM Actions
  const handleSaveUserModal = () => {
    if (!userForm.email || !userForm.email.includes('@')) {
      alert('يرجى كتابة بريد إلكتروني صحيح');
      return;
    }
    saveManagedUser({
      ...userForm,
      email: userForm.email.trim(),
    });
    refreshAllData();
    setUserModalOpen(false);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      hasAdToolAccess: true,
    });
    showToast('✅ تم حفظ بيانات المستخدم بنجاح!');
  };

  const handleToggleUserBan = (email: string) => {
    toggleUserBan(email);
    refreshAllData();
    showToast(`تم تحديث حالة الحظر للمستخدم (${email})`);
  };

  const handleToggleUserAccess = (email: string, grant: boolean) => {
    toggleUserAdAccess(email, grant);
    refreshAllData();
    showToast(grant ? `🎁 تم منح رصيد الاستخدام لـ (${email})` : `تم إلغاء رصيد (${email})`);
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المستخدم (${email}) نهائياً؟`)) {
      deleteManagedUser(email);
      refreshAllData();
      showToast(`تم حذف المستخدم (${email}) بنجاح`);
    }
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateSiteSettings(settingsForm);
    setSiteSettings(updated);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3500);
    showToast('⚙️ تم حفظ إعدادات الموقع وتحديث كل الصفحات بنجاح!');
  };

  // Maintenance Toggle
  const handleToggleMaintenance = () => {
    const updated = updateSiteSettings({ maintenanceMode: !siteSettings.maintenanceMode });
    setSiteSettings(updated);
    showToast(
      updated.maintenanceMode
        ? '⚠️ تم تشغيل وضع الصيانة للموقع!'
        : '🟢 تم إلغاء وضع الصيانة والموقع متاح للجميع الآن!'
    );
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    const jsonStr = exportFullWebsiteBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `markncode_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 تم تحميل النسخة الاحتياطية الكاملة بنجاح!');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importWebsiteBackup(content);
      if (res.success) {
        refreshAllData();
        showToast(res.message);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // WhatsApp Link Helper
  const buildWhatsAppChatUrl = (phone: string, text: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const intl = clean.startsWith('0') ? `2${clean}` : clean;
    return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
  };

  // Metrics Calculations
  const approvedOrders = useMemo(
    () => orders.filter((o) => o.status === 'approved' || o.status === 'used'),
    [orders]
  );
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending'), [orders]);
  const totalRevenue = useMemo(
    () => approvedOrders.reduce((sum, o) => sum + (o.amount || siteSettings.adToolPriceEGP), 0),
    [approvedOrders, siteSettings.adToolPriceEGP]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (orderFilter !== 'all') {
      result = result.filter((o) => o.status === orderFilter);
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.senderPhone.includes(q)
      );
    }
    return result;
  }, [orders, orderFilter, orderSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return usersList;
    const q = userSearch.toLowerCase().trim();
    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
    );
  }, [usersList, userSearch]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    if (inquiryFilter === 'all') return inquiriesList;
    return inquiriesList.filter((i) => i.status === inquiryFilter);
  }, [inquiriesList, inquiryFilter]);

  // If not authenticated and not Google admin, show protected gate without leaking admin email
  if (!isAuthenticated && !isGoogleAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#030712',
          p: 3,
        }}
      >
        <Card
          sx={{
            maxWidth: 480,
            width: '100%',
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: '28px',
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 25px 70px rgba(0,0,0,0.9), 0 0 40px rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '24px',
              bgcolor: 'rgba(239, 68, 68, 0.15)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
            }}
          >
            <BlockIcon sx={{ fontSize: 44, color: '#ef4444' }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 900, color: '#f8fafc', mb: 1.5 }}>
            منطقة محظورة ⛔
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 2, lineHeight: 1.8 }}>
            عذراً، هذه الصفحة غير متاحة. يتطلب الوصول تسجيل الدخول باستخدام حساب Google الإداري المعتمد.
          </Typography>
          {user && (
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                أنت مسجل حالياً بحساب ({user.email}) وهو حساب لا يملك أي صلاحيات إدارة.
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                  await signOut();
                }}
                sx={{
                  color: '#f87171',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  py: 0.5,
                  alignSelf: 'center',
                }}
              >
                تسجيل الخروج من هذا الحساب 🚪
              </Button>
            </Stack>
          )}

          {showPasscodeForm ? (
            <form onSubmit={handlePasscodeSubmit}>
              <TextField
                fullWidth
                type="password"
                placeholder="اكتب رمز الأدمن (Passcode)..."
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                sx={{
                  mb: 2,
                  '& input': {
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '6px',
                    fontWeight: 900,
                    py: 1.5,
                  },
                  bgcolor: 'rgba(0,0,0,0.4)',
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    '&:hover': { borderColor: '#38bdf8' },
                    '&.Mui-focused': { borderColor: '#38bdf8' },
                  },
                }}
                autoFocus
              />

              {passcodeError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '14px', fontWeight: 700 }}>
                  {passcodeError}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.4,
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                  mb: 2,
                }}
              >
                تأكيد رمز المرور والدخول 🚀
              </Button>
            </form>
          ) : (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    navigate('/signin');
                  }
                }}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                }}
              >
                تسجيل الدخول باستخدام Google 🔑
              </Button>
            </Stack>
          )}

          <Stack spacing={1}>
            <Button
              variant="text"
              onClick={() => setShowPasscodeForm(!showPasscodeForm)}
              sx={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}
            >
              {showPasscodeForm ? 'الرجوع لخيار الدخول بجوجل' : 'أو الدخول برمز المرور الإداري (Master Passcode) 🔒'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/home')}
              startIcon={<BackIcon />}
              sx={{
                py: 1.2,
                borderRadius: '14px',
                fontWeight: 700,
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#cbd5e1',
                '&:hover': { borderColor: '#ffffff', color: '#ffffff' },
              }}
            >
              العودة للصفحة الرئيسية للموقع 🏠
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  // Master Dashboard Screen
  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: '#f8fafc', pb: 12 }}>
      {/* Top Admin Header Bar */}
      <Box
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
          pt: { xs: 12, md: 14 },
          pb: 3,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2.5,
            }}
          >
            {/* Title & Live Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
                  flexShrink: 0,
                }}
              >
                <SecurityIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                    لوحة الإدارة والتحكم الشاملة لـ MarkNCode 👑
                  </Typography>
                  <Chip
                    size="small"
                    label="متصل ومباشر 🟢"
                    sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }}
                  />
                  {siteSettings.maintenanceMode && (
                    <Chip
                      size="small"
                      label="وضع الصيانة مفعّل ⚠️"
                      sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 800 }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.85rem' }}>
                  التحكم المالي، إدارة المستخدمين، تعديل المحتوى، وتتبع أداء الذكاء الاصطناعي في كل الموقع
                </Typography>
              </Box>
            </Box>

            {/* Quick Action Buttons */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/home')}
                startIcon={<LaunchIcon />}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' },
                }}
              >
                الموقع الحي
              </Button>

              <Button
                variant="contained"
                onClick={() => setQuickActivateModalOpen(true)}
                startIcon={<QuickActivateIcon />}
                sx={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 800,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                }}
              >
                تفعيل مستخدم فوري ⚡
              </Button>

              <Button
                variant="outlined"
                onClick={handleDownloadBackup}
                startIcon={<DownloadIcon />}
                sx={{
                  borderRadius: '12px',
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                نسخ احتياطي 💾
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{ borderRadius: '12px', fontWeight: 700 }}
              >
                قفل / خروج 🚪
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* KPI Summary Cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Card 1: Revenue */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, display: 'block', mb: 0.5 }}>
                💰 إجمالي الإيرادات
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                {totalRevenue.toLocaleString()} ج.م
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                {approvedOrders.length} اشتراك معتمد
              </Typography>
            </Card>
          </Grid>

          {/* Card 2: Pending Orders */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              onClick={() => {
                setActiveTab(1);
                setOrderFilter('pending');
              }}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: pendingOrders.length > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.85)',
                border: pendingOrders.length > 0 ? '2px solid #ef4444' : '1.5px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: pendingOrders.length > 0 ? '#fca5a5' : '#fbbf24',
                  fontWeight: 800,
                  display: 'block',
                  mb: 0.5,
                }}
              >
                ⏳ تحويلات بانتظار الاعتماد
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: pendingOrders.length > 0 ? '#ef4444' : '#ffffff' }}
              >
                {pendingOrders.length} طلب
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                {pendingOrders.length > 0 ? 'يتطلب اتخاذ قرار الآن ⚠️' : 'لا توجد طلبات معلقة'}
              </Typography>
            </Card>
          </Grid>

          {/* Card 3: Users */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              onClick={() => setActiveTab(2)}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, display: 'block', mb: 0.5 }}>
                👥 مستخدمو المنصة
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                {usersList.length} مستخدم
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                {usersList.filter((u) => u.hasAdToolAccess).length} مفعّل لديهم الأداة
              </Typography>
            </Card>
          </Grid>

          {/* Card 4: Campaigns Generated */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              onClick={() => setActiveTab(4)}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(168, 85, 247, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 800, display: 'block', mb: 0.5 }}>
                🚀 خطط إعلانات الـ AI
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                {campaignLogs.length} خطة
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                تم توليدها وفحصها
              </Typography>
            </Card>
          </Grid>

          {/* Card 5: Doctor Bot Leads */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              onClick={() => setActiveTab(5)}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 800, display: 'block', mb: 0.5 }}>
                🩺 استفسارات العيادات
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                {inquiriesList.length} ليدز
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                {inquiriesList.filter((i) => i.status === 'new').length} جديد لم يتم التواصل
              </Typography>
            </Card>
          </Grid>

          {/* Card 6: Ad Tool Pricing */}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card
              onClick={() => setActiveTab(3)}
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(59, 130, 246, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 800, display: 'block', mb: 0.5 }}>
                🏷️ سعر استخدام الأداة
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#38bdf8' }}>
                {siteSettings.adToolPriceEGP} ج.م
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                قابل للتعديل الفوري
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Modern Tabs Bar */}
        <Box sx={{ mb: 4, borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                bgcolor: '#38bdf8',
                borderRadius: '3px',
              },
              '& .MuiTab-root': {
                color: '#cbd5e1',
                fontWeight: 700,
                fontSize: { xs: '0.88rem', md: '0.98rem' },
                minHeight: 48,
                px: { xs: 2, md: 3 },
                borderRadius: '12px',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#ffffff',
                  bgcolor: 'rgba(56, 189, 248, 0.12)',
                },
              },
            }}
          >
            <Tab icon={<DashboardIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="📊 المؤشرات الحية" />
            <Tab
              icon={<PaymentIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`💳 التحويلات (${pendingOrders.length > 0 ? `⚠️ ${pendingOrders.length}` : orders.length})`}
            />
            <Tab icon={<PeopleIcon sx={{ fontSize: 20 }} />} iconPosition="start" label={`👥 إدارة المستخدمين (${usersList.length})`} />
            <Tab icon={<AnnouncementIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="🛠️ محتوى الموقع والبانرات" />
            <Tab icon={<CampaignIcon sx={{ fontSize: 20 }} />} iconPosition="start" label={`🚀 حملات الـ AI (${campaignLogs.length})`} />
            <Tab icon={<DoctorIcon sx={{ fontSize: 20 }} />} iconPosition="start" label={`🩺 طلبات العيادات (${inquiriesList.length})`} />
            <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="⚙️ الأمان والنسخ الاحتياطي" />
          </Tabs>
        </Box>

        {/* ============================================================== */}
        {/* TAB 0: EXECUTIVE ANALYTICS & OVERVIEW                          */}
        {/* ============================================================== */}
        {activeTab === 0 && (
          <Stack spacing={3}>
            {/* Quick Actions Row */}
            <Card
              sx={{
                p: 3,
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#38bdf8', mb: 2 }}>
                ⚡ لوحة العمليات السريعة (Quick Operations):
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setQuickActivateModalOpen(true)}
                    startIcon={<QuickActivateIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      fontWeight: 800,
                    }}
                  >
                    تفعيل عميل بدون تحويل ⚡
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setUserForm({
                        name: '',
                        email: '',
                        phone: '',
                        role: 'user',
                        status: 'active',
                        hasAdToolAccess: true,
                      });
                      setUserModalOpen(true);
                    }}
                    startIcon={<AddIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                      fontWeight: 800,
                    }}
                  >
                    إضافة مستخدم جديد ➕
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleToggleMaintenance}
                    sx={{
                      py: 1.5,
                      borderRadius: '14px',
                      borderColor: siteSettings.maintenanceMode ? '#ef4444' : 'rgba(255,255,255,0.2)',
                      color: siteSettings.maintenanceMode ? '#f87171' : '#ffffff',
                      fontWeight: 800,
                      bgcolor: siteSettings.maintenanceMode ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    }}
                  >
                    {siteSettings.maintenanceMode ? 'إلغاء وضع الصيانة 🟢' : 'تشغيل وضع الصيانة ⚠️'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={refreshAllData}
                    startIcon={<RefreshIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '14px',
                      borderColor: 'rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      fontWeight: 800,
                    }}
                  >
                    مزامنة وتحديث فوري 🔄
                  </Button>
                </Grid>
              </Grid>
            </Card>

            {/* Split View: Recent Payments vs Recent Inquiries */}
            <Grid container spacing={3}>
              {/* Left Column: Recent Orders */}
              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                      💳 آخر المعاملات المالية والتحويلات:
                    </Typography>
                    <Button size="small" onClick={() => setActiveTab(1)} sx={{ color: '#38bdf8', fontWeight: 700 }}>
                      عرض الكل ({orders.length}) ↗
                    </Button>
                  </Box>

                  {orders.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>
                      لا توجد أي طلبات تحويل مسجلة حتى الآن.
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {orders.slice(0, 5).map((o) => (
                        <Box
                          key={o.orderId}
                          sx={{
                            p: 2,
                            borderRadius: '14px',
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                              {o.userName || o.userEmail}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                              {o.paymentMethod === 'vodafone_cash' ? 'فودافون كاش 🔴' : 'انستا باي 🟣'} | رقم:{' '}
                              {o.senderPhone}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={
                                o.status === 'approved'
                                  ? 'معتمد ✔️'
                                  : o.status === 'pending'
                                  ? 'معلق ⏳'
                                  : o.status === 'used'
                                  ? 'مستهلك 🎉'
                                  : 'مرفوض ❌'
                              }
                              sx={{
                                bgcolor:
                                  o.status === 'approved' || o.status === 'used'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : o.status === 'pending'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(255,255,255,0.1)',
                                color:
                                  o.status === 'approved' || o.status === 'used'
                                    ? '#34d399'
                                    : o.status === 'pending'
                                    ? '#f87171'
                                    : '#cbd5e1',
                                fontWeight: 800,
                              }}
                            />
                            {o.status === 'pending' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleApproveOrder(o)}
                                sx={{
                                  bgcolor: '#10b981',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  '&:hover': { bgcolor: '#059669' },
                                }}
                              >
                                تفعيل الآن
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>
              </Grid>

              {/* Right Column: Recent Doctor & Contact Inquiries */}
              <Grid item xs={12} lg={6}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '24px',
                    bgcolor: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                      🩺 أحدث طلبات استشارات البوت الطبي والموقع:
                    </Typography>
                    <Button size="small" onClick={() => setActiveTab(5)} sx={{ color: '#38bdf8', fontWeight: 700 }}>
                      عرض الكل ({inquiriesList.length}) ↗
                    </Button>
                  </Box>

                  {inquiriesList.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center', color: '#94a3b8' }}>لا توجد طلبات واردة حالياً.</Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {inquiriesList.slice(0, 5).map((inq) => (
                        <Box
                          key={inq.id}
                          sx={{
                            p: 2,
                            borderRadius: '14px',
                            bgcolor: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                          }}
                        >
                          <Box sx={{ maxWidth: '70%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                                {inq.name}
                              </Typography>
                              <Chip
                                size="small"
                                label={inq.source === 'bot_for_doctor' ? 'بوت الأطباء 🩺' : 'تواصل معنا 📩'}
                                sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.7rem' }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#cbd5e1',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {inq.message}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              href={buildWhatsAppChatUrl(inq.phone, `أهلاً دكتور/أستاذ ${inq.name}، بخصوص طلبك في MarkNCode...`)}
                              target="_blank"
                              startIcon={<WhatsAppIcon sx={{ color: '#25d366' }} />}
                              sx={{
                                borderColor: 'rgba(37, 211, 102, 0.4)',
                                color: '#34d399',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                              }}
                            >
                              واتساب
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Stack>
        )}

        {/* ============================================================== */}
        {/* TAB 1: PAYMENTS & CASHFLOW APPROVAL PIPELINE                   */}
        {/* ============================================================== */}
        {activeTab === 1 && (
          <Stack spacing={3}>
            {/* Filter and Search Bar */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                {/* Filter Chips */}
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
                  <Chip
                    clickable
                    label={`الكل (${orders.length})`}
                    onClick={() => setOrderFilter('all')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: orderFilter === 'all' ? '#2563eb' : 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                    }}
                  />
                  <Chip
                    clickable
                    label={`⏳ بانتظار المراجعة (${pendingOrders.length})`}
                    onClick={() => setOrderFilter('pending')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: orderFilter === 'pending' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                      color: orderFilter === 'pending' ? '#ffffff' : '#f87171',
                    }}
                  />
                  <Chip
                    clickable
                    label={`✔️ معتمد ومفعل (${approvedOrders.length})`}
                    onClick={() => setOrderFilter('approved')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: orderFilter === 'approved' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                      color: orderFilter === 'approved' ? '#ffffff' : '#34d399',
                    }}
                  />
                  <Chip
                    clickable
                    label={`❌ مرفوض (${orders.filter((o) => o.status === 'rejected').length})`}
                    onClick={() => setOrderFilter('rejected')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: orderFilter === 'rejected' ? '#64748b' : 'rgba(255,255,255,0.06)',
                      color: '#cbd5e1',
                    }}
                  />
                </Stack>

                {/* Search Box */}
                <TextField
                  placeholder="بحث برقم الطلب، اسم العميل، بريد، أو رقم المحول منه..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#38bdf8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: { xs: '100%', md: 340 },
                    bgcolor: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    '& input': { color: 'white', fontSize: '0.9rem' },
                  }}
                />
              </Box>
            </Card>

            {/* Orders Table */}
            <Card
              sx={{
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>رقم الطلب</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>العميل</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>وسيلة التحويل</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الرقم المحول منه</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>المبلغ</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>التوقيت</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الحالة</TableCell>
                      <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        الإجراءات
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                          لا توجد طلبات تطابق معايير الفلترة الحالية.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow
                          key={order.orderId}
                          sx={{
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <TableCell sx={{ color: '#ffffff', fontWeight: 800, fontFamily: 'monospace' }}>
                            {order.orderId}
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                              {order.userName || 'غير مسجل اسم'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                              {order.userEmail}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش 🔴' : 'انستا باي 🟣'}
                              sx={{
                                bgcolor:
                                  order.paymentMethod === 'vodafone_cash'
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : 'rgba(168, 85, 247, 0.15)',
                                color: order.paymentMethod === 'vodafone_cash' ? '#fca5a5' : '#e9d5ff',
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>

                          <TableCell sx={{ color: '#38bdf8', fontWeight: 800, direction: 'ltr' }}>
                            {order.senderPhone}
                          </TableCell>

                          <TableCell sx={{ color: '#34d399', fontWeight: 900 }}>
                            {order.amount || siteSettings.adToolPriceEGP} ج.م
                          </TableCell>

                          <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG') : 'الآن'}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                order.status === 'approved'
                                  ? 'معتمد ✔️'
                                  : order.status === 'pending'
                                  ? 'معلق ⏳'
                                  : order.status === 'used'
                                  ? 'مستهلك 🎉'
                                  : 'مرفوض ❌'
                              }
                              sx={{
                                bgcolor:
                                  order.status === 'approved' || order.status === 'used'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : order.status === 'pending'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(255,255,255,0.1)',
                                color:
                                  order.status === 'approved' || order.status === 'used'
                                    ? '#34d399'
                                    : order.status === 'pending'
                                    ? '#f87171'
                                    : '#cbd5e1',
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => handleApproveOrder(order)}
                                    startIcon={<CheckCircleIcon />}
                                    sx={{
                                      bgcolor: '#10b981',
                                      fontWeight: 800,
                                      fontSize: '0.78rem',
                                      borderRadius: '10px',
                                      '&:hover': { bgcolor: '#059669' },
                                    }}
                                  >
                                    اعتماد وتفعيل
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleRejectOrder(order)}
                                    startIcon={<CancelIcon />}
                                    sx={{
                                      borderColor: 'rgba(239,68,68,0.4)',
                                      color: '#f87171',
                                      fontWeight: 700,
                                      fontSize: '0.78rem',
                                      borderRadius: '10px',
                                      '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
                                    }}
                                  >
                                    رفض
                                  </Button>
                                </>
                              )}

                              {order.status !== 'pending' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleApproveOrder(order)}
                                  startIcon={<RefreshIcon />}
                                  sx={{
                                    borderColor: 'rgba(56, 189, 248, 0.4)',
                                    color: '#38bdf8',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                  }}
                                >
                                  إعادة تفعيل
                                </Button>
                              )}

                              <Tooltip title="مراسلة عبر واتساب">
                                <IconButton
                                  size="small"
                                  href={buildWhatsAppChatUrl(
                                    order.senderPhone,
                                    `أهلاً بك أستاذ ${order.userName || ''}، بخصوص طلب تحويل الـ ${order.amount} ج.م في منصة MarkNCode (طلب رقم ${order.orderId})...`
                                  )}
                                  target="_blank"
                                  sx={{ color: '#25d366' }}
                                >
                                  <WhatsAppIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        )}

        {/* ============================================================== */}
        {/* TAB 2: USER MANAGEMENT & CRM                                   */}
        {/* ============================================================== */}
        {activeTab === 2 && (
          <Stack spacing={3}>
            {/* Header and User Actions */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                    👥 قاعدة بيانات العملاء والمستخدمين (CRM Management):
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    تعديل الرتب، منح صلاحيات صانع الإعلانات، وحظر أو تفعيل أي حساب
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <TextField
                    placeholder="بحث باسم العميل، البريد، أو الهاتف..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#38bdf8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      minWidth: { xs: 200, sm: 280 },
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: '12px',
                      '& input': { color: 'white', fontSize: '0.9rem' },
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={() => {
                      setUserForm({
                        name: '',
                        email: '',
                        phone: '',
                        role: 'user',
                        status: 'active',
                        hasAdToolAccess: true,
                      });
                      setUserModalOpen(true);
                    }}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    مستخدم جديد ➕
                  </Button>
                </Stack>
              </Box>
            </Card>

            {/* Users Table */}
            <Card
              sx={{
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>العميل</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الهاتف</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الرتبة</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الحالة</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>صلاحية صانع الإعلانات</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>تاريخ التسجيل</TableCell>
                      <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        الإجراءات
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                          لم يتم العثور على أي مستخدم.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow
                          key={u.id}
                          sx={{
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                              {u.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                              {u.email}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ color: '#cbd5e1', direction: 'ltr' }}>{u.phone || '—'}</TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={u.role === 'admin' ? 'مدير نظام 👑' : 'مستخدم عادي 👤'}
                              sx={{
                                bgcolor: u.role === 'admin' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.08)',
                                color: u.role === 'admin' ? '#38bdf8' : '#cbd5e1',
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={u.status === 'active' ? 'نشط 🟢' : 'محظور 🚫'}
                              sx={{
                                bgcolor: u.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: u.status === 'active' ? '#34d399' : '#f87171',
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={u.hasAdToolAccess ? 'مفعل ومتاح ✔️' : 'مغلق (يلزم شحن) 🔒'}
                              sx={{
                                bgcolor: u.hasAdToolAccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                                color: u.hasAdToolAccess ? '#34d399' : '#94a3b8',
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>

                          <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                            {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                          </TableCell>

                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title={u.hasAdToolAccess ? 'سحب صلاحية الأداة' : 'منح وصول مجاني للأداة'}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleToggleUserAccess(u.email, !u.hasAdToolAccess)}
                                  sx={{
                                    borderColor: u.hasAdToolAccess ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)',
                                    color: u.hasAdToolAccess ? '#f87171' : '#34d399',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    borderRadius: '10px',
                                  }}
                                >
                                  {u.hasAdToolAccess ? 'قفل الأداة' : 'منح رصيد 🎁'}
                                </Button>
                              </Tooltip>

                              <Tooltip title={u.status === 'active' ? 'حظر الحساب' : 'إلغاء الحظر'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleUserBan(u.email)}
                                  sx={{ color: u.status === 'active' ? '#f87171' : '#34d399' }}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="حذف المستخدم">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteUser(u.email)}
                                  sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        )}

        {/* ============================================================== */}
        {/* TAB 3: WEBSITE CONTENT & CMS SETTINGS                          */}
        {/* ============================================================== */}
        {activeTab === 3 && (
          <form onSubmit={handleSaveSettings}>
            <Stack spacing={3.5}>
              {/* Top Banner Settings Card */}
              <Card
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#38bdf8' }}>
                      📢 البانر الإعلاني العام بأعلى الموقع (Top Announcement Bar):
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                      شريط يظهر في أعلى كافة صفحات الموقع لعرض العروض الترويجية أو التحديثات الهامة
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settingsForm.announcement.enabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            announcement: { ...settingsForm.announcement, enabled: e.target.checked },
                          })
                        }
                        color="primary"
                      />
                    }
                    label={settingsForm.announcement.enabled ? 'مفعّل وشغال 🟢' : 'معطل ومخفي ⚪'}
                    sx={{ color: '#ffffff', fontWeight: 700 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="نص الإعلان أو العرض الترويجي"
                      value={settingsForm.announcement.message}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: { ...settingsForm.announcement, message: e.target.value },
                        })
                      }
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: 'white', fontWeight: 600 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="نص زر الإجراء (Call to Action)"
                      value={settingsForm.announcement.linkText || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: { ...settingsForm.announcement, linkText: e.target.value },
                        })
                      }
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: 'white' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="رابط الزر (URL)"
                      value={settingsForm.announcement.linkUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          announcement: { ...settingsForm.announcement, linkUrl: e.target.value },
                        })
                      }
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: 'white', direction: 'ltr' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Financial & Wallet Numbers Settings */}
              <Card
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#34d399', mb: 1 }}>
                  💳 أرقام المحافظ المالية وبيانات استقبال التحويلات:
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 3 }}>
                  تعديل هذه الأرقام هنا ينعكس فوراً وتلقائياً على صفحة صانع الإعلانات وباقي صفحات الدفع دون الحاجة لتعديل الكود البرمجي!
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="🔴 رقم محفظة فودافون كاش (Vodafone Cash Number)"
                      value={settingsForm.vodafoneCashNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vodafoneCashNumber: e.target.value })}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: '#ffffff', fontWeight: 800, fontSize: '1.1rem', direction: 'ltr' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="🟣 حساب / رقم انستا باي (InstaPay Handle)"
                      value={settingsForm.instaPayHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instaPayHandle: e.target.value })}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: '#ffffff', fontWeight: 800, fontSize: '1.1rem', direction: 'ltr' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="💰 تكلفة الاستخدام لمرة واحدة (EGP)"
                      value={settingsForm.adToolPriceEGP}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, adToolPriceEGP: Number(e.target.value) || 200 })
                      }
                      InputProps={{
                        endAdornment: <InputAdornment position="end" sx={{ '& p': { color: '#34d399' } }}>ج.م</InputAdornment>,
                      }}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: '#34d399', fontWeight: 900, fontSize: '1.2rem' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="🎟️ كود الخصم التلقائي (Promo Code)"
                      value={settingsForm.promoCode || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promoCode: e.target.value })}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: 'white', fontWeight: 700 },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="نسبة الخصم (%)"
                      value={settingsForm.promoDiscountPercent || 0}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, promoDiscountPercent: Number(e.target.value) || 0 })
                      }
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: 'white' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Administrative Contact Info */}
              <Card
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
                  📞 بيانات التواصل والدعم الفني للموقع:
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 3 }}>
                  البيانات التي تظهر للزوار في الفوتر وصفحة تواصل معنا
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="رقم هاتف الدعم الفني والواتساب الرسمي"
                      value={settingsForm.adminPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPhone: e.target.value })}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: '#ffffff', fontWeight: 700, direction: 'ltr' },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="بريد الأدمن الوحيد والمصرح له (محمي بالكامل)"
                      value={SOLE_ADMIN_EMAIL}
                      disabled
                      InputProps={{
                        readOnly: true,
                        startAdornment: <InputAdornment position="start">🔒</InputAdornment>,
                      }}
                      helperText="الحساب الوحيد المعتمد لإدارة الموقع حصرياً وغير قابل للتغيير"
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '12px',
                        '& input': { color: '#38bdf8', fontWeight: 800, direction: 'ltr' },
                        '& .MuiFormHelperText-root': { color: '#94a3b8' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>

              {/* Save Button & Feedback */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    py: 1.8,
                    px: 6,
                    borderRadius: '16px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                  }}
                >
                  حفظ وتطبيق التعديلات على كامل الموقع الآن 💾
                </Button>

                {settingsSavedSuccess && (
                  <Typography variant="body2" sx={{ color: '#34d399', fontWeight: 800 }}>
                    ✔️ تم الحفظ بنجاح وتحديث كافة الصفحات في الوقت الفعلي!
                  </Typography>
                )}
              </Box>
            </Stack>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AI STUDIO & GENERATED CAMPAIGNS                         */}
        {/* ============================================================== */}
        {activeTab === 4 && (
          <Stack spacing={3}>
            {/* System Status Card */}
            <Card
              sx={{
                p: 3,
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#c084fc' }}>
                    🤖 محرك الذكاء الاصطناعي وصانع الإعلانات (Gemini AI Engine):
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    حالة الخوارزميات وتوليد الخطط والاستهداف المتقاطع وسكريبتات الفيديو
                  </Typography>
                </Box>
                <Chip label="الخوارزميات تعمل بكفاءة 100% ⚡" sx={{ bgcolor: 'rgba(16,185,129,0.2)', color: '#34d399', fontWeight: 800 }} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 700 }}>النموذج الذكي المستخدم:</Typography>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800, mt: 0.5 }}>Gemini 1.5 Flash</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>متوسط زمن الاستجابة:</Typography>
                    <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 800, mt: 0.5 }}>~1.8 ثانية</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>الهدف الأكثر طلباً من العملاء:</Typography>
                    <Typography variant="h6" sx={{ color: '#34d399', fontWeight: 800, mt: 0.5 }}>واتساب (Messages)</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Campaign Logs Table */}
            <Card
              sx={{
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>اسم المنتج / النشاط</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>المجال</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الهدف الإعلاني</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الميزانية</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>المنصة</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>العائد المتوقع</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>تاريخ التوليد</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaignLogs.map((c) => (
                      <TableRow key={c.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>{c.productName}</TableCell>
                        <TableCell sx={{ color: '#cbd5e1' }}>{c.businessField}</TableCell>
                        <TableCell>
                          <Chip size="small" label={c.objective} sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>{c.budget} ج.م / {c.days} أيام</TableCell>
                        <TableCell sx={{ color: '#cbd5e1' }}>{c.platform}</TableCell>
                        <TableCell sx={{ color: '#34d399', fontWeight: 800 }}>{c.roiEstimate}</TableCell>
                        <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                          {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        )}

        {/* ============================================================== */}
        {/* TAB 5: DOCTOR BOT & CONTACT LEADS                              */}
        {/* ============================================================== */}
        {activeTab === 5 && (
          <Stack spacing={3}>
            {/* Filter Bar */}
            <Card
              sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fbbf24' }}>
                    🩺 إدارة طلبات بوت العيادات واستشارات الموقع (Inquiries CRM):
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    تتبع كل طبيب أو صاحب نشاط تواصل لحجز بوت أو خدمة برمجية
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Chip
                    clickable
                    label={`الكل (${inquiriesList.length})`}
                    onClick={() => setInquiryFilter('all')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: inquiryFilter === 'all' ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                      color: inquiryFilter === 'all' ? '#0f172a' : '#cbd5e1',
                    }}
                  />
                  <Chip
                    clickable
                    label={`جديد (${inquiriesList.filter((i) => i.status === 'new').length})`}
                    onClick={() => setInquiryFilter('new')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: inquiryFilter === 'new' ? '#ef4444' : 'rgba(239,68,68,0.15)',
                      color: inquiryFilter === 'new' ? '#ffffff' : '#f87171',
                    }}
                  />
                  <Chip
                    clickable
                    label={`تم التواصل (${inquiriesList.filter((i) => i.status === 'contacted').length})`}
                    onClick={() => setInquiryFilter('contacted')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: inquiryFilter === 'contacted' ? '#3b82f6' : 'rgba(59,130,246,0.15)',
                      color: inquiryFilter === 'contacted' ? '#ffffff' : '#93c5fd',
                    }}
                  />
                  <Chip
                    clickable
                    label={`تم الحجز (${inquiriesList.filter((i) => i.status === 'booked').length})`}
                    onClick={() => setInquiryFilter('booked')}
                    sx={{
                      fontWeight: 800,
                      bgcolor: inquiryFilter === 'booked' ? '#10b981' : 'rgba(16,185,129,0.15)',
                      color: inquiryFilter === 'booked' ? '#ffffff' : '#34d399',
                    }}
                  />
                </Stack>
              </Box>
            </Card>

            {/* Inquiries Table */}
            <Card
              sx={{
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>العميل</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الهاتف</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>مصدر الطلب</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الخدمة المطلوبة</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>تفاصيل الرسالة</TableCell>
                      <TableCell sx={{ color: '#38bdf8', fontWeight: 800 }}>الحالة</TableCell>
                      <TableCell align="center" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        تواصل فوري
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                          لا توجد استفسارات في هذا القسم.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <TableRow key={inq.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                              {inq.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                              {inq.email}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ color: '#38bdf8', fontWeight: 800, direction: 'ltr' }}>
                            {inq.phone}
                          </TableCell>

                          <TableCell>
                            <Chip
                              size="small"
                              label={inq.source === 'bot_for_doctor' ? 'بوت الأطباء 🩺' : 'تواصل معنا 📩'}
                              sx={{
                                bgcolor: inq.source === 'bot_for_doctor' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: inq.source === 'bot_for_doctor' ? '#38bdf8' : '#34d399',
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>

                          <TableCell sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                            {inq.serviceRequested || 'استشارة عامة'}
                          </TableCell>

                          <TableCell sx={{ color: '#e2e8f0', maxWidth: 280 }}>
                            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.6 }}>
                              {inq.message}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Stack direction="row" spacing={0.5}>
                              {(['new', 'contacted', 'booked'] as const).map((st) => (
                                <Chip
                                  key={st}
                                  clickable
                                  size="small"
                                  label={st === 'new' ? 'جديد' : st === 'contacted' ? 'تواصلنا' : 'تم الحجز'}
                                  onClick={() => {
                                    updateInquiryStatus(inq.id, st);
                                    refreshAllData();
                                  }}
                                  sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    bgcolor:
                                      inq.status === st
                                        ? st === 'new'
                                          ? '#ef4444'
                                          : st === 'contacted'
                                          ? '#2563eb'
                                          : '#10b981'
                                        : 'rgba(255,255,255,0.06)',
                                    color: inq.status === st ? '#ffffff' : '#94a3b8',
                                  }}
                                />
                              ))}
                            </Stack>
                          </TableCell>

                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="contained"
                              href={buildWhatsAppChatUrl(
                                inq.phone,
                                `أهلاً دكتور/أستاذ ${inq.name}، معك إدارة منصة MarkNCode بخصوص استفسارك عن ${inq.serviceRequested || 'خدماتنا'}...`
                              )}
                              target="_blank"
                              startIcon={<WhatsAppIcon />}
                              sx={{
                                bgcolor: '#25d366',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                borderRadius: '10px',
                                '&:hover': { bgcolor: '#128c7e' },
                              }}
                            >
                              واتساب
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SECURITY & SYSTEM BACKUP                                */}
        {/* ============================================================== */}
        {activeTab === 6 && (
          <Stack spacing={3}>
            {/* Change Passcode Card */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#38bdf8', mb: 1 }}>
                🔐 رمز مرور الأدمن (Admin Passcode):
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 2.5 }}>
                يمكنك تغيير الرمز السري الذي يطلبه النظام عند فتح صفحة /admin في أي وقت
              </Typography>

              <Box sx={{ maxWidth: 400 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="رمز المرور الجديد"
                  value={settingsForm.adminPasscode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPasscode: e.target.value })}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    mb: 2,
                    '& input': { color: 'white', fontWeight: 800, letterSpacing: '4px' },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  sx={{
                    borderRadius: '12px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  }}
                >
                  تحديث الرمز السري 🔒
                </Button>
              </Box>
            </Card>

            {/* Maintenance Mode Card */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: siteSettings.maintenanceMode ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: siteSettings.maintenanceMode ? '#f87171' : '#f8fafc' }}>
                    ⚠️ وضع الصيانة الشامل للموقع (Maintenance Mode):
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    عند تفعيله، يتم إغلاق الوصول لصفحات الموقع للزوار وعرض رسالة صيانة احترافية
                  </Typography>
                </Box>
                <Switch checked={siteSettings.maintenanceMode} onChange={handleToggleMaintenance} color="error" />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={2}
                label="رسالة الصيانة التي تظهر للزوار"
                value={settingsForm.maintenanceMessage}
                onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMessage: e.target.value })}
                sx={{
                  bgcolor: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  '& textarea': { color: 'white' },
                }}
              />
            </Card>

            {/* Backup & Data Export/Import */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: '24px',
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#34d399', mb: 1 }}>
                💾 النسخ الاحتياطي واستعادة البيانات (System Backup & Restore):
              </Typography>
              <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 3 }}>
                احفظ نسخة كاملة من كل المستخدمين، المعاملات المالية، الاستفسارات، وإعدادات الموقع كملف JSON آمن
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleDownloadBackup}
                  startIcon={<DownloadIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '14px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  تحميل نسخة احتياطية كاملة (JSON) 📥
                </Button>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '14px',
                    fontWeight: 800,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' },
                  }}
                >
                  استعادة نسخة سابقة (Restore JSON) 📤
                  <input type="file" accept=".json" hidden onChange={handleRestoreFile} />
                </Button>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>

      {/* ============================================================== */}
      {/* MODAL: QUICK USER ACTIVATION (NO PAYMENT REQUIRED)             */}
      {/* ============================================================== */}
      <Dialog
        open={quickActivateModalOpen}
        onClose={() => setQuickActivateModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #10b981',
            p: 2,
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '20px',
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <QuickActivateIcon sx={{ fontSize: 34, color: '#34d399' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            تفعيل مستخدم فوري (استثناء إداري) ⚡
          </Typography>
          <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
            فتح أداة صانع الإعلانات لأي حساب عميل فوراً دون الحاجة لتحويل مالي
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="البريد الإلكتروني للعميل (إلزامي)"
              placeholder="user@example.com"
              value={quickEmailInput}
              onChange={(e) => setQuickEmailInput(e.target.value)}
              sx={{
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                '& input': { color: 'white', direction: 'ltr' },
              }}
            />
            <TextField
              fullWidth
              label="اسم العميل (اختياري)"
              placeholder="مثال: د. محمد سامي"
              value={quickNameInput}
              onChange={(e) => setQuickNameInput(e.target.value)}
              sx={{
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                '& input': { color: 'white' },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setQuickActivateModalOpen(false)} sx={{ color: '#cbd5e1' }}>
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleQuickActivate}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              px: 3,
            }}
          >
            تفعيل وفتح الأداة له الآن 🚀
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT USER IN CRM                                  */}
      {/* ============================================================== */}
      <Dialog
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #38bdf8',
            p: 2,
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {userForm.id ? 'تعديل بيانات المستخدم 👤' : 'إضافة مستخدم جديد للنظام ➕'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="الاسم الكامل"
              value={userForm.name || ''}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px', '& input': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              value={userForm.email || ''}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px', '& input': { color: 'white', direction: 'ltr' } }}
            />
            <TextField
              fullWidth
              label="رقم الهاتف / الواتساب"
              value={userForm.phone || ''}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '12px', '& input': { color: 'white', direction: 'ltr' } }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label="نوع الحساب: مستخدم عادي (User) 👤"
                sx={{
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  py: 1.8,
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={userForm.hasAdToolAccess ?? true}
                    onChange={(e) => setUserForm({ ...userForm, hasAdToolAccess: e.target.checked })}
                    color="success"
                  />
                }
                label={userForm.hasAdToolAccess ? 'أداة الإعلانات مفعلة 🟢' : 'أداة الإعلانات مغلقة 🔒'}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setUserModalOpen(false)} sx={{ color: '#cbd5e1' }}>
            إلغاء
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUserModal}
            sx={{
              borderRadius: '12px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
              px: 3,
            }}
          >
            حفظ البيانات ✔️
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AdminPayments;
