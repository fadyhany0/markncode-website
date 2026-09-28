import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  Container,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BotIcon from '@mui/icons-material/SmartToy';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import ServicesIcon from '@mui/icons-material/BuildCircleRounded';
import AppsIcon from '@mui/icons-material/AppsRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import ContactMailIcon from '@mui/icons-material/ContactMailRounded';
import CampaignIcon from '@mui/icons-material/CampaignRounded';
import LoginIcon from '@mui/icons-material/LoginRounded';
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import SecurityIcon from '@mui/icons-material/SecurityRounded';
import { useAuth } from '../contexts/AuthContext';
import { getSiteSettings, SOLE_ADMIN_EMAIL } from '../services/adminSettingsService';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => getSiteSettings());

  useEffect(() => {
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
  
  // Use 1120px breakpoint to guarantee that items never wrap or collide on laptops
  const isMobile = useMediaQuery('(max-width: 1120px)');

  // User Profile Dropdown Anchor
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
    setMobileOpen(false);
    navigate('/home');
  };

  // Admin privilege is strictly and exclusively granted ONLY when logged in via Google OAuth with hanyfady034@gmail.com
  const isGoogleAdmin = Boolean(
    user &&
    user.isGoogleAuth === true &&
    user.email?.toLowerCase() === SOLE_ADMIN_EMAIL.toLowerCase()
  );

  const navItems = [
    { text: 'Home', path: '/home', icon: <HomeIcon fontSize="small" /> },
    { text: 'اعمل إعلانك 🚀', path: '/create-your-ad', icon: <CampaignIcon fontSize="small" />, isHighlight: true },
    ...(isGoogleAdmin ? [{ text: 'لوحة الإدارة 👑', path: '/admin', icon: <SecurityIcon fontSize="small" />, isHighlight: true }] : []),
    { text: 'Bot for Doctor', path: '/bot-for-doctor', icon: <BotIcon fontSize="small" /> },
    { text: 'Services', path: '/services', icon: <ServicesIcon fontSize="small" /> },
    { text: 'All Services', path: '/our-services', icon: <AppsIcon fontSize="small" /> },
    { text: 'About', path: '/about', icon: <InfoIcon fontSize="small" /> },
    { text: 'Contact', path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
  ];

  // User display name helper
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'Account';
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Mobile Drawer
  const drawer = (
    <Box 
      sx={{ 
        width: 300, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#ffffff',
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2.5,
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(124, 58, 237, 0.04) 100%)',
      }}>
        <Typography 
          variant="h6" 
          component={RouterLink}
          to="/home"
          onClick={() => {
            handleDrawerToggle();
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }}
          sx={{ 
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          MarknCode
          <Box component="span" sx={{ 
            ml: 0.6,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Agency
          </Box>
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle}
          size="small"
          sx={{
            color: '#64748b',
            '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Drawer Nav Items */}
      <List sx={{ px: 2, py: 2, flexGrow: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              key={item.text}
              component={RouterLink}
              to={item.path}
              onClick={() => {
                handleDrawerToggle();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              sx={{
                borderRadius: '12px',
                mb: 1,
                py: 1.2,
                px: 2,
                textDecoration: 'none',
                color: isActive ? '#2563eb' : item.isHighlight ? '#ea580c' : '#334155',
                bgcolor: isActive
                  ? 'rgba(37, 99, 235, 0.08)'
                  : item.isHighlight
                  ? 'rgba(249, 115, 22, 0.08)'
                  : 'transparent',
                border: item.isHighlight ? '1px dashed rgba(249, 115, 22, 0.4)' : '1px solid transparent',
                fontWeight: (isActive || item.isHighlight) ? 700 : 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: item.isHighlight ? '#c2410c' : '#2563eb',
                  bgcolor: item.isHighlight ? 'rgba(249, 115, 22, 0.15)' : 'rgba(37, 99, 235, 0.06)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#2563eb' : item.isHighlight ? '#ea580c' : '#64748b', minWidth: 38 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: (isActive || item.isHighlight) ? 700 : 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          );
        })}

        {/* MarknCode Bot for Doctor (Mobile Highlight) */}
        <Box sx={{ my: 2 }}>
          <Button
            fullWidth
            onClick={() => {
              navigate('/bot-for-doctor');
              handleDrawerToggle();
            }}
            startIcon={<BotIcon />}
            sx={{
              py: 1.2,
              px: 2,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              },
            }}
          >
            MarknCode Bot for Doctor
          </Button>
        </Box>

        {/* Links & Socials Page (Mobile Drawer) */}
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            onClick={() => {
              navigate('/links');
              handleDrawerToggle();
            }}
            sx={{
              py: 1.1,
              px: 2,
              borderRadius: '14px',
              border: '1.5px solid rgba(37, 99, 235, 0.35)',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              bgcolor: 'rgba(37, 99, 235, 0.04)',
              '&:hover': {
                bgcolor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            روابطنا وقنوات التواصل (Links) 🔗
          </Button>
        </Box>
      </List>

      {/* Drawer Auth Footer (Always clean and spacious, NEVER overlapping) */}
      <Box sx={{ 
        p: 2.5, 
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        bgcolor: '#f8fafc',
      }}>
        {user ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#2563eb', 
                  width: 38, 
                  height: 38,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                }}
              >
                {getUserInitial()}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography noWrap variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {getUserDisplayName()}
                </Typography>
                <Typography noWrap variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to="/dashboard"
              onClick={handleDrawerToggle}
              variant="outlined"
              fullWidth
              startIcon={<DashboardIcon />}
              sx={{
                borderRadius: '12px',
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#cbd5e1',
                color: '#334155',
                '&:hover': {
                  borderColor: '#2563eb',
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                  color: '#2563eb',
                },
              }}
            >
              Dashboard
            </Button>

            <Button
              onClick={handleSignOut}
              variant="text"
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: '12px',
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                color: '#ef4444',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.08)',
                },
              }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              component={RouterLink}
              to="/signin"
              onClick={() => {
                handleDrawerToggle();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              variant="outlined"
              fullWidth
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: '12px',
                py: 1.1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderColor: '#cbd5e1',
                color: '#1e293b',
                '&:hover': {
                  borderColor: '#2563eb',
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                  color: '#2563eb',
                },
              }}
            >
              Sign In
            </Button>

            <Button
              component={RouterLink}
              to="/signup"
              onClick={() => {
                handleDrawerToggle();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              variant="contained"
              fullWidth
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: '12px',
                py: 1.1,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              Free Trial & Sign Up 🎁
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
      {/* Site-wide Announcement Bar or Guest Perk Banner */}
      {siteSettings.announcement?.enabled ? (
        <Box
          sx={{
            background:
              siteSettings.announcement.type === 'warning'
                ? 'linear-gradient(90deg, #78350f 0%, #b45309 50%, #78350f 100%)'
                : siteSettings.announcement.type === 'success'
                ? 'linear-gradient(90deg, #064e3b 0%, #059669 50%, #064e3b 100%)'
                : 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
            color: 'white',
            py: 0.9,
            px: 2,
            textAlign: 'center',
            fontSize: { xs: '0.78rem', sm: '0.85rem' },
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
            <span>
              {siteSettings.announcement.type === 'warning'
                ? '⚠️'
                : siteSettings.announcement.type === 'success'
                ? '🎉'
                : '📢'}
            </span>
            <span>{siteSettings.announcement.message}</span>
          </Box>
          {siteSettings.announcement.linkText && siteSettings.announcement.linkUrl && (
            <Button
              {...(siteSettings.announcement.linkUrl.startsWith('/')
                ? { component: RouterLink, to: siteSettings.announcement.linkUrl }
                : { component: 'a', href: siteSettings.announcement.linkUrl, target: '_blank', rel: 'noopener noreferrer' })}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                fontWeight: 700,
                fontSize: '0.75rem',
                py: 0.3,
                px: 1.8,
                borderRadius: '20px',
                textTransform: 'none',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: '#ffffff',
                  color: '#0f172a',
                },
              }}
            >
              {siteSettings.announcement.linkText} ⚡
            </Button>
          )}
        </Box>
      ) : !user ? (
        <Box
          sx={{
            background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
            color: 'white',
            py: 0.8,
            px: 2,
            textAlign: 'center',
            fontSize: { xs: '0.78rem', sm: '0.84rem' },
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6 }}>
            <span>🎁</span>
            <span>
              <strong>New Member Perk:</strong> Create an account today to claim a <strong>Free Clinic Growth Audit</strong> & <strong>7-Day Doctor Bot Trial</strong>!
            </span>
          </Box>
          <Button
            component={RouterLink}
            to="/signup"
            size="small"
            sx={{
              bgcolor: 'rgba(52, 211, 153, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.45)',
              fontWeight: 700,
              fontSize: '0.74rem',
              py: 0.2,
              px: 1.5,
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#10b981',
                color: 'white',
              },
            }}
          >
            Claim Free Account ⚡
          </Button>
        </Box>
      ) : null}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          height: '74px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar 
            disableGutters
            sx={{ 
              justifyContent: 'space-between', 
              height: '100%',
              minHeight: '74px',
              flexWrap: 'nowrap',
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h5"
                component={RouterLink}
                to="/home"
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }}
                sx={{
                  textDecoration: 'none',
                  fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.65rem' },
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MarknCode
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 0.8,
                    fontWeight: 700,
                    fontSize: '0.85em',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Agency
                </Box>
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: { md: 1, lg: 1.5 },
                  flexWrap: 'nowrap',
                }}
              >
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.text}
                      component={RouterLink}
                      to={item.path}
                      onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      sx={{
                        color: isActive ? (item.isHighlight ? '#ea580c' : '#2563eb') : item.isHighlight ? '#ea580c' : '#334155',
                        px: { md: 1.5, lg: 2 },
                        py: 0.8,
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        fontWeight: (isActive || item.isHighlight) ? 700 : 500,
                        whiteSpace: 'nowrap',
                        textTransform: 'none',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        bgcolor: isActive
                          ? (item.isHighlight ? 'rgba(249, 115, 22, 0.12)' : 'rgba(37, 99, 235, 0.08)')
                          : (item.isHighlight ? 'rgba(249, 115, 22, 0.08)' : 'transparent'),
                        border: item.isHighlight ? '1px dashed rgba(249, 115, 22, 0.45)' : '1px solid transparent',
                        '&:hover': {
                          color: item.isHighlight ? '#c2410c' : '#2563eb',
                          bgcolor: item.isHighlight ? 'rgba(249, 115, 22, 0.15)' : 'rgba(37, 99, 235, 0.06)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                })}

                {/* MarknCode Bot for Doctor Button (Glowing Desktop Pill) */}
                <Button
                  onClick={() => {
                    navigate('/bot-for-doctor');
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }}
                  startIcon={<BotIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    color: 'white',
                    px: { md: 1.8, lg: 2.2 },
                    py: 0.7,
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Bot for Doctor
                </Button>
              </Box>
            )}

            {/* Desktop Auth Section (Completely insulated with zero overlap) */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.2,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {user ? (
                  <>
                    <Button
                      onClick={handleProfileMenuOpen}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.6,
                        px: 1.5,
                        borderRadius: '50px',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        bgcolor: '#ffffff',
                        textTransform: 'none',
                        color: '#1e293b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#f8fafc',
                          borderColor: '#cbd5e1',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 30, 
                          height: 30, 
                          bgcolor: '#2563eb', 
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        }}
                      >
                        {getUserInitial()}
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          maxWidth: 120, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}
                      >
                        {getUserDisplayName()}
                      </Typography>
                      <ArrowDownIcon sx={{ fontSize: 18, color: '#64748b' }} />
                    </Button>

                    {/* Profile Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      PaperProps={{
                        elevation: 4,
                        sx: {
                          mt: 1.2,
                          minWidth: 210,
                          borderRadius: '16px',
                          p: 1,
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {getUserDisplayName()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 0.8 }} />
                      <MenuItem 
                        component={RouterLink}
                        to="/dashboard"
                        onClick={handleMenuClose}
                        sx={{ 
                          borderRadius: '10px', 
                          py: 1,
                          gap: 1.5,
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#334155',
                          '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' }
                        }}
                      >
                        <DashboardIcon fontSize="small" sx={{ color: '#2563eb' }} />
                        Dashboard
                      </MenuItem>
                      {isGoogleAdmin && (
                        <MenuItem 
                          component={RouterLink} 
                          to="/admin"
                          onClick={() => {
                            handleMenuClose();
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          }}
                          sx={{ 
                            borderRadius: '10px', 
                            py: 1,
                            gap: 1.5,
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: '#0284c7',
                            '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.08)' }
                          }}
                        >
                          <SecurityIcon fontSize="small" sx={{ color: '#0284c7' }} />
                          لوحة الإدارة 👑
                        </MenuItem>
                      )}
                      <MenuItem 
                        onClick={handleSignOut}
                        sx={{ 
                          borderRadius: '10px', 
                          py: 1,
                          gap: 1.5,
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
                        }}
                      >
                        <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/signin"
                      onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      sx={{
                        color: '#334155',
                        px: { md: 2, lg: 2.2 },
                        py: 0.8,
                        borderRadius: '50px',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#2563eb',
                          bgcolor: 'rgba(37, 99, 235, 0.06)',
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                      }}
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        px: { md: 2.2, lg: 2.8 },
                        py: 0.8,
                        borderRadius: '50px',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 6px 18px rgba(16, 185, 129, 0.5)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Free Trial & Sign Up 🎁
                    </Button>
                  </>
                )}
              </Box>
            )}

            {/* Mobile Hamburger Button */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                aria-label="open drawer"
                sx={{
                  color: '#1e293b',
                  bgcolor: 'rgba(241, 245, 249, 0.8)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.08)',
                    color: '#2563eb',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>

        {/* Mobile Navigation Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: 300,
              bgcolor: '#ffffff',
              boxShadow: '-8px 0 28px rgba(15, 23, 42, 0.15)',
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </Box>
  );
};

export default Navbar;