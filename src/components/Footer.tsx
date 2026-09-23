import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0a0f1d',
        color: '#94a3b8',
        pt: { xs: 8, md: 10 },
        pb: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Company Brand Column */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              MarknCode
              <Box
                component="span"
                sx={{
                  ml: 0.8,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Agency
              </Box>
            </Typography>

            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7, mb: 3, maxWidth: 320 }}>
              Pioneering digital marketing, performance advertising, custom software, and conversational AI solutions for
              growing businesses and modern medical practices.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                { icon: <FacebookIcon fontSize="small" />, href: 'https://www.facebook.com/profile.php?id=61575849693891' },
                { icon: <TwitterIcon fontSize="small" />, href: 'https://x.com/MarknCodeAgency' },
                { icon: <InstagramIcon fontSize="small" />, href: 'https://www.instagram.com/markncodeagency/' },
                { icon: <LinkedInIcon fontSize="small" />, href: 'https://www.linkedin.com/in/markncode-agency-markncode-agency-a07036364/' },
              ].map((s, idx) => (
                <IconButton
                  key={idx}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#2563eb',
                      color: 'white',
                      transform: 'translateY(-3px)',
                      borderColor: '#2563eb',
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2.5 }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                { text: 'Home', href: '/' },
                { text: 'Services', href: '/services' },
                { text: 'Bot for Doctor ↗', href: 'https://fusion-expenditures-quickly-psychological.trycloudflare.com/', target: '_blank', isHighlight: true },
                { text: 'About Agency', href: '/about' },
                { text: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1.5 }}>
                  <Link
                    href={link.href}
                    target={link.target || undefined}
                    rel={link.target ? 'noopener noreferrer' : undefined}
                    sx={{
                      color: link.isHighlight ? '#60a5fa' : '#94a3b8',
                      textDecoration: 'none',
                      fontSize: '0.92rem',
                      fontWeight: link.isHighlight ? 700 : 500,
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#ffffff',
                        textDecoration: 'none',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Solutions & AI */}
          <Grid item xs={6} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2.5 }}>
              Key Solutions
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {[
                'MarknCode Bot for Doctor',
                'Performance Ads (Meta & Google)',
                'Social Media Management',
                'Full-Stack Web Development',
                'Video & Commercial Production',
                'Workflow Automation & CRM',
              ].map((service) => (
                <Box component="li" key={service} sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                    {service}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2.5 }}>
              Get In Touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Al-Nozha, Heliopolis, Cairo, Egypt
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                <Link
                  href="tel:+201067283396"
                  sx={{ color: '#cbd5e1', textDecoration: 'none', '&:hover': { color: 'white' } }}
                >
                  +20 106 728 3396
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                <Link
                  href="mailto:markncodeagency@gmail.com"
                  sx={{ color: '#cbd5e1', textDecoration: 'none', '&:hover': { color: 'white' } }}
                >
                  markncodeagency@gmail.com
                </Link>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={<BotIcon sx={{ color: '#22c55e !important', fontSize: 16 }} />}
                  label="All AI Bots & Services Operational"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            © {new Date().getFullYear()} MarknCode Agency. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Designed for high performance, modern branding & healthcare automation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;