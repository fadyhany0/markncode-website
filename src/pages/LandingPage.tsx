import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Divider,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Language as WebsiteIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  ArrowForward as ArrowForwardIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  SmartToy as BotIcon,
  Code as CodeIcon,
  Campaign as CampaignIcon,
  Palette as PaletteIcon,
  Speed as SpeedIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  getLandingAnalytics,
  recordLandingVisit,
  recordLandingClick,
  getFormattedAnalyticsReport,
  LandingAnalyticsData,
} from '../services/landingAnalyticsService';
import { getSiteSettings, SOLE_ADMIN_EMAIL } from '../services/adminSettingsService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [siteSettings] = useState(() => getSiteSettings());

  // Analytics State
  const [analytics, setAnalytics] = useState<LandingAnalyticsData>(() => getLandingAnalytics());
  const [statsDialogOpen, setStatsDialogOpen] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('mnc_landing_stats_unlocked') === 'true';
  });
  const [copiedSnackbar, setCopiedSnackbar] = useState<string>('');

  // Check if admin is currently logged in
  const isGoogleAdmin = Boolean(
    user &&
    user.isGoogleAuth === true &&
    user.email?.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase()
  );

  // Auto-record visit on mount and listen to sync
  useEffect(() => {
    // Record visit
    const updated = recordLandingVisit();
    setAnalytics(updated);

    // Sync across tabs
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('mnc_landing_analytics_sync');
      bc.onmessage = () => {
        setAnalytics(getLandingAnalytics());
      };
    } catch (e) {}

    const handleStorage = () => {
      setAnalytics(getLandingAnalytics());
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  // Update unlock state if logged in as admin
  useEffect(() => {
    if (isGoogleAdmin) {
      setIsUnlocked(true);
    }
  }, [isGoogleAdmin]);

  // Click tracker and navigator
  const handleLinkClick = (
    buttonName: 'facebook' | 'instagram' | 'website' | 'whatsapp' | 'call' | 'services' | 'bot_doctor' | 'ad_tool',
    label: string,
    url: string,
    isExternal: boolean = true
  ) => {
    recordLandingClick(buttonName, label);
    setAnalytics(getLandingAnalytics());

    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  // Passcode verification
  const handleUnlockStats = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const correctCode = (siteSettings.adminPasscode || '2025').trim();
    if (passcode.trim() === correctCode || passcode.trim() === '2025') {
      setIsUnlocked(true);
      sessionStorage.setItem('mnc_landing_stats_unlocked', 'true');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Copy WhatsApp summary report
  const handleCopyReport = () => {
    const report = getFormattedAnalyticsReport(analytics);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(report);
      setCopiedSnackbar('تم نسخ تقرير الزوار بنجاح! يمكنك لصقه وإرساله الآن عبر واتساب 📋');
    } else {
      // Fallback
      alert(report);
    }
  };

  // Share Page Link
  const handleSharePage = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'MarknCode Agency | حلول التسويق والبرمجة والذكاء الاصطناعي',
        text: 'تواصل مع MarknCode Agency واكتشف خدماتنا في التسويق الرقمي وتطوير المواقع وبوتات الذكاء الاصطناعي.',
        url: url,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSnackbar('تم نسخ رابط صفحة الهبوط لمشاركتها 🔗');
    }
  };

  // Total link interactions
  const totalInteractions =
    analytics.clicks.facebook +
    analytics.clicks.instagram +
    analytics.clicks.website +
    analytics.clicks.whatsapp +
    analytics.clicks.call +
    analytics.clicks.services;

  const conversionPercent = analytics.totalVisits > 0
    ? Math.min(100, Math.round((totalInteractions / analytics.totalVisits) * 100))
    : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#040814',
        color: '#f8fafc',
        position: 'relative',
        overflowX: 'hidden',
        pt: { xs: 4, md: 6 },
        pb: { xs: 10, md: 12 },
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
      }}
    >
      {/* Background Ambient Glow Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '350px', md: '750px' },
          height: { xs: '350px', md: '650px' },
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(124, 58, 237, 0.15) 50%, transparent 75%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          right: '-100px',
          width: { xs: '260px', md: '500px' },
          height: { xs: '260px', md: '500px' },
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(16, 185, 129, 0.1) 60%, transparent 80%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
        {/* Top Header & Share Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          {/* Brand Tag */}
          <Chip
            label="MarknCode Digital Hub ✨"
            sx={{
              bgcolor: 'rgba(37, 99, 235, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              fontWeight: 800,
              fontSize: '0.85rem',
              px: 1,
            }}
          />

          {/* Quick Share & Live Visits Trigger */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="مشاركة رابط الصفحة">
              <IconButton
                onClick={handleSharePage}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' },
                }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Quick Visitor Stats Button (Visible ONLY to Admin) */}
            {isGoogleAdmin && (
              <Tooltip title="إحصائيات زوار الصفحة (خاصة بالأدمن فقط)">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setStatsDialogOpen(true)}
                  startIcon={<VisibilityIcon sx={{ color: '#38bdf8' }} />}
                  sx={{
                    borderRadius: '50px',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    color: '#e2e8f0',
                    bgcolor: 'rgba(56, 189, 248, 0.08)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    px: 2,
                    '&:hover': {
                      borderColor: '#38bdf8',
                      bgcolor: 'rgba(56, 189, 248, 0.2)',
                    },
                  }}
                >
                  {analytics.totalVisits > 0 ? `${analytics.totalVisits} زيارة 👑` : 'إحصائيات الأدمن 👑'}
                </Button>
              </Tooltip>
            )}
          </Stack>
        </Box>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          {/* Logo Badge */}
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: '28px',
              margin: '0 auto 20px',
              p: '3px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed, #06b6d4)',
              boxShadow: '0 12px 35px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '25px',
                bgcolor: '#0a0f1d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                M&C
              </Typography>
            </Box>
          </Box>

          {/* Agency Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.75rem' },
              letterSpacing: '-0.02em',
              mb: 1.5,
              background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MarknCode Agency 🚀
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              mb: 2,
            }}
          >
            شريكك الرقمي لصناعة النمو، الإعلانات الممولة، والأنظمة الذكية
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              mb: 3,
            }}
          >
            نساعد الشركات الناشئة، أصحاب الأعمال، والعيادات الطبية على مضاعفة المبيعات وجذب العملاء المحتملين عبر حملات إعلانية دقيقة، مواقع إلكترونية عصرية سريعة، وروبوتات ذكاء اصطناعي تعمل على مدار الساعة.
          </Typography>

          {/* Key Value Badges */}
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ gap: 1 }}
          >
            <Chip
              icon={<TrendingUpIcon sx={{ color: '#34d399 !important' }} />}
              label="أعلى عائد إعلاني (ROAS)"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#6ee7b7',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontWeight: 700,
              }}
            />
            <Chip
              icon={<SpeedIcon sx={{ color: '#38bdf8 !important' }} />}
              label="برمجة سريعة فائقة الاستجابة"
              sx={{
                bgcolor: 'rgba(56, 189, 248, 0.12)',
                color: '#7dd3fc',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: 700,
              }}
            />
            <Chip
              icon={<BotIcon sx={{ color: '#c084fc !important' }} />}
              label="حلول الذكاء الاصطناعي وبوتات واتساب"
              sx={{
                bgcolor: 'rgba(192, 132, 252, 0.12)',
                color: '#e9d5ff',
                border: '1px solid rgba(192, 132, 252, 0.25)',
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>

        {/* ============================================================== */}
        {/* SECTION 1: OFFICIAL CHANNELS & PROMINENT LINKS                */}
        {/* ============================================================== */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: '"Outfit", sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              روابطنا الرسمية وقنوات التواصل 🔗
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              اختر القناة المفضلة لديك للمتابعة والتواصل المباشر مع فريقنا
            </Typography>
          </Box>

          <Stack spacing={2}>
            {/* 1. FACEBOOK */}
            <Card
              onClick={() =>
                handleLinkClick(
                  'facebook',
                  'Facebook Official Page',
                  'https://www.facebook.com/profile.php?id=61575849693891'
                )
              }
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(24, 119, 242, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#1877F2',
                  boxShadow: '0 12px 35px rgba(24, 119, 242, 0.35)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: '#1877F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(24, 119, 242, 0.5)',
                    flexShrink: 0,
                  }}
                >
                  <FacebookIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      صفحتنا على فيسبوك | Facebook
                    </Typography>
                    <Chip
                      size="small"
                      label="نشط يومياً"
                      sx={{ bgcolor: 'rgba(24, 119, 242, 0.25)', color: '#93c5fd', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    تابع أحدث عروض التسويق، نماذج الإعلانات الناجحة، واستراتيجيات زيادة المبيعات
                  </Typography>
                </Box>
              </Box>
              <IconButton
                sx={{
                  bgcolor: 'rgba(24, 119, 242, 0.2)',
                  color: '#93c5fd',
                  flexShrink: 0,
                  '&:hover': { bgcolor: '#1877F2', color: '#ffffff' },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Card>

            {/* 2. INSTAGRAM */}
            <Card
              onClick={() =>
                handleLinkClick(
                  'instagram',
                  'Instagram Official Profile',
                  'https://www.instagram.com/markncodeagency/'
                )
              }
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(225, 48, 108, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(225, 48, 108, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#E1306C',
                  boxShadow: '0 12px 35px rgba(225, 48, 108, 0.35)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(225, 48, 108, 0.5)',
                    flexShrink: 0,
                  }}
                >
                  <InstagramIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      إنستجرام الرسمي | @markncodeagency
                    </Typography>
                    <Chip
                      size="small"
                      label="ريلز ونصائح 🎥"
                      sx={{ bgcolor: 'rgba(225, 48, 108, 0.25)', color: '#fca5a5', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    شاهد أحدث تصاميمنا، فيديوهات الريلز الإعلانية، ونتائج عملائنا الحقيقية
                  </Typography>
                </Box>
              </Box>
              <IconButton
                sx={{
                  bgcolor: 'rgba(225, 48, 108, 0.2)',
                  color: '#fca5a5',
                  flexShrink: 0,
                  '&:hover': { bgcolor: '#E1306C', color: '#ffffff' },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Card>

            {/* 3. OFFICIAL WEBSITE */}
            <Card
              onClick={() => handleLinkClick('website', 'Official Website Home', '/home', false)}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(6, 182, 212, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#06b6d4',
                  boxShadow: '0 12px 35px rgba(6, 182, 212, 0.35)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(6, 182, 212, 0.5)',
                    flexShrink: 0,
                  }}
                >
                  <WebsiteIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      الموقع الرسمي للمنصة | MarknCode.com
                    </Typography>
                    <Chip
                      size="small"
                      label="المنصة الكاملة 🌐"
                      sx={{ bgcolor: 'rgba(6, 182, 212, 0.25)', color: '#67e8f9', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    تصفح جميع خدماتنا، الأسعار، وأداة صانع الإعلانات بالذكاء الاصطناعي (AI Studio)
                  </Typography>
                </Box>
              </Box>
              <IconButton
                sx={{
                  bgcolor: 'rgba(6, 182, 212, 0.2)',
                  color: '#67e8f9',
                  flexShrink: 0,
                  '&:hover': { bgcolor: '#06b6d4', color: '#ffffff' },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Card>

            {/* 4. WHATSAPP INSTANT CONSULTATION */}
            <Card
              onClick={() =>
                handleLinkClick(
                  'whatsapp',
                  'WhatsApp Instant Consultation',
                  `https://wa.me/2${siteSettings.adminPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'مرحباً MarknCode، أرغب في استشارة تسويقية وبرمجية لمشروعي وتفاصيل الخدمات.'
                  )}`
                )
              }
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '22px',
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.16) 0%, rgba(15, 23, 42, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(37, 211, 102, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: '#25D366',
                  boxShadow: '0 12px 35px rgba(37, 211, 102, 0.35)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    bgcolor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(37, 211, 102, 0.5)',
                    flexShrink: 0,
                  }}
                >
                  <WhatsAppIcon sx={{ color: '#ffffff', fontSize: 32 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      محادثة واتساب فورية | WhatsApp Direct
                    </Typography>
                    <Chip
                      size="small"
                      label="رد فوري ⚡"
                      sx={{ bgcolor: 'rgba(37, 211, 102, 0.25)', color: '#86efac', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    تحدث معنا مباشرة لمناقشة خطة مشروعك واستلام عرض سعر مخصص مجاناً
                  </Typography>
                </Box>
              </Box>
              <IconButton
                sx={{
                  bgcolor: 'rgba(37, 211, 102, 0.2)',
                  color: '#86efac',
                  flexShrink: 0,
                  '&:hover': { bgcolor: '#25D366', color: '#ffffff' },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Card>

            {/* 5. PHONE CALL & SPECIAL TOOLS QUICK ROW */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() =>
                    handleLinkClick('call', 'Direct Phone Call', `tel:${siteSettings.adminPhone}`)
                  }
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#38bdf8', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                    }}
                  >
                    <PhoneIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      اتصال هاتفي مباشر
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {siteSettings.adminPhone}
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  onClick={() =>
                    handleLinkClick('bot_doctor', 'Bot For Doctor Showcase', '/bot-for-doctor', false)
                  }
                  sx={{
                    p: 2.5,
                    borderRadius: '18px',
                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#c084fc', transform: 'translateY(-2px)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'rgba(192, 132, 252, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c084fc',
                    }}
                  >
                    <BotIcon />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      Bot for Doctor 🩺
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      نظام حجز العيادات بالذكاء الاصطناعي
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Box>

        {/* ============================================================== */}
        {/* SECTION 2: WHAT WE DO (بنعمل إيه بالتحديد في MarknCode)          */}
        {/* ============================================================== */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Chip
              label="خدماتنا وحلولنا المتكاملة"
              sx={{
                bgcolor: 'rgba(124, 58, 237, 0.15)',
                color: '#c084fc',
                fontWeight: 800,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: '"Outfit", sans-serif',
                fontSize: { xs: '1.75rem', sm: '2.2rem' },
              }}
            >
              بنعمل إيه في MarknCode؟ 💡
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 600, mx: 'auto', mt: 1 }}>
              نجمع بين قوة التسويق الرقمي عالي الأداء والحلول البرمجية المتطورة لنضمن نمو مشروعك بشكل حقيقي
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            {/* 1. Paid Ads */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#3b82f6',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: 'rgba(37, 99, 235, 0.15)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <CampaignIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  🎯 إعلانات ممولة وحملات رقمية (Performance Marketing)
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2 }}>
                  إدارة حملات إعلانية متكاملة على فيسبوك، إنستجرام، جوجل، وتيك توك مع استهداف دقيق لتقليل تكلفة الرسالة/الليد ومضاعفة المبيعات (High ROAS).
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  <Chip size="small" label="Meta Ads" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="Google Ads" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="TikTok Ads" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="استهداف دقيق" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                </Box>
              </Card>
            </Grid>

            {/* 2. Web & App Dev */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(6, 182, 212, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <CodeIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  💻 تصميم وتطوير المواقع والأنظمة (Web Development)
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2 }}>
                  برمجة مواقع شركات عصرية، صفحات هبوط (Landing Pages) سريعة مخصصة لتحقيق أعلى نسبة تحويل، متاجر إلكترونية متكاملة، ولوحات تحكم لإدارة أعمالك.
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  <Chip size="small" label="Landing Pages" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="متاجر إلكترونية" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="لوحات تحكم" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="بوابات دفع" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                </Box>
              </Card>
            </Grid>

            {/* 3. AI & Chatbots */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#a855f7',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(168, 85, 247, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <BotIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  🤖 حلول الذكاء الاصطناعي وبوتات واتساب (AI Agents)
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2 }}>
                  تطوير روبوتات محادثة ذكية متخصصة مثل Bot for Doctor للأطباء والعيادات لحجز المواعيد والرد على استفسارات المرضى 24/7 دون أي تأخير، وبوتات واتساب للأنشطة التجارية.
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  <Chip size="small" label="Bot For Doctor" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="واتساب بوت" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="رد آلي 24/7" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="حجز مواعيد" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                </Box>
              </Card>
            </Grid>

            {/* 4. Branding & Content Creation */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(245, 158, 11, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    bgcolor: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <PaletteIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                  🎬 صناعة المحتوى والهوية البصرية (Branding & Media)
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2 }}>
                  كتابة سكريبتات إعلانية فيروسية (Viral Hooks)، تصاميم سوشيال ميديا فاخرة، مونتاج ريلز وتيك توك خاطف للأنظار، وبناء هوية بصرية كاملة تميز علامتك عن المنافسين.
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  <Chip size="small" label="سكريبتات ريلز" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="تصاميم احترافية" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="هوية بصرية" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                  <Chip size="small" label="مونتاج فيديو" sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#94a3b8' }} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* ============================================================== */}
        {/* SECTION 3: WHY CHOOSE US & TRUST METRICS                      */}
        {/* ============================================================== */}
        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '26px',
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            mb: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
            ليه تختار MarknCode Agency؟ 🌟
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            نحن لا نكتفي بتقديم خدمة عادية، بل نعمل كشريك استراتيجي ملتزم بنجاحك المالي والرقمي
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#38bdf8', mb: 0.5 }}>
                  +98%
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
                  رضا وثقة العملاء
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#34d399', mb: 0.5 }}>
                  4.5x
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
                  متوسط العائد الإعلاني
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#c084fc', mb: 0.5 }}>
                  24/7
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
                  دعم واستجابة سريعة
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: 2, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fbbf24', mb: 0.5 }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>
                  شفافية وتقارير دورية
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
            جميع الحقوق محفوظة © {new Date().getFullYear()} MarknCode Agency • وكالتك للحلول البرمجية والتسويقية
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              size="small"
              onClick={() => navigate('/home')}
              sx={{ color: '#94a3b8', fontSize: '0.8rem', '&:hover': { color: '#38bdf8' } }}
            >
              الموقع الرئيسي ↗
            </Button>
          </Box>
        </Box>
      </Container>

      {/* ============================================================== */}
      {/* DIALOG: DETAILED VISITOR STATS (كام حد دخل اللاندنج بيج دي)      */}
      {/* ============================================================== */}
      <Dialog
        open={statsDialogOpen}
        onClose={() => setStatsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '26px',
            bgcolor: '#090d16',
            color: '#f8fafc',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                }}
              >
                <VisibilityIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.15rem' }}>
                  تقرير زوار صفحة الهبوط 📊
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  إحصائيات دقيقة للإجابة عن: كم شخص دخل على الصفحة؟
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setAnalytics(getLandingAnalytics())}
              sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)' }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {/* Security Gate if not unlocked */}
          {!isUnlocked ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <LockIcon sx={{ fontSize: 50, color: '#fbbf24', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#ffffff' }}>
                أدخل رمز المرور الإداري لعرض التقرير الكامل 🔒
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                تقرير الزوار والنقرات مخصص لإدارة MarknCode لضمان دقة وخصوصية الأرقام.
              </Typography>

              <form onSubmit={handleUnlockStats}>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="رمز المرور (الافتراضي 2025)..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  error={passcodeError}
                  helperText={passcodeError ? 'رمز المرور غير صحيح، يرجى المحاولة مجدداً.' : ''}
                  sx={{
                    mb: 2.5,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    borderRadius: '14px',
                    '& input': { textAlign: 'center', fontSize: '1.2rem', color: '#ffffff' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '14px',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    },
                  }}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.3,
                    borderRadius: '14px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                  }}
                >
                  فتح الإحصائيات الآن 🚀
                </Button>
              </form>
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* Top 3 Metric Cards */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      bgcolor: 'rgba(37, 99, 235, 0.12)',
                      border: '1.5px solid rgba(37, 99, 235, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 700, display: 'block' }}>
                      إجمالي الزيارات
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', my: 0.5 }}>
                      {analytics.totalVisits}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      زيارة مسجلة
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      bgcolor: 'rgba(16, 185, 129, 0.12)',
                      border: '1.5px solid rgba(16, 185, 129, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#6ee7b7', fontWeight: 700, display: 'block' }}>
                      الزوار الفريدين
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', my: 0.5 }}>
                      {analytics.uniqueVisitors}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      شخص مختلف
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      bgcolor: 'rgba(245, 158, 11, 0.12)',
                      border: '1.5px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fde68a', fontWeight: 700, display: 'block' }}>
                      زيارات اليوم
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', my: 0.5 }}>
                      {analytics.todayVisits}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      خلال اليوم
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Conversion Rate Progress */}
              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                    معدل التفاعل والنقر على الروابط:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#38bdf8' }}>
                    {conversionPercent}% ({totalInteractions} نقرة)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={conversionPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                    },
                  }}
                />
              </Box>

              {/* Links Click Breakdown */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#cbd5e1', mb: 1.5 }}>
                  🎯 تفاصيل ضغطات الروابط (أين يذهب الزوار؟):
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FacebookIcon sx={{ color: '#1877F2', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>فيسبوك</Typography>
                      </Box>
                      <Chip size="small" label={`${analytics.clicks.facebook} نقرة`} sx={{ bgcolor: '#1877F2', color: 'white', fontWeight: 800 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(225, 48, 108, 0.1)', border: '1px solid rgba(225, 48, 108, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InstagramIcon sx={{ color: '#E1306C', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>إنستجرام</Typography>
                      </Box>
                      <Chip size="small" label={`${analytics.clicks.instagram} نقرة`} sx={{ bgcolor: '#E1306C', color: 'white', fontWeight: 800 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WebsiteIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>الموقع الرسمي</Typography>
                      </Box>
                      <Chip size="small" label={`${analytics.clicks.website} نقرة`} sx={{ bgcolor: '#06b6d4', color: 'white', fontWeight: 800 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsAppIcon sx={{ color: '#25D366', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>واتساب</Typography>
                      </Box>
                      <Chip size="small" label={`${analytics.clicks.whatsapp} نقرة`} sx={{ bgcolor: '#25D366', color: 'white', fontWeight: 800 }} />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Devices Breakdown */}
              <Box sx={{ p: 2, borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>
                  📱 نوع الأجهزة المستخدمة:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#38bdf8' }}>
                      {analytics.deviceStats.mobile}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      موبايل 📱
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#a855f7' }}>
                      {analytics.deviceStats.desktop}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      كمبيوتر 💻
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#34d399' }}>
                      {analytics.deviceStats.tablet}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      تابلت 📟
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCopyReport}
            startIcon={<ContentCopyIcon />}
            sx={{
              borderRadius: '12px',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontWeight: 700,
            }}
          >
            نسخ التقرير لواتساب 📋
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setStatsDialogOpen(false);
                navigate('/admin');
              }}
              startIcon={<AdminIcon />}
              sx={{ borderRadius: '12px', borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
            >
              لوحة الإدارة 👑
            </Button>
            <Button
              variant="contained"
              onClick={() => setStatsDialogOpen(false)}
              sx={{ borderRadius: '12px', bgcolor: '#334155', color: '#ffffff' }}
            >
              إغلاق
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(copiedSnackbar)}
        autoHideDuration={4000}
        onClose={() => setCopiedSnackbar('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '14px', fontWeight: 700, bgcolor: '#064e3b', color: '#a7f3d0' }}>
          {copiedSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;
