import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocationOn,
  Phone,
  Email,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  WhatsApp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCodeProtection } from '../hooks/useCodeProtection';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  useCodeProtection();
  const navigate = useNavigate();
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // EmailJS credentials
    const serviceID = 'service_n8m925l';
    const templateID = 'template_0g53eyr';
    const publicKey = '3SYIQKDc9ttv2HUfA';

    emailjs.sendForm(serviceID, templateID, form.current!, publicKey)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setSuccess('Your message has been sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      })
      .catch((error) => {
        console.error('Error sending email:', error.text);
        setError('Failed to send message. Please try again later.');
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Unified Dark Midnight Radial Hero */}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Direct Support & Consulting"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  px: 1.5,
                  py: 2,
                }}
              />
              <Chip
                label="🎁 Sign in to Unlock Free Growth Audit"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.18)',
                  color: '#6ee7b7',
                  fontWeight: 700,
                  border: '1px solid rgba(52, 211, 153, 0.45)',
                  cursor: 'pointer',
                  px: 1.5,
                  py: 2,
                  '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.28)' },
                }}
              />
            </Box>
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
              Get in Touch with Our Experts
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(226, 232, 240, 0.88)',
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                lineHeight: 1.6,
                maxWidth: 620,
                mx: 'auto',
                mb: 3,
              }}
            >
              Have a question about MarknCode Bot for Doctor or ready to launch a marketing campaign? We respond in under 2 hours.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: '#10b981',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: '50px',
                  px: 3.5,
                  py: 1.3,
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                Sign Up for Free Account 🎁
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Form and Info */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                  <Typography variant="h5" gutterBottom>
                    Contact Information
                  </Typography>
                  <motion.div
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocationOn color="primary" sx={{ mr: 2 }} />
                      <Typography>
                        Al-Nozha, Almazah
                        <br />
                        Heliopolis, Cairo
                        <br />
                        Egypt
                      </Typography>
                    </Box>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Phone color="primary" sx={{ mr: 2 }} />
                      <Typography>+201067283396</Typography>
                    </Box>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Email color="primary" sx={{ mr: 2 }} />
                      <Typography>markncodeagency@gmail.com</Typography>
                    </Box>
                  </motion.div>
                  <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <motion.div whileHover={{ y: -5 }}>
                      <IconButton 
                        color="primary"
                        component="a"
                        href="https://www.facebook.com/profile.php?id=61575849693891"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook />
                      </IconButton>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }}>
                      <IconButton 
                        color="primary"
                        component="a"
                        href="https://x.com/MarknCodeAgency"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter />
                      </IconButton>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }}>
                      <IconButton 
                        color="primary"
                        component="a"
                        href="https://www.linkedin.com/in/markncode-agency-markncode-agency-a07036364/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedIn />
                      </IconButton>
                    </motion.div>
                    <motion.div whileHover={{ y: -5 }}>
                      <IconButton 
                        color="primary"
                        component="a"
                        href="https://www.instagram.com/markncodeagency/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram />
                      </IconButton>
                    </motion.div>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Paper elevation={3} sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Send us a Message
                  </Typography>
                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <form ref={form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          multiline
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                        >
                          Send Message
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          color="success"
                          size="large"
                          fullWidth
                          startIcon={<WhatsApp />}
                          href="https://wa.me/201067283396?text=Hello%20MarknCode%20Agency,%20I%20would%20like%20to%20inquire%20about%20your%20services"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            borderColor: '#25D366',
                            color: '#128C7E',
                            '&:hover': {
                              borderColor: '#128C7E',
                              backgroundColor: 'rgba(37, 211, 102, 0.08)',
                            },
                          }}
                        >
                          Or Chat Directly on WhatsApp
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Map Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Find Us
            </Typography>
            <Box
              sx={{
                height: 400,
                mt: 4,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.46958118156!2d31.2359483!3d30.0444196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822f2426062d7%3A0xcc78c5ce1837a3c2!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1710864000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MarknCode Agency Location"
              />
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 