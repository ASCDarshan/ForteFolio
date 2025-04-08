import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  FormatColorFill as ColorIcon,
  TextFormat as FontIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Description as DocumentIcon,
  Article as MinimalIcon,
  Brush as CreativeIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  Print as PrintIcon,
  KeyboardArrowDown as ArrowDownIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as ViewIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Assignment as ProjectIcon,
  Tune as CustomizeIcon,
  FormatSize as FontSizeIcon,
  Style as StyleIcon
} from '@mui/icons-material';
import { 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Paper,
  Grid,
  Link,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Avatar,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Zoom,
  Fade,
  Card,
  CardContent,
  Slide,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import html2pdf from 'html2pdf.js';

// Resume template variations
const TEMPLATES = {
  MODERN: 'modern',
  MINIMAL: 'minimal', 
  CREATIVE: 'creative',
  PROFESSIONAL: 'professional'
};

// Font families
const FONTS = {
  POPPINS: "'Poppins', sans-serif",
  ROBOTO: "'Roboto', sans-serif",
  OPEN_SANS: "'Open Sans', sans-serif",
  MONTSERRAT: "'Montserrat', sans-serif",
  RALEWAY: "'Raleway', sans-serif"
};

// Color schemes
const COLOR_SCHEMES = {
  LAVENDER: {
    primary: '#7B68EE',
    secondary: '#9370DB',
    accent: '#E6E6FA',
    text: '#424242',
    background: '#FFFFFF',
    title: 'Lavender'
  },
  BLUE: {
    primary: '#1976d2',
    secondary: '#0d47a1',
    accent: '#bbdefb',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Blue'
  },
  TEAL: {
    primary: '#009688',
    secondary: '#00796b',
    accent: '#b2dfdb',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Teal'
  },
  CHARCOAL: {
    primary: '#455a64',
    secondary: '#263238',
    accent: '#cfd8dc',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Charcoal'
  },
  BURGUNDY: {
    primary: '#9c27b0',
    secondary: '#7b1fa2',
    accent: '#e1bee7',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Burgundy'
  },
  FOREST: {
    primary: '#2e7d32',
    secondary: '#1b5e20',
    accent: '#c8e6c9',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Forest'
  },
  MIDNIGHT: {
    primary: '#303f9f',
    secondary: '#1a237e',
    accent: '#c5cae9',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Midnight'
  },
  CORAL: {
    primary: '#e57373',
    secondary: '#c62828',
    accent: '#ffcdd2',
    text: '#263238',
    background: '#FFFFFF',
    title: 'Coral'
  }
};

const ResumePreview = ({ resumeData, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const resumeRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES.MODERN);
  const [fontFamily, setFontFamily] = useState(FONTS.POPPINS);
  const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES.BLUE);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [colorMenu, setColorMenu] = useState(null);
  const [fontMenu, setFontMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [starredSections, setStarredSections] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Destructure resumeData for easier access
  const { personalInfo = {}, education = [], experience = [], skills = [], projects = [] } = resumeData;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString; // Return original on error
    }
  };

  // Handle template change
  const handleTemplateChange = (event, newValue) => {
    setActiveTab(newValue);
    switch(newValue) {
      case 0:
        setActiveTemplate(TEMPLATES.MODERN);
        break;
      case 1:
        setActiveTemplate(TEMPLATES.MINIMAL);
        break;
      case 2:
        setActiveTemplate(TEMPLATES.CREATIVE);
        break;
      case 3:
        setActiveTemplate(TEMPLATES.PROFESSIONAL);
        break;
      default:
        setActiveTemplate(TEMPLATES.MODERN);
    }
  };

  // Toggle section star
  const toggleStarSection = (section) => {
    if (starredSections.includes(section)) {
      setStarredSections(starredSections.filter(s => s !== section));
    } else {
      setStarredSections([...starredSections, section]);
    }
  };

  // Handle color menu
  const handleColorMenuOpen = (event) => {
    setColorMenu(event.currentTarget);
  };

  const handleColorMenuClose = () => {
    setColorMenu(null);
  };

  // Handle font menu
  const handleFontMenuOpen = (event) => {
    setFontMenu(event.currentTarget);
  };

  const handleFontMenuClose = () => {
    setFontMenu(null);
  };

  // Handle export menu
  const handleExportMenuOpen = (event) => {
    setExportMenu(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenu(null);
  };

  // Change color scheme
  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    handleColorMenuClose();
  };

  // Change font family
  const changeFontFamily = (font) => {
    setFontFamily(font);
    handleFontMenuClose();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add utility for determining if a section is empty
  const isSectionEmpty = (section) => {
    switch(section) {
      case 'personalInfo':
        return !personalInfo || Object.keys(personalInfo).length === 0;
      case 'education':
        return !education || education.length === 0;
      case 'experience':
        return !experience || experience.length === 0;
      case 'skills':
        return !skills || skills.length === 0;
      case 'projects':
        return !projects || projects.length === 0;
      default:
        return true;
    }
  };

  // Function to download resume as PDF
  const downloadPDF = () => {
    setLoading(true);
    const element = resumeRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${personalInfo.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Resume downloaded successfully!',
        severity: 'success'
      });
      handleExportMenuClose();
    }).catch((error) => {
      console.error("PDF generation error:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to download resume. Please try again.',
        severity: 'error'
      });
    });
  };

  // Print resume
  const printResume = () => {
    window.print();
    handleExportMenuClose();
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Create section components that can be reused across templates
  const SectionHeading = ({ title, icon, section, sx = {} }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2,
      ...sx
    }}>
      {icon && React.cloneElement(icon, { 
        sx: { mr: 1, color: colorScheme.primary }
      })}
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          fontWeight: 600, 
          color: colorScheme.primary,
        }}
      >
        {title}
      </Typography>
      {section && (
        <IconButton 
          size="small" 
          onClick={() => toggleStarSection(section)}
          sx={{ ml: 1 }}
        >
          {starredSections.includes(section) ? 
            <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
            <StarBorderIcon fontSize="small" />
          }
        </IconButton>
      )}
    </Box>
  );

  // Render modern template
  const renderModernTemplate = () => (
    <Box 
      sx={{ 
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 4,
        maxWidth: '1000px',
        mx: 'auto',
      }}
    >
      {/* Header/Personal Info */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        pb: 4,
        borderBottom: '2px solid',
        borderColor: colorScheme.primary
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: colorScheme.primary, 
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </Typography>
        
        {personalInfo.jobTitle && (
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              mb: 2
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 3,
            mt: 3
          }}
        >
          {personalInfo.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Typography variant="body2">{personalInfo.email}</Typography>
            </Box>
          )}
          
          {personalInfo.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Typography variant="body2">{personalInfo.phone}</Typography>
            </Box>
          )}
          
          {personalInfo.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Typography variant="body2">{personalInfo.location}</Typography>
            </Box>
          )}
          
          {personalInfo.linkedin && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkedInIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Link href={personalInfo.linkedin} target="_blank" variant="body2" underline="hover">
                LinkedIn
              </Link>
            </Box>
          )}
          
          {personalInfo.github && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GitHubIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Link href={personalInfo.github} target="_blank" variant="body2" underline="hover">
                GitHub
              </Link>
            </Box>
          )}
          
          {personalInfo.website && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Link href={personalInfo.website} target="_blank" variant="body2" underline="hover">
                Website
              </Link>
            </Box>
          )}
          
          {personalInfo.portfolio && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon fontSize="small" sx={{ mr: 0.5, color: colorScheme.primary }} />
              <Link href={personalInfo.portfolio} target="_blank" variant="body2" underline="hover">
                Portfolio
              </Link>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          {/* Summary */}
          {personalInfo.summary && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary, 
                    display: 'flex',
                    alignItems: 'center',
                    '&::after': {
                      content: '""',
                      flexGrow: 1,
                      height: '2px',
                      bgcolor: colorScheme.accent,
                      ml: 2
                    }
                  }}
                >
                  Profile
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('summary')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('summary') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                {personalInfo.summary}
              </Typography>
            </Box>
          )}

          {/* Experience */}
          {!isSectionEmpty('experience') && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary, 
                    display: 'flex',
                    alignItems: 'center',
                    '&::after': {
                      content: '""',
                      flexGrow: 1,
                      height: '2px',
                      bgcolor: colorScheme.accent,
                      ml: 2
                    }
                  }}
                >
                  Experience
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('experience')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('experience') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              {experience.map((exp, index) => (
                <Box key={exp.id || index} sx={{ mb: 3, pl: 2, borderLeft: '2px solid', borderColor: colorScheme.accent }}>
                  <Grid container>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary }}>
                        {exp.position || 'Position Title'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {exp.company || 'Company Name'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      {exp.location && (
                        <Typography variant="body2" color="text.secondary">
                          {exp.location}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(exp.startDate) || 'Start Date'} - {exp.current ? 'Present' : (formatDate(exp.endDate) || 'End Date')}
                      </Typography>
                    </Grid>
                  </Grid>

                  {exp.description && (
                    <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                      {exp.description}
                    </Typography>
                  )}

                  {Array.isArray(exp.responsibilities) && exp.responsibilities.filter(Boolean).length > 0 && (
                    <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                      {exp.responsibilities.filter(Boolean).map((responsibility, index) => (
                        responsibility.trim() && (
                          <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                            {responsibility}
                          </Typography>
                        )
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Projects */}
          {!isSectionEmpty('projects') && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary, 
                    display: 'flex',
                    alignItems: 'center',
                    '&::after': {
                      content: '""',
                      flexGrow: 1,
                      height: '2px',
                      bgcolor: colorScheme.accent,
                      ml: 2
                    }
                  }}
                >
                  Projects
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('projects')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('projects') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              {projects.map((project, index) => (
                <Box key={project.id || index} sx={{ mb: 3, pl: 2, borderLeft: '2px solid', borderColor: colorScheme.accent }}>
                  <Grid container>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary }}>
                        {project.title || 'Project Title'}
                        {project.link && (
                          <Link 
                            href={project.link} 
                            target="_blank" 
                            underline="hover"
                            sx={{ ml: 1, fontSize: '0.8rem', color: colorScheme.primary }}
                          >
                            View Project
                          </Link>
                        )}
                      </Typography>
                      {project.technologies && (
                        <Typography variant="subtitle2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                          {project.technologies}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(project.startDate) || 'Start Date'} - {project.current ? 'Present' : (formatDate(project.endDate) || 'End Date')}
                      </Typography>
                    </Grid>
                  </Grid>

                  {project.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {project.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <Box sx={{ 
            bgcolor: colorScheme.accent, 
            p: 3, 
            borderRadius: 2,
            height: '100%'
          }}>
            {/* Education */}
            {!isSectionEmpty('education') && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: colorScheme.primary,
                    }}
                  >
                    Education
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleStarSection('education')}
                    sx={{ ml: 1 }}
                  >
                    {starredSections.includes('education') ? 
                      <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                      <StarBorderIcon fontSize="small" />
                    }
                  </IconButton>
                </Box>

                {education.map((edu, index) => (
                  <Box key={edu.id || index} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, fontSize: '1rem' }}>
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {edu.institution || 'Institution Name'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      {edu.location && (
                        <Typography variant="body2" color="text.secondary">
                          {edu.location}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.startDate) || 'Start Date'} - {formatDate(edu.endDate) || 'End Date'}
                      </Typography>
                    </Box>
                    {edu.description && (
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                        {edu.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Skills */}
            {!isSectionEmpty('skills') && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: colorScheme.primary,
                    }}
                  >
                    Skills
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleStarSection('skills')}
                    sx={{ ml: 1 }}
                  >
                    {starredSections.includes('skills') ? 
                      <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                      <StarBorderIcon fontSize="small" />
                    }
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  {skills.map((category, index) => (
                    <Box key={category.id || index}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colorScheme.secondary, mb: 1 }}>
                        {category.name || 'Skill Category'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {typeof category.skills === 'string' && category.skills.split(',').map((skill, idx) => (
                          skill.trim() && (
                            <Chip 
                              key={idx}
                              label={skill.trim()}
                              size="small"
                              sx={{ 
                                bgcolor: 'white', 
                                color: colorScheme.secondary,
                                borderColor: colorScheme.primary,
                                '&:hover': {
                                  bgcolor: colorScheme.primary,
                                  color: 'white'
                                }
                              }}
                            />
                          )
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Render minimal template
  const renderMinimalTemplate = () => (
    <Box 
      sx={{ 
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 4,
        maxWidth: '1000px',
        mx: 'auto',
      }}
    >
      {/* Header/Personal Info */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: colorScheme.primary, 
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </Typography>
        
        {personalInfo.jobTitle && (
          <Typography 
            variant="h5" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              mb: 2
            }}
          >
            {personalInfo.jobTitle}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={8}>
            {personalInfo.summary && (
              <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                {personalInfo.summary}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={1}>
              {personalInfo.email && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.email}</Typography>
                </Box>
              )}
              
              {personalInfo.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.phone}</Typography>
                </Box>
              )}
              
              {personalInfo.location && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.location}</Typography>
                </Box>
              )}
              
              {personalInfo.linkedin && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinkedInIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Link href={personalInfo.linkedin} target="_blank" variant="body2" underline="hover" color="inherit">
                    LinkedIn
                    </Link>
                </Box>
              )}
              
              {personalInfo.github && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GitHubIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Link href={personalInfo.github} target="_blank" variant="body2" underline="hover" color="inherit">
                    GitHub
                  </Link>
                </Box>
              )}
              
              {personalInfo.website && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Link href={personalInfo.website} target="_blank" variant="body2" underline="hover" color="inherit">
                    Website
                  </Link>
                </Box>
              )}
              
              {personalInfo.portfolio && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LanguageIcon fontSize="small" sx={{ mr: 1, color: colorScheme.primary }} />
                  <Link href={personalInfo.portfolio} target="_blank" variant="body2" underline="hover" color="inherit">
                    Portfolio
                  </Link>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 3, borderColor: colorScheme.primary }} />
      </Box>

      {/* Experience */}
      {!isSectionEmpty('experience') && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: colorScheme.primary
              }}
            >
              Experience
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => toggleStarSection('experience')}
              sx={{ ml: 1 }}
            >
              {starredSections.includes('experience') ? 
                <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                <StarBorderIcon fontSize="small" />
              }
            </IconButton>
          </Box>

          {experience.map((exp, index) => (
            <Box key={exp.id || index} sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate) || 'Start Date'} - {exp.current ? 'Present' : (formatDate(exp.endDate) || 'End Date')}
                  </Typography>
                  {exp.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {exp.location}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, fontSize: '1.1rem' }}>
                    {exp.position || 'Position Title'}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                    {exp.company || 'Company Name'}
                  </Typography>
                  
                  {exp.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {exp.description}
                    </Typography>
                  )}
                  
                  {exp.responsibilities && typeof exp.responsibilities === 'string' && (
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {exp.responsibilities.split('\n').map((responsibility, idx) => (
                        responsibility.trim() && (
                          <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                            {responsibility}
                          </Typography>
                        )
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {!isSectionEmpty('education') && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: colorScheme.primary
              }}
            >
              Education
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => toggleStarSection('education')}
              sx={{ ml: 1 }}
            >
              {starredSections.includes('education') ? 
                <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                <StarBorderIcon fontSize="small" />
              }
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {education.map((edu, index) => (
              <Grid item xs={12} sm={6} md={4} key={edu.id || index}>
                <Box sx={{ 
                  p: 2, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, fontSize: '1rem' }}>
                    {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                    {edu.institution || 'Institution Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(edu.startDate) || 'Start Date'} - {formatDate(edu.endDate) || 'End Date'}
                  </Typography>
                  {edu.location && (
                    <Typography variant="body2" color="text.secondary">
                      {edu.location}
                    </Typography>
                  )}
                  {edu.description && (
                    <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Skills */}
      {!isSectionEmpty('skills') && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: colorScheme.primary
              }}
            >
              Skills
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => toggleStarSection('skills')}
              sx={{ ml: 1 }}
            >
              {starredSections.includes('skills') ? 
                <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                <StarBorderIcon fontSize="small" />
              }
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            {skills.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category.id || index}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colorScheme.secondary, mb: 1 }}>
                    {category.name || 'Skill Category'}
                  </Typography>
                  
                  {category.skills && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {typeof category.skills === 'string' && category.skills.split(',').map((skill, idx) => (
                        skill.trim() && (
                          <Chip 
                            key={idx}
                            label={skill.trim()}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: colorScheme.primary,
                              color: colorScheme.text
                            }}
                          />
                        )
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Projects */}
      {!isSectionEmpty('projects') && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: colorScheme.primary
              }}
            >
              Projects
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => toggleStarSection('projects')}
              sx={{ ml: 1 }}
            >
              {starredSections.includes('projects') ? 
                <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                <StarBorderIcon fontSize="small" />
              }
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} key={project.id || index}>
                <Box sx={{ 
                  p: 2, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, fontSize: '1.1rem' }}>
                    {project.title || 'Project Title'}
                    {project.link && (
                      <Link 
                        href={project.link} 
                        target="_blank" 
                        underline="hover"
                        sx={{ ml: 1, fontSize: '0.8rem', color: colorScheme.primary }}
                      >
                        View
                      </Link>
                    )}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(project.startDate) || 'Start Date'} - {project.current ? 'Present' : (formatDate(project.endDate) || 'End Date')}
                  </Typography>
                  
                  {project.technologies && (
                    <Chip 
                      label={project.technologies} 
                      size="small" 
                      sx={{ 
                        mt: 1, 
                        bgcolor: colorScheme.accent,
                        color: colorScheme.secondary,
                        fontSize: '0.75rem'
                      }} 
                    />
                  )}
                  
                  {project.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {project.description}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );

  // Render creative template
  const renderCreativeTemplate = () => (
    <Box 
      sx={{ 
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: colorScheme.background,
        p: 4,
        maxWidth: '1000px',
        mx: 'auto',
        position: 'relative',
        ':before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '150px',
          bgcolor: colorScheme.primary,
          zIndex: 0
        }
      }}
    >
      {/* Header/Personal Info */}
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-end' },
        mb: 6,
        gap: 3
      }}>
        <Avatar
          sx={{
            width: { xs: 100, md: 120 },
            height: { xs: 100, md: 120 },
            bgcolor: colorScheme.secondary,
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            border: '4px solid white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          {personalInfo.fullName ? getInitials(personalInfo.fullName) : 'N'}
        </Avatar>
        
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 600, 
              color: 'white', 
              mb: 0.5,
              fontSize: { xs: '2rem', md: '2.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {personalInfo.fullName || 'Your Name'}
          </Typography>
          
          {personalInfo.jobTitle && (
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 400,
                color: 'white',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                opacity: 0.9
              }}
            >
              {personalInfo.jobTitle}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ 
          ml: { xs: 0, md: 'auto' }, 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', md: 'flex-end' }
        }}>
          {personalInfo.email && (
            <Tooltip title={personalInfo.email}>
              <IconButton sx={{ color: 'white' }}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.phone && (
            <Tooltip title={personalInfo.phone}>
              <IconButton sx={{ color: 'white' }}>
                <PhoneIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.location && (
            <Tooltip title={personalInfo.location}>
              <IconButton sx={{ color: 'white' }}>
                <LocationIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.linkedin && (
            <Tooltip title="LinkedIn Profile">
              <IconButton component="a" href={personalInfo.linkedin} target="_blank" sx={{ color: 'white' }}>
                <LinkedInIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.github && (
            <Tooltip title="GitHub Profile">
              <IconButton component="a" href={personalInfo.github} target="_blank" sx={{ color: 'white' }}>
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.website && (
            <Tooltip title="Website">
              <IconButton component="a" href={personalInfo.website} target="_blank" sx={{ color: 'white' }}>
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {personalInfo.portfolio && (
            <Tooltip title="Portfolio Website">
              <IconButton component="a" href={personalInfo.portfolio} target="_blank" sx={{ color: 'white' }}>
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Summary */}
      {personalInfo.summary && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 4,
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -15,
              left: 20,
              width: 30,
              height: 30,
              bgcolor: colorScheme.primary,
              transform: 'rotate(45deg)',
              zIndex: -1
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                color: colorScheme.primary
              }}
            >
              About Me
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => toggleStarSection('summary')}
              sx={{ ml: 1 }}
            >
              {starredSections.includes('summary') ? 
                <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                <StarBorderIcon fontSize="small" />
              }
            </IconButton>
          </Box>
          <Typography variant="body1">
            {personalInfo.summary}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/* Experience */}
          {!isSectionEmpty('experience') && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2 }}>
                  <WorkIcon />
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary
                  }}
                >
                  Work Experience
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('experience')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('experience') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              <Box sx={{ 
                position: 'relative',
                ml: 3,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: -20,
                  width: 2,
                  height: '100%',
                  bgcolor: colorScheme.accent
                }
              }}>
                {experience.map((exp, index) => (
                  <Box 
                    key={exp.id || index} 
                    sx={{ 
                      mb: 4,
                      position: 'relative',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 6,
                        left: -23,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: colorScheme.primary,
                      }
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary }}>
                        {exp.position || 'Position Title'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {exp.company || 'Company Name'}
                          {exp.location && ` • ${exp.location}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {formatDate(exp.startDate) || 'Start Date'} - {exp.current ? 'Present' : (formatDate(exp.endDate) || 'End Date')}
                        </Typography>
                      </Box>
                    </Box>

                    {exp.description && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {exp.description}
                      </Typography>
                    )}

                    {typeof exp.responsibilities === 'string' && exp.responsibilities.trim() && (
                      <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                        {exp.responsibilities.split('\n').map((responsibility, idx) => (
                          responsibility.trim() && (
                            <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                              {responsibility}
                            </Typography>
                          )
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Projects */}
          {!isSectionEmpty('projects') && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2 }}>
                  <CodeIcon />
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary
                  }}
                >
                  Projects
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('projects')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('projects') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                {projects.map((project, index) => (
                  <Grid item xs={12} key={project.id || index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderLeft: '4px solid', 
                        borderColor: colorScheme.primary,
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary }}>
                            {project.title || 'Project Title'}
                            {project.link && (
                              <Link 
                                href={project.link} 
                                target="_blank" 
                                underline="hover"
                                sx={{ ml: 1, fontSize: '0.8rem', color: colorScheme.primary }}
                              >
                                <ViewIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                View
                              </Link>
                            )}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {formatDate(project.startDate) || 'Start Date'} - {project.current ? 'Present' : (formatDate(project.endDate) || 'End Date')}
                            </Typography>
                            
                            {project.technologies && (
                              <Chip 
                                label={project.technologies} 
                                size="small" 
                                sx={{ 
                                  bgcolor: colorScheme.accent,
                                  color: colorScheme.secondary,
                                  fontSize: '0.75rem'
                                }} 
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {project.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {project.description}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          {/* Education */}
          {!isSectionEmpty('education') && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary
                  }}
                >
                  Education
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('education')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('education') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              <Stack spacing={2}>
                {education.map((edu, index) => (
                  <Paper 
                    key={edu.id || index} 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      borderColor: colorScheme.accent
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colorScheme.secondary, fontSize: '1rem' }}>
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {edu.institution || 'Institution Name'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      {edu.location && (
                        <Typography variant="body2" color="text.secondary">
                          {edu.location}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(edu.startDate) || 'Start Date'} - {formatDate(edu.endDate) || 'End Date'}
                      </Typography>
                    </Box>
                    {edu.description && (
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                        {edu.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Skills */}
          {!isSectionEmpty('skills') && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: colorScheme.primary, mr: 2 }}>
                  <PsychologyIcon />
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary
                  }}
                >
                  Skills
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('skills')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('skills') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {skills.map((category, index) => (
                  <Box key={category.id || index}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colorScheme.secondary, mb: 1, backgroundColor: colorScheme.accent, p: 1, borderRadius: 1 }}>
                      {category.name || 'Skill Category'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {typeof category.skills === 'string' && category.skills.split(',').map((skill, idx) => (
                        skill.trim() && (
                          <Chip 
                            key={idx}
                            label={skill.trim()}
                            size="small"
                            sx={{ 
                              bgcolor: 'white', 
                              border: '1px solid',
                              borderColor: colorScheme.primary,
                              color: colorScheme.secondary,
                              '&:hover': {
                                bgcolor: colorScheme.primary,
                                color: 'white'
                              }
                            }}
                          />
                        )
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  // Render professional template 
  const renderProfessionalTemplate = () => (
    <Box 
      sx={{ 
        fontFamily: fontFamily,
        color: colorScheme.text,
        bgcolor: 'white',
        p: 4,
        maxWidth: '1000px',
        mx: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        borderBottom: `3px solid ${colorScheme.primary}`,
        pb: 3,
        mb: 4
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: colorScheme.secondary,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              
              {personalInfo.fullName || 'Your Name'}
            </Typography>
            
            {personalInfo.jobTitle && (
              <Typography 
                variant="h5" 
                sx={{ 
                  color: colorScheme.primary,
                  fontWeight: 500,
                  mb: 2
                }}
              >
                {personalInfo.jobTitle}
              </Typography>
            )}
            
            {personalInfo.summary && (
              <Typography variant="body1" sx={{ maxWidth: '650px' }}>
                {personalInfo.summary}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              {personalInfo.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.email}</Typography>
                </Box>
              )}
              
              {personalInfo.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.phone}</Typography>
                </Box>
              )}
              
              {personalInfo.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Typography variant="body2">{personalInfo.location}</Typography>
                </Box>
              )}
              
              {personalInfo.linkedin && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkedInIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Link href={personalInfo.linkedin} target="_blank" variant="body2" underline="hover">
                    LinkedIn
                  </Link>
                </Box>
              )}
              
              {personalInfo.github && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GitHubIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Link href={personalInfo.github} target="_blank" variant="body2" underline="hover">
                    GitHub
                  </Link>
                </Box>
              )}
              
              {personalInfo.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon fontSize="small" sx={{ color: colorScheme.primary }} />
                  <Link href={personalInfo.website} target="_blank" variant="body2" underline="hover">
                    Website
                  </Link>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left Column: Experience & Projects */}
        <Grid item xs={12} md={8}>
          {/* Experience Section */}
          {!isSectionEmpty('experience') && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colorScheme.accent}`
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Professional Experience
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('experience')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('experience') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              
              {experience.map((exp, index) => (
                <Box key={exp.id || index} sx={{ mb: 4 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mb: 0.5
                      }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: colorScheme.secondary 
                        }}>
                          {exp.position || 'Position Title'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          color: colorScheme.primary
                        }}>
                          {formatDate(exp.startDate) || 'Start Date'} - {exp.current ? 'Present' : (formatDate(exp.endDate) || 'End Date')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mb: 1
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {exp.company || 'Company Name'}
                        </Typography>
                        {exp.location && (
                          <Typography variant="body2" color="text.secondary">
                            {exp.location}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {exp.description && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {exp.description}
                    </Typography>
                  )}
                  
                  {typeof exp.responsibilities === 'string' && exp.responsibilities.trim() && (
                    <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                      {exp.responsibilities.split('\n').map((responsibility, idx) => (
                        responsibility.trim() && (
                          <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                            {responsibility}
                          </Typography>
                        )
                      ))}
                    </Box>
                  )}
                  
                  {index < experience.length - 1 && (
                    <Divider sx={{ mt: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
          
          {/* Projects Section */}
          {!isSectionEmpty('projects') && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colorScheme.accent}`
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Projects
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('projects')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('projects') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              
              {projects.map((project, index) => (
                <Box key={project.id || index} sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    mb: 0.5
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: colorScheme.secondary
                    }}>
                      {project.title || 'Project Title'}
                      {project.link && (
                        <Link 
                          href={project.link} 
                          target="_blank" 
                          underline="hover"
                          sx={{ ml: 1, fontSize: '0.8rem', color: colorScheme.primary }}
                        >
                          View Project
                        </Link>
                      )}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      fontWeight: 500,
                      color: colorScheme.primary
                    }}>
                      {formatDate(project.startDate) || 'Start Date'} - {project.current ? 'Present' : (formatDate(project.endDate) || 'End Date')}
                    </Typography>
                  </Box>
                  
                  {project.technologies && (
                    <Typography variant="subtitle2" sx={{ fontStyle: 'italic', mb: 1 }}>
                      {project.technologies}
                    </Typography>
                  )}
                  
                  {project.description && (
                    <Typography variant="body2">
                      {project.description}
                    </Typography>
                  )}
                  
                  {index < projects.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Right Column: Education, Skills, etc. */}
        <Grid item xs={12} md={4}>
          {/* Education Section */}
          {!isSectionEmpty('education') && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colorScheme.accent}`
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Education
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('education')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('education') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              
              {education.map((edu, index) => (
                <Box key={edu.id || index} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.secondary,
                    fontSize: '1rem'
                  }}>
                    {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {edu.institution || 'Institution Name'}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    mt: 0.5,
                    mb: 1
                  }}>
                    {edu.location && (
                      <Typography variant="body2" color="text.secondary">
                        {edu.location}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: colorScheme.primary }}>
                      {formatDate(edu.startDate) || 'Start Date'} - {formatDate(edu.endDate) || 'End Date'}
                    </Typography>
                  </Box>
                  
                  {edu.description && (
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {edu.description}
                    </Typography>
                  )}
                  
                  {index < education.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
          
          {/* Skills Section */}
          {!isSectionEmpty('skills') && (
            <Box sx={{ mb: 5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                pb: 1,
                borderBottom: `2px solid ${colorScheme.accent}`
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: colorScheme.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Skills
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleStarSection('skills')}
                  sx={{ ml: 1 }}
                >
                  {starredSections.includes('skills') ? 
                    <StarIcon fontSize="small" sx={{ color: colorScheme.primary }} /> : 
                    <StarBorderIcon fontSize="small" />
                  }
                </IconButton>
              </Box>
              
              <Stack spacing={2}>
                {skills.map((category, index) => (
                  <Box key={category.id || index}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: colorScheme.secondary, 
                      mb: 1 
                    }}>
                      {category.name || 'Skill Category'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {typeof category.skills === 'string' && category.skills.split(',').map((skill, idx) => (
                        skill.trim() && (
                          <Chip 
                            key={idx}
                            label={skill.trim()}
                            size="small"
                            sx={{ 
                              bgcolor: colorScheme.accent, 
                              color: colorScheme.secondary,
                              fontWeight: 500
                            }}
                          />
                        )
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  // Render the selected template
  const renderTemplate = () => {
    switch(activeTemplate) {
      case TEMPLATES.MODERN:
        return renderModernTemplate();
      case TEMPLATES.MINIMAL:
        return renderMinimalTemplate();
      case TEMPLATES.CREATIVE:
        return renderCreativeTemplate();
      case TEMPLATES.PROFESSIONAL:
        return renderProfessionalTemplate();
      default:
        return renderModernTemplate();
    }
  };

  // Calculate colors for SpeedDial
  const speedDialActions = [
    { icon: <DownloadIcon />, name: 'Download PDF', action: downloadPDF },
    { icon: <PrintIcon />, name: 'Print', action: printResume },
    { icon: <ColorIcon />, name: 'Change Colors', action: handleColorMenuOpen },
    { icon: <FontIcon />, name: 'Change Font', action: handleFontMenuOpen },
  ];

  return (
    <Box sx={{ position: 'relative', pb: 6 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', md: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            Edit Resume
          </Button>
          <Typography variant="h5" component="h2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Resume Preview
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-end', sm: 'flex-end' } }}>
          {!isMobile && (
            <>
              <Button
                variant="outlined"
                startIcon={<ColorIcon />}
                onClick={handleColorMenuOpen}
                size="small"
              >
                Color Scheme
              </Button>
              <Button
                variant="outlined"
                startIcon={<FontIcon />}
                onClick={handleFontMenuOpen}
                size="small"
              >
                Font
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportMenuOpen}
                endIcon={<ArrowDownIcon />}
                startIcon={<DownloadIcon />}
              >
                Export / Print
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 0, 
          borderRadius: 2,
          mb: 4, 
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTemplateChange} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          centered={!isMobile}
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <Tab label="Modern" icon={<DocumentIcon />} iconPosition="start" />
          <Tab label="Minimal" icon={<MinimalIcon />} iconPosition="start" />
          <Tab label="Creative" icon={<CreativeIcon />} iconPosition="start" />
          <Tab label="Professional" icon={<WorkIcon />} iconPosition="start" />
        </Tabs>

        <Box 
          sx={{ 
            maxHeight: '800px', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colorScheme.primary,
              borderRadius: '4px',
            },
          }}
        >
          <Box ref={resumeRef} className="resume-content">
            {renderTemplate()}
          </Box>
        </Box>
      </Paper>

      {/* Mobile SpeedDial for actions */}
      {isMobile && (
        <SpeedDial
          ariaLabel="Resume actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={action.action}
            />
          ))}
        </SpeedDial>
      )}

      {/* Color scheme menu */}
      <Menu
        anchorEl={colorMenu}
        open={Boolean(colorMenu)}
        onClose={handleColorMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
          <MenuItem key={key} onClick={() => changeColorScheme(scheme)}>
            <ListItemIcon>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: scheme.primary 
                }} 
              />
            </ListItemIcon>
            <ListItemText>{scheme.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Font family menu */}
      <Menu
        anchorEl={fontMenu}
        open={Boolean(fontMenu)}
        onClose={handleFontMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => changeFontFamily(FONTS.POPPINS)}>
          <Typography sx={{ fontFamily: FONTS.POPPINS }}>Poppins</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeFontFamily(FONTS.ROBOTO)}>
          <Typography sx={{ fontFamily: FONTS.ROBOTO }}>Roboto</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeFontFamily(FONTS.OPEN_SANS)}>
          <Typography sx={{ fontFamily: FONTS.OPEN_SANS }}>Open Sans</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeFontFamily(FONTS.MONTSERRAT)}>
          <Typography sx={{ fontFamily: FONTS.MONTSERRAT }}>Montserrat</Typography>
        </MenuItem>
        <MenuItem onClick={() => changeFontFamily(FONTS.RALEWAY)}>
          <Typography sx={{ fontFamily: FONTS.RALEWAY }}>Raleway</Typography>
        </MenuItem>
      </Menu>

      {/* Export menu */}
      <Menu
        anchorEl={exportMenu}
        open={Boolean(exportMenu)}
        onClose={handleExportMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={downloadPDF} disabled={loading}>
          <ListItemIcon>
            {loading ? <CircularProgress size={20} /> : <PdfIcon />}
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={printResume}>
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumePreview;
