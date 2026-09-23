import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/signin" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bot-for-doctor" element={<BotForDoctor />} />
            <Route path="/markncode-bot-for-doctor" element={<BotForDoctor />} />
            
            <Route path="/our-services" element={<OurServices />} />
            
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
            
            {/* Redirects */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App; 