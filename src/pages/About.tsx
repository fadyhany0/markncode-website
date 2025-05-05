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
  useTheme,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
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
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" component="h1" align="center" gutterBottom>
              About Us
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              We're passionate about helping businesses grow and succeed
            </Typography>
          </Container>
        </motion.div>
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

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" component="h2" align="center" gutterBottom>
              Want to Work With Us?
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Let's create something amazing together
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    background: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Get in Touch
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 