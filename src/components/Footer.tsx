import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Marketing Agency
            </Typography>
            <Typography variant="body2" paragraph>
              Transforming businesses through innovative marketing solutions and
              digital experiences.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                color="inherit" 
                aria-label="Facebook"
                component="a"
                href="https://www.facebook.com/profile.php?id=61575849693891"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="X (Twitter)"
                component="a"
                href="https://x.com/MarknCodeAgency"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Instagram"
                component="a"
                href="https://www.instagram.com/markncodeagency/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="LinkedIn"
                component="a"
                href="https://www.linkedin.com/in/markncode-agency-markncode-agency-a07036364/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                { text: 'Home', href: '/' },
                { text: 'Services', href: '/services' },
                { text: 'About', href: '/about' },
                { text: 'Contact', href: '/contact' },
              ].map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    color="inherit"
                    underline="hover"
                    sx={{ display: 'block' }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                'Campaign Marketing',
                'Personal Branding',
                'Product Marketing',
                'Web Development',
              ].map((service) => (
                <Box component="li" key={service} sx={{ mb: 1 }}>
                  <Typography variant="body2">{service}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" paragraph>
              Al-Nozha, Almazah
              <br />
              Heliopolis, Cairo
              <br />
              Egypt
              <br />
              Phone: +201067283396
              <br />
              Email: markncodeagency@gmail.com
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Marketing Agency. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 