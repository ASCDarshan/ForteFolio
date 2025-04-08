import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  SvgIcon,
  alpha,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ShareIcon from '@mui/icons-material/Share'; // Keep if used later, currently unused in features
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; // Keep if used later
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarsIcon from '@mui/icons-material/Stars';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import { motion, AnimatePresence } from 'framer-motion';

// Updated softer lavender color palette
const lavenderPalette = {
  light: '#EAE4F7',  // Lighter background shade
  soft: '#D8CCF0',   // Soft lavender
  medium: '#B9A5E3', // Medium lavender
  primary: '#9D88D9', // Primary lavender
  deep: '#7F68C9',   // Deeper accent
  text: '#4A3B77',   // Text color
  darkText: '#2E2152', // Dark text color
  gradient: 'linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)',
  accentGradient: 'linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)'
};

// ForteFolio logo as SVG component with updated softer colors
const ForteFolioLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 512 512" sx={{ width: props.width || 80, height: props.height || 80 }}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={lavenderPalette.medium} />
        <stop offset="100%" stopColor={lavenderPalette.deep} />
      </linearGradient>
    </defs>
    <path
      d="M256 32c-123.5 0-224 100.5-224 224s100.5 224 224 224 224-100.5 224-224S379.5 32 256 32zm0 400c-97.2 0-176-78.8-176-176S158.8 80 256 80s176 78.8 176 176-78.8 176-176 176z"
      fill="url(#logoGradient)"
    />
    <path
      d="M352 176H256a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V200a24 24 0 0 0-24-24zm-20 164h-56V220h56v120z"
      fill="url(#logoGradient)"
    />
    <path
      d="M176 176h-40a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h40a24 24 0 0 0 24-24V200a24 24 0 0 0-24-24zm-20 164h-0V220h0v120z"
      fill="url(#logoGradient)"
    />
  </SvgIcon>
);

// Animated floating elements
const FloatingElements = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const numElements = isMobile ? 8 : 15; // Reduce elements on mobile

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(numElements)].map((_, i) => {
        const size = Math.random() * (isMobile ? 20 : 30) + (isMobile ? 8 : 10); // Smaller elements on mobile
        // Generate different shapes
        const shapes = [
          // Circle
          <Box
            key={`shape-circle-${i}`} // Unique key
            component={motion.div}
            sx={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              background: `${lavenderPalette.soft}20`,
              border: `1px solid ${lavenderPalette.medium}30`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 180 : -180, 0],
              x: [0, Math.random() * 40 - 20, 0], // Slightly reduced movement
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />,
          // Square
          <Box
            key={`shape-square-${i}`} // Unique key
            component={motion.div}
            sx={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '4px',
              background: `${lavenderPalette.soft}20`,
              border: `1px solid ${lavenderPalette.medium}30`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 90 : -90, 0],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />,
          // Triangle (using border trick)
          <Box
            key={`shape-triangle-${i}`} // Unique key
            component={motion.div}
            sx={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${lavenderPalette.soft}20`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0.7, 1, 0.7],
              rotate: [0, Math.random() > 0.5 ? 120 : -120, 0],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ];
        // Return random shape
        return shapes[Math.floor(Math.random() * shapes.length)];
      })}
    </Box>
  );
};

// Animated background gradients
const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1, // Ensure it's behind content
      }}
    >
      {/* Main background */}
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${lavenderPalette.light} 0%, ${lavenderPalette.soft} 100%)`,
      }} />

      {/* Animated gradient blob 1 */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: { xs: '50%', md: '40%' }, // Adjust size for mobile
          height: { xs: '50%', md: '40%' },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${lavenderPalette.medium}20 0%, ${lavenderPalette.medium}00 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Animated gradient blob 2 */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: { xs: '45%', md: '35%' }, // Adjust size for mobile
          height: { xs: '45%', md: '35%' },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${lavenderPalette.deep}20 0%, ${lavenderPalette.deep}00 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Additional gradient blob for interest */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        sx={{
          position: 'absolute',
          top: '40%',
          left: { xs: '50%', md: '60%' }, // Adjust position for mobile
          width: { xs: '30%', md: '25%' },
          height: { xs: '30%', md: '25%' },
          borderRadius: '60% 40% 70% 30% / 60% 30% 70% 40%',
          background: `linear-gradient(45deg, ${lavenderPalette.soft}30, ${lavenderPalette.primary}20)`,
          filter: 'blur(40px)',
        }}
      />
    </Box>
  );
};

// Animated feature card component with enhanced animations
const FeatureCard = ({ icon, title, description, delay, index }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 }
      }}
      sx={{ height: '100%' }} // Ensure Box takes full height for Card
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 10px 30px ${lavenderPalette.medium}20`,
          transition: 'all 0.3s ease',
          height: '100%', // Make Card fill the Box height
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${lavenderPalette.soft}50`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex', // Added for consistent content alignment if needed
          flexDirection: 'column', // Added for consistent content alignment
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: lavenderPalette.gradient,
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1 }}> {/* Responsive padding */}
          <Box
            component={motion.div}
            whileHover={{
              rotate: [0, -10, 10, -5, 0],
              transition: { duration: 0.5 }
            }}
            sx={{
              display: 'inline-flex',
              mb: 2
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${lavenderPalette.medium} 0%, ${lavenderPalette.deep} 100%)`,
                boxShadow: `0 4px 12px ${lavenderPalette.medium}40`,
              }}
            >
              {/* Ensure icon color contrasts well */}
              {React.cloneElement(icon, { sx: { color: 'white' } })}
            </Avatar>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: lavenderPalette.darkText,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                bottom: -2, // Adjusted position
                width: '40%',
                height: '2px',
                background: lavenderPalette.gradient,
              }
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: alpha(lavenderPalette.text, 0.85),
              lineHeight: 1.6
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

// Animated statistics component
const StatisticsBar = () => {
  const stats = [
    { number: '15K+', label: 'Users' },
    { number: '120+', label: 'Templates' },
    { number: '4.9/5', label: 'Rating' },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 3, sm: 4, md: 5 }, // Responsive gap
        py: 2,
        mt: 4, // Increased margin top for spacing
        flexWrap: 'wrap' // Ensures wrapping on small screens
      }}
    >
      {stats.map((stat, index) => (
        <Box
          key={stat.label}
          component={motion.div}
          initial={{ scale: 0.9, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.9 + (index * 0.2), duration: 0.5 }}
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h4" // Kept h4, could adjust with isSmall if needed
            component="div"
            sx={{
              fontWeight: 700,
              color: lavenderPalette.deep,
              position: 'relative',
              mb: 0.5
            }}
          >
            {stat.number}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
                delay: index * 0.5
              }}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                background: `radial-gradient(circle, ${lavenderPalette.medium}30 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: -1,
                filter: 'blur(8px)'
              }}
            />
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: lavenderPalette.text,
              fontWeight: 500
            }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Testimonial badge
const TestimonialBadge = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      sx={{
        mt: 4, // Adjusted margin
        mb: { xs: 4, md: 0 }, // Add bottom margin on mobile
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          py: 1.5,
          px: { xs: 2, sm: 3 }, // Responsive padding
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: `1px solid ${lavenderPalette.soft}`,
          boxShadow: `0 8px 16px ${lavenderPalette.medium}15`,
          textAlign: 'center' // Center text better on small screens
        }}
      >
        <VerifiedIcon
          sx={{
            color: lavenderPalette.deep,
            fontSize: 20,
            flexShrink: 0 // Prevent icon shrinking
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: lavenderPalette.text,
            fontWeight: 500
          }}
        >
          "ForteFolio helped me land my dream job!" - Sarah K.
        </Typography>
      </Paper>
    </Box>
  );
};

function LoginPage() {
  const { handleGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Keep for conditional logic if needed elsewhere
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const [showContent, setShowContent] = useState(false); // Can likely be removed if using motion initial/animate
  const [hoverButton, setHoverButton] = useState(false);

  // // Animation effect when component mounts - replaced by motion.div initial/animate
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowContent(true);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, []);

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const success = await handleGoogleLogin();
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Login cancelled or failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login Page Error:", err);
      setError('An unexpected error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <DescriptionIcon fontSize="medium" />,
      title: "Professional Templates",
      description: "Build standout resumes with beautiful templates designed by career experts for every industry"
    },
    {
      icon: <EditIcon fontSize="medium" />,
      title: "Smart Editor",
      description: "Our intelligent editor makes creating and updating your resume effortless with real-time feedback"
    },
    {
      icon: <PhoneAndroidIcon fontSize="medium" />,
      title: "Work Anywhere",
      description: "Access your portfolio from any device - build on desktop, edit on mobile, share from anywhere"
    },
    {
      icon: <BoltIcon fontSize="medium" />,
      title: "Instant Sharing",
      description: "Share your resume via email, custom link, or download as a perfectly formatted PDF in seconds"
    },
  ];

  return (
    // Outermost container for background and layout control
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      sx={{
        minHeight: '100vh', // Ensure it takes at least full height
        display: 'flex',    // Use flexbox for layout
        flexDirection: 'column', // Stack children vertically
        position: 'relative', // For absolute positioning of background/floating elements
        overflow: 'hidden',   // Hide overflow from animations
      }}
    >
      {/* Animated background - positioned absolutely */}
      <AnimatedBackground />

      {/* Floating elements - positioned absolutely */}
      <FloatingElements />

      {/* Main content container */}
      <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, sm: 3, md: 4 }, // Responsive vertical padding
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1, // Allow container to grow and fill space
            minHeight: '100vh', // Ensure content area respects min height
            zIndex: 1 // Keep content above background elements
          }}
        >
        {/* Header - Logo and Title */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} // Added slight delay
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 3, md: 4 }, // Responsive bottom margin
            mt: { xs: 2, md: 3 }, // Responsive top margin
          }}
        >
          <Box
            component={motion.div}
            animate={{
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.3 }
            }}
          >
            {/* Logo size adjusts based on screen size */}
            <ForteFolioLogo width={isSmall ? 50 : 70} height={isSmall ? 50 : 70} />
          </Box>
          <Typography
            variant={isSmall ? "h4" : "h3"} // Responsive variant
            component="h1"
            sx={{
              ml: 2,
              fontWeight: 800,
              background: lavenderPalette.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 4px 12px ${lavenderPalette.medium}30`,
              position: 'relative', // For the sparkle icon positioning
            }}
          >
            ForteFolio
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              sx={{
                position: 'absolute',
                top: -10,
                right: -15,
                color: lavenderPalette.deep
              }}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Box>
          </Typography>
        </Box>

        {/* Main Content Grid (Features + Login Card) */}
        {/* Added flexGrow: 1 here to push footer down */}
        <Grid container spacing={{ xs: 4, md: 5 }} sx={{ flexGrow: 1, alignItems: 'center', mb: { xs: 4, md: 6} }}>
          {/* Feature Section Column */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}> {/* Features below login on mobile */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Subtitle/Tagline */}
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component={motion.div}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <StarsIcon sx={{ color: lavenderPalette.deep }} />
                </Box>
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{
                    color: lavenderPalette.primary,
                    fontWeight: 600,
                    letterSpacing: 1
                  }}
                >
                  RESUME BUILDER
                </Typography>
              </Box>

              {/* Main Headline */}
              <Typography
                variant={isSmall ? "h4" : "h3"} // Responsive variant
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: lavenderPalette.darkText,
                  lineHeight: 1.2,
                }}
              >
                <Box component="span" sx={{ position: 'relative' }}>
                  Elevate
                  <Box
                    component={motion.div}
                    animate={{
                      width: ['0%', '100%', '100%', '0%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      height: '8px',
                      background: `linear-gradient(90deg, ${lavenderPalette.soft}00, ${lavenderPalette.medium}40, ${lavenderPalette.soft}00)`,
                      borderRadius: '4px',
                      zIndex: -1, // Behind text
                    }}
                  />
                </Box> your career with stunning resumes
              </Typography>

              {/* Sub-headline */}
              <Typography
                variant="h6"
                component="h3"
                // color="text.secondary" // Using custom palette color
                sx={{
                  mb: 4,
                  maxWidth: { xs: '100%', md: '90%' }, // Ensure full width on mobile
                  fontWeight: 400,
                  color: lavenderPalette.text
                }}
              >
                Create professional resumes that help you stand out and land your dream job.
              </Typography>

              {/* Features Grid */}
              <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}> {/* Responsive spacing */}
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={feature.title}> {/* Stacks on xs, 2-col on sm+ */}
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      delay={0.4 + (index * 0.15)} // Adjusted delay slightly
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>

              <StatisticsBar />
              <TestimonialBadge />
            </Box>
          </Grid>

          {/* Sign-in Card Column */}
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}> {/* Login card first on mobile */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }} // Added delay
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                 mb: { xs: 4, md: 0 } // Add margin bottom on mobile when it's ordered first
              }}
            >
              <Box
                component={motion.div}
                whileHover={{
                  boxShadow: `0 30px 100px ${lavenderPalette.primary}30`,
                  transition: { duration: 0.3 }
                }}
                sx={{
                  width: '100%',
                  maxWidth: '430px',
                  position: 'relative', // For decorative elements
                }}
              >
                {/* Decorative elements */}
                {/* ... (kept decorative elements as they were) ... */}
                 <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -15,
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: lavenderPalette.medium,
                    transform: 'rotate(15deg)',
                    zIndex: 0, // Behind Paper
                  }}
                />
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    left: -15,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: lavenderPalette.deep,
                    zIndex: 0, // Behind Paper
                  }}
                />

                {/* Login Paper */}
                <Paper
                  elevation={16}
                  sx={{
                    p: { xs: 3, sm: 4 }, // Responsive padding
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    borderRadius: 4,
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: `0 20px 80px ${lavenderPalette.primary}25`,
                    position: 'relative', // Needed for zIndex stacking
                    overflow: 'hidden',
                    border: `1px solid ${lavenderPalette.soft}70`,
                    zIndex: 1, // Above decorative elements
                  }}
                >
                  {/* Avatar/Logo */}
                  <Box
                    component={motion.div}
                    whileHover={{
                      y: -5,
                      boxShadow: `0 20px 30px ${lavenderPalette.primary}30`,
                      transition: { duration: 0.3 }
                    }}
                    sx={{
                      backgroundColor: lavenderPalette.medium,
                      borderRadius: '50%',
                      padding: 1.5,
                      mb: 3,
                      display: 'flex', // Center avatar content
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative', // For the dashed border animation
                      width: 112, // Container size (80 + 1.5*2*8 + 4*2) approx
                      height: 112,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'white',
                        position: 'relative', // To contain the dashed border
                        overflow: 'visible' // Allow border animation to show
                      }}
                    >
                       {/* Animated dashed border */}
                      <Box
                        component={motion.div}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        sx={{
                          position: 'absolute',
                          top: '-6px', // Adjust to center dash around avatar
                          left: '-6px',
                          width: 'calc(100% + 12px)', // Make larger than avatar
                          height: 'calc(100% + 12px)',
                          borderRadius: '50%',
                          border: `4px dashed ${lavenderPalette.soft}70`,
                          // borderSpacing: '10px' // CSS border-spacing doesn't work here
                        }}
                      />
                      <ForteFolioLogo width={50} height={50} />
                    </Avatar>
                  </Box>

                  {/* Welcome Text */}
                  <Typography
                    variant="h4" // Could use isSmall here if needed
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: lavenderPalette.darkText,
                      textAlign: 'center',
                      mb: 1,
                      position: 'relative' // For underline animation
                    }}
                  >
                    Welcome to ForteFolio
                     {/* Animated Underline */}
                    <Box
                      component={motion.div}
                      animate={{
                        width: ['0%', '100%', '0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: '-4px', // Position below text
                        left: '50%', // Start from center
                        transform: 'translateX(-50%)', // Center the line
                        height: '4px',
                        background: lavenderPalette.gradient,
                        borderRadius: '2px',
                      }}
                    />
                  </Typography>

                  {/* Subtitle Text */}
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 5,
                      textAlign: 'center',
                      maxWidth: '320px',
                      color: lavenderPalette.text
                    }}
                  >
                    Begin your journey to creating impressive, job-winning resumes
                  </Typography>

                  {/* Error Alert */}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        width: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'error.light',
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Google Sign-In Button */}
                  <Box
                    component={motion.div}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.97 }}
                    sx={{ width: '100%' }}
                    onHoverStart={() => setHoverButton(true)}
                    onHoverEnd={() => setHoverButton(false)}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                     // color="primary" // Using sx background instead
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Box component={motion.div} animate={hoverButton ? {
                            rotate: [0, -10, 10, -5, 0],
                          } : {}} transition={{ duration: 0.5 }}>
                            <GoogleIcon />
                          </Box>
                        )
                      }
                      onClick={onGoogleSignIn}
                      disabled={isLoading}
                      sx={{
                        py: 1.8, // Slightly reduced padding for better fit
                        borderRadius: '16px',
                        textTransform: 'none',
                        fontSize: { xs: '1rem', sm: '1.1rem' }, // Responsive font size
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        boxShadow: `0 10px 20px ${lavenderPalette.medium}30`,
                        background: lavenderPalette.gradient,
                        color: 'white', // Ensure text is white on gradient
                        position: 'relative', // For hover effect & particles
                        overflow: 'hidden', // Contain hover effect
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, ${alpha(lavenderPalette.light, 0.4)}, transparent)`, // Softer sheen
                          transition: 'all 0.6s ease',
                        },
                        '&:hover': {
                          boxShadow: `0 15px 25px ${lavenderPalette.medium}40`,
                          // Override default hover background if needed:
                          // background: lavenderPalette.gradient,
                          '&::before': {
                            left: '100%',
                          }
                        }
                      }}
                    >
                      {isLoading ? 'Signing In...' : 'Continue with Google'}

                      {/* Animated particles on button hover */}
                      <AnimatePresence>
                        {hoverButton && !isLoading && [...Array(5)].map((_, i) => (
                          <Box
                            key={`particle-${i}`} // Unique key
                            component={motion.div}
                            initial={{
                              opacity: 1,
                              scale: 0,
                              x: '50%', // Start near center
                              y: '50%',
                            }}
                            animate={{
                              opacity: 0,
                              scale: Math.random() * 0.5 + 0.5,
                              x: `${(Math.random() - 0.5) * 200}%`, // Use percentage for better scaling
                              y: `${(Math.random() - 0.5) * 200}%`
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: Math.random() * 0.5 + 0.4 }} // Faster particle decay
                            sx={{
                              position: 'absolute',
                              // Ensure particles originate from roughly the center
                              top: '50%',
                              left: '50%',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              pointerEvents: 'none', // Prevent interaction
                            }}
                          />
                        ))}
                      </AnimatePresence>
                    </Button>
                  </Box>

                  {/* Setup Time Hint */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    sx={{
                      mt: 3, // Reduced margin top slightly
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', // Center align items
                      gap: 0.5 // Reduced gap
                    }}
                  >
                    <AccessTimeIcon sx={{ color: lavenderPalette.primary, fontSize: 16 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: lavenderPalette.text,
                        fontStyle: 'italic'
                      }}
                    >
                      Setup takes less than 1 minute
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        {/* No flexGrow needed here, it sits after the flex-growing content grid */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          sx={{
            py: { xs: 2, md: 3 }, // Responsive padding
            textAlign: 'center',
            width: '100%', // Ensure full width
           // position: 'relative', // No longer needed to be relative for zIndex here
           // zIndex: 1, // Moved zIndex control to container/outer box
           mt: 'auto' // Push footer to bottom if content is short
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: lavenderPalette.text,
              opacity: 0.8
            }}
          >
            © {new Date().getFullYear()} ForteFolio | Privacy Policy | Terms of Service
          </Typography>
        </Box>
      </Container> {/* End Main Content Container */}
    </Box> // End Outermost Box
  );
}

export default LoginPage;