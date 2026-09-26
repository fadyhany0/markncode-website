import React from 'react';
import { useCodeProtection } from '../hooks/useCodeProtection';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  useCodeProtection();
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Fady hany',
      role: 'CEO & Founder',
      image: '/images/386653303_6458971110865081_8738973807561091878_n.jpg',
      description: 'Visionary leader with 4+ years of experience in digital marketing.',
    },
    {
      name: 'abd elrahman ashraf',
      role: 'Creative Director',
      image: '/images/Screenshot 2025-05-04 190255.png',
      description: 'Creative mind behind our most successful campaigns.',
    },
    {
      name: 'Ziad ibrahim',
      role: 'Content Manager',
      image: '/images/WhatsApp Image 2025-05-04 at 18.30.21_6f2b277b.jpg',
      description: 'Expert in content strategy and digital storytelling.',
    },
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries and explore new ideas to deliver cutting-edge solutions.',
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, ensuring the highest quality standards.',
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and work closely with our clients.',
    },
    {
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our business practices.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% -10%, #1e3a8a 0%, #0f172a 80%, #020617 100%)',
          color: 'white',
          py: { xs: 8, md: 11 },
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="About MarknCode Agency"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  px: 1.8,
                  py: 2.2,
                  fontSize: '0.92rem',
                }}
              />
              <Chip
                label="🎁 Free Strategy Audit for New Members"
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
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              Engineering Growth. Automating Care.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                maxWidth: 820,
                mx: 'auto',
                color: 'rgba(226, 232, 240, 0.9)',
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                lineHeight: 1.65,
                mb: 4.5,
              }}
            >
              We're a team of marketing strategists, full-stack engineers, and AI pioneers passionate about transforming clinics and enterprises into high-performing digital powerhouses.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  px: 4,
                  py: 1.6,
                  borderRadius: '50px',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                Sign Up & Join Our Community 🎁
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/services')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  px: 3.5,
                  py: 1.6,
                  borderRadius: '50px',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Our Services
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Company Story */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="body1" paragraph>
                Founded in 2010, we started as a small team with a big vision: to help businesses thrive in the digital age.
                Today, we've grown into a full-service digital agency, working with clients across various industries.
              </Typography>
              <Typography variant="body1" paragraph>
                Our journey has been marked by continuous learning, innovation, and a commitment to delivering exceptional
                results for our clients. We believe in building long-term relationships and creating sustainable growth
                strategies.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80"
                  alt="Our Office"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Our Values */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Our Values
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph>
              The principles that guide everything we do
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4} sx={{ mt: 4 }}>
              {values.map((value, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 2,
                          boxShadow: 3,
                          '&:hover': {
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h5" gutterBottom>
                            {value.title}
                          </Typography>
                          <Typography color="text.secondary">
                            {value.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Meet the people behind our success
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 3,
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                          src={member.image}
                          alt={member.name}
                          sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 2,
                          }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {member.name}
                        </Typography>
                        <Typography color="primary" gutterBottom>
                          {member.role}
                        </Typography>
                        <Typography color="text.secondary">
                          {member.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Unified CTA Section */}
      <Container maxWidth="md" sx={{ mt: 10, mb: 12 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
            color: 'white',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Join the Next Generation of High-Growth Brands
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 620, mx: 'auto', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}
          >
            Create your free account today to claim your complimentary growth audit, test MarknCode Doctor Bot for 7 days, and unlock 20% off all marketing packages.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.05rem',
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              Sign Up Free & Claim Audit 🎁
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: 'white',
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
              Contact Our Founders
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default About; 