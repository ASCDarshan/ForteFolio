import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebaseConfig';
import { ref, onValue, off, push, serverTimestamp, set, remove } from 'firebase/database';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Divider,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert,
  Snackbar,
  Grow,
  Fade,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Skeleton,
  CardHeader,
  useScrollTrigger,
  ButtonGroup,
  alpha,
  Backdrop,
  SvgIcon  // Add this import specifically for the ForteFolioLogo component
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as DuplicateIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
  NoteAdd as NoteAddIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ArrowBack as ArrowBackIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Bolt as BoltIcon,
  AutoAwesome as AutoAwesomeIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Celebration as CelebrationIcon,
  FormatColorFill as FormatColorFillIcon,
  Style as StyleIcon,
  AutoAwesomeMotion as AutoAwesomeMotionIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---

// Updated lavender color palette from the login page
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

// Initial state for a new resume
const initialResumeState = {
    personalInfo: {}, education: [], experience: [], skills: [], projects: []
};

// --- Helper Components (Assuming these are defined correctly elsewhere or above) ---

// Animated background component
const AnimatedBackground = () => {
    // ... (Keep the definition from your previous code)
    return (
        <Box
            sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                overflow: 'hidden', zIndex: -2, // Ensure behind FloatingElements
                background: `linear-gradient(135deg, ${lavenderPalette.light} 0%, ${alpha(lavenderPalette.soft, 0.7)} 100%)`,
            }}
        >
            {/* Animated Blobs */}
            <Box
                component={motion.div} animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, 30, 0] }}
                transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
                sx={{ position: 'absolute', top: '-15%', right: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: `radial-gradient(circle, ${lavenderPalette.medium}15 0%, ${lavenderPalette.medium}00 70%)`, filter: 'blur(60px)' }}
            />
            <Box
                component={motion.div} animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, -30, 0] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '35%', height: '35%', borderRadius: '50%', background: `radial-gradient(circle, ${lavenderPalette.deep}15 0%, ${lavenderPalette.deep}00 70%)`, filter: 'blur(60px)' }}
            />
            <Box
                component={motion.div} animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
                sx={{ position: 'absolute', top: '40%', left: '60%', width: '25%', height: '25%', borderRadius: '60% 40% 70% 30% / 60% 30% 70% 40%', background: `linear-gradient(45deg, ${lavenderPalette.soft}20, ${lavenderPalette.primary}15)`, filter: 'blur(40px)' }}
            />
        </Box>
    );
};

// Floating geometric shapes
const FloatingElements = () => {
    // ... (Keep the definition from your previous code)
    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
            {[...Array(12)].map((_, i) => {
                const size = Math.random() * 20 + 10;
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const duration = Math.random() * 15 + 10;
                const shapeType = Math.floor(Math.random() * 3);

                let shapeStyle = {
                    position: 'absolute', width: size, height: size,
                    background: `${lavenderPalette.soft}15`, border: `1px solid ${lavenderPalette.medium}20`,
                    left: left, top: top,
                };
                let animationProps = {
                    scale: [0.7, 1, 0.7],
                    x: [0, Math.random() * 50 - 25, 0],
                    y: [0, Math.random() * 50 - 25, 0],
                };

                if (shapeType === 0) { // Circle
                    shapeStyle.borderRadius = '50%';
                    animationProps.rotate = [0, Math.random() > 0.5 ? 180 : -180, 0];
                } else if (shapeType === 1) { // Square
                    shapeStyle.borderRadius = '4px';
                    animationProps.rotate = [0, Math.random() > 0.5 ? 90 : -90, 0];
                } else { // Triangle
                    shapeStyle = {
                        ...shapeStyle, width: 0, height: 0, background: 'transparent', border: 'none',
                        borderLeft: `${size/2}px solid transparent`, borderRight: `${size/2}px solid transparent`,
                        borderBottom: `${size}px solid ${lavenderPalette.soft}15`,
                    };
                     animationProps.rotate = [0, Math.random() > 0.5 ? 120 : -120, 0];
                }

                return (
                    <Box
                        key={`shape-${i}`} component={motion.div} sx={shapeStyle}
                        initial={{ scale: 0, rotate: 0 }} animate={animationProps}
                        transition={{ duration: duration, repeat: Infinity, ease: "easeInOut" }}
                    />
                );
            })}
        </Box>
    );
};

// ForteFolio logo
const ForteFolioLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 512 512" sx={{ width: props.width || 40, height: props.height || 40 }}>
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

// Animated stat card component
const StatCard = ({ icon, title, value, delay, color = lavenderPalette.primary }) => (
    <Grid item xs={12} sm={4}>
        <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} whileHover={{ y: -5, transition: { duration: 0.2 } }} >
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 4, position: 'relative', overflow: 'hidden', border: `1px solid ${lavenderPalette.soft}`, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', boxShadow: `0 10px 20px ${lavenderPalette.medium}15` }} >
                <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: delay + 0.3 }} sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`, zIndex: 0 }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box component={motion.div} animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} sx={{ display: 'inline-flex', backgroundColor: alpha(color, 0.1), borderRadius: '50%', p: 1.5, mb: 2, color: color }} > {icon} </Box>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: color, mb: 1 }} >
                        <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay + 0.5 }} > {value} </Box>
                    </Typography>
                    <Typography variant="body1" sx={{ color: lavenderPalette.text, fontWeight: 500 }} > {title} </Typography>
                </Box>
            </Paper>
        </Box>
    </Grid>
);

// Dashboard Empty State
const EmptyState = ({ onCreateNew }) => (
     <Box component={motion.div} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} sx={{ textAlign: 'center', py: 8, px: 3 }} >
        <Box component={motion.div} animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity }} sx={{ mb: 3, display: 'inline-block' }} >
            <DescriptionIcon sx={{ fontSize: 100, color: lavenderPalette.medium, opacity: 0.7 }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: lavenderPalette.darkText }} > Create Your First Resume </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', mb: 4, color: lavenderPalette.text }} > Start building your professional resume and unlock your career potential. </Typography>
        <Box component={motion.div} whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} whileTap={{ scale: 0.95 }} >
            <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={onCreateNew} sx={{ py: 1.5, px: 3, borderRadius: 8, background: lavenderPalette.gradient, textTransform: 'none', fontSize: '1.1rem', fontWeight: 600, boxShadow: `0 10px 20px ${lavenderPalette.medium}30`, position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: `linear-gradient(90deg, transparent, ${lavenderPalette.soft}40, transparent)`, transition: 'all 0.6s ease', }, '&:hover': { boxShadow: `0 15px 25px ${lavenderPalette.medium}40`, '&::before': { left: '100%', } } }} > Create Your First Resume </Button>
        </Box>
    </Box>
);

// Animated resume card (Grid View)
const ResumeCard = ({ resume, onEdit, onPreview, onContextMenu }) => {
    const lastModifiedDate = resume.lastModified ? new Date(resume.lastModified) : null;
    const lastModifiedText = lastModifiedDate ? formatDistanceToNow(lastModifiedDate, { addSuffix: true }) : 'Never modified';

    return (
        <Box component={motion.div} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ y: -8 }} transition={{ duration: 0.4 }} sx={{ height: '100%' }} >
            <Card elevation={0} onContextMenu={(e) => onContextMenu(e, resume.id)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', position: 'relative', border: `1px solid ${lavenderPalette.soft}`, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', boxShadow: `0 10px 30px ${alpha(lavenderPalette.primary, 0.1)}`, transition: 'all 0.3s ease' }} >
                {/* Header Section */}
                <Box sx={{ height: 140, background: lavenderPalette.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', position: 'relative', overflow: 'hidden' }} >
                    <Box component={motion.div} animate={{ y: [0, -5, 0], rotate: [0, -2, 2, 0] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }} >
                        <DescriptionIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                    </Box>
                    {/* Decorative elements */}
                     <Box component={motion.div} animate={{ rotate: [0, 360], x: [0, 10, 0], y: [0, -5, 0] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }} sx={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderRadius: 2, background: 'rgba(255, 255, 255, 0.2)', zIndex: 0 }} />
                     <Box component={motion.div} animate={{ rotate: [0, -360], x: [0, -10, 0], y: [0, 15, 0] }} transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }} sx={{ position: 'absolute', bottom: 20, left: 20, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', zIndex: 0 }} />

                    {/* Progress Bar */}
                    {resume.completionPercentage < 100 && (
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                            <LinearProgress variant="determinate" value={resume.completionPercentage} sx={{ height: 5, backgroundColor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { backgroundColor: 'white' } }} />
                        </Box>
                    )}
                    {/* Completion Chip */}
                    {resume.completionPercentage === 100 && (
                        <Box component={motion.div} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} sx={{ position: 'absolute', top: 12, right: 12 }} >
                            <Chip label="Complete" color="success" size="small" icon={<AutoAwesomeIcon fontSize="small" />} sx={{ fontWeight: 'bold', background: 'rgba(255,255,255,0.9)', color: lavenderPalette.deep, '& .MuiChip-icon': { color: lavenderPalette.deep } }} />
                        </Box>
                    )}
                </Box>
                {/* Content Section */}
                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Typography variant="h6" component="div" noWrap title={resume.title} sx={{ fontWeight: 600, color: lavenderPalette.darkText }} > {resume.title} </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: lavenderPalette.text }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="body2"> {lastModifiedText} </Typography>
                    </Box>
                    {/* Completion Info */}
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: lavenderPalette.text }} > Completion: {resume.completionPercentage}% </Typography>
                             <Typography variant="body2" component={motion.div} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }} sx={{ color: resume.completionPercentage === 100 ? 'success.main' : 'inherit' }} > {resume.completionPercentage === 100 ? '✓ Complete' : `${5 - Object.values(resume.sections || {}).filter(Boolean).length} sections left`} </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={resume.completionPercentage} sx={{ height: 8, borderRadius: 4, backgroundColor: alpha(lavenderPalette.soft, 0.3), '& .MuiLinearProgress-bar': { background: lavenderPalette.gradient, borderRadius: 4, } }} />
                    </Box>
                    {/* Section Chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 3 }}>
                       {resume.sections?.hasPersonalInfo && <Chip label="Personal Info" size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, borderRadius: 4, fontWeight: 500, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />}
                       {resume.sections?.hasEducation && <Chip label="Education" size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, borderRadius: 4, fontWeight: 500, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />}
                       {resume.sections?.hasExperience && <Chip label="Experience" size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, borderRadius: 4, fontWeight: 500, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />}
                       {resume.sections?.hasSkills && <Chip label="Skills" size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, borderRadius: 4, fontWeight: 500, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />}
                       {resume.sections?.hasProjects && <Chip label="Projects" size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, borderRadius: 4, fontWeight: 500, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />}
                    </Box>
                </CardContent>
                {/* Actions Section */}
                <Divider sx={{ backgroundColor: lavenderPalette.soft }} />
                <CardActions sx={{ justifyContent: 'space-between', p: 2, backgroundColor: alpha(lavenderPalette.light, 0.3) }} >
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => onPreview(resume.id)} sx={{ color: lavenderPalette.deep, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > Preview </Button>
                    <Box>
                        <Tooltip title="Edit Resume">
                            <IconButton size="small" onClick={() => onEdit(resume.id)} sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.2) }, mr: 1 }} > <EditIcon fontSize="small" /> </IconButton>
                        </Tooltip>
                        <Tooltip title="More Options">
                            <IconButton size="small" onClick={(e) => onContextMenu(e, resume.id)} sx={{ color: lavenderPalette.text, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <MoreVertIcon fontSize="small" /> </IconButton>
                        </Tooltip>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
};

// List view resume item
const ResumeListItem = ({ resume, onEdit, onPreview, onContextMenu }) => {
    const lastModifiedDate = resume.lastModified ? new Date(resume.lastModified) : null;
    const lastModifiedText = lastModifiedDate ? formatDistanceToNow(lastModifiedDate, { addSuffix: true }) : 'Never modified';

    return (
        <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} whileHover={{ x: 5 }} transition={{ duration: 0.3 }} >
            <Paper elevation={0} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', borderRadius: 3, overflow: 'hidden', position: 'relative', border: `1px solid ${lavenderPalette.soft}`, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', boxShadow: `0 8px 25px ${alpha(lavenderPalette.primary, 0.08)}`, '&::before': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: lavenderPalette.gradient, borderRadius: '3px 0 0 3px' } }} onContextMenu={(e) => onContextMenu(e, resume.id)} >
                <Avatar sx={{ background: lavenderPalette.gradient, width: 48, height: 48, ml: 1 }} > <DescriptionIcon /> </Avatar>
                <Box sx={{ ml: 2, flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="h6" component="div" noWrap title={resume.title} sx={{ fontWeight: 600, color: lavenderPalette.darkText }} > {resume.title} </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: lavenderPalette.text }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                            <Typography variant="body2"> {lastModifiedText} </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress variant="determinate" value={resume.completionPercentage} sx={{ width: 100, height: 6, borderRadius: 3, mr: 1, backgroundColor: alpha(lavenderPalette.soft, 0.3), '& .MuiLinearProgress-bar': { background: lavenderPalette.gradient, borderRadius: 3, } }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: lavenderPalette.text }} > {resume.completionPercentage}% </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: {xs: 0.5, sm: 1}, alignItems: 'center' }}> {/* Adjusted gap */}
                     <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => onPreview(resume.id)} sx={{ color: lavenderPalette.deep, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <VisibilityIcon /> </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                         <IconButton size="small" onClick={() => onEdit(resume.id)} sx={{ color: lavenderPalette.deep, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }}> <EditIcon /> </IconButton>
                    </Tooltip>
                     <Tooltip title="More Options">
                        <IconButton size="small" onClick={(e) => onContextMenu(e, resume.id)} sx={{ color: lavenderPalette.text, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <MoreVertIcon fontSize="small" /> </IconButton>
                    </Tooltip>
                </Box>
            </Paper>
        </Box>
    );
};


// Create New Dialog component
const CreateResumeDialog = ({ open, onClose, onSubmit, isCreating, initialName, handleNameChange, selectedTemplate, setSelectedTemplate, selectedColorScheme, setSelectedColorScheme }) => (
     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ elevation: 24, sx: { borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: `0 25px 50px -12px ${alpha(lavenderPalette.deep, 0.25)}` } }} TransitionComponent={Grow} TransitionProps={{ timeout: 600 }} >
        <Box sx={{ background: lavenderPalette.gradient, pt: 3, pb: 2, px: 3, position: 'relative', overflow: 'hidden' }} >
             <Box component={motion.div} animate={{ rotate: [0, 360], opacity: [0.5, 0.7, 0.5] }} transition={{ duration: 20, repeat: Infinity, repeatType: 'loop' }} sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <NoteAddIcon sx={{ color: 'white', mr: 1 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'white' }} > Create New Resume </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }} > Get started with your professional resume in just a few clicks </Typography>
            </Box>
        </Box>
        <DialogContent sx={{ p: 3 }}>
            {/* Resume Name */}
            <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ mb: 3 }} >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: lavenderPalette.darkText, display: 'flex', alignItems: 'center', '&::after': { content: '""', display: 'block', height: '2px', background: lavenderPalette.gradient, flexGrow: 1, ml: 2 } }} > Resume Name </Typography>
                <TextField autoFocus margin="dense" id="name" label="Give your resume a name" type="text" fullWidth variant="outlined" value={initialName} onChange={handleNameChange} InputProps={{ sx: { borderRadius: 2, '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(lavenderPalette.medium, 0.2)}` } } }} sx={{ mt: 2 }} />
            </Box>
            {/* Choose Template */}
             <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} sx={{ mb: 3 }} >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: lavenderPalette.darkText, display: 'flex', alignItems: 'center', '&::after': { content: '""', display: 'block', height: '2px', background: lavenderPalette.gradient, flexGrow: 1, ml: 2 } }} > Choose Template </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {[ { id: 'modern', name: 'Modern' }, { id: 'minimal', name: 'Minimal' }, { id: 'creative', name: 'Creative' }, { id: 'professional', name: 'Professional' } ].map((template) => (
                        <Grid item xs={6} sm={3} key={template.id}>
                            <Box component={motion.div} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} >
                                <Paper elevation={0} onClick={() => setSelectedTemplate(template.id)} sx={{ p: 1, border: selectedTemplate === template.id ? `2px solid ${lavenderPalette.deep}` : `1px solid ${lavenderPalette.soft}`, borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selectedTemplate === template.id ? alpha(lavenderPalette.medium, 0.1) : 'white', boxShadow: selectedTemplate === template.id ? `0 5px 15px ${alpha(lavenderPalette.deep, 0.2)}` : `0 2px 8px ${alpha(lavenderPalette.medium, 0.1)}`, }} >
                                    <Box sx={{ height: 80, bgcolor: selectedTemplate === template.id ? alpha(lavenderPalette.medium, 0.1) : alpha(lavenderPalette.light, 0.5), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }} >
                                        <StyleIcon sx={{ fontSize: 40, color: selectedTemplate === template.id ? lavenderPalette.deep : lavenderPalette.medium, opacity: 0.8 }} />
                                    </Box>
                                    <Typography align="center" variant="body2" sx={{ fontWeight: selectedTemplate === template.id ? 600 : 400, color: selectedTemplate === template.id ? lavenderPalette.darkText : lavenderPalette.text }} > {template.name} </Typography>
                                </Paper>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {/* Select Color Scheme */}
             <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: lavenderPalette.darkText, display: 'flex', alignItems: 'center', '&::after': { content: '""', display: 'block', height: '2px', background: lavenderPalette.gradient, flexGrow: 1, ml: 2 } }} > Select Color Scheme </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                    {[ { id: 'purple', name: 'Purple', color: '#7b68ee' }, { id: 'blue', name: 'Blue', color: '#1976d2' }, { id: 'teal', name: 'Teal', color: '#009688' }, { id: 'charcoal', name: 'Charcoal', color: '#455a64' } ].map((color) => (
                        <Box key={color.id} sx={{ textAlign: 'center' }}>
                            <Box component={motion.div} whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedColorScheme(color.id)} sx={{ width: 40, height: 40, bgcolor: color.color, borderRadius: '50%', cursor: 'pointer', mx: 'auto', border: selectedColorScheme === color.id ? '3px solid white' : '3px solid transparent', outline: selectedColorScheme === color.id ? `2px solid ${color.color}` : 'none', boxShadow: selectedColorScheme === color.id ? `0 5px 12px ${alpha(color.color, 0.4)}` : `0 2px 8px ${alpha(color.color, 0.2)}` }} />
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: selectedColorScheme === color.id ? 600 : 400, color: selectedColorScheme === color.id ? lavenderPalette.darkText : lavenderPalette.text }} > {color.name} </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose} disabled={isCreating} sx={{ color: lavenderPalette.text, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > Cancel </Button>
            <Box component={motion.div} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} >
                <Button onClick={onSubmit} variant="contained" disabled={isCreating || !initialName.trim()} startIcon={isCreating ? <CircularProgress size={20} color="inherit"/> : <AddIcon />} sx={{ px: 3, py: 1, ml: 1, borderRadius: 6, background: lavenderPalette.gradient, boxShadow: `0 5px 15px ${alpha(lavenderPalette.deep, 0.2)}`, textTransform: 'none', fontWeight: 600, '&:hover': { boxShadow: `0 8px 20px ${alpha(lavenderPalette.deep, 0.3)}`, } }} > {isCreating ? 'Creating...' : 'Create & Edit'} </Button>
            </Box>
        </DialogActions>
    </Dialog>
);

// --- Main Dashboard Page Component ---

function DashboardPage() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    // --- State ---
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('lastModified');
    const [sortDirection, setSortDirection] = useState('desc');
    const [anchorEl, setAnchorEl] = useState(null); // For sort menu
    const [contextMenu, setContextMenu] = useState({ mouseX: null, mouseY: null, resumeId: null });
    const [confirmation, setConfirmation] = useState({ open: false, resumeId: null, title: '' }); // For delete confirmation
    const [createDialog, setCreateDialog] = useState(false);
    const [newResumeName, setNewResumeName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [selectedColorScheme, setSelectedColorScheme] = useState('purple');
    const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
    const [isCreating, setIsCreating] = useState(false); // Loading state for create dialog
    const [stats, setStats] = useState({ total: 0, recent: 0, completed: 0 });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // --- Effects ---

    // Fetch Resumes List
    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        };

        setIsLoading(true);
        setError('');
        const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);

        const listener = onValue(resumesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedResumes = [];

            if (data) {
                Object.keys(data).forEach((key) => {
                    const resumeEntry = data[key];
                    const resumeData = resumeEntry.resumeData || initialResumeState;
                    const metadata = resumeEntry.metadata || {};

                    // Calculate completion
                    const sections = {
                         hasPersonalInfo: resumeData.personalInfo && Object.values(resumeData.personalInfo).some(v => v && v.trim() !== ''),
                         hasEducation: resumeData.education && resumeData.education.length > 0,
                         hasExperience: resumeData.experience && resumeData.experience.length > 0,
                         hasSkills: resumeData.skills && resumeData.skills.length > 0,
                         hasProjects: resumeData.projects && resumeData.projects.length > 0
                    }
                    const totalSections = 5;
                    const completedSections = Object.values(sections).filter(Boolean).length;
                    const completionPercentage = Math.round((completedSections / totalSections) * 100);

                    loadedResumes.push({
                        id: key,
                        title: metadata.title || 'Untitled Resume',
                        lastModified: metadata.lastModified || null,
                        createdAt: metadata.createdAt || null,
                        template: metadata.template || 'modern',
                        colorScheme: metadata.colorScheme || 'purple',
                        shared: metadata.shared || false,
                        completionPercentage,
                        sections // Store calculated section completion
                    });
                });
            }

            setResumes(loadedResumes);
           // setFilteredResumes(loadedResumes); // This will be handled by the filter/sort effect

            // Update stats
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            setStats({
                total: loadedResumes.length,
                recent: loadedResumes.filter(r => r.lastModified && new Date(r.lastModified) > oneWeekAgo).length,
                completed: loadedResumes.filter(r => r.completionPercentage === 100).length
            });

            setIsLoading(false);

        }, (err) => {
            console.error("Error fetching resumes:", err);
            setError("Could not load your resumes. Please try again later.");
            setIsLoading(false);
        });

        // Cleanup listener on unmount
        return () => off(resumesRef, 'value', listener);
    }, [currentUser]); // Dependency on currentUser

    // Filter and sort resumes when search or sort options change
    useEffect(() => {
        // No need to run if still loading or resumes haven't loaded yet
        if (isLoading || !resumes) return;

        let results = [...resumes];

        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            results = results.filter(resume =>
                resume.title.toLowerCase().includes(search)
            );
        }

        // Apply sorting
        results.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case 'title':
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    return sortDirection === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                case 'completion':
                    valueA = a.completionPercentage || 0;
                    valueB = b.completionPercentage || 0;
                    break;
                case 'createdAt':
                case 'lastModified': // Handles both date fields
                    valueA = a[sortBy] || 0;
                    valueB = b[sortBy] || 0;
                    break;
                default: // Default to lastModified if sortBy is unknown
                    valueA = a.lastModified || 0;
                    valueB = b.lastModified || 0;
            }

            // For numeric and date values
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        });

        setFilteredResumes(results);
    }, [resumes, searchTerm, sortBy, sortDirection, isLoading]); // Add isLoading dependency

    // --- Handlers ---

    const handleCreateDialogOpen = () => {
        const defaultName = `Resume - ${format(new Date(), 'MMMM d, yyyy')}`; // Corrected format
        setNewResumeName(defaultName);
        setSelectedTemplate('modern'); // Reset defaults
        setSelectedColorScheme('purple');
        setCreateDialog(true);
    };

    const handleCreateDialogClose = () => {
        setCreateDialog(false);
        // No need to reset name here, happens on open
    };

    const handleCreateNew = async () => {
        if (!currentUser || !newResumeName.trim()) return;

        setIsCreating(true);

        const resumeName = newResumeName.trim();
        const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);
        const newResumeRef = push(resumesRef);

        const newResumeData = {
            resumeData: initialResumeState,
            metadata: {
                title: resumeName,
                createdAt: serverTimestamp(),
                lastModified: serverTimestamp(),
                template: selectedTemplate,
                colorScheme: selectedColorScheme,
                shared: false // Default shared status
            }
        };

        try {
            await set(newResumeRef, newResumeData);
            setNotification({ open: true, message: 'Resume created successfully!', type: 'success' });
            handleCreateDialogClose();
            navigate(`/resume/${newResumeRef.key}`); // Navigate to the new resume editor
        } catch (err) {
            console.error("Error creating new resume:", err);
            setNotification({ open: true, message: 'Failed to create resume. Please try again.', type: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = (resumeId) => navigate(`/resume/${resumeId}`);
    const handlePreview = (resumeId) => navigate(`/preview/${resumeId}`);

    const handleDelete = async (resumeId) => {
        if (!currentUser || !resumeId) return;
        try {
            const resumeRef = ref(database, `users/${currentUser.uid}/resumes/${resumeId}`);
            await remove(resumeRef);
            setNotification({ open: true, message: 'Resume deleted successfully', type: 'success' });
        } catch (err) {
            console.error("Error deleting resume:", err);
            setNotification({ open: true, message: 'Failed to delete resume', type: 'error' });
        } finally {
            setConfirmation({ open: false, resumeId: null, title: '' }); // Close confirmation dialog
        }
    };

    const handleDuplicate = async (resumeId) => {
         if (!currentUser || !resumeId) return;
        try {
            const originalResumeRef = ref(database, `users/${currentUser.uid}/resumes/${resumeId}`);
            // Use get() for a single read instead of onValue if appropriate for your Firebase version
             const snapshot = await new Promise((resolve, reject) => {
                onValue(originalResumeRef, (snap) => resolve(snap), (err) => reject(err), { onlyOnce: true });
            });

            const originalData = snapshot.val();
            if (!originalData) throw new Error("Resume not found");

            const resumesRef = ref(database, `users/${currentUser.uid}/resumes`);
            const newResumeRef = push(resumesRef);

            const duplicateData = {
                ...originalData,
                metadata: {
                    ...(originalData.metadata || {}),
                    title: `${originalData.metadata?.title || 'Resume'} (Copy)`,
                    createdAt: serverTimestamp(),
                    lastModified: serverTimestamp()
                }
            };

            await set(newResumeRef, duplicateData);
            setNotification({ open: true, message: 'Resume duplicated successfully', type: 'success' });
        } catch (err) {
            console.error("Error duplicating resume:", err);
            setNotification({ open: true, message: 'Failed to duplicate resume', type: 'error' });
        }
    };

    const handleSortMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleSortMenuClose = () => setAnchorEl(null);

    const handleSort = (field) => {
        setSortBy(prevSortBy => {
            if (prevSortBy === field) {
                // Toggle direction if same field
                setSortDirection(prevDir => prevDir === 'asc' ? 'desc' : 'asc');
            } else {
                // Set new field with default direction (desc)
                setSortDirection('desc');
            }
            return field; // Set the new sort field
        });
        handleSortMenuClose();
    };

    const handleContextMenu = (event, resumeId) => {
        event.preventDefault();
        setContextMenu({ mouseX: event.clientX - 2, mouseY: event.clientY - 4, resumeId });
    };

    const handleContextMenuClose = () => setContextMenu({ mouseX: null, mouseY: null, resumeId: null });

    const handleConfirmationOpen = (resumeId, title) => {
        setConfirmation({ open: true, resumeId, title });
        handleContextMenuClose(); // Close context menu when opening dialog
    };

    const handleConfirmationClose = () => setConfirmation({ open: false, resumeId: null, title: '' });

    const handleRefresh = () => {
        // Re-trigger the useEffect fetch (indirectly by potentially changing a dep or just setting loading)
        setIsLoading(true);
        setError('');
        // Add a slight delay to show loading state, actual fetch is handled by useEffect listener
         setTimeout(() => { if (!error) setIsLoading(false); }, 500);
    };

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (err) {
            console.error("Logout error:", err);
            setNotification({ open: true, message: 'Logout failed. Please try again.', type: 'error' });
        }
    };

    // --- Render Helper Functions ---

    const renderSkeletonCards = (count = 6) => (
        Array(count).fill(0).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3, opacity: 1 - (index * 0.1) }} />
            </Grid>
        ))
    );

    // Render resume list based on view mode and state
    const renderResumeList = () => {
        if (isLoading) {
            return (
                <Grid container spacing={3}>
                    {renderSkeletonCards(viewMode === 'grid' ? 6 : 3)} {/* Show fewer skeletons for list */}
                </Grid>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ m: 2, borderRadius: 3, border: '1px solid', borderColor: 'error.light' }} action={ <Button color="inherit" size="small" onClick={handleRefresh} sx={{ fontWeight: 600 }} > Retry </Button> } > {error} </Alert>
            );
        }

        if (filteredResumes.length === 0) {
            if (resumes.length > 0) { // No results from filter, but resumes exist
                return (
                    <Box component={motion.div} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} sx={{ textAlign: 'center', py: 6, px: 3, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', borderRadius: 4, border: `1px solid ${lavenderPalette.soft}` }} >
                        <Box component={motion.div} animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} sx={{ mb: 3, display: 'inline-block' }} >
                            <SearchIcon sx={{ fontSize: 70, color: lavenderPalette.medium, opacity: 0.7 }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: lavenderPalette.darkText }} > No matching resumes found </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: lavenderPalette.text, maxWidth: 500, mx: 'auto' }} > Try different search terms or clear your search to see all of your resumes. </Typography>
                        <Box component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
                            <Button variant="outlined" onClick={() => setSearchTerm('')} startIcon={<CloseIcon />} sx={{ borderRadius: 8, px: 3, py: 1, textTransform: 'none', fontWeight: 600, color: lavenderPalette.deep, borderColor: lavenderPalette.medium, '&:hover': { borderColor: lavenderPalette.deep, backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > Clear search </Button>
                        </Box>
                    </Box>
                );
            } else { // No resumes exist at all
                return <EmptyState onCreateNew={handleCreateDialogOpen} />;
            }
        }

        // Render grid or list view
        return (
            <AnimatePresence mode="wait"> {/* Use mode="wait" for smoother transitions */}
                <motion.div
                    key={viewMode} // Key change triggers animation
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {viewMode === 'grid' ? (
                        <Grid container spacing={3}>
                            {filteredResumes.map((resume) => (
                                <Grid item xs={12} sm={6} md={4} key={resume.id}>
                                    <ResumeCard resume={resume} onEdit={handleEdit} onPreview={handlePreview} onContextMenu={handleContextMenu} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box> {/* Container for list items */}
                            {filteredResumes.map((resume) => (
                                <ResumeListItem key={resume.id} resume={resume} onEdit={handleEdit} onPreview={handlePreview} onContextMenu={handleContextMenu} />
                            ))}
                        </Box>
                    )}
                </motion.div>
            </AnimatePresence>
        );
    };

    // --- Render ---
    return (
        <>
            {/* Backgrounds */}
            <AnimatedBackground />
            <FloatingElements />

            {/* Header Box (Sticky) */}
            <Box component={motion.div} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.85)', boxShadow: `0 4px 20px ${alpha(lavenderPalette.medium, 0.15)}`, borderBottom: `1px solid ${lavenderPalette.soft}`, mb: 4, position: 'sticky', top: 0, zIndex: 1100 // Ensure header is above content but below modals/menus
                }} >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                        {/* Logo and Title */}
                        <Box component={motion.div} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} sx={{ display: 'flex', alignItems: 'center' }} >
                            <Box component={motion.div} whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }} sx={{ mr: 1.5, display: 'flex' /* Fix alignment */}} >
                                <ForteFolioLogo />
                            </Box>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, background: lavenderPalette.gradient, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} > ForteFolio </Typography>
                        </Box>
                        {/* User Info and Logout */}
                        <Box component={motion.div} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }} >
                           {currentUser && ( // Check if currentUser exists
                               <Box component={motion.div} whileHover={{ y: -2 }} transition={{ duration: 0.2 }} sx={{ display: { xs: 'none', md: 'flex'}, /* Hide on mobile */ alignItems: 'center', py: 0.5, px: 1.5, borderRadius: 6, backgroundColor: alpha(lavenderPalette.light, 0.5), border: `1px solid ${lavenderPalette.soft}` }} >
                                   <Typography variant="body2" sx={{ mr: 1, color: lavenderPalette.text, fontWeight: 500 }} noWrap > {currentUser.displayName || currentUser.email} </Typography>
                                   <Tooltip title={currentUser.email || ''}>
                                       <Avatar src={currentUser.photoURL || undefined} sx={{ width: 32, height: 32, border: `2px solid ${lavenderPalette.medium}` }} />
                                   </Tooltip>
                               </Box>
                           )}
                            <Tooltip title="Logout">
                                <Box component={motion.div} whileHover={{ rotate: [0, 15, 0], transition: { duration: 0.3 } }} >
                                    <IconButton color="error" onClick={handleLogout} size={isMobile ? "small" : "medium"} sx={{ backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid rgba(255,82,82,0.1)', '&:hover': { backgroundColor: 'rgba(255,82,82,0.05)' } }} > <LogoutIcon /> </IconButton>
                                </Box>
                            </Tooltip>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content Container */}
            <Container maxWidth="lg" sx={{ pb: 8, position: 'relative', zIndex: 1 }}>
                {/* Stats Cards */}
                <Box component={motion.div} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} sx={{ mb: 4 }} >
                    <Grid container spacing={3}>
                        <StatCard icon={<DescriptionIcon fontSize="large" />} title="Total Resumes" value={stats.total} delay={0.1} color={lavenderPalette.deep} />
                        <StatCard icon={<CalendarIcon fontSize="large" />} title="Updated Recently" value={stats.recent} delay={0.2} color="#7c4dff" /* Example color */ />
                        <StatCard icon={<AutoAwesomeIcon fontSize="large" />} title="Completed" value={stats.completed} delay={0.3} color="#00bfa5" /* Example color */ />
                    </Grid>
                </Box>

                {/* Actions Bar */}
                 <Box component={motion.div} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} sx={{ mb: 3 }} >
                    <Paper elevation={0} sx={{ p: {xs: 1.5, sm: 2.5}, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${lavenderPalette.soft}`, boxShadow: `0 8px 25px ${alpha(lavenderPalette.primary, 0.1)}`, }} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            {/* Section Title */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: lavenderPalette.darkText, display: 'flex', alignItems: 'center' }} >
                                    <Box component={motion.div} animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} sx={{ display: {xs: 'none', sm: 'inline-block'}, mr: 1 }} >
                                        <AutoAwesomeMotionIcon sx={{ color: lavenderPalette.deep, verticalAlign: 'middle', fontSize: 20 }} />
                                    </Box> Your Resumes
                                </Typography>
                                {!isLoading && (
                                    <Chip label={filteredResumes.length} size="small" sx={{ backgroundColor: alpha(lavenderPalette.medium, 0.1), color: lavenderPalette.deep, fontWeight: 600, borderRadius: 4, border: `1px solid ${alpha(lavenderPalette.medium, 0.3)}` }} />
                                )}
                            </Box>
                             {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: {xs: 0.5, sm: 1.5}, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {/* Search */}
                                <TextField id="search-resumes" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." variant="outlined" size="small" InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: lavenderPalette.primary }} /></InputAdornment>), endAdornment: searchTerm ? ( <InputAdornment position="end"> <IconButton aria-label="clear search" onClick={() => setSearchTerm('')} edge="end" size="small" > <CloseIcon fontSize="small" /> </IconButton> </InputAdornment> ) : null, sx: { borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.8)', '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(lavenderPalette.medium, 0.2)}` } } }} sx={{ width: { xs: '100%', sm: 'auto'}, order: {xs: 3, sm: 0} /* Move search down on mobile */ }} />
                                {/* Sort */}
                                <Button size="small" startIcon={<SortIcon />} variant="outlined" onClick={handleSortMenuOpen} sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 500, color: lavenderPalette.deep, borderColor: lavenderPalette.medium, backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { borderColor: lavenderPalette.deep, backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > Sort </Button>
                                {/* View Toggle */}
                                 <ButtonGroup variant="outlined" size="small" sx={{ borderRadius: 6, overflow: 'hidden', '& .MuiButton-root': { borderColor: lavenderPalette.medium, color: lavenderPalette.text, backgroundColor: 'rgba(255,255,255,0.8)', '&:hover': { borderColor: lavenderPalette.deep, backgroundColor: alpha(lavenderPalette.medium, 0.1) }, '&.Mui-selected, &.Mui-selected:hover': { background: lavenderPalette.gradient, color: 'white', borderColor: lavenderPalette.deep } } }} >
                                    <Tooltip title="Grid View">
                                        <Button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'Mui-selected' : ''} sx={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} > <GridViewIcon /> </Button>
                                    </Tooltip>
                                     <Tooltip title="List View">
                                        <Button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'Mui-selected' : ''} sx={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }} > <ListViewIcon /> </Button>
                                    </Tooltip>
                                </ButtonGroup>
                                {/* Create New */}
                                 <Box component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} sx={{ width: { xs: '100%', sm: 'auto' }, order: { xs: 0, sm: 4 } /* Move Create button top on mobile */}}>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateDialogOpen} size="small" sx={{ borderRadius: 6, background: lavenderPalette.gradient, boxShadow: `0 4px 12px ${alpha(lavenderPalette.deep, 0.2)}`, textTransform: 'none', fontWeight: 600, pl: 2, pr: 2.5, py: 1, width: '100%', '&:hover': { boxShadow: `0 6px 16px ${alpha(lavenderPalette.deep, 0.3)}`, } }} > Create New </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                {/* Resumes List/Grid */}
                <Box component={motion.div} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} >
                    {renderResumeList()}
                </Box>
            </Container>

            {/* --- Dialogs, Menus, Snackbar --- */}

            {/* Create Resume Dialog */}
            <CreateResumeDialog
                open={createDialog}
                onClose={handleCreateDialogClose}
                onSubmit={handleCreateNew}
                isCreating={isCreating}
                initialName={newResumeName}
                handleNameChange={(e) => setNewResumeName(e.target.value)}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                selectedColorScheme={selectedColorScheme}
                setSelectedColorScheme={setSelectedColorScheme}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmation.open} onClose={handleConfirmationClose} PaperProps={{ elevation: 24, sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } }} >
                <DialogTitle sx={{ background: '#ffebee', color: '#d32f2f', fontWeight: 600, pb: 1 }} > Confirm Deletion </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <DialogContentText> Are you sure you want to delete <span style={{ fontWeight: 600 }}>{confirmation.title}</span>? This cannot be undone. </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleConfirmationClose} sx={{ color: lavenderPalette.text, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > Cancel </Button>
                    <Box component={motion.div} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
                        <Button onClick={() => handleDelete(confirmation.resumeId)} color="error" variant="contained" startIcon={<DeleteIcon />} sx={{ borderRadius: 6 }} > Delete </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Context Menu */}
             <Menu open={contextMenu.mouseY !== null} onClose={handleContextMenuClose} anchorReference="anchorPosition" anchorPosition={ contextMenu.mouseY !== null && contextMenu.mouseX !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined } PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 180, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: `0 10px 30px ${alpha(lavenderPalette.medium, 0.2)}`, border: `1px solid ${lavenderPalette.soft}`, overflow: 'hidden' } }} >
                <MenuItem onClick={() => { handleEdit(contextMenu.resumeId); handleContextMenuClose(); }} sx={{ py: 1.5, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon><EditIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /></ListItemIcon> <ListItemText primary="Edit Resume" primaryTypographyProps={{ fontWeight: 500, color: lavenderPalette.darkText }} /> </MenuItem>
                <MenuItem onClick={() => { handlePreview(contextMenu.resumeId); handleContextMenuClose(); }} sx={{ py: 1.5, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /></ListItemIcon> <ListItemText primary="Preview" primaryTypographyProps={{ fontWeight: 500, color: lavenderPalette.darkText }} /> </MenuItem>
                <MenuItem onClick={() => { handleDuplicate(contextMenu.resumeId); handleContextMenuClose(); }} sx={{ py: 1.5, '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon><DuplicateIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /></ListItemIcon> <ListItemText primary="Duplicate" primaryTypographyProps={{ fontWeight: 500, color: lavenderPalette.darkText }} /> </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={() => { const resume = resumes.find(r => r.id === contextMenu.resumeId); if (resume) handleConfirmationOpen(contextMenu.resumeId, resume.title); else handleContextMenuClose(); }} sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255,82,82,0.1)' } }} > <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon> <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error.main', fontWeight: 500 }} /> </MenuItem>
            </Menu>

            {/* Sort Menu */}
             <Menu id="sort-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortMenuClose} PaperProps={{ elevation: 3, sx: { borderRadius: 2, minWidth: 180, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: `0 10px 30px ${alpha(lavenderPalette.medium, 0.2)}`, border: `1px solid ${lavenderPalette.soft}`, overflow: 'hidden' } }} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} >
                <MenuItem onClick={() => handleSort('lastModified')} sx={{ py: 1.5, backgroundColor: sortBy === 'lastModified' ? alpha(lavenderPalette.medium, 0.1) : 'transparent', '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon>{sortBy === 'lastModified' && (sortDirection === 'desc' ? <KeyboardArrowDownIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /> : <KeyboardArrowUpIcon fontSize="small" sx={{ color: lavenderPalette.deep }} />)}</ListItemIcon> <ListItemText primary="Last Modified" primaryTypographyProps={{ fontWeight: sortBy === 'lastModified' ? 600 : 400, color: sortBy === 'lastModified' ? lavenderPalette.darkText : lavenderPalette.text }} /> </MenuItem>
                <MenuItem onClick={() => handleSort('title')} sx={{ py: 1.5, backgroundColor: sortBy === 'title' ? alpha(lavenderPalette.medium, 0.1) : 'transparent', '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon>{sortBy === 'title' && (sortDirection === 'desc' ? <KeyboardArrowDownIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /> : <KeyboardArrowUpIcon fontSize="small" sx={{ color: lavenderPalette.deep }} />)}</ListItemIcon> <ListItemText primary="Name" primaryTypographyProps={{ fontWeight: sortBy === 'title' ? 600 : 400, color: sortBy === 'title' ? lavenderPalette.darkText : lavenderPalette.text }} /> </MenuItem>
                <MenuItem onClick={() => handleSort('completion')} sx={{ py: 1.5, backgroundColor: sortBy === 'completion' ? alpha(lavenderPalette.medium, 0.1) : 'transparent', '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon>{sortBy === 'completion' && (sortDirection === 'desc' ? <KeyboardArrowDownIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /> : <KeyboardArrowUpIcon fontSize="small" sx={{ color: lavenderPalette.deep }} />)}</ListItemIcon> <ListItemText primary="Completion" primaryTypographyProps={{ fontWeight: sortBy === 'completion' ? 600 : 400, color: sortBy === 'completion' ? lavenderPalette.darkText : lavenderPalette.text }} /> </MenuItem>
                <MenuItem onClick={() => handleSort('createdAt')} sx={{ py: 1.5, backgroundColor: sortBy === 'createdAt' ? alpha(lavenderPalette.medium, 0.1) : 'transparent', '&:hover': { backgroundColor: alpha(lavenderPalette.medium, 0.1) } }} > <ListItemIcon>{sortBy === 'createdAt' && (sortDirection === 'desc' ? <KeyboardArrowDownIcon fontSize="small" sx={{ color: lavenderPalette.deep }} /> : <KeyboardArrowUpIcon fontSize="small" sx={{ color: lavenderPalette.deep }} />)}</ListItemIcon> <ListItemText primary="Date Created" primaryTypographyProps={{ fontWeight: sortBy === 'createdAt' ? 600 : 400, color: sortBy === 'createdAt' ? lavenderPalette.darkText : lavenderPalette.text }} /> </MenuItem>
            </Menu>

            {/* Notification Snackbar */}
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleNotificationClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
                <Alert onClose={handleNotificationClose} severity={notification.type} variant="filled" sx={{ width: '100%', borderRadius: 3, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }} > {notification.message} </Alert>
            </Snackbar>
        </>
    );
}

export default DashboardPage;