import React from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const navigate = useNavigate();

  const services = [
    {
      title: 'Digital Marketing',
      description: 'Boost your online presence with our comprehensive digital marketing strategies. We help you reach your target audience through SEO, PPC, and content marketing.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['SEO Optimization', 'PPC Campaigns', 'Content Strategy', 'Social Media Marketing'],
    },
    {
      title: 'Social Media Management',
      description: 'Engage your audience and grow your brand on social media platforms. We create and manage content that resonates with your target market.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Content Creation', 'Community Management', 'Analytics & Reporting', 'Influencer Marketing'],
    },
    {
      title: 'Content Creation',
      description: 'Create compelling content that drives engagement and conversions. Our team of experts crafts content that tells your brand story effectively.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Blog Writing', 'Video Production', 'Graphic Design', 'Email Marketing'],
    },
    {
      title: 'Web Development',
      description: 'Build beautiful, responsive websites that convert visitors into customers. We create user-friendly experiences that drive results.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
      features: ['Responsive Design', 'E-commerce Solutions', 'Performance Optimization', 'Security Implementation'],
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
              Our Services
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              Comprehensive solutions to grow your business
            </Typography>
          </Container>
        </motion.div>
      </Box>

      {/* Services Grid */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: 3,
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={service.image}
                        alt={service.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h3">
                          {service.title}
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                          {service.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {service.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    mr: 1,
                                  }}
                                />
                                {feature}
                              </Typography>
                            </motion.div>
                          ))}
                        </Box>
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
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              Contact us today to discuss how we can help your business grow
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
                  Contact Us
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Services; 