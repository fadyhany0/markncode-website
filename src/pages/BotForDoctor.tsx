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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCodeProtection } from '../hooks/useCodeProtection';

const BOT_URL = 'https://ipaq-rat-craig-hair.trycloudflare.com/';

const BotForDoctor: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleOpenBot = () => {
    window.open(BOT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

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

  const steps = [
    {
      num: '01',
      title: 'Connect Clinic WhatsApp & Web',
      desc: 'We link your official clinic phone number and embed the web chat widget on your site with zero technical hassle.',
    },
    {
      num: '02',
      title: 'Customize Doctors & Schedules',
      desc: 'Define clinic working hours, consultation fees, doctor specialties, and booking rules tailored to your practice.',
    },
    {
      num: '03',
      title: 'Automate 24/7 Patient Care',
      desc: 'Sit back as the bot handles bookings, patient inquiries, and reminders while notifying your team in real time.',
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
      q: 'Can the bot integrate with our existing clinic WhatsApp number?',
      a: 'Yes! MarknCode Bot for Doctor is powered by the official WhatsApp Cloud API, allowing your clinic to keep its existing number and have automated verified responses.',
    },
    {
      q: 'Does the bot support Arabic and Egyptian dialect?',
      a: 'Absolutely. The bot is trained to communicate fluently in Modern Standard Arabic, Egyptian dialect, and English, understanding medical terms and colloquial patient inquiries.',
    },
    {
      q: 'Can doctors view patient details before the appointment?',
      a: 'Yes. All booked appointments, patient names, contact numbers, and reported symptoms are instantly dispatched to the doctor or reception dashboard and via instant notifications.',
    },
    {
      q: 'How long does it take to deploy for my clinic?',
      a: 'Initial deployment and clinic customization typically take less than 48 to 72 hours, with full training provided for your reception team.',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
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
                maxWidth: 820,
                mx: 'auto',
                color: 'rgba(226, 232, 240, 0.9)',
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.65,
                mb: 4.5,
              }}
            >
              The intelligent conversational AI assistant tailored for doctors, medical practices, and polyclinics.
              Automating appointments, answering patient inquiries, and providing 24/7 care on WhatsApp and Web.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
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
                  Open MarknCode Bot for Doctor ↗
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
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  boxShadow: '0 0 12px #22c55e',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Live Doctor Bot Interface
              </Typography>
              <Chip label="Active Now" size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefreshIframe}
                startIcon={<RefreshIcon />}
                sx={{ borderRadius: '20px', fontWeight: 600 }}
              >
                Reload
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleOpenBot}
                endIcon={<LaunchIcon />}
                sx={{
                  borderRadius: '20px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                }}
              >
                Open in Full Window ↗
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2.5, borderRadius: 3 }}>
            You can test the bot live inside this window, or{' '}
            <Box
              component="span"
              onClick={handleOpenBot}
              sx={{ fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', color: 'primary.dark' }}
            >
              click here to open in dedicated tab
            </Box>{' '}
            for full screen interaction.
          </Alert>

          {/* Embedded Iframe Container */}
          <Box
            sx={{
              width: '100%',
              height: { xs: '650px', sm: '750px', md: '820px' },
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              bgcolor: '#0f172a',
              position: 'relative',
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

      {/* 3 Steps: How It Works */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Chip label="Simple Onboarding" sx={{ fontWeight: 700, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1), mb: 2 }} />
          <Typography variant="h2" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            How It Works in 3 Simple Steps
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.15rem' }}>
            Transform your clinic reception from overwhelmed phone lines to automated, effortless precision.
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
            Engineered Specifically For Healthcare
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto' }}>
            Built around clinic workflows to reduce no-shows, answer common inquiries, and increase patient loyalty.
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
              Why modern clinics are shifting to AI-first patient communication.
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Feature</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'text.secondary' }}>Traditional Reception</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'primary.main' }}>MarknCode Doctor Bot</TableCell>
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

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Got questions about implementing MarknCode Bot for Doctor?
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
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto', color: 'rgba(255,255,255,0.85)' }}>
            We customize the bot with your clinic's services, pricing, doctor profiles, and WhatsApp number.
          </Typography>
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
            Launch MarknCode Bot for Doctor Now ↗
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default BotForDoctor;
