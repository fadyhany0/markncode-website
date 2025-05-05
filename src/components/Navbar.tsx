import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const trigger = useScrollTrigger();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
  };

  const navItems = [
    { text: 'Home', path: '/home' },
    { text: 'Services', path: '/services' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
    { text: 'Our Services', path: '/our-services' },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 3,
        borderBottom: 1,
        borderColor: alpha(theme.palette.primary.main, 0.1),
        bgcolor: alpha(theme.palette.background.paper, 0.8),
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          MarknCode
          <Box component="span" sx={{ 
            ml: 1,
            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #EF6C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Agency
          </Box>
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem 
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                bgcolor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
              {location.pathname === item.path && (
                <Box
                  sx={{
                    width: 4,
                    height: '100%',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
                    position: 'absolute',
                    left: 0,
                    borderRadius: '0 4px 4px 0',
                  }}
                />
              )}
            </ListItem>
          </motion.div>
        ))}
        <Divider sx={{ 
          my: 2,
          borderColor: alpha(theme.palette.primary.main, 0.1),
        }} />
        {user ? (
          <>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <ListItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: location.pathname === '/dashboard' ? theme.palette.primary.main : theme.palette.text.primary,
                  bgcolor: location.pathname === '/dashboard' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemText 
                  primary="Dashboard"
                  primaryTypographyProps={{
                    fontWeight: location.pathname === '/dashboard' ? 600 : 400,
                  }}
                />
              </ListItem>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <ListItem
                button
                onClick={handleSignOut}
                sx={{
                  borderRadius: 2,
                  color: theme.palette.error.main,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                  },
                }}
              >
                <ListItemText primary="Sign Out" />
              </ListItem>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <ListItem
                component={RouterLink}
                to="/signin"
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemText primary="Sign In" />
              </ListItem>
            </motion.div>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              fullWidth
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 50%, #1565C0 100%)',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Sign Up
            </Button>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(20px)',
          borderBottom: 1,
          borderColor: alpha(theme.palette.primary.main, 0.1),
          height: { xs: '64px', md: '72px' },
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Toolbar 
            sx={{ 
              justifyContent: 'space-between', 
              height: '100%',
              minHeight: { xs: '64px', md: '72px' },
              px: { xs: 2, sm: 3, md: 4 },
              gap: { xs: 2, md: 3 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <Typography
                variant="h5"
                component={RouterLink}
                to="/home"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                MarknCode
                <Box 
                  component="span" 
                  sx={{ 
                    ml: { xs: 0.5, md: 1 },
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #EF6C00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Agency
                </Box>
              </Typography>
            </motion.div>

            {isMobile ? (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  color: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: { md: 1.5, lg: 2 }, 
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <AnimatePresence>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        component={RouterLink}
                        to={item.path}
                        sx={{
                          color: location.pathname === item.path 
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          px: { md: 2, lg: 2.5 },
                          py: 1,
                          height: '44px',
                          borderRadius: 2,
                          position: 'relative',
                          overflow: 'hidden',
                          fontSize: '0.95rem',
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          transition: 'all 0.3s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
                            transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover': {
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'translateY(-1px)',
                            '&::before': {
                              transform: 'scaleX(1)',
                            },
                          },
                        }}
                      >
                        {item.text}
                      </Button>
                    </motion.div>
                  ))}

                  <Box sx={{ height: '24px', width: '1px', bgcolor: alpha(theme.palette.primary.main, 0.1), mx: { md: 1, lg: 2 } }} />

                  {user ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <Button
                          component={RouterLink}
                          to="/dashboard"
                          sx={{
                            color: location.pathname === '/dashboard'
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                            px: { md: 2, lg: 2.5 },
                            py: 1,
                            height: '44px',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            fontWeight: location.pathname === '/dashboard' ? 600 : 400,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          Dashboard
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <Button
                          onClick={handleSignOut}
                          sx={{
                            color: theme.palette.error.main,
                            px: { md: 2, lg: 2.5 },
                            py: 1,
                            height: '44px',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.08),
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          Sign Out
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <Button
                          component={RouterLink}
                          to="/signin"
                          sx={{
                            color: theme.palette.text.primary,
                            px: { md: 2, lg: 2.5 },
                            py: 1,
                            height: '44px',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          Sign In
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <Button
                          component={RouterLink}
                          to="/signup"
                          variant="contained"
                          sx={{
                            px: { md: 3, lg: 4 },
                            height: '44px',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 50%, #1976D2 100%)',
                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 50%, #1565C0 100%)',
                              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          Sign Up
                        </Button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </Box>
            )}
          </Toolbar>
        </Container>

        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: 280,
              bgcolor: 'background.default',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>
    </Slide>
  );
};

export default Navbar; 