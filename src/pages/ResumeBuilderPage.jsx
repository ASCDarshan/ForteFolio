import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming this path is correct
import { database } from '../firebaseConfig'; // Assuming this path is correct
import { ref, onValue, off, serverTimestamp, update } from 'firebase/database';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from '../theme'; // Replace '../theme' with the correct path to your theme file
import {
    // Layout & Structure
    CssBaseline, Container, Box, Paper, AppBar, Toolbar, Drawer, SwipeableDrawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    // Components
    Typography, Button, IconButton, Avatar, Zoom, Fab, BottomNavigation, BottomNavigationAction,
    Stepper, Step, StepLabel, /* StepIconProps removed from here */ Chip, Skeleton, Collapse, Grow, LinearProgress,
    // Feedback & Indicators
    CircularProgress, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, Snackbar, Badge, styled, alpha,
    // Utilities
    useMediaQuery, useScrollTrigger, Slide, useTheme
} from '@mui/material';
// Corrected Import for StepIconProps:
import {
    // Icons (Using mostly Outlined for consistency)
    Menu as MenuIcon,
    ArrowBack as ArrowBackIcon,
    SaveOutlined as SaveIcon, // Using Outlined variant
    EditOutlined as EditIcon, // Using Outlined variant
    ErrorOutline as ErrorIcon, // Using Outlined variant
    KeyboardArrowUp as KeyboardArrowUpIcon,
    DescriptionOutlined as DescriptionIcon,
    SchoolOutlined as SchoolIcon,
    WorkOutlineOutlined as WorkIcon, // Using Outlined variant
    PsychologyOutlined as PsychologyIcon,
    BuildOutlined as ConstructionIcon,
    VisibilityOutlined as VisibilityIcon,
    CheckCircleOutline as CheckCircleIcon, // Use Outline for consistency
    CloseOutlined as CloseIcon, // Using Outlined variant
    DashboardOutlined as DashboardIcon,
    ArrowForward as ArrowForwardIcon, // Added for Next button
    MoreVert as MoreVertIcon,
    // DownloadOutlined as DownloadIcon, // Not used in provided logic
    DarkModeOutlined as DarkModeIcon, // Using Outlined variant
    LightModeOutlined as LightModeIcon, // Using Outlined variant
    // FileDownloadOutlined, // Not used
    // ShareOutlined as ShareIcon // Not used
} from '@mui/icons-material';

// Import Child Form Components (Ensure these paths are correct)
import PersonalInfoForm from '../components/PersonalInfoForm';
import EducationForm from '../components/EducationForm';
import ExperienceForm from '../components/ExperienceForm';
import SkillsForm from '../components/SkillsForm';
import ProjectsForm from '../components/ProjectsForm';
import ResumePreview from '../components/ResumePreview';

// --- Theme Definition ---
const getCustomTheme = (prefersDarkMode) => {
    return createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            primary: {
                main: '#4361ee',
                light: '#738efc',
                dark: '#2d41a7',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#6c63ff',
                light: '#9d97ff',
                dark: '#4a44b3',
                contrastText: '#ffffff',
            },
            background: {
                default: prefersDarkMode ? '#121212' : '#f7f8fc',
                paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
            },
            success: {
                main: '#00b894', // A slightly different green
                light: '#55efc4',
                dark: '#00838f',
                contrastText: '#ffffff',
            },
            warning: {
                main: '#fdcb6e', // Kept original warning yellow
                light: '#ffeaa7',
                dark: '#e0b057',
                contrastText: 'rgba(0, 0, 0, 0.87)', // Ensure contrast on yellow
            },
            error: {
                main: '#e74c3c', // Kept original error red
                light: '#ff7675',
                dark: '#c0392b',
                contrastText: '#ffffff',
            },
            info: {
                main: '#0984e3', // Kept original info blue
                light: '#74b9ff',
                dark: '#0864b1',
                contrastText: '#ffffff',
            },
            divider: prefersDarkMode ? alpha('#ffffff', 0.12) : alpha('#000000', 0.08), // Softer divider
            text: prefersDarkMode ? {
                primary: '#e0e0e0',
                secondary: '#b0bec5',
                disabled: '#757575',
            } : {
                primary: '#212121',
                secondary: '#757575',
                disabled: '#bdbdbd',
            }
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontWeight: 700, fontSize: '2.5rem' },
            h2: { fontWeight: 700, fontSize: '2rem' },
            h3: { fontWeight: 600, fontSize: '1.75rem' },
            h4: { fontWeight: 600, fontSize: '1.5rem' },
            h5: { fontWeight: 600, fontSize: '1.25rem' },
            h6: { fontWeight: 600, fontSize: '1.1rem' }, // Slightly larger h6
            button: {
                fontWeight: 600,
                textTransform: 'none',
                letterSpacing: '0.5px', // Add subtle letter spacing
            },
        },
        shape: {
            borderRadius: 12, // Consistent rounding
        },
        shadows: Array(25).fill('none').map((_, index) =>
            index === 0 ? 'none' : `0px ${index * 2}px ${index * 4}px rgba(0,0,0,${Math.min(0.04 + index * 0.005, 0.1)})`
        ), // Custom softer shadows
        components: {
            MuiButton: {
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        borderRadius: 8,
                        padding: '8px 20px', // Slightly more padding
                        boxShadow: ownerState.variant === 'contained' ? '0px 4px 12px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.25s ease-in-out',
                        '&:hover': {
                            boxShadow: ownerState.variant === 'contained' ? '0px 6px 16px rgba(0,0,0,0.12)' : 'none',
                            transform: 'translateY(-1px)', // Subtle lift on hover
                        },
                    }),
                    containedPrimary: ({ theme }) => ({
                         '&:hover': {
                            backgroundColor: theme.palette.primary.dark, // Darken primary on hover
                         }
                    }),
                     containedWarning: ({ theme }) => ({
                         color: theme.palette.getContrastText(theme.palette.warning.main), // Ensure contrast
                     }),
                },
            },
            MuiPaper: {
                 defaultProps: {
                     elevation: 1, // Default elevation for consistency
                 },
                styleOverrides: {
                    root: ({ theme, elevation = 1 }) => ({
                        borderRadius: theme.shape.borderRadius,
                        backgroundImage: 'none', // Remove potential gradients
                        boxShadow: theme.shadows[elevation] || theme.shadows[1], // Use theme shadows
                    }),
                },
            },
            MuiFab: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        boxShadow: theme.shadows[6],
                         '&:hover': {
                             boxShadow: theme.shadows[10],
                             transform: 'scale(1.03)',
                        },
                         transition: 'all 0.25s ease-in-out',
                    }),
                },
            },
            MuiTextField: {
                 defaultProps: {
                     variant: 'outlined', // Ensure outlined is default
                     size: 'small',
                 },
                styleOverrides: {
                    root: {
                         '& .MuiOutlinedInput-root': {
                             borderRadius: 8, // Match button rounding
                            transition: 'all 0.2s ease-in-out',
                             '&:hover .MuiOutlinedInput-notchedOutline': {
                                 borderColor: alpha('#000000', 0.23) // Standard hover border color
                            },
                         },
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        borderRight: `1px solid ${theme.palette.divider}`, // Consistent divider
                        backgroundImage: 'none',
                        boxShadow: 'none', // Remove default drawer shadow if needed
                    }),
                },
            },
            MuiAppBar: {
                 defaultProps: {
                     elevation: 0, // Flat app bar
                 },
                styleOverrides: {
                    root: ({ theme }) => ({
                         backgroundColor: alpha(theme.palette.background.paper, 0.85),
                         backdropFilter: 'blur(8px)',
                         borderBottom: `1px solid ${theme.palette.divider}`,
                    }),
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        fontWeight: 600,
                        borderRadius: 8, // Match button rounding
                    },
                     filledWarning: ({ theme }) => ({
                         color: theme.palette.getContrastText(theme.palette.warning.main), // Ensure contrast
                     }),
                     outlinedWarning: ({ theme }) => ({
                         borderColor: alpha(theme.palette.warning.main, 0.7),
                     }),
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: 8,
                        margin: '4px 10px', // Adjust margin
                        padding: '8px 16px',
                        transition: 'background-color 0.2s ease-out',
                         '&.Mui-selected': {
                             backgroundColor: alpha(theme.palette.primary.main, 0.1),
                             color: theme.palette.primary.main,
                             fontWeight: 600,
                              '& .MuiListItemIcon-root': {
                                 color: theme.palette.primary.main,
                             },
                             '&:hover': {
                                 backgroundColor: alpha(theme.palette.primary.main, 0.15),
                             },
                         },
                         '&:hover': {
                             backgroundColor: alpha(theme.palette.action.hover, 0.04),
                         },
                    }),
                },
            },
             MuiBottomNavigation: {
                 styleOverrides: {
                     root: ({ theme }) => ({
                         borderTop: `1px solid ${theme.palette.divider}`,
                         backgroundColor: alpha(theme.palette.background.paper, 0.95),
                         backdropFilter: 'blur(5px)',
                         height: 65,
                     }),
                 }
             },
             MuiBottomNavigationAction: {
                 styleOverrides: {
                     root: ({ theme }) => ({
                         color: theme.palette.text.secondary,
                         transition: 'color 0.2s',
                          '&.Mui-selected': {
                             color: theme.palette.primary.main,
                         },
                     }),
                     label: {
                         transition: 'font-weight 0.2s',
                          '&.Mui-selected': {
                             fontWeight: 600,
                         },
                     }
                 }
             },
            MuiAlert: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius, // Use theme radius
                        boxShadow: theme.shadows[2],
                    }),
                    standardWarning: ({ theme }) => ({ // Style standard variant
                         backgroundColor: alpha(theme.palette.warning.light, 0.2),
                         color: theme.palette.warning.dark,
                    }),
                    filledWarning: ({ theme }) => ({ // Ensure contrast for filled variant
                         color: theme.palette.getContrastText(theme.palette.warning.main),
                    }),
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius * 1.5, // Slightly more rounded dialogs
                         boxShadow: theme.shadows[10],
                         padding: theme.spacing(1),
                    })
                }
            },
            MuiStepper: { // Basic styling for Stepper
                styleOverrides: {
                    root: ({ theme }) => ({
                        padding: theme.spacing(2, 0), // Add some padding
                    })
                }
            },
            MuiStepLabel: {
                styleOverrides: {
                    label: ({ theme, ownerState }) => ({
                        fontWeight: ownerState.active ? 600 : 400,
                        color: ownerState.active ? theme.palette.primary.main : theme.palette.text.secondary,
                        transition: 'all 0.3s ease',
                    }),
                    iconContainer: {
                        paddingRight: theme.spacing(1),
                    }
                }
            },
        },
    });
};


// Custom-styled components (Keep relevant ones)
const ProgressContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: 6,
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    overflow: 'hidden',
}));

const ProgressBar = styled(Box)(({ theme, value }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    borderRadius: theme.shape.borderRadius,
    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    transition: 'width 0.4s ease-out',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.main, // Needs contrast if text is used
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        width: 8,
        height: 8,
        minWidth: 8, // Ensure dot size
    },
}));

const AnimatedCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3, 3, 4, 3), // Adjust padding
    borderRadius: theme.shape.borderRadius * 1.5, // More rounded card
    // boxShadow: theme.shadows[3], // Use theme shadow
    // backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease-in-out',
    position: 'relative', // Needed for potential pseudo-elements or absolute children
    // '&:hover': {
    //     transform: 'translateY(-4px)',
    //     boxShadow: theme.shadows[6],
    // },
}));

// --- Helper Components ---

// ScrollTop (Unchanged from previous versions)
function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200, // Trigger a bit later
  });

  const handleClick = (event) => {
    // Find anchor or scroll window to top
    const anchor = document.querySelector('#back-to-top-anchor');
    if (anchor) {
      // Use window scroll for reliability across layouts
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        // Adjust position based on bottom nav/FABs
        sx={{ position: 'fixed', bottom: { xs: 80, md: 32 }, right: { xs: 16, md: 32 }, zIndex: (theme) => theme.zIndex.tooltip + 1 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

// HideOnScroll (Unchanged)
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// --- Constants and Initial State ---

const initialResumeState = {
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
    education: [],
    experience: [],
    skills: [],
    projects: []
};

const sections = [
    { id: 1, key: 'personalInfo', label: 'Personal Info', icon: <DescriptionIcon />, form: PersonalInfoForm },
    { id: 2, key: 'education', label: 'Education', icon: <SchoolIcon />, form: EducationForm },
    { id: 3, key: 'experience', label: 'Experience', icon: <WorkIcon />, form: ExperienceForm },
    { id: 4, key: 'skills', label: 'Skills', icon: <PsychologyIcon />, form: SkillsForm },
    { id: 5, key: 'projects', label: 'Projects', icon: <ConstructionIcon />, form: ProjectsForm },
];
const totalSteps = sections.length;
const previewStepId = totalSteps + 1; // Use a distinct ID for the preview step


// Helper function to check if a section is complete (Unchanged)
const isSectionComplete = (sectionKey, data) => {
    if (!data) return false;
    switch (sectionKey) {
        case 'personalInfo': return !!(data.fullName && data.email);
        case 'education': return data.length > 0 && data.every(item => item.institution && item.degree);
        case 'experience': return data.length > 0 && data.every(item => item.company && item.position);
        case 'skills': return data.length > 0; // Simple check if skills array is not empty
        case 'projects': return data.length > 0 && data.every(item => item.title);
        default: return false;
    }
};

// --- Main Component ---

function ResumeBuilderPage() {
    const { resumeId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // --- Theme and Mode ---
    const systemPrefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    // Add state persistence if desired (e.g., localStorage)
    const [darkMode, setDarkMode] = useState(systemPrefersDarkMode);
    const theme = useMemo(() => getCustomTheme(darkMode), [darkMode]);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm')); // For stepper adjustments

    useEffect(() => {
         // Sync state if system preference changes while component is mounted
         setDarkMode(systemPrefersDarkMode);
    }, [systemPrefersDarkMode]);


    // --- State ---
    const [currentStep, setCurrentStep] = useState(sections[0].id); // Start at first section ID
    const [resumeData, setResumeData] = useState(initialResumeState);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [resumeMetadata, setResumeMetadata] = useState({ title: 'Untitled Resume', lastModified: null, createdAt: null });
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(''); // Data loading error
    const [saveError, setSaveError] = useState(''); // Data saving error
    const [showTitleDialog, setShowTitleDialog] = useState(false);
    const [currentTitle, setCurrentTitle] = useState(''); // Temp title for dialog
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null); // Store intended destination

    // --- Derived State ---
    const completedSections = useMemo(() => {
        const completed = {};
        sections.forEach(sec => {
            completed[sec.key] = isSectionComplete(sec.key, resumeData[sec.key]);
        });
        return completed;
    }, [resumeData]);

    const completionProgress = useMemo(() => {
        return (Object.values(completedSections).filter(Boolean).length / totalSteps) * 100;
    }, [completedSections]);


    // --- Firebase Data Loading ---
    useEffect(() => {
        if (!currentUser || !resumeId) {
            navigate('/dashboard');
            return;
        }
        setIsLoading(true);
        setError('');
        const resumeRef = ref(database, `users/${currentUser.uid}/resumes/${resumeId}`);

        const listener = onValue(resumeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Deep merge with initial state to ensure all keys exist, prevents errors if DB data is partial
                 const loadedData = {
                     personalInfo: { ...initialResumeState.personalInfo, ...(data.resumeData?.personalInfo || {}) },
                     education: data.resumeData?.education || [],
                     experience: data.resumeData?.experience || [],
                     skills: data.resumeData?.skills || [],
                     projects: data.resumeData?.projects || [],
                 };
                setResumeData(loadedData);
                setResumeMetadata(data.metadata || { title: 'Untitled Resume', lastModified: null, createdAt: serverTimestamp() });
                setCurrentTitle(data.metadata?.title || 'Untitled Resume'); // Initialize temp title
                setUnsavedChanges(false); // Reset flag on load
            } else {
                setError(`Resume with ID ${resumeId} not found.`);
                // Optional: Navigate back immediately or show error prominently
                // navigate('/dashboard');
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching resume:", err);
            setError("Could not load resume data. Check connection or permissions.");
            setIsLoading(false);
        });

        return () => off(resumeRef, 'value', listener); // Cleanup listener on unmount
    }, [currentUser, resumeId, navigate]);

    // --- Save Function ---
    const saveResumeData = useCallback(async (showSuccessNotification = true) => {
        if (!currentUser || !resumeId || isSaving) return false; // Prevent multiple saves

        setIsSaving(true);
        setSaveError(''); // Clear previous save errors

        const resumeRef = ref(database, `users/${currentUser.uid}/resumes/${resumeId}`);
        const updates = {
            'resumeData': resumeData,
            'metadata/lastModified': serverTimestamp(),
            'metadata/title': resumeMetadata.title,
             // Add createdAt only if it's null in the state (first save)
             ...(resumeMetadata.createdAt === null && { 'metadata/createdAt': serverTimestamp() }),
        };

        try {
            await update(resumeRef, updates);
            console.log("Resume saved successfully:", resumeId);
            setUnsavedChanges(false); // Clear flag *after* successful save
            if (showSuccessNotification) {
                setNotification({ open: true, message: 'Resume saved successfully!', severity: 'success' });
            }
             // Update lastModified in state locally for immediate feedback if needed
             // setResumeMetadata(prev => ({...prev, lastModified: Date.now()}));
            return true; // Indicate success
        } catch (err) {
            console.error("Firebase save error:", err);
            setSaveError("Failed to save. Please check connection and try again.");
            setNotification({ open: true, message: 'Failed to save changes', severity: 'error' });
            return false; // Indicate failure
        } finally {
            setIsSaving(false);
        }
    }, [currentUser, resumeId, isSaving, resumeData, resumeMetadata.title, resumeMetadata.createdAt]); // Added createdAt


    // --- Warn on Unload (Browser Native Prompt) ---
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (unsavedChanges) {
                e.preventDefault();
                 // Standard message, browser might override it
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [unsavedChanges]);

     // --- Auto Save on Unmount (Component Leave) ---
     useEffect(() => {
         // Return a cleanup function that runs when the component unmounts
         return () => {
             if (unsavedChanges) {
                  // Consider if a prompt is better here, but auto-save might be smoother UX
                  // For simplicity, attempt a silent save on unmount if changes exist.
                  // Note: This might not always complete if the browser closes too quickly.
                 console.log("Attempting auto-save on unmount due to unsaved changes...");
                 saveResumeData(false); // Attempt save without notification
             }
         };
     }, [unsavedChanges, saveResumeData]); // Rerun if unsavedChanges status or save function changes


    // --- Form Data Update ---
    const updateResumeData = useCallback((sectionKey, data) => {
        // console.log(`Updating ${sectionKey} data`);
        setResumeData(prevData => ({
            ...prevData,
            [sectionKey]: data
        }));
        setUnsavedChanges(true); // Mark changes whenever form data is updated
    }, []);

    // --- Navigation Handlers ---
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleNavItemClick = (stepId) => {
        // Don't auto-save here, rely on navigateWithConfirmation or manual save
        if (stepId === previewStepId) {
            setIsPreviewMode(true);
            setCurrentStep(previewStepId);
        } else if (stepId > 0 && stepId <= totalSteps) {
            setIsPreviewMode(false);
            setCurrentStep(stepId);
        }
        setMobileOpen(false); // Close drawer after selection
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

     // Handle navigation triggered by BottomNav (mobile)
     const handleBottomNavChange = (event, newValue) => {
         // Prevent action if already on the selected step/preview
         if (newValue === currentStep || (newValue === previewStepId && isPreviewMode)) return;
         handleNavItemClick(newValue); // Use the same logic as drawer item click
     };

    // Unified Navigation Logic with Unsaved Changes Check
    const navigateWithConfirmation = (destination) => {
        if (unsavedChanges) {
            setPendingNavigation(destination); // Store where user wants to go
            setShowLeaveConfirmation(true); // Show the confirmation dialog
        } else {
            navigate(destination); // Navigate directly if no unsaved changes
        }
    };

    // Handle response from the Leave Confirmation Dialog
    const handleConfirmedNavigation = async (saveBeforeLeaving) => {
        setShowLeaveConfirmation(false); // Close dialog regardless of choice
        let canNavigate = true;

        if (saveBeforeLeaving && unsavedChanges) {
            canNavigate = await saveResumeData(true); // Attempt save, show notification
        }

        if (canNavigate && pendingNavigation) {
            navigate(pendingNavigation); // Navigate if allowed or discard was chosen
        }
        setPendingNavigation(null); // Clear pending destination
    };

     // Next/Prev Button Logic (Uses handleNavItemClick for consistency)
     const nextStep = () => {
         const nextId = isPreviewMode ? previewStepId : (currentStep < totalSteps ? currentStep + 1 : previewStepId);
         handleNavItemClick(nextId);
     };

     const prevStep = () => {
         const prevId = isPreviewMode ? totalSteps : (currentStep > 1 ? currentStep - 1 : 1);
         handleNavItemClick(prevId);
     };


    // --- Dialog Handlers ---
    const handleOpenTitleDialog = () => {
        setCurrentTitle(resumeMetadata.title); // Pre-fill dialog input
        setShowTitleDialog(true);
    };
    const handleCloseTitleDialog = () => setShowTitleDialog(false);

    const handleSaveTitle = () => {
        const newTitle = currentTitle.trim();
        if (!newTitle || newTitle === resumeMetadata.title) {
             handleCloseTitleDialog(); // Close if no change or empty
             return;
        }
        // Update metadata state optimistically
        setResumeMetadata(prev => ({ ...prev, title: newTitle }));
        setUnsavedChanges(true); // Mark changes (will be saved later)
        handleCloseTitleDialog();
        setNotification({
            open: true,
            message: 'Title updated. Save changes to finalize.',
            severity: 'info'
        });
    };

    // --- Notification Handler ---
    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification(prev => ({ ...prev, open: false }));
    };

    // --- Manual Save Handler ---
    const handleManualSave = () => {
        saveResumeData(true); // Manually trigger save with success notification
    };

    // --- Theme Toggle ---
    const toggleDarkMode = () => setDarkMode(!darkMode);

    // --- Loading State ---
    if (isLoading) {
        return (
            <ThemeProvider theme={theme}> {/* Use theme even for loading */}
                <CssBaseline />
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    height: '100vh', bgcolor: 'background.default',
                    // Optional subtle gradient background
                    // backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 90%)`
                }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center', maxWidth: 300 }}>
                        <CircularProgress size={40} sx={{ mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Loading...</Typography>
                        <Typography variant="body2" color="text.secondary">Preparing your resume editor.</Typography>
                         <LinearProgress sx={{ width: '80%', height: 4, borderRadius: 2, mt: 3, mx: 'auto' }} />
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    height: '100vh', bgcolor: 'background.default', p: 2,
                    // Optional subtle error gradient
                     // backgroundImage: `radial-gradient(circle at 90% 10%, ${alpha(theme.palette.error.light, 0.05)} 0%, ${alpha(theme.palette.error.dark, 0.05)} 90%)`
                }}>
                    <Paper elevation={3} sx={{ p: {xs: 3, sm: 4}, borderRadius: 4, textAlign: 'center', maxWidth: 450 }}>
                         <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: alpha(theme.palette.error.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                            <ErrorIcon color="error" sx={{ fontSize: 36 }} />
                        </Box>
                        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>Error Loading Resume</Typography>
                        <Alert severity="error" variant="outlined" sx={{ mb: 3, textAlign: 'left', borderRadius: 2 }}>
                             {error}
                         </Alert>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<DashboardIcon />}
                            onClick={() => navigate('/dashboard')} // Direct navigation ok from error state
                        >
                            Go to Dashboard
                        </Button>
                    </Paper>
                </Box>
            </ThemeProvider>
        );
    }

    // --- Form Rendering Logic ---
    const renderForm = () => {
        const currentSection = sections.find(sec => sec.id === currentStep);
        if (!currentSection) return <Alert severity="warning">Invalid step selected.</Alert>; // Should not happen

        const FormComponent = currentSection.form;
        const sectionKey = currentSection.key;

        return (
            // Add a key to ensure component re-renders correctly on step change if needed
            // Though usually not necessary with controlled components and useEffect
             <Box key={currentSection.id}>
                {/* Optional Title for the form section */}
                 {/* <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>{currentSection.label}</Typography> */}

                 <Grow in={true} timeout={350}>
                    <div> {/* Grow needs a direct child */}
                         <FormComponent
                            data={resumeData[sectionKey]}
                            updateData={(data) => updateResumeData(sectionKey, data)}
                            // Pass navigation only if a specific form needs it
                            // nextStep={nextStep}
                            // prevStep={prevStep}
                            isComplete={completedSections[sectionKey]}
                        />
                     </div>
                 </Grow>

                 {/* Consistent Navigation Buttons at the bottom of the form area */}
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button
                        variant="outlined"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        startIcon={<ArrowBackIcon />}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        onClick={nextStep}
                        endIcon={currentStep !== totalSteps ? <ArrowForwardIcon /> : <VisibilityIcon />} // Use ArrowForwardIcon for next
                    >
                        {currentStep === totalSteps ? 'Preview Resume' : 'Next Section'}
                    </Button>
                </Box>
             </Box>
        );
    };


    // --- Drawer Content ---
    const drawerContent = (
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* Drawer Header */}
            <Box
                sx={{
                    py: 2, px: 2.5, bgcolor: 'primary.main', color: 'primary.contrastText',
                    // Fancy gradient background
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
            >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Resume Editor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Click to rename" placement="bottom-start">
                        <Typography
                            variant="body2" noWrap onClick={handleOpenTitleDialog}
                            sx={{
                                color: alpha('#ffffff', 0.9), flexGrow: 1, mr: 1,
                                cursor: 'pointer', '&:hover': { color: '#ffffff' }
                            }}
                        >
                            {resumeMetadata.title}
                        </Typography>
                    </Tooltip>
                    <IconButton size="small" sx={{ color: alpha('#ffffff', 0.7), '&:hover': { color: '#ffffff', bgcolor: alpha('#ffffff', 0.1) } }} onClick={handleOpenTitleDialog}>
                        <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Navigation List */}
            <List sx={{ pt: 1, pb: 0, flexGrow: 1, overflowY: 'auto' }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigateWithConfirmation('/dashboard')}>
                        <ListItemIcon sx={{ minWidth: 40 }}> <DashboardIcon /> </ListItemIcon>
                        <ListItemText primary="My Dashboard" primaryTypographyProps={{ fontWeight: 500, variant: 'body2' }} />
                    </ListItemButton>
                </ListItem>
                <Divider sx={{ mx: 2, my: 1 }} />

                <Typography variant="overline" sx={{ px: 2.5, mb: 0.5, display: 'block', color: 'text.disabled' }}>
                    Sections
                </Typography>

                {sections.map((section) => (
                    <ListItem key={section.id} disablePadding>
                        <ListItemButton
                            selected={!isPreviewMode && currentStep === section.id}
                            onClick={() => handleNavItemClick(section.id)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                 {completedSections[section.key] ? (
                                     <StyledBadge overlap="circular" variant="dot" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                        {React.cloneElement(section.icon, { color: (!isPreviewMode && currentStep === section.id) ? 'primary' : 'inherit' })}
                                    </StyledBadge>
                                 ) : (
                                    React.cloneElement(section.icon, { color: (!isPreviewMode && currentStep === section.id) ? 'primary' : 'inherit' })
                                 )}
                            </ListItemIcon>
                            <ListItemText
                                primary={section.label}
                                primaryTypographyProps={{ fontWeight: (!isPreviewMode && currentStep === section.id) ? 600 : 500, variant: 'body2' }}
                            />
                             {completedSections[section.key] && (
                                <CheckCircleIcon color="success" sx={{ fontSize: 18, opacity: 0.8, ml: 1 }} />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ mx: 2, my: 1 }} />

                 <ListItem disablePadding>
                    <ListItemButton selected={isPreviewMode} onClick={() => handleNavItemClick(previewStepId)}>
                        <ListItemIcon sx={{ minWidth: 40 }}> <VisibilityIcon /> </ListItemIcon>
                        <ListItemText primary="Preview" primaryTypographyProps={{ fontWeight: isPreviewMode ? 600 : 500, variant: 'body2' }} />
                    </ListItemButton>
                </ListItem>

            </List>

             {/* Save Area at Bottom */}
             <Box sx={{ p: 2, mt: 'auto', borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: alpha(theme.palette.action.hover, 0.02) }}>
                  <Button
                      fullWidth
                      variant={unsavedChanges ? "contained" : "outlined"}
                      color={unsavedChanges ? "warning" : "primary"}
                      onClick={handleManualSave}
                      disabled={isSaving}
                      startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{ mb: 1 }}
                  >
                      {isSaving ? "Saving..." : (unsavedChanges ? "Save Changes" : "All Saved")}
                  </Button>
                  {saveError && <Typography variant="caption" color="error" display="block" textAlign="center">{saveError}</Typography>}
                   {!saveError && resumeMetadata.lastModified && (
                      <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                          Last saved: {new Date(resumeMetadata.lastModified).toLocaleTimeString()}
                      </Typography>
                  )}
             </Box>
              {/* Optional: Dark mode toggle in drawer footer */}
              {/* <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                   <ListItemButton onClick={toggleDarkMode}>
                       <ListItemIcon>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
                       <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
                   </ListItemButton>
               </Box> */}
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Navigation Drawer (Handles both Mobile and Desktop) */}
                <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
                     {/* Mobile Drawer */}
                    <SwipeableDrawer
                        variant="temporary"
                        open={mobileOpen}
                        onOpen={() => setMobileOpen(true)}
                        onClose={handleDrawerToggle} // Use the toggle function
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRight: 'none' },
                        }}
                    >
                        {drawerContent}
                    </SwipeableDrawer>

                    {/* Desktop Permanent Drawer */}
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box', width: 280,
                                bgcolor: 'background.paper', // Use theme background
                                borderRight: `1px solid ${theme.palette.divider}`, // Ensure consistent border
                                // Optional: Add slight top offset if AppBar isn't sticky or has different height needs
                                // top: '70px', height: 'calc(100% - 70px)',
                            },
                        }}
                        open
                    >
                        {drawerContent}
                    </Drawer>
                </Box>

                {/* Main Content Area */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { md: 'calc(100% - 280px)' }, // Account for drawer width
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Anchor for ScrollTop */}
                    <span id="back-to-top-anchor" style={{ position: 'absolute', top: '-100px' }}></span>

                    {/* --- AppBar --- */}
                    <HideOnScroll>
                        <AppBar
                            position="sticky" // Sticky works well with this layout
                            sx={{
                                // Let theme handle background/blur/border
                                width: { md: 'calc(100% - 280px)' }, // Match content width on desktop
                                ml: { md: '280px' }, // Offset by drawer width on desktop
                             }}
                        >
                            <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
                                {/* Mobile Menu Toggle */}
                                <IconButton
                                    color="inherit" aria-label="open drawer" edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 1.5, display: { md: 'none' } }}
                                > <MenuIcon /> </IconButton>

                                {/* Spacer to push items right */}
                                <Box sx={{ flexGrow: 1 }} />

                                {/* Unsaved Changes Chip (visible on larger screens) */}
                                {unsavedChanges && !isSaving && (
                                    <Grow in={unsavedChanges}>
                                        <Chip
                                            label="Unsaved Changes" color="warning" size="small" variant="filled" // Use filled for better visibility
                                            sx={{ mx: 1.5, display: { xs: 'none', sm: 'flex' } }}
                                        />
                                    </Grow>
                                )}

                                {/* Saving Indicator */}
                                {isSaving && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5, color: 'text.secondary' }}>
                                        <CircularProgress size={18} sx={{ mr: 1 }} color="inherit" />
                                        <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline' } }}>Saving...</Typography>
                                    </Box>
                                )}

                                {/* Completion Progress */}
                                <Box sx={{ width: { xs: 60, sm: 80 }, mr: 1.5, display: { xs: 'none', sm: 'block' } }}>
                                    <Tooltip title={`${Math.round(completionProgress)}% Complete`}>
                                        <ProgressContainer>
                                            <ProgressBar value={completionProgress} />
                                        </ProgressContainer>
                                    </Tooltip>
                                </Box>

                                {/* Dark Mode Toggle */}
                                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                                    <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 0.5 }}>
                                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                                    </IconButton>
                                </Tooltip>

                                {/* Preview Button (Desktop) */}
                                {!isPreviewMode && (
                                    <Button
                                        variant="outlined" color="secondary"
                                        onClick={() => handleNavItemClick(previewStepId)}
                                        startIcon={<VisibilityIcon />}
                                        sx={{ display: { xs: 'none', md: 'inline-flex' }, mr: 1 }}
                                    > Preview </Button>
                                )}

                                {/* Save Button (Desktop) */}
                                <Button
                                    variant={unsavedChanges ? "contained" : "outlined"}
                                    color={unsavedChanges ? "warning" : "primary"}
                                    onClick={handleManualSave}
                                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                    disabled={isSaving || !unsavedChanges}
                                    sx={{
                                        display: { xs: 'none', md: 'inline-flex' },
                                        minWidth: 100, // Ensure button text fits
                                         // Make warning button more prominent
                                         ...(unsavedChanges && { animation: 'pulse 1.5s infinite ease-in-out' }),
                                         '@keyframes pulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)' } }
                                    }}
                                >
                                    {isSaving ? "Saving" : (unsavedChanges ? "Save" : "Saved")}
                                </Button>

                                 {/* Mobile Actions (using MoreVert) - Alternative to FAB */}
                                 <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
                                      {unsavedChanges && !isSaving && (
                                         <Tooltip title="Save Changes">
                                             <IconButton color="warning" onClick={handleManualSave} disabled={isSaving}>
                                                 <SaveIcon />
                                             </IconButton>
                                         </Tooltip>
                                      )}
                                      {isSaving && (
                                          <IconButton disabled color="inherit">
                                              <CircularProgress size={24} color="inherit" />
                                          </IconButton>
                                      )}
                                      {/* Add other actions like Preview here if needed */}
                                      {/* <IconButton color="inherit" onClick={() => handleNavItemClick(previewStepId)}>
                                           <VisibilityIcon />
                                       </IconButton> */}
                                 </Box>

                            </Toolbar>
                        </AppBar>
                    </HideOnScroll>

                    {/* --- Form/Preview Content --- */}
                    <Container
                        maxWidth="lg"
                        sx={{ flexGrow: 1, py: { xs: 2, sm: 3 }, mb: { xs: 8, md: 3 } }} // Margin bottom for mobile nav
                    >
                        {/* Unsaved changes alert - subtle version */}
                        <Collapse in={unsavedChanges && !isSaving}>
                           <Alert
                               severity="info" variant="standard" // Use standard for less intrusion
                               sx={{ mb: 2, display: { xs: 'none', sm: 'flex' } }} // Hide on xs, AppBar chip is primary
                               icon={<SaveIcon fontSize="inherit" />}
                               action={
                                    <Button color="inherit" size="small" onClick={handleManualSave} disabled={isSaving}>Save Now</Button>
                               }
                           > You have unsaved changes. </Alert>
                        </Collapse>

                        {/* Horizontal Stepper (Desktop) */}
                         {!isPreviewMode && !isSmall && (
                             <Paper elevation={0} sx={{ mb: 3, p: 1, bgcolor: 'transparent' }}>
                                <Stepper activeStep={currentStep - 1} alternativeLabel>
                                    {sections.map((section, index) => (
                                        <Step key={section.id} completed={completedSections[section.key]}>
                                            <StepLabel
                                                onClick={() => handleNavItemClick(section.id)}
                                                sx={{ cursor: 'pointer' }}
                                                // Use default MUI StepIcon or customize it further if needed
                                                // StepIconComponent={(props: StepIconProps) => (
                                                //     <Box sx={{ color: props.completed ? 'success.main' : (props.active ? 'primary.main' : 'text.disabled') }}>
                                                //         {props.completed ? <CheckCircleIcon /> : React.cloneElement(section.icon, { fontSize: 'medium' })}
                                                //     </Box>
                                                // )}
                                            >
                                                {section.label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                             </Paper>
                         )}

                        {/* Main Content Card */}
                        {!isPreviewMode ? (
                            <AnimatedCard elevation={1}>
                                {renderForm()}
                            </AnimatedCard>
                        ) : (
                             // Preview doesn't need the animated card wrapper usually
                            <Box sx={{ mt: { xs: 0, sm: -2 } }}> {/* Adjust margin if stepper removed */}
                                <ResumePreview resumeData={resumeData} onBack={prevStep} />
                            </Box>
                        )}
                    </Container>
                </Box> {/* End Main Content Area */}

                {/* --- Bottom Navigation (Mobile Only) --- */}
                {isMobile && (
                    <Paper
                        elevation={3} // Give it slight elevation
                        sx={{
                            position: 'fixed', bottom: 0, left: 0, right: 0,
                            zIndex: (theme) => theme.zIndex.appBar, // Ensure it's below FAB, above content
                            display: { md: 'none' }, // Hide on medium and up
                            // Use theme styles for consistency
                        }}
                    >
                        <BottomNavigation
                            value={isPreviewMode ? previewStepId : currentStep}
                            onChange={handleBottomNavChange}
                            showLabels
                        >
                            {sections.map(section => (
                                <BottomNavigationAction
                                    key={section.id}
                                    label={isSmall ? section.label.substring(0, 4) : section.label} // Shorten label on very small screens
                                    value={section.id}
                                    icon={
                                        completedSections[section.key] ? (
                                            <StyledBadge overlap="circular" variant="dot" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                                {section.icon}
                                            </StyledBadge>
                                        ) : ( section.icon )
                                    }
                                    sx={{ minWidth: 'auto', px: 1 }} // Adjust padding for more items
                                />
                            ))}
                            {/* Preview Action */}
                             <BottomNavigationAction
                                 label={isSmall ? "View" : "Preview"}
                                 value={previewStepId}
                                 icon={<VisibilityIcon />}
                                 sx={{ minWidth: 'auto', px: 1 }}
                             />
                        </BottomNavigation>
                    </Paper>
                )}

                {/* --- Utilities --- */}

                {/* Save FAB for mobile (Optional - Actions are also in AppBar now) */}
                {/* {isMobile && unsavedChanges && !isSaving && (
                     <Fab
                         color="warning" aria-label="save"
                         sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: (theme) => theme.zIndex.speedDial }}
                         onClick={handleManualSave}
                     > <SaveIcon /> </Fab>
                 )}
                 {isMobile && isSaving && ( // Show saving state on FAB too
                      <Fab color="warning" sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: (theme) => theme.zIndex.speedDial }} disabled>
                           <CircularProgress size={24} color="inherit" />
                       </Fab>
                  )} */}


                {/* Scroll-to-top Button */}
                <ScrollTop>
                    <Fab color="primary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>

                {/* Title Edit Dialog */}
                <Dialog open={showTitleDialog} onClose={handleCloseTitleDialog} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600 }}>Rename Resume</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Enter a new name for this resume.
                        </DialogContentText>
                        <TextField
                            autoFocus margin="dense" id="resumeTitle" label="Resume Name" type="text" fullWidth
                            value={currentTitle}
                            onChange={(e) => setCurrentTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                            InputProps={{
                                endAdornment: currentTitle ? (
                                    <IconButton size="small" onClick={() => setCurrentTitle('')} edge="end"> <CloseIcon fontSize="small" /> </IconButton>
                                ) : null
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleCloseTitleDialog} color="inherit">Cancel</Button>
                        <Button onClick={handleSaveTitle} variant="contained" disabled={!currentTitle.trim()}> Update Name </Button>
                    </DialogActions>
                </Dialog>

                {/* Toast Notification */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={4000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                     // Adjust bottom position if bottom nav is present
                     sx={{ bottom: { xs: isMobile ? 70 : 24, md: 24 } }}
                >
                    <Alert
                        onClose={handleCloseNotification} severity={notification.severity}
                        variant="filled" elevation={6} sx={{ width: '100%' }}
                    > {notification.message} </Alert>
                </Snackbar>

                {/* Confirmation dialog for unsaved changes on navigation */}
                <Dialog open={showLeaveConfirmation} onClose={() => setShowLeaveConfirmation(false)} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ fontWeight: 600 }}>Unsaved Changes</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to save your changes before leaving this page?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => handleConfirmedNavigation(false)} color="inherit"> Discard </Button>
                        <Button onClick={() => handleConfirmedNavigation(true)} variant="contained" color="primary"> Save & Leave </Button>
                    </DialogActions>
                </Dialog>

            </Box> {/* End Root Flex Container */}
        </ThemeProvider>
    );
}

export default ResumeBuilderPage;