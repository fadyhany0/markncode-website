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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  useCodeProtection();
  const theme = useTheme();
  const navigate = useNavigate();

  const services = [
    {
      title: 'Digital Marketing',
      description: 'Boost your online presence with our comprehensive digital marketing strategies.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      title: 'Social Media',
      description: 'Engage your audience and grow your brand on social media platforms.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    },
    {
      title: 'Content Creation',
      description: 'Create compelling content that resonates with your target audience.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
          py: { xs: 4, sm: 6, md: 8 },
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
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    Transform Your Business
                  </Typography>
                  <Typography 
                    variant="h5" 
                    paragraph
                    sx={{ 
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                    }}
                  >
                    We help businesses grow through innovative marketing strategies and creative solutions.
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/our-services')}
                      sx={{
                        background: 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80"
                    alt="Digital Marketing Team"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      boxShadow: 3,
                      objectFit: 'cover',
                      height: { xs: 250, sm: 300, md: 400 },
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Our Services
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            }}
          >
            We offer a range of services to help your business succeed
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
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
                        image={service.image}
                        alt={service.title}
                        sx={{
                          objectFit: 'cover',
                          height: { xs: 200, sm: 220, md: 250 },
                        }}
                      />
                      <CardContent>
                        <Typography 
                          gutterBottom 
                          variant="h5" 
                          component="h3"
                          sx={{ 
                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                          }}
                        >
                          {service.description}
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
          py: { xs: 4, sm: 6, md: 8 },
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
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Ready to Grow Your Business?
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              paragraph
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              }}
            >
              Join us today and take your business to the next level
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/our-services')}
                  sx={{
                    background: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Get Started Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 