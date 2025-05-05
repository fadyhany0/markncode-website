import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCodeProtection } from '../hooks/useCodeProtection';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Code as CodeIcon,
  CameraAlt as CameraIcon,
  Analytics as AnalyticsIcon,
  DesignServices as DesignIcon,
  Campaign as CampaignIcon,
  Web as WebIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  LocalOffer as OfferIcon,
  Videocam as VideoIcon,
  Public as PublicIcon,
  Store as StoreIcon,
  Chat as ChatIcon,
  PhoneAndroid as MobileIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  DataObject as DataIcon,
  Api as ApiIcon,
  IntegrationInstructions as IntegrationIcon,
  SmartToy as AIIcon,
  Business as BusinessIcon,
  Devices as IoTIcon,
  ShoppingCart as EcommerceIcon,
  Style as BrandingIcon,
  Create as ContentIcon,
  Article as ArticleIcon,
  Movie as MovieIcon,
  Podcasts as PodcastIcon,
  Animation as AnimationIcon,
  Language as LanguageIcon,
  TrendingFlat as GrowthIcon,
  Psychology as PsychologyIcon,
  Groups as CommunityIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  SmartDisplay as SmartDisplayIcon,
  Pinterest as PinterestIcon,
  Reddit as RedditIcon,
  Telegram as TelegramIcon,
  WhatsApp as WhatsAppIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';

const OurServices: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  useCodeProtection();

  const handleGetStarted = (serviceName: string) => {
    const message = `Hi! I'm interested in your ${serviceName} service. Can you tell me more about it?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://m.me/61575849693891?text=${encodedMessage}`, '_blank');
  };

  const services = [
    {
      title: 'Digital Marketing',
      description: 'Comprehensive digital marketing solutions to maximize your online presence and ROI',
      icon: <CampaignIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Social Media Marketing',
        'Content Marketing',
        'SEO Optimization',
        'Email Marketing',
        'PPC Advertising',
        'Influencer Marketing',
        'Video Marketing',
        'Marketing Automation'
      ]
    },
    {
      title: 'Social Media Management',
      description: 'Professional social media management and growth strategies',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Content Strategy',
        'Community Management',
        'Social Media Advertising',
        'Influencer Partnerships',
        'Brand Monitoring',
        'Crisis Management',
        'Analytics & Reporting',
        'Platform Optimization'
      ]
    },
    {
      title: 'Search Engine Marketing',
      description: 'Comprehensive SEO and SEM solutions for better visibility',
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Keyword Research',
        'On-Page SEO',
        'Technical SEO',
        'Local SEO',
        'Google Ads Management',
        'Bing Ads Management',
        'Competitor Analysis',
        'Ranking Reports'
      ]
    },
    {
      title: 'Email Marketing',
      description: 'Strategic email marketing campaigns for better engagement',
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Email Campaign Design',
        'List Management',
        'Automation Workflows',
        'A/B Testing',
        'Analytics & Reporting',
        'Lead Nurturing',
        'Transactional Emails',
        'Compliance Management'
      ]
    },
    {
      title: 'Performance Marketing',
      description: 'Data-driven marketing strategies for maximum ROI',
      icon: <TrendingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Conversion Optimization',
        'Retargeting Campaigns',
        'Affiliate Marketing',
        'Performance Analytics',
        'ROI Tracking',
        'Campaign Optimization',
        'Multi-Channel Attribution',
        'Budget Management'
      ]
    },
    {
      title: 'Video Marketing',
      description: 'Professional video content creation and distribution',
      icon: <VideoIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Video Production',
        'YouTube Marketing',
        'Social Media Videos',
        'Explainer Videos',
        'Product Videos',
        'Live Streaming',
        'Video SEO',
        'Video Analytics'
      ]
    },
    {
      title: 'Local Marketing',
      description: 'Targeted marketing solutions for local businesses',
      icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Local SEO',
        'Google My Business',
        'Local Directory Listings',
        'Local Content Marketing',
        'Community Engagement',
        'Local Events Marketing',
        'Geotargeted Ads',
        'Local PR'
      ]
    },
    {
      title: 'Content Marketing',
      description: 'Strategic content creation and distribution',
      icon: <PublicIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Blog Content',
        'Whitepapers',
        'Case Studies',
        'Infographics',
        'E-books',
        'Content Strategy',
        'Content Distribution',
        'Content Analytics'
      ]
    },
    {
      title: 'Influencer Marketing',
      description: 'Strategic influencer partnerships and campaigns',
      icon: <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Influencer Identification',
        'Campaign Management',
        'Relationship Building',
        'Content Collaboration',
        'Performance Tracking',
        'Brand Alignment',
        'Crisis Management',
        'ROI Analysis'
      ]
    },
    {
      title: 'Promotional Marketing',
      description: 'Strategic promotional campaigns and offers',
      icon: <OfferIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Promotional Strategy',
        'Discount Campaigns',
        'Loyalty Programs',
        'Seasonal Promotions',
        'Flash Sales',
        'Referral Programs',
        'Promotion Analytics',
        'ROI Tracking'
      ]
    },
    {
      title: 'Systems Maker',
      description: 'Custom enterprise systems and solutions for any business need',
      icon: <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Custom ERP Systems',
        'CRM Solutions',
        'Inventory Management',
        'HR Management Systems',
        'Financial Systems',
        'Workflow Automation',
        'Integration Services',
        'Custom Business Logic'
      ]
    },
    {
      title: 'Web Development',
      description: 'Custom web development solutions for your business needs',
      icon: <WebIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Custom Website Development',
        'E-commerce Solutions',
        'Web Applications',
        'Mobile Responsive Design',
        'API Integration',
        'Maintenance & Support'
      ]
    },
    {
      title: 'Photography Services',
      description: 'Professional photography for all your business needs',
      icon: <CameraIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Product Photography',
        'Corporate Headshots',
        'Event Photography',
        'Brand Photography',
        'Commercial Photography',
        'Photo Editing'
      ]
    },
    {
      title: 'Programming Solutions',
      description: 'Custom software development and programming services',
      icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Custom Software Development',
        'Mobile App Development',
        'Database Solutions',
        'Cloud Services',
        'API Development',
        'System Integration'
      ]
    },
    {
      title: 'Analytics & Insights',
      description: 'Data-driven insights for better business decisions',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Business Analytics',
        'Market Research',
        'Competitor Analysis',
        'Performance Tracking',
        'Data Visualization',
        'ROI Analysis'
      ]
    },
    {
      title: 'Design Services',
      description: 'Creative design solutions for your brand',
      icon: <DesignIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Brand Identity',
        'Graphic Design',
        'UI/UX Design',
        'Print Design',
        'Packaging Design',
        'Motion Graphics'
      ]
    },
    {
      title: 'Mobile App Development',
      description: 'Custom mobile applications for iOS and Android platforms',
      icon: <MobileIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'iOS App Development',
        'Android App Development',
        'Cross-Platform Apps',
        'App UI/UX Design',
        'App Testing & QA',
        'App Store Optimization',
        'App Maintenance',
        'Push Notifications'
      ]
    },
    {
      title: 'Cloud Solutions',
      description: 'Cloud infrastructure and application development',
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'AWS Solutions',
        'Azure Development',
        'Google Cloud Services',
        'Cloud Migration',
        'Serverless Architecture',
        'Cloud Security',
        'Cloud Optimization',
        'DevOps Implementation'
      ]
    },
    {
      title: 'Cybersecurity Services',
      description: 'Comprehensive security solutions for your digital assets',
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Security Audits',
        'Penetration Testing',
        'Vulnerability Assessment',
        'Security Implementation',
        'Data Encryption',
        'Access Control',
        'Security Monitoring',
        'Incident Response'
      ]
    },
    {
      title: 'Database Solutions',
      description: 'Custom database design and management services',
      icon: <DataIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Database Design',
        'SQL Development',
        'NoSQL Solutions',
        'Data Migration',
        'Performance Optimization',
        'Data Security',
        'Backup Solutions',
        'Data Analytics'
      ]
    },
    {
      title: 'API Development',
      description: 'Custom API development and integration services',
      icon: <ApiIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'REST API Development',
        'GraphQL APIs',
        'API Documentation',
        'API Security',
        'Third-Party Integration',
        'API Testing',
        'Performance Optimization',
        'Version Management'
      ]
    },
    {
      title: 'System Integration',
      description: 'Seamless integration of various systems and platforms',
      icon: <IntegrationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Legacy System Integration',
        'Third-Party Integration',
        'Data Synchronization',
        'Workflow Automation',
        'System Migration',
        'API Integration',
        'Middleware Development',
        'Integration Testing'
      ]
    },
    {
      title: 'AI & Machine Learning',
      description: 'Artificial Intelligence and Machine Learning solutions',
      icon: <AIIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Machine Learning Models',
        'Natural Language Processing',
        'Computer Vision',
        'Predictive Analytics',
        'AI Integration',
        'Data Processing',
        'Model Training',
        'AI Deployment'
      ]
    },
    {
      title: 'Business Consulting',
      description: 'Strategic business consulting and advisory services',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Business Strategy',
        'Market Analysis',
        'Growth Planning',
        'Process Optimization',
        'Risk Management',
        'Financial Advisory',
        'Organizational Development',
        'Performance Improvement'
      ]
    },
    {
      title: 'IoT Solutions',
      description: 'Comprehensive Internet of Things solutions and implementation',
      icon: <IoTIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'IoT Device Development',
        'Sensor Integration',
        'Data Collection Systems',
        'IoT Security',
        'Cloud Connectivity',
        'Real-time Monitoring',
        'Predictive Maintenance',
        'Smart Solutions'
      ]
    },
    {
      title: 'E-commerce Marketing',
      description: 'Specialized marketing solutions for online stores',
      icon: <EcommerceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'E-commerce SEO',
        'Product Listing Optimization',
        'Marketplace Management',
        'Shopping Ads',
        'Conversion Optimization',
        'Customer Retention',
        'Abandoned Cart Recovery',
        'E-commerce Analytics'
      ]
    },
    {
      title: 'Branding & Identity',
      description: 'Comprehensive branding solutions to build and strengthen your brand identity',
      icon: <BrandingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Brand Strategy Development',
        'Brand Identity Design',
        'Logo Design',
        'Brand Guidelines',
        'Brand Messaging',
        'Brand Positioning',
        'Brand Voice & Tone',
        'Brand Architecture',
        'Brand Audit & Analysis',
        'Brand Experience Design',
        'Brand Collateral',
        'Brand Implementation'
      ]
    },
    {
      title: 'Content Creation',
      description: 'Professional content creation services for all your digital needs',
      icon: <ContentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Blog Writing',
        'Social Media Content',
        'Video Content Creation',
        'Graphic Design',
        'Infographic Design',
        'E-books & Whitepapers',
        'Email Marketing Content',
        'Website Content',
        'Product Descriptions',
        'Case Studies',
        'Press Releases',
        'Content Strategy'
      ]
    },
    {
      title: 'Video Production',
      description: 'Professional video production and editing services',
      icon: <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Commercial Videos',
        'Product Videos',
        'Explainer Videos',
        'Brand Videos',
        'Social Media Videos',
        'Live Streaming',
        'Video Editing',
        'Motion Graphics',
        'Video SEO',
        'Video Marketing',
        'YouTube Channel Management',
        'Video Analytics'
      ]
    },
    {
      title: 'Podcast Production',
      description: 'Professional podcast creation and management services',
      icon: <PodcastIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Podcast Recording',
        'Audio Editing',
        'Show Notes Writing',
        'Podcast Marketing',
        'Guest Management',
        'Distribution',
        'Transcription Services',
        'Podcast SEO',
        'Monetization Strategy',
        'Analytics & Reporting',
        'Brand Integration',
        'Content Repurposing'
      ]
    },
    {
      title: 'Animation Services',
      description: 'Professional animation and motion graphics services',
      icon: <AnimationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        '2D Animation',
        '3D Animation',
        'Motion Graphics',
        'Character Animation',
        'Explainer Videos',
        'Product Animations',
        'Brand Animations',
        'Social Media Animations',
        'Whiteboard Animation',
        'Interactive Animations',
        'Animation for Apps',
        'VR/AR Content'
      ]
    },
    {
      title: 'Technical Writing',
      description: 'Professional technical content creation services',
      icon: <ArticleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Technical Documentation',
        'User Manuals',
        'API Documentation',
        'Technical Blog Posts',
        'White Papers',
        'Case Studies',
        'Technical Guides',
        'Knowledge Base Articles',
        'Process Documentation',
        'Technical Reviews',
        'Research Papers',
        'Technical Editing'
      ]
    },
    {
      title: 'Growth Marketing',
      description: 'Data-driven growth strategies to scale your business',
      icon: <GrowthIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Growth Strategy',
        'User Acquisition',
        'Retention Optimization',
        'Conversion Rate Optimization',
        'A/B Testing',
        'Growth Hacking',
        'Market Expansion',
        'Revenue Growth',
        'Customer Lifecycle',
        'Growth Analytics',
        'Experimentation',
        'Scaling Strategies'
      ]
    },
    {
      title: 'International Marketing',
      description: 'Global marketing strategies for international expansion',
      icon: <LanguageIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Market Entry Strategy',
        'Localization Services',
        'International SEO',
        'Global Content Strategy',
        'Cross-Cultural Marketing',
        'International PPC',
        'Global Social Media',
        'International PR',
        'Market Research',
        'Compliance Management',
        'International Partnerships',
        'Global Branding'
      ]
    },
    {
      title: 'Behavioral Marketing',
      description: 'Psychology-based marketing strategies for better engagement',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Consumer Behavior Analysis',
        'Psychological Triggers',
        'Behavioral Segmentation',
        'Personalization Strategy',
        'Emotional Marketing',
        'Decision-Making Analysis',
        'User Experience Optimization',
        'Behavioral Data Analysis',
        'Conversion Psychology',
        'Customer Journey Mapping',
        'Psychological Pricing',
        'Behavioral Email Marketing'
      ]
    },
    {
      title: 'Community Marketing',
      description: 'Building and engaging brand communities',
      icon: <CommunityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Community Strategy',
        'Community Building',
        'Engagement Programs',
        'Brand Advocacy',
        'User-Generated Content',
        'Community Events',
        'Moderation Services',
        'Community Analytics',
        'Loyalty Programs',
        'Influencer Engagement',
        'Feedback Management',
        'Community Growth'
      ]
    },
    {
      title: 'Instagram Marketing',
      description: 'Strategic Instagram marketing for brand growth and engagement',
      icon: <InstagramIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Content Strategy',
        'Story Management',
        'Reels Production',
        'IGTV Content',
        'Hashtag Strategy',
        'Influencer Partnerships',
        'Shopping Integration',
        'Analytics & Insights',
        'Community Management',
        'Ad Campaigns',
        'Branded Content',
        'Instagram SEO'
      ]
    },
    {
      title: 'LinkedIn Marketing',
      description: 'Professional B2B marketing on LinkedIn',
      icon: <LinkedInIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Company Page Management',
        'Content Strategy',
        'Thought Leadership',
        'Lead Generation',
        'LinkedIn Ads',
        'Employee Advocacy',
        'Industry Networking',
        'Analytics & Reporting',
        'Recruitment Marketing',
        'Sponsored Content',
        'LinkedIn Groups',
        'B2B Marketing'
      ]
    },
    {
      title: 'TikTok Marketing',
      description: 'Viral content creation and marketing on TikTok',
      icon: <SmartDisplayIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Content Creation',
        'Trend Analysis',
        'Hashtag Challenges',
        'Influencer Collaborations',
        'TikTok Ads',
        'Viral Strategy',
        'Community Building',
        'Analytics & Insights',
        'Branded Effects',
        'Live Streaming',
        'Shopping Features',
        'TikTok SEO'
      ]
    },
    {
      title: 'YouTube Marketing',
      description: 'Comprehensive YouTube channel management and growth',
      icon: <YouTubeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Channel Strategy',
        'Video Production',
        'SEO Optimization',
        'Thumbnail Design',
        'Community Management',
        'YouTube Ads',
        'Monetization Strategy',
        'Analytics & Insights',
        'Playlist Management',
        'Live Streaming',
        'Brand Integration',
        'YouTube Shorts'
      ]
    },
    {
      title: 'Pinterest Marketing',
      description: 'Visual marketing and e-commerce promotion on Pinterest',
      icon: <PinterestIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Pin Strategy',
        'Board Management',
        'Rich Pins Setup',
        'Shopping Integration',
        'Pinterest Ads',
        'Visual SEO',
        'Analytics & Insights',
        'Trend Research',
        'Product Pins',
        'Idea Pins',
        'Community Engagement',
        'E-commerce Promotion'
      ]
    },
    {
      title: 'Messaging App Marketing',
      description: 'Marketing through messaging platforms like WhatsApp and Telegram',
      icon: <WhatsAppIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Chatbot Development',
        'Broadcast Messaging',
        'Customer Support',
        'Automated Responses',
        'Group Management',
        'Business Profile Setup',
        'Analytics & Reporting',
        'Campaign Management',
        'Lead Nurturing',
        'App Integration',
        'Multi-language Support',
        'Compliance Management'
      ]
    },
    {
      title: 'Google Ads Management',
      description: 'Comprehensive Google advertising solutions for maximum ROI',
      icon: <GoogleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Search Ads Management',
        'Display Network Ads',
        'Shopping Ads',
        'Video Ads (YouTube)',
        'App Promotion',
        'Smart Campaigns',
        'Remarketing',
        'Local Campaigns',
        'Performance Max',
        'Keyword Research',
        'Ad Copy Optimization',
        'Conversion Tracking',
        'A/B Testing',
        'Budget Management',
        'Competitor Analysis',
        'ROI Optimization'
      ]
    },
    {
      title: 'Performance Max',
      description: 'AI-powered cross-channel campaign optimization',
      icon: <TrendingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Campaign Setup',
        'Asset Creation',
        'Audience Signals',
        'Conversion Tracking',
        'Budget Optimization',
        'Cross-Channel Management',
        'Performance Analysis',
        'ROI Optimization',
        'Automated Bidding',
        'Creative Optimization',
        'Audience Expansion',
        'Reporting & Insights'
      ]
    },
    {
      title: 'Google Search Ads',
      description: 'Strategic search advertising for maximum visibility and conversions',
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Keyword Strategy',
        'Ad Copy Creation',
        'Quality Score Optimization',
        'Bid Management',
        'Negative Keywords',
        'Ad Extensions',
        'Landing Page Optimization',
        'Conversion Tracking',
        'A/B Testing',
        'Competitor Analysis',
        'Budget Optimization',
        'Performance Reporting'
      ]
    },
    {
      title: 'Google Shopping Ads',
      description: 'Product-focused advertising for e-commerce success',
      icon: <EcommerceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Product Feed Management',
        'Shopping Campaign Setup',
        'Product Data Optimization',
        'Price Optimization',
        'Inventory Management',
        'Smart Shopping Campaigns',
        'Product Segmentation',
        'Competitive Analysis',
        'ROI Tracking',
        'Seasonal Campaigns',
        'Promotion Management',
        'Performance Analytics'
      ]
    },
    {
      title: 'YouTube Advertising',
      description: 'Video advertising solutions for maximum engagement',
      icon: <VideoIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Video Ad Creation',
        'Campaign Strategy',
        'Targeting Optimization',
        'YouTube SEO',
        'Channel Management',
        'Video Analytics',
        'Remarketing',
        'Brand Lift Studies',
        'Influencer Integration',
        'Content Strategy',
        'Audience Building',
        'Performance Tracking'
      ]
    },
    {
      title: 'App Promotion',
      description: 'Mobile app advertising and user acquisition',
      icon: <MobileIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'App Install Campaigns',
        'App Engagement Ads',
        'Universal App Campaigns',
        'App Store Optimization',
        'User Acquisition',
        'Retention Campaigns',
        'In-App Event Tracking',
        'ROAS Optimization',
        'A/B Testing',
        'Audience Targeting',
        'Competitor Analysis',
        'Performance Analytics'
      ]
    },
    {
      title: 'Local Ads',
      description: 'Location-based advertising for local businesses',
      icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Local Campaign Setup',
        'Location Targeting',
        'Store Visit Tracking',
        'Local Inventory Ads',
        'Google My Business',
        'Local SEO Integration',
        'Radius Targeting',
        'Competitor Analysis',
        'Local Market Research',
        'Performance Tracking',
        'Budget Management',
        'ROI Optimization'
      ]
    },
    {
      title: 'Affiliate Marketing',
      description: 'Strategic affiliate marketing programs and management',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Program Setup',
        'Affiliate Recruitment',
        'Commission Management',
        'Performance Tracking',
        'Fraud Prevention',
        'Payment Processing',
        'Affiliate Communication',
        'Program Optimization',
        'Brand Protection',
        'Compliance Management',
        'Reporting & Analytics',
        'Growth Strategy'
      ]
    },
    {
      title: 'Retail Marketing',
      description: 'Comprehensive marketing solutions for retail businesses',
      icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'In-Store Marketing',
        'Promotional Campaigns',
        'Loyalty Programs',
        'Seasonal Marketing',
        'Point of Sale Marketing',
        'Visual Merchandising',
        'Retail Analytics',
        'Customer Experience',
        'Inventory Marketing',
        'Store Layout Optimization',
        'Staff Training',
        'Competitor Analysis'
      ]
    },
    {
      title: 'B2B Marketing',
      description: 'Strategic marketing solutions for business-to-business companies',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Lead Generation',
        'Account-Based Marketing',
        'Industry Research',
        'Thought Leadership',
        'Trade Show Marketing',
        'Whitepaper Marketing',
        'Case Study Development',
        'Webinar Marketing',
        'Email Nurturing',
        'Sales Enablement',
        'Partner Marketing',
        'ROI Tracking'
      ]
    },
    {
      title: 'Event Marketing',
      description: 'Comprehensive event marketing and promotion services',
      icon: <CampaignIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: [
        'Event Promotion',
        'Ticket Sales',
        'Social Media Marketing',
        'Email Campaigns',
        'Sponsorship Management',
        'Event Branding',
        'Attendee Engagement',
        'Post-Event Marketing',
        'Analytics & Reporting',
        'ROI Tracking',
        'Audience Building',
        'Partnership Development'
      ]
    }
  ];

  return (
    <Box sx={{ py: 8, background: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            color: '#202124',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
          }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {service.icon}
                      <Typography variant="h5" component="h2" sx={{ ml: 2 }}>
                        {service.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {service.features.map((feature, i) => (
                        <Chip
                          key={i}
                          label={feature}
                          size="small"
                          sx={{ m: 0.5 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                    onClick={() => handleGetStarted(service.title)}
                    startIcon={<FacebookIcon />}
                      sx={{
                        background: 'linear-gradient(45deg, #2563eb 30%, #1d4ed8 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1d4ed8 30%, #1e40af 90%)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
    </Container>
    </Box>
  );
};

export default OurServices; 