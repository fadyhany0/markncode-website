import React, { useState } from 'react';
import { useCodeProtection } from '../hooks/useCodeProtection';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Button,
  Chip,
  alpha,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/OpenInNew';
import BotIcon from '@mui/icons-material/SmartToy';
import ArrowIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/CheckCircle';

const BOT_URL = 'https://ipaq-rat-craig-hair.trycloudflare.com/';

const Services: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI & Automation', 'Marketing & Ads', 'Web & Technology'];

  const services = [
    {
      title: 'MarknCode Bot for Doctor',
      badge: 'AI Healthcare Solution',
      category: 'AI & Automation',
      isBot: true,
      botUrl: BOT_URL,
      description:
        'Specialized AI medical assistant designed for doctors and clinics. Automates patient appointment bookings, handles WhatsApp inquiries 24/7, collects payments via InstaPay & cards, and autonomously sells clinic packages.',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: [
        '24/7 WhatsApp & Web Chatbot',
        'Automated Appointments & InstaPay Payments',
        'Autonomous Medical Package & Offer Sales',
        'Abandoned Booking Lead Recovery Funnel',
        'Patient Triage & Instant Doctor Alerts',
      ],
      accentColor: '#2563eb',
    },
    {
      title: 'Digital & Growth Marketing',
      badge: 'Performance Marketing',
      category: 'Marketing & Ads',
      description:
        'Boost your brand reach and customer acquisition with full-funnel digital marketing strategies spanning Google, Meta, SEO, and programmatic PPC.',
      image:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['SEO & Search Engine Strategy', 'Targeted PPC Advertising', 'Retargeting Campaigns', 'Attribution Analytics'],
      accentColor: '#7c3aed',
    },
    {
      title: 'Social Media Management',
      badge: 'Viral & Community',
      category: 'Marketing & Ads',
      description:
        'Engage your audience and build loyalty on modern social platforms with consistent, algorithm-optimized content and influencer collaborations.',
      image:
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Content Production & Reels', 'Community Moderation', 'Influencer Marketing', 'Platform Growth Analytics'],
      accentColor: '#ec4899',
    },
    {
      title: 'Full-Stack Web & App Development',
      badge: 'Engineering',
      category: 'Web & Technology',
      description:
        'Build high-performance, mobile-responsive web applications that convert visitors into active customers, backed by modern UI/UX design.',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['React & Next.js Frameworks', 'Custom Dashboards & Portals', 'Speed Optimization', 'Enterprise Security'],
      accentColor: '#059669',
    },
    {
      title: 'Creative Content & Video Production',
      badge: 'Media Production',
      category: 'Marketing & Ads',
      description:
        'Tell your brand story with compelling commercial video production, motion graphics, and graphic design that captivates and converts.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Promotional Brand Videos', 'Explainer Reels & Shorts', 'Commercial Graphic Design', 'Copywriting & Scripting'],
      accentColor: '#f59e0b',
    },
    {
      title: 'Custom CRM & Workflow Automation',
      badge: 'Automation',
      category: 'AI & Automation',
      description:
        'Eliminate repetitive operational headaches with tailored enterprise integrations, automated WhatsApp notification flows, and CRM setups.',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Custom CRM & ERP Pipelines', 'WhatsApp Business Integrations', 'Task Automation', 'Business Logic Syncing'],
      accentColor: '#0891b2',
    },
  ];

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 12 }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% -10%, #1e3a8a 0%, #0f172a 80%, #020617 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Chip
              label="Our Capabilities"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                mb: 2,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.4rem', md: '4rem' },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Services Built for Real Growth
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(226, 232, 240, 0.88)',
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                lineHeight: 1.6,
                maxWidth: 650,
                mx: 'auto',
              }}
            >
              From artificial intelligence and automated healthcare bots to full-funnel marketing campaigns, we build what
              scales your business.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Filter Tabs */}
      <Container maxWidth="lg" sx={{ mt: -3, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={4}
          sx={{
            p: 1.5,
            borderRadius: '50px',
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            maxWidth: 680,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat}
                value={cat}
                label={cat}
                sx={{
                  borderRadius: '30px',
                  px: 2.5,
                  py: 1,
                  minHeight: 40,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  color: selectedCategory === cat ? 'white !important' : 'text.primary',
                  bgcolor: selectedCategory === cat ? 'primary.main' : 'transparent',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: selectedCategory === cat ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>
      </Container>

      {/* Services Grid */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <Grid item xs={12} md={6} key={service.title}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: service.isBot
                        ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}`
                        : `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                      boxShadow: service.isBot
                        ? '0 15px 35px rgba(37, 99, 235, 0.15)'
                        : '0 8px 25px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="230"
                      image={service.image}
                      alt={service.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3.5, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Chip
                          icon={service.isBot ? <BotIcon sx={{ fontSize: 16, color: '#2563eb !important' }} /> : undefined}
                          label={service.badge}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: alpha(service.accentColor, 0.12),
                            color: service.accentColor,
                            borderRadius: '6px',
                          }}
                        />
                        {service.isBot && (
                          <Chip label="ONLINE 24/7" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }} />
                        )}
                      </Box>

                      <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 1.5, fontSize: '1.65rem' }}>
                        {service.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                        {service.description}
                      </Typography>

                      <Box sx={{ mt: 'auto', mb: 3 }}>
                        {service.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                            <CheckIcon sx={{ fontSize: 18, color: service.accentColor }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      {service.isBot ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => window.open(service.botUrl, '_blank', 'noopener,noreferrer')}
                          endIcon={<LaunchIcon />}
                          sx={{
                            py: 1.3,
                            borderRadius: '50px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                          }}
                        >
                          Open MarknCode Bot for Doctor ↗
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate('/contact')}
                          endIcon={<ArrowIcon />}
                          sx={{
                            py: 1.2,
                            borderRadius: '50px',
                            fontWeight: 600,
                          }}
                        >
                          Request a Quote
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;