import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { getSiteSettings } from './services/adminSettingsService';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import OurServices from './components/OurServices';
import NotFound from './pages/NotFound';
import BotForDoctor from './pages/BotForDoctor';
import CreateYourAd from './pages/CreateYourAd';
import AdminPayments from './pages/AdminPayments';
import LandingPage from './pages/LandingPage';
import ScrollToTop from './components/ScrollToTop';
import BackToTopFab from './components/BackToTopFab';
import SecurityGuard from './components/SecurityGuard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(226, 232, 240, 0.8)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      fontSize: '3.75rem',
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
      fontSize: '2.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#334155',
    },
    body2: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          padding: '10px 24px',
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return user ? <>{children}</> : <Navigate to="/signin" />;
};

const MaintenanceScreen: React.FC<{ message: string; phone: string; email: string }> = ({
  message,
  phone,
  email,
}) => {
  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
        px: 3,
        py: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          color: '#ffffff',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(234, 179, 8, 0.15)',
            border: '2px solid rgba(234, 179, 8, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            fontSize: '2.5rem',
          }}
        >
          ⚙️
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            color: '#f8fafc',
            fontSize: { xs: '1.5rem', sm: '1.9rem' },
          }}
        >
          الموقع تحت الصيانة المؤقتة
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.8, fontSize: '1.02rem' }}
        >
          {message ||
            'نقوم حالياً بإجراء بعض التحديثات والتحسينات الدورية لنمنحكم أفضل تجربة. سنعود للعمل بكامل طاقتنا في أقرب وقت!'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 4 }}>
          {phone && (
            <Button
              component="a"
              href={`https://wa.me/2${phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                px: 3,
                fontWeight: 700,
              }}
            >
              تواصل عبر واتساب 💬
            </Button>
          )}
          {email && (
            <Button
              component="a"
              href={`mailto:${email}`}
              variant="outlined"
              sx={{
                borderColor: 'rgba(148, 163, 184, 0.3)',
                color: '#cbd5e1',
                '&:hover': { borderColor: '#ffffff', color: '#ffffff' },
                px: 3,
                fontWeight: 600,
              }}
            >
              مراسلة الإدارة ✉️
            </Button>
          )}
        </Box>
        <Box sx={{ borderTop: '1px solid rgba(148, 163, 184, 0.1)', pt: 3 }}>
          <Button
            component={RouterLink}
            to="/admin"
            size="small"
            sx={{ color: '#64748b', fontSize: '0.8rem', '&:hover': { color: '#94a3b8' } }}
          >
            دخول إدارة الموقع (Admin Area) 🔒
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const HomeRouteWrapper: React.FC = () => {
  const location = useLocation();
  const search = (location.search || '').toLowerCase();
  if (
    search.includes('ref=qr') ||
    search.includes('source=qr') ||
    search.includes('utm_source=qr') ||
    search.includes('qr=')
  ) {
    return <Navigate to={`/links${location.search}`} replace />;
  }
  return <Home />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = React.useState(() => getSiteSettings());

  React.useEffect(() => {
    const handleSync = () => setSiteSettings(getSiteSettings());
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('mnc_admin_settings_sync');
      bc.onmessage = handleSync;
    } catch (e) {}
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      if (bc) bc.close();
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (siteSettings.maintenanceMode && !isAdminRoute) {
    return (
      <>
        <MaintenanceScreen
          message={siteSettings.maintenanceMessage}
          phone={siteSettings.adminPhone}
          email={siteSettings.adminEmail}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bot-for-doctor" element={<BotForDoctor />} />
        <Route path="/markncode-bot-for-doctor" element={<BotForDoctor />} />
        <Route path="/create-your-ad" element={<CreateYourAd />} />
        <Route path="/ai-ad-studio" element={<CreateYourAd />} />

        <Route path="/our-services" element={<OurServices />} />

        {/* Landing Page & Bio Links */}
        <Route path="/links" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/bio" element={<LandingPage />} />
        <Route path="/connect" element={<LandingPage />} />
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="/qr" element={<Navigate to="/links?ref=qr" replace />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPayments />} />
        <Route path="/admin/payments" element={<AdminPayments />} />

        {/* Redirects */}
        <Route path="/" element={<HomeRouteWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <BackToTopFab />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <SecurityGuard />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 