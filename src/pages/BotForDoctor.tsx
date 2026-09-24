import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  useTheme,
  alpha,
  Paper,
  Alert,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Switch,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  OpenInNew as LaunchIcon,
  MedicalServices as MedicalIcon,
  EventAvailable as ScheduleIcon,
  Chat as ChatIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  NotificationsActive as AlertIcon,
  ExpandMore as ExpandIcon,
  Check as YesIcon,
  Close as NoIcon,
  Refresh as RefreshIcon,
  MonetizationOn as SalesIcon,
  Payment as PaymentIcon,
  TrendingUp as UpsellIcon,
  ReceiptLong as ReceiptIcon,
  AutoGraph as FunnelIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as WalletIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ShoppingCart as CartIcon,
  WhatsApp as WhatsAppIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCodeProtection } from '../hooks/useCodeProtection';

const BOT_URL = 'https://ipaq-rat-craig-hair.trycloudflare.com/';

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  monthlyPriceEgp: number;
  monthlyPriceUsd: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const BotForDoctor: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Billing cycle state
  const [isAnnual, setIsAnnual] = useState(false);

  // Checkout modal states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'card' | 'wallet' | 'fawry'>('instapay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Form inputs
  const [formData, setFormData] = useState({
    doctorName: '',
    clinicName: '',
    specialty: '',
    whatsappNumber: '',
    email: '',
  });
  const [formError, setFormError] = useState('');

  const handleOpenBot = () => {
    window.open(BOT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCheckout = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setOrderCompleted(false);
    setFormError('');
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setOrderCompleted(false);
  };

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmitCheckout = () => {
    if (!formData.doctorName.trim() || !formData.whatsappNumber.trim()) {
      setFormError('Please fill in your Name and WhatsApp number / يرجى كتابة الاسم ورقم الواتساب');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = 'MNC-' + Math.floor(100000 + Math.random() * 900000);
      setOrderRef(generatedRef);
      setOrderCompleted(true);
    }, 1200);
  };

  // Autonomous Sales Features
  const salesFeatures = [
    {
      icon: <PaymentIcon sx={{ fontSize: 38, color: '#10b981' }} />,
      title: 'Automated Online Payment Collection',
      titleAr: 'تحصيل إلكتروني تلقائي لرسوم الكشف والعربون',
      description:
        'Collect consultation fees, telemedicine prepayments, or booking deposits upfront via InstaPay, Credit/Debit cards, Vodafone Cash, and Fawry with automated confirmation.',
      stat: '0% No-Shows',
      badge: 'Payments & InstaPay',
    },
    {
      icon: <OfferIcon sx={{ fontSize: 38, color: '#f59e0b' }} />,
      title: 'Autonomous Clinic Package Sales',
      titleAr: 'البيع الآلي للباقات والعروض الطبية',
      description:
        'The bot autonomously presents and sells clinic service packages (Laser sessions, Dental whitening, Slimming programs, Annual wellness checkups) directly in WhatsApp chat.',
      stat: '+45% Revenue',
      badge: 'Package Selling',
    },
    {
      icon: <UpsellIcon sx={{ fontSize: 38, color: '#6366f1' }} />,
      title: 'AI Smart Upselling & Cross-selling',
      titleAr: 'اقتراح ذكي للتحاليل والخدمات التكميلية',
      description:
        'Based on symptoms or selected specialty, the AI intelligently suggests relevant pre-consultation lab tests, ultrasound scans, or cosmetic add-ons before checkout.',
      stat: '+30% Avg Order Value',
      badge: 'AI Cross-Sell',
    },
    {
      icon: <FunnelIcon sx={{ fontSize: 38, color: '#ec4899' }} />,
      title: 'Abandoned Booking Recovery Funnel',
      titleAr: 'استرداد الحجوزات والمبيعات المفقودة تلقائياً',
      description:
        'Patients who browse but do not complete payment receive automated, polite WhatsApp follow-ups with limited-time booking reminders or special discounts.',
      stat: '3.2x Lead Recovery',
      badge: 'Automated Recovery',
    },
    {
      icon: <ReceiptIcon sx={{ fontSize: 38, color: '#0ea5e9' }} />,
      title: 'Instant Certified E-Receipts & Invoicing',
      titleAr: 'إصدار فوري للفواتير والإيصالات الرقمية',
      description:
        'Generates instant branded digital invoices and payment confirmation vouchers sent directly to the patient on WhatsApp with clinic stamp and QR verification.',
      stat: '100% Automated',
      badge: 'Smart Invoicing',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 38, color: '#8b5cf6' }} />,
      title: 'Real-time Sales & Revenue Analytics',
      titleAr: 'لوحة تقارير أرباح ومبيعات العيادة المباشرة',
      description:
        'Live dashboard tracking daily sales, collected revenues, booked treatments, top requested packages, and active conversions accessible anytime by the doctor.',
      stat: 'Live Dashboard',
      badge: 'Doctor Insights',
    },
  ];

  // Core Features
  const features = [
    {
      icon: <ScheduleIcon sx={{ fontSize: 36, color: '#2563eb' }} />,
      title: 'Automated 24/7 Appointment Booking',
      description:
        'Patients can easily book, reschedule, or cancel consultations around the clock without manual receptionist intervention.',
    },
    {
      icon: <ChatIcon sx={{ fontSize: 36, color: '#7c3aed' }} />,
      title: 'WhatsApp & Web AI Assistant',
      description:
        'Seamlessly integrated with WhatsApp Business Cloud API and web chat to provide immediate responses in fluent Arabic and English.',
    },
    {
      icon: <MedicalIcon sx={{ fontSize: 36, color: '#059669' }} />,
      title: 'Smart Clinical Triage',
      description:
        'Collects patient symptoms, medical history, age, and pre-consultation details prior to doctor appointments.',
    },
    {
      icon: <AlertIcon sx={{ fontSize: 36, color: '#d97706' }} />,
      title: 'Real-Time Doctor & Staff Alerts',
      description:
        'Instant notifications sent directly to the doctor or clinic team whenever urgent cases or new bookings arrive.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 36, color: '#dc2626' }} />,
      title: 'Confidential & HIPAA-Ready',
      description:
        'Engineered to safeguard patient privacy, medical notes, and personal contact details with high enterprise encryption.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 36, color: '#0891b2' }} />,
      title: 'Zero Wait Times',
      description:
        'Gives patients instant answers about clinic hours, doctor specialties, clinic location, pricing, and prep instructions.',
    },
  ];

  // Subscription Plans
  const plans: PlanTier[] = [
    {
      id: 'starter',
      name: 'Starter Clinic',
      badge: 'Solo Practice',
      monthlyPriceEgp: 1490,
      monthlyPriceUsd: 49,
      description: 'Ideal for independent doctors and single clinics automating appointments and payment deposits.',
      features: [
        'Official WhatsApp Cloud API Integration',
        '24/7 Automated Appointment Booking',
        'Online Payment Collection (InstaPay & Cards)',
        'Smart Medical Triage & Patient Details',
        'Doctor Instant WhatsApp Notifications',
        'Up to 1,500 patient conversations / month',
        'Digital Receipts & Invoicing',
        'Free Setup & Clinic Customization',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Medical Center',
      badge: 'Most Popular / الأكثر طلباً',
      isPopular: true,
      monthlyPriceEgp: 2990,
      monthlyPriceUsd: 99,
      description: 'The complete autonomous sales engine for polyclinics, specialized centers, and cosmetic clinics.',
      features: [
        'Everything in Starter Clinic, plus:',
        'Autonomous Medical Package & Offers Sales',
        'AI Smart Upselling & Lab Test Add-ons',
        'Automated Abandoned Booking Recovery Funnel',
        'Multi-Doctor & Multi-Specialty Scheduling',
        'Advanced Payment Gateways (InstaPay, Fawry, Wallets, Visa)',
        'Real-time Revenue & Sales Analytics Dashboard',
        'Up to 5,000 patient conversations / month',
        'Priority 24/7 Onboarding & Technical Support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Hospital',
      badge: 'Hospitals & Chains',
      monthlyPriceEgp: 6990,
      monthlyPriceUsd: 229,
      description: 'Custom high-volume enterprise setup for hospitals, medical networks, and multiple branches.',
      features: [
        'Everything in Pro Medical Center, plus:',
        'Unlimited Patient Conversations & Messages',
        'Full EHR / EMR / Clinic System Integration',
        'Centralized Multi-branch & Department Routing',
        'Custom AI Medical Model Trained on Clinic Guidelines',
        'Automated Post-op & Telemedicine Follow-up',
        'Dedicated Account Manager & VIP SLA Support',
        'Custom Domain & Private Cloud Deployment Option',
      ],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Choose Plan & Connect Clinic WhatsApp',
      desc: 'Select your preferred subscription plan and link your official clinic WhatsApp number in minutes.',
    },
    {
      num: '02',
      title: 'Configure Services, Packages & Payments',
      desc: 'Define consultation fees, medical packages, InstaPay / payment links, and doctor clinic hours.',
    },
    {
      num: '03',
      title: 'Autopilot Booking & Autonomous Sales',
      desc: 'Sit back as the bot handles bookings, collects consultation fees, sells treatment packages, and recovers leads 24/7.',
    },
  ];

  const comparisons = [
    {
      criteria: 'Availability',
      traditional: '8–10 hours / day (clinic open hours only)',
      bot: '24 Hours / 7 Days a week non-stop',
    },
    {
      criteria: 'Response Time',
      traditional: 'Minutes to hours (busy phone lines)',
      bot: 'Instant (< 2 seconds response)',
    },
    {
      criteria: 'Simultaneous Patients',
      traditional: '1 caller per receptionist line',
      bot: 'Unlimited simultaneous patient chats',
    },
    {
      criteria: 'Online Payments & Deposits',
      traditional: 'Manual cash/POS at front desk only',
      bot: 'Automated InstaPay, Visa & upfront payment collection',
    },
    {
      criteria: 'Selling Packages & Offers',
      traditional: 'Dependent on receptionist memory & mood',
      bot: 'Autonomous AI Sales of clinic packages & procedures',
    },
    {
      criteria: 'Lost Inquiries Recovery',
      traditional: 'Unconfirmed patient inquiries lost forever',
      bot: 'Automated WhatsApp sales recovery & re-engagement',
    },
    {
      criteria: 'WhatsApp Automation',
      traditional: 'Manual typing & delayed replies',
      bot: '100% automated booking & confirmations',
    },
    {
      criteria: 'Staff Burnout',
      traditional: 'High repetitive call fatigue',
      bot: 'Zero burnout, frees staff for clinic care',
    },
  ];

  const faqs = [
    {
      q: 'How does the bot sell and collect payments autonomously?',
      a: 'The bot integrates directly with payment solutions like InstaPay, Vodafone Cash, Visa/Mastercard (via Paymob/Stripe), and Fawry. When a patient requests a booking, consultation, or package, the bot provides the secure payment link or wallet details, verifies the transaction, and issues an instant digital receipt on WhatsApp.',
    },
    {
      q: 'Can the bot sell specific medical packages (like Dental, Laser, or Checkups)?',
      a: 'Yes! You can define any number of medical packages, promotional discounts, or bundles with custom pricing. The bot showcases them with photos, details, and pricing inside the WhatsApp conversation, driving direct purchases.',
    },
    {
      q: 'What is the Abandoned Booking Recovery feature?',
      a: 'If a patient inquires about a service, picks an appointment, but stops before completing payment, the bot automatically sends a polite follow-up reminder after a configured delay (e.g. 15-30 minutes) to help close the booking.',
    },
    {
      q: 'Can the bot integrate with our existing clinic WhatsApp number?',
      a: 'Yes! MarknCode Bot for Doctor is powered by the official WhatsApp Cloud API, allowing your clinic to keep its existing number with automated verified responses.',
    },
    {
      q: 'Does the bot support Arabic and Egyptian dialect?',
      a: 'Absolutely. The bot is trained to communicate fluently in Modern Standard Arabic, Egyptian dialect, and English, understanding medical terms and colloquial patient inquiries.',
    },
    {
      q: 'How fast can our clinic be onboarded after subscribing online?',
      a: 'Once you choose a plan and submit your clinic details, our engineering team contacts you within a few hours to complete WhatsApp API verification and service setup. Full deployment is completed within 24 to 48 hours.',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 12 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% -10%, #1e3a8a 0%, #0f172a 80%, #020617 100%)',
          color: 'white',
          py: { xs: 8, md: 11 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                icon={<BotIcon sx={{ color: '#60a5fa !important' }} />}
                label="AI Healthcare Innovation for Doctors & Medical Clinics"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  px: 1.8,
                  py: 2.2,
                  fontSize: '0.92rem',
                }}
              />
              <Chip
                icon={<SalesIcon sx={{ color: '#34d399 !important' }} />}
                label="Autonomous Sales & Online Payments Enabled ⚡"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: '#6ee7b7',
                  fontWeight: 700,
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  px: 1.8,
                  py: 2.2,
                  fontSize: '0.92rem',
                }}
              />
            </Box>

            <Typography
              variant="h1"
              component="h1"
              align="center"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              MarknCode Bot for Doctor
            </Typography>

            <Typography
              variant="h5"
              align="center"
              sx={{
                maxWidth: 860,
                mx: 'auto',
                color: 'rgba(226, 232, 240, 0.9)',
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.65,
                mb: 4.5,
              }}
            >
              The intelligent conversational AI assistant tailored for doctors, medical practices, and polyclinics.
              Automates appointments, answers patient inquiries, collects consultation fees upfront, and autonomously sells medical packages 24/7 on WhatsApp & Web.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenBot}
                  endIcon={<LaunchIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: '#1e3a8a',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4.2,
                    py: 1.6,
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.94)',
                    },
                  }}
                >
                  Open Live Demo ↗
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={scrollToPricing}
                  startIcon={<CartIcon />}
                  sx={{
                    borderColor: 'rgba(52, 211, 153, 0.7)',
                    color: '#a7f3d0',
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.6,
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: '#34d399',
                      bgcolor: 'rgba(16, 185, 129, 0.22)',
                      color: 'white',
                    },
                  }}
                >
                  Buy & Subscribe Online ⚡
                </Button>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Main Interactive Demo & Embed Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 5,
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.15)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 3,
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 800 }}>
                Live Interactive Bot Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experience the live AI clinic assistant below or test booking a consultation directly.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefreshIframe}
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: '20px' }}
              >
                Reload
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenBot}
                endIcon={<LaunchIcon />}
                sx={{ borderRadius: '20px' }}
              >
                Full Window
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              width: '100%',
              height: { xs: '520px', md: '680px' },
              borderRadius: 3.5,
              overflow: 'hidden',
              bgcolor: '#0f172a',
              position: 'relative',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {!iframeLoaded && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  bgcolor: '#0f172a',
                  color: 'white',
                  zIndex: 2,
                }}
              >
                <BotIcon sx={{ fontSize: 56, color: '#38bdf8' }} />
                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  Connecting to MarknCode Doctor Bot...
                </Typography>
                <Button variant="contained" onClick={handleOpenBot} endIcon={<LaunchIcon />}>
                  Open Directly in New Window
                </Button>
              </Box>
            )}

            <iframe
              key={iframeKey}
              src={BOT_URL}
              title="MarknCode Bot for Doctor"
              onLoad={() => setIframeLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="microphone; camera; clipboard-write"
            />
          </Box>
        </Paper>
      </Container>

      {/* NEW SECTION: Autonomous Sales & Revenue Engine */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            icon={<SalesIcon sx={{ color: '#059669 !important' }} />}
            label="Autonomous Sales & Revenue Engine"
            sx={{
              fontWeight: 700,
              color: '#059669',
              bgcolor: alpha('#10b981', 0.12),
              mb: 2,
              px: 1.5,
              py: 2,
              fontSize: '0.95rem',
            }}
          />
          <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            A Bot That Doesn’t Just Chat — It Sells On Its Own
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 780, mx: 'auto', lineHeight: 1.6 }}
          >
            Turn your clinic's WhatsApp into an autonomous 24/7 revenue channel. Collect upfront consultation fees, sell cosmetic and treatment packages, and automatically recover unconfirmed bookings.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {salesFeatures.map((sf, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  p: 3.5,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: '0 8px 25px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.35s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.12)',
                    borderColor: alpha('#10b981', 0.4),
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        display: 'inline-flex',
                      }}
                    >
                      {sf.icon}
                    </Box>
                    <Chip
                      label={sf.stat}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha('#10b981', 0.12),
                        color: '#059669',
                        borderRadius: '12px',
                      }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.3 }}>
                    {sf.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 1.5 }}
                  >
                    {sf.titleAr}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {sf.description}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${alpha(theme.palette.divider, 0.7)}` }}>
                  <Chip
                    label={sf.badge}
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.78rem', fontWeight: 600 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 3 Steps: How It Works */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            label="Simple Onboarding"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 2,
            }}
          />
          <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            How It Works in 3 Simple Steps
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.15rem' }}
          >
            Transform your clinic reception from overwhelmed phone lines to automated, effortless precision and revenue growth.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: alpha(theme.palette.primary.main, 0.12),
                    position: 'absolute',
                    top: 10,
                    right: 20,
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  {step.num}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, mt: 2 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {step.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Key Features Grid */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Engineered Specifically For Healthcare Practices
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto' }}>
            Built around medical clinic workflows to reduce no-shows, answer common patient inquiries, and protect patient privacy.
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  p: 3.5,
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: '0 8px 25px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 18px 35px rgba(37, 99, 235, 0.1)',
                    borderColor: alpha(theme.palette.primary.main, 0.35),
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Comparison: Traditional vs AI Bot */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.06)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
              Traditional Receptionist vs. MarknCode Doctor Bot
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Why modern medical clinics and doctors are shifting to AI-first patient care and autonomous selling.
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Feature / Capability</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'text.secondary' }}>
                    Traditional Reception
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'primary.main' }}>
                    MarknCode Doctor Bot
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisons.map((row, idx) => (
                  <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                      {row.criteria}
                    </TableCell>
                    <TableCell sx={{ color: '#ef4444' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NoIcon sx={{ fontSize: 18 }} />
                        {row.traditional}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#16a34a', fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <YesIcon sx={{ fontSize: 18 }} />
                        {row.bot}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* NEW SECTION: Pricing & Subscription Checkout (شراء واشتراك أونلاين) */}
      <Container id="pricing-section" maxWidth="lg" sx={{ mt: 14 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<CartIcon sx={{ color: '#2563eb !important' }} />}
            label="Instant Online Subscription & Plans"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 2,
              px: 1.5,
              py: 2,
              fontSize: '0.95rem',
            }}
          />
          <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Transparent Pricing. Ready To Sell Today.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
            Choose the right plan for your medical clinic, subscribe instantly online, and launch your automated doctor bot within 24 hours.
          </Typography>

          {/* Billing Switch */}
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <Typography variant="body1" sx={{ fontWeight: !isAnnual ? 700 : 500 }}>
              Monthly
            </Typography>
            <Switch
              checked={isAnnual}
              onChange={(e) => setIsAnnual(e.target.checked)}
              color="primary"
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: isAnnual ? 700 : 500 }}>
                Annual Billing
              </Typography>
              <Chip
                label="Save 20% 🎉"
                size="small"
                sx={{
                  bgcolor: alpha('#10b981', 0.15),
                  color: '#059669',
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan) => {
            const finalPriceEgp = isAnnual
              ? Math.round(plan.monthlyPriceEgp * 0.8)
              : plan.monthlyPriceEgp;
            const finalPriceUsd = isAnnual
              ? Math.round(plan.monthlyPriceUsd * 0.8)
              : plan.monthlyPriceUsd;

            return (
              <Grid item xs={12} md={4} key={plan.id}>
                <Paper
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 5,
                    bgcolor: 'background.paper',
                    border: plan.isPopular
                      ? `2.5px solid ${theme.palette.primary.main}`
                      : `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    boxShadow: plan.isPopular
                      ? '0 20px 45px rgba(37, 99, 235, 0.18)'
                      : '0 10px 30px rgba(15, 23, 42, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 25px 50px rgba(37, 99, 235, 0.22)',
                    },
                  }}
                >
                  {plan.badge && (
                    <Box sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                      <Chip
                        icon={plan.isPopular ? <StarIcon sx={{ color: 'white !important', fontSize: 16 }} /> : undefined}
                        label={plan.badge}
                        sx={{
                          bgcolor: plan.isPopular ? 'primary.main' : '#0f172a',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          px: 1.2,
                        }}
                      />
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 45, mb: 3 }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ mb: 3, pb: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                          {finalPriceEgp.toLocaleString()} EGP
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          / month
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        (or approx. ${finalPriceUsd} USD / billed {isAnnual ? 'annually' : 'monthly'})
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Included Features:
                    </Typography>
                    <Stack spacing={1.5} sx={{ mb: 4 }}>
                      {plan.features.map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981', mt: 0.3 }} />
                          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5 }}>
                            {feat}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    variant={plan.isPopular ? 'contained' : 'outlined'}
                    size="large"
                    fullWidth
                    onClick={() => handleOpenCheckout(plan)}
                    startIcon={<CartIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      ...(plan.isPopular && {
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }),
                    }}
                  >
                    Subscribe & Activate Now ⚡
                  </Button>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Interactive Checkout Modal (نافذة إتمام الاشتراك الفوري) */}
      <Dialog
        open={checkoutOpen}
        onClose={handleCloseCheckout}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {orderCompleted ? 'Order Confirmed! 🎉' : 'Instant Online Checkout'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              MarknCode Bot for Doctor — Automated Activation
            </Typography>
          </Box>
          <IconButton onClick={handleCloseCheckout} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {orderCompleted ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 72, color: '#10b981', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Thank You, Dr. {formData.doctorName}!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your order for <strong>{selectedPlan?.name}</strong> has been registered successfully.
              </Typography>

              <Paper
                sx={{
                  p: 2.5,
                  mb: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3,
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  textAlign: 'left',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Order Reference: <span style={{ color: '#2563eb' }}>{orderRef}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Selected Plan:</strong> {selectedPlan?.name} ({isAnnual ? 'Annual' : 'Monthly'})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>WhatsApp:</strong> {formData.whatsappNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Payment Method:</strong> {paymentMethod.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Activation Time:</strong> Within 12–24 Hours
                </Typography>
              </Paper>

              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Our medical automation onboarding engineer is ready to link your official WhatsApp number.
              </Alert>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<WhatsAppIcon />}
                onClick={() => {
                  const msg = encodeURIComponent(
                    `Hello MarknCode! I just subscribed to MarknCode Bot for Doctor (${selectedPlan?.name}) with Order Ref: ${orderRef}. Doctor: ${formData.doctorName}, WhatsApp: ${formData.whatsappNumber}. Let's activate my bot!`
                  );
                  window.open(`https://wa.me/201099689408?text=${msg}`, '_blank');
                }}
                sx={{
                  bgcolor: '#25D366',
                  color: 'white',
                  fontWeight: 700,
                  py: 1.6,
                  borderRadius: '50px',
                  fontSize: '1.05rem',
                  '&:hover': { bgcolor: '#1eb855' },
                }}
              >
                Connect on WhatsApp to Activate ↗
              </Button>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              {selectedPlan && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {selectedPlan.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isAnnual ? 'Annual Subscription (20% Off applied)' : 'Monthly Subscription'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {(
                      isAnnual
                        ? Math.round(selectedPlan.monthlyPriceEgp * 0.8)
                        : selectedPlan.monthlyPriceEgp
                    ).toLocaleString()}{' '}
                    EGP/mo
                  </Typography>
                </Paper>
              )}

              {formError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {formError}
                </Alert>
              )}

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Doctor & Clinic Details (بيانات الطبيب والعيادة):
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Doctor / Contact Name *"
                    fullWidth
                    size="small"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Clinic / Center Name"
                    fullWidth
                    size="small"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Medical Specialty (e.g. Dental, Derma)"
                    fullWidth
                    size="small"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="WhatsApp Number for Bot *"
                    placeholder="+20 1xxxxxxxxx"
                    fullWidth
                    size="small"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    size="small"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Select Payment Method (اختر طريقة الدفع):
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2.5,
                    border:
                      paymentMethod === 'instapay'
                        ? `2px solid ${theme.palette.primary.main}`
                        : undefined,
                  }}
                >
                  <FormControlLabel
                    value="instapay"
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WalletIcon sx={{ color: '#ec4899', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          InstaPay / المحافظ الإلكترونية (فودافون كاش، اتصالات، وي)
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2.5,
                    border:
                      paymentMethod === 'card'
                        ? `2px solid ${theme.palette.primary.main}`
                        : undefined,
                  }}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CardIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Credit / Debit Card (Visa, MasterCard, Meeza)
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    border:
                      paymentMethod === 'fawry'
                        ? `2px solid ${theme.palette.primary.main}`
                        : undefined,
                  }}
                >
                  <FormControlLabel
                    value="fawry"
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SalesIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Fawry Pay / كود فوري
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </Box>
          )}
        </DialogContent>

        {!orderCompleted && (
          <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
            <Button onClick={handleCloseCheckout} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitCheckout}
              disabled={isSubmitting}
              sx={{
                px: 3.5,
                borderRadius: '50px',
                fontWeight: 700,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Confirm Order & Activate Now 🚀'
              )}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mt: 14 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Got questions about MarknCode Bot for Doctor, sales automation, and licensing?
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              sx={{
                mb: 1.5,
                borderRadius: '16px !important',
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                '&:before': { display: 'none' },
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.03)',
              }}
            >
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      {/* Bottom CTA */}
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #0f172a 100%)',
            color: 'white',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Deploy MarknCode Bot for Your Practice Today
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 620, mx: 'auto', color: 'rgba(255,255,255,0.85)' }}
          >
            We customize the bot with your clinic services, consultation fees, payment links, and doctor schedules with 24/7 autonomous sales.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenBot}
              endIcon={<LaunchIcon />}
              sx={{
                px: 4.5,
                py: 1.6,
                borderRadius: '50px',
                fontSize: '1.05rem',
                fontWeight: 700,
                bgcolor: 'white',
                color: '#1e3a8a',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Launch Live Demo ↗
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={scrollToPricing}
              startIcon={<CartIcon />}
              sx={{
                px: 4,
                py: 1.6,
                borderRadius: '50px',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderColor: 'rgba(52, 211, 153, 0.7)',
                color: '#a7f3d0',
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                '&:hover': {
                  borderColor: '#34d399',
                  bgcolor: 'rgba(16, 185, 129, 0.25)',
                  color: 'white',
                },
              }}
            >
              View Pricing & Subscribe ⚡
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default BotForDoctor;
