import React from 'react';
import { useCodeProtection } from '../hooks/useCodeProtection';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Chip,
  alpha,
  Paper,
  Stack,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  OpenInNew as LaunchIcon,
  MedicalServices as MedicalIcon,
  EventAvailable as ScheduleIcon,
  Chat as ChatIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  SupportAgent as SupportIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BOT_URL = 'https://ipaq-rat-craig-hair.trycloudflare.com/';

const Home: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const navigate = useNavigate();

  const services = [
    {
      title: 'MarknCode Bot for Doctor',
      category: 'Healthcare AI',
      isBot: true,
      description:
        'Revolutionary 24/7 AI medical assistant for clinics and doctors. Handles automated appointment booking, WhatsApp inquiries, and patient triage.',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['24/7 WhatsApp AI Chat', 'Automated Clinic Scheduling', 'Patient Triage & Intake'],
      accentColor: '#2563eb',
    },
    {
      title: 'Digital & Growth Marketing',
      category: 'Performance',
      description:
        'Data-driven performance campaigns, multi-channel PPC, and high-conversion funnels designed to scale your revenue exponentially.',
      image:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Targeted Paid Ads (Meta, Google)', 'Conversion Rate Optimization', 'ROI & Attribution Tracking'],
      accentColor: '#7c3aed',
    },
    {
      title: 'Social Media Management',
      category: 'Branding',
      description:
        'End-to-end content production, community building, and viral growth strategies tailored for modern social algorithms.',
      image:
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Content Calendar & Reels/TikToks', 'Community Engagement', 'Influencer Partnerships'],
      accentColor: '#ec4899',
    },
    {
      title: 'Full-Stack Web & App Development',
      category: 'Engineering',
      description:
        'High-performance, ultra-responsive web applications with sleek UI/UX, optimized SEO, and blazing fast cloud architectures.',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['React & Next.js Web Apps', 'Custom Portals & Dashboards', 'API & Database Integration'],
      accentColor: '#059669',
    },
    {
      title: 'Video & Media Production',
      category: 'Creative',
      description:
        'Cinematic promotional videos, explainer reels, and commercial graphics crafted to capture attention and tell your brand story.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['High-End Commercial Editing', '3D Motion Graphics', 'Scriptwriting & Storyboarding'],
      accentColor: '#f59e0b',
    },
    {
      title: 'Custom Business Automation',
      category: 'Systems',
      description:
        'Tailored CRM, ERP, and automated communication pipelines that eliminate manual repetitive tasks across your organization.',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['CRM & ERP Integrations', 'WhatsApp Automated Bots', 'Custom Business Logic'],
      accentColor: '#0891b2',
    },
  ];

  const stats = [
    { value: '150+', label: 'Successful Clients' },
    { value: '340%', label: 'Average ROI Growth' },
    { value: '24/7', label: 'AI Patient Automation' },
    { value: '99.4%', label: 'Client Satisfaction' },
  ];

  const pillars = [
    {
      icon: <SpeedIcon sx={{ fontSize: 36, color: '#2563eb' }} />,
      title: 'Ultra-Fast Execution',
      desc: 'Rapid deployment of marketing campaigns and AI systems designed for immediate market traction.',
    },
    {
      icon: <BotIcon sx={{ fontSize: 36, color: '#7c3aed' }} />,
      title: 'AI-First Innovation',
      desc: 'We combine traditional marketing mastery with state-of-the-art conversational AI & automation.',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 36, color: '#059669' }} />,
      title: 'Dedicated Partnership',
      desc: 'Hands-on strategy, continuous optimization, and 24/7 technical monitoring for your peace of mind.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 36, color: '#f59e0b' }} />,
      title: 'Proven ROI & Privacy',
      desc: 'Transparent reporting, rigorous data privacy standards, and measurable revenue attribution.',
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% -20%, #1e3a8a 0%, #0f172a 75%, #020617 100%)',
          color: 'white',
          pt: { xs: 8, sm: 10, md: 14 },
          pb: { xs: 10, sm: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Decorative Blurs */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Eyebrow Pill */}
                <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 3 }}>
                  <Chip
                    icon={<StarIcon sx={{ color: '#fbbf24 !important', fontSize: 18 }} />}
                    label="Next-Gen Digital Marketing & Healthcare AI Agency"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      py: 2.2,
                      px: 1.5,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  />
                </Box>

                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.4rem', md: '4.2rem' },
                    lineHeight: 1.12,
                    letterSpacing: '-0.03em',
                    mb: 2.5,
                  }}
                >
                  Scale Your Brand.{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Automate With AI.
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.25rem' },
                    lineHeight: 1.7,
                    color: 'rgba(226, 232, 240, 0.88)',
                    mb: 4,
                    maxWidth: 620,
                  }}
                >
                  MarknCode powers modern brands and clinics with high-converting digital marketing, custom software,
                  and 24/7 intelligent AI bots for doctors.
                </Typography>

                {/* CTAs */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                      startIcon={<BotIcon />}
                      endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        color: 'white',
                        px: 3.5,
                        py: 1.6,
                        borderRadius: '50px',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                          boxShadow: '0 15px 35px rgba(37, 99, 235, 0.6)',
                        },
                      }}
                    >
                      Try MarknCode Bot for Doctor
                    </Button>
                  </motion.div>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/services')}
                    endIcon={<ArrowIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      px: 3,
                      py: 1.6,
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Explore Services
                  </Button>
                </Stack>

                {/* Micro Trust Indicators */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                      Official WhatsApp Cloud API
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                      No Technical Setup Required
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Graphic / Interactive Showcase Card */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Box sx={{ position: 'relative' }}>
                  {/* Floating Pill 1 */}
                  <Paper
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: { xs: 0, sm: -20 },
                      zIndex: 3,
                      p: 1.5,
                      px: 2.2,
                      borderRadius: '30px',
                      bgcolor: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: '#22c55e',
                        boxShadow: '0 0 10px #22c55e',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                      🩺 Bot Active • 24/7
                    </Typography>
                  </Paper>

                  {/* Main Showcase Container */}
                  <Paper
                    elevation={8}
                    sx={{
                      borderRadius: 5,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <Box
                      component="img"
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                      alt="Agency & Medical AI Innovation"
                      sx={{
                        width: '100%',
                        height: { xs: 260, sm: 320, md: 360 },
                        objectFit: 'cover',
                        opacity: 0.9,
                      }}
                    />
                    <Box sx={{ p: 3, bgcolor: '#0f172a' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                          MarknCode AI Ecosystem
                        </Typography>
                        <Chip
                          label="LIVE DEMO"
                          size="small"
                          sx={{ bgcolor: '#2563eb', color: 'white', fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                        Seamlessly connecting clinical patients and high-value customers through intelligent automation.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                        endIcon={<LaunchIcon />}
                        sx={{
                          py: 1.2,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                          fontWeight: 700,
                        }}
                      >
                        Open Live Doctor Assistant
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Metrics & Statistics Strip */}
      <Container maxWidth="lg" sx={{ mt: { xs: -5, md: -7 }, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {stats.map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Box
                  sx={{
                    textAlign: 'center',
                    borderRight: { md: idx < stats.length - 1 ? '1px solid #e2e8f0' : 'none' },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 0.5,
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* MarknCode Bot for Doctor Spotlight Section */}
      <Box
        id="markncode-bot-for-doctor"
        sx={{
          py: { xs: 8, sm: 10, md: 12 },
          background: `radial-gradient(circle at 85% 20%, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 60%)`,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={4}
            sx={{
              borderRadius: { xs: 4, md: 6 },
              p: { xs: 3.5, sm: 5, md: 7 },
              background: `linear-gradient(145deg, #ffffff 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: '0 25px 50px rgba(37, 99, 235, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Left Details */}
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Chip
                    icon={<BotIcon sx={{ color: '#2563eb !important' }} />}
                    label="Featured AI Healthcare Innovation"
                    sx={{
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
                      px: 1,
                      py: 2,
                    }}
                  />
                  <Chip label="Ready to Deploy" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }} />
                </Box>

                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                    lineHeight: 1.15,
                    mb: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  MarknCode Bot for Doctor
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    mb: 3.5,
                  }}
                >
                  Empower your clinic or medical practice with our cutting-edge AI medical bot. Automate patient
                  appointment bookings, handle common medical inquiries on WhatsApp, triage patient symptoms, and notify
                  the doctor instantly — 24 hours a day, 7 days a week.
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    { icon: <ScheduleIcon sx={{ color: '#2563eb' }} />, text: 'Automated 24/7 Appointment Booking' },
                    { icon: <ChatIcon sx={{ color: '#7c3aed' }} />, text: 'WhatsApp & Web Medical Chatbot' },
                    { icon: <MedicalIcon sx={{ color: '#059669' }} />, text: 'Patient Intake & Symptom Triage' },
                    { icon: <CheckIcon sx={{ color: '#0891b2' }} />, text: 'Zero Wait Times & Instant Confirmation' },
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        {item.icon}
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                      endIcon={<LaunchIcon />}
                      sx={{
                        py: 1.5,
                        px: 3.8,
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
                      }}
                    >
                      Open MarknCode Bot for Doctor
                    </Button>
                  </motion.div>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/bot-for-doctor')}
                    endIcon={<ArrowIcon />}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: '50px',
                      fontWeight: 600,
                    }}
                  >
                    View Interactive Embed
                  </Button>
                </Stack>
              </Grid>

              {/* Right Live Simulation Mockup */}
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={6}
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    bgcolor: '#0f172a',
                    color: 'white',
                    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pb: 2,
                      mb: 2,
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            bgcolor: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MedicalIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: '#22c55e',
                            border: '2px solid #0f172a',
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white' }}>
                          MarknCode Doctor Bot
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#22c55e' }}>
                          Active Now • Automated Clinic AI
                        </Typography>
                      </Box>
                    </Box>
                    <Chip label="ONLINE" size="small" sx={{ bgcolor: '#16a34a', color: 'white', fontWeight: 700 }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Box
                      sx={{
                        maxWidth: '85%',
                        p: 1.8,
                        borderRadius: '16px 16px 4px 16px',
                        bgcolor: '#2563eb',
                        color: 'white',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      Hello Doctor! I would like to book a consultation for tomorrow.
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2.5 }}>
                    <Box
                      sx={{
                        maxWidth: '90%',
                        p: 2,
                        borderRadius: '16px 16px 16px 4px',
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#e2e8f0',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#38bdf8', mb: 0.5 }}>
                        🩺 Dr. Clinic AI Assistant
                      </Typography>
                      Welcome! We have two slots open tomorrow:
                      <Box sx={{ my: 1, pl: 1, borderLeft: '2px solid #38bdf8' }}>
                        • 3:30 PM (Consultation)<br />
                        • 5:00 PM (Follow-up)
                      </Box>
                      Would you like me to confirm the 3:30 PM slot?
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                    endIcon={<LaunchIcon />}
                    sx={{
                      py: 1.3,
                      borderRadius: 2,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      color: 'white',
                    }}
                  >
                    Open Live Doctor Bot ↗
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip
            label="What We Do"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              mb: 2,
            }}
          />
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              letterSpacing: '-0.02em',
              mb: 2,
            }}
          >
            Comprehensive Services
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', fontSize: '1.15rem' }}>
            From high-converting performance marketing to enterprise AI and custom software, we build solutions that win.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.25 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: service.isBot
                      ? `2px solid ${alpha(theme.palette.primary.main, 0.4)}`
                      : `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    boxShadow: service.isBot
                      ? '0 15px 35px rgba(37, 99, 235, 0.15)'
                      : '0 8px 25px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={service.image}
                    alt={service.title}
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        label={service.category}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: alpha(service.accentColor, 0.12),
                          color: service.accentColor,
                          borderRadius: '6px',
                        }}
                      />
                    </Box>

                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {service.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                      {service.description}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      {service.features.map((feature, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: service.accentColor,
                            }}
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}

                      {service.isBot ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                          endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            mt: 2.5,
                            borderRadius: '50px',
                            fontWeight: 700,
                            py: 1,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }}
                        >
                          Open Bot for Doctor
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate('/services')}
                          endIcon={<ArrowIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            mt: 2.5,
                            borderRadius: '50px',
                            fontWeight: 600,
                            py: 0.8,
                          }}
                        >
                          Learn More
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose MarknCode Agency (4 Pillars) */}
      <Box sx={{ py: { xs: 8, sm: 10, md: 12 }, bgcolor: '#ffffff', borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}` }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Why Leading Brands & Clinics Choose Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', fontSize: '1.15rem' }}>
              We merge creative storytelling with engineering precision to deliver tangible results.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {pillars.map((pillar, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    bgcolor: '#f8fafc',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 15px 30px rgba(15, 23, 42, 0.08)',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{pillar.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {pillar.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {pillar.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Modern High-Impact CTA Banner */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="md">
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #0f172a 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                lineHeight: 1.2,
                mb: 2.5,
              }}
            >
              Ready to Accelerate Your Growth?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 600,
                mx: 'auto',
                mb: 4.5,
                lineHeight: 1.7,
              }}
            >
              Partner with MarknCode Agency today and transform your business or medical practice with industry-leading
              marketing and AI automation.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  bgcolor: 'white',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Contact Our Team
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.open(BOT_URL, '_blank', 'noopener,noreferrer')}
                endIcon={<LaunchIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  px: 3.5,
                  py: 1.5,
                  borderRadius: '50px',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Launch Doctor Bot ↗
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;