import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  IconButton,
  Divider,
  Paper,
  Avatar,
  InputAdornment,
  Chip,
  Tooltip,
  Alert,
  Card,
  CardContent,
  Stack,
  Fade,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  BookmarkBorder as DegreeIcon,
  Psychology as FieldIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Degree suggestions (keep as is)
const degreeSuggestions = [ /* ... */ ];

// Field of study suggestions (keep as is)
const fieldSuggestions = [ /* ... */ ];

const defaultEducationEntry = {
  id: 1,
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  location: '',
  description: ''
};

const EducationForm = ({ data, updateData, nextStep, prevStep }) => {
  // Initialize with a default entry structure
  const [educations, setEducations] = useState([defaultEducationEntry]);

  const [showDegreeSuggestions, setShowDegreeSuggestions] = useState(null);
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(null);
  const [formComplete, setFormComplete] = useState(0);

  useEffect(() => {
    // Sync with data prop from App.js (which gets it from Firebase)
    if (data && data.length > 0) {
      setEducations(data);
    } else if (data && data.length === 0) {
      // If Firebase returns an empty array (e.g., user deleted all entries),
      // reset to the default single entry state.
      setEducations([defaultEducationEntry]);
    }
    // If data is initially undefined/null, keep the default state.
  }, [data]); // Dependency array is correct

  useEffect(() => {
    // Calculate form completion percentage (no changes needed)
    const requiredFields = ['institution', 'degree', 'startDate'];
    let completed = 0;
    let total = 0; // Initialize total
    // Ensure educations is always an array before iterating
    if(Array.isArray(educations)) {
        educations.forEach(edu => {
            // Ensure edu is an object before accessing fields
            if (typeof edu === 'object' && edu !== null) {
                total += requiredFields.length;
                requiredFields.forEach(field => {
                    if (edu[field] && String(edu[field]).trim() !== '') {
                        completed++;
                    }
                });
            }
        });
    }
    // Prevent division by zero if total is 0
    setFormComplete(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [educations]);

  const handleChange = (id, field, value) => {
    setEducations(prevEducations =>
      prevEducations.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const addEducation = () => {
    // Ensure unique IDs, even if items were deleted and re-added
    const newId = educations.length > 0 ? Math.max(0, ...educations.map(edu => edu.id)) + 1 : 1;
    setEducations(prevEducations => [
      ...prevEducations,
      {
        // Use default structure for new entries
        ...defaultEducationEntry,
        id: newId,
      }
    ]);
  };

  const removeEducation = (id) => {
    setEducations(prevEducations => {
      const updatedEducations = prevEducations.filter(edu => edu.id !== id);
      // If removing the last item, add back a default blank entry
      if (updatedEducations.length === 0) {
        return [defaultEducationEntry];
      }
      return updatedEducations;
    });
  };

  const selectDegreeSuggestion = (eduId, degree) => {
    handleChange(eduId, 'degree', degree);
    setShowDegreeSuggestions(null);
  };

  const selectFieldSuggestion = (eduId, field) => {
    handleChange(eduId, 'field', field);
    setShowFieldSuggestions(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out any completely empty default entries before saving if desired,
    // or let App.js handle saving whatever is in the state.
    // Example: Filter entries that are just the default template AND empty
    const dataToSave = educations.filter(edu =>
         !(edu.id === 1 && !edu.institution && !edu.degree && !edu.field && !edu.startDate && !edu.endDate && !edu.location && !edu.description)
    );
    updateData(dataToSave); // Pass the current state up to App.js
    nextStep();
  };

  // --- JSX Rendering (No changes needed from your original code) ---
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
            <SchoolIcon />
          </Avatar>
          <Typography variant="h5" component="h2">Education</Typography>
        </Box>
        <Chip
          label={`${formComplete}% Complete`}
          color={formComplete === 100 ? "success" : "primary"}
          variant={formComplete === 100 ? "filled" : "outlined"}
          icon={formComplete === 100 ? <CheckCircleIcon /> : undefined}
        />
      </Box>

      {/* Initial Info Alert */}
      {educations.length === 1 && !educations[0].institution && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3, borderRadius: 2 }}>
          Add your educational background to showcase your academic qualifications
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Ensure educations is an array before mapping */}
        {Array.isArray(educations) && educations.map((education, index) => (
          <Zoom in key={education.id || index} style={{ transitionDelay: `${index * 50}ms` }}>
            <Paper
              elevation={2} // Adjusted elevation for consistency
              sx={{
                p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, position: 'relative',
                overflow: 'visible', border: '1px solid', borderColor: 'divider', // Use theme divider color
                transition: 'box-shadow 0.3s ease'
              }}
            >
              {/* Badge */}
              <Box sx={{
                position: 'absolute', top: -15, left: 20, bgcolor: 'primary.main',
                color: 'primary.contrastText', py: 0.5, px: 2, borderRadius: 5, boxShadow: 1
              }}>
                <Typography variant="body2" fontWeight="medium">
                  {index === 0 ? 'Most Recent Education' : `Education #${index + 1}`}
                </Typography>
              </Box>

              {/* Remove Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: -1, mr: -1 }}>
                 {/* Only show remove button if there's more than one entry */}
                {educations.length > 1 && (
                  <Tooltip title="Remove this education entry">
                    <IconButton
                      color="error"
                      onClick={() => removeEducation(education.id)}
                      size="small"
                      sx={{ /* Optional: Refine styling if needed */ }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Form Grid */}
              <Grid container spacing={3}>
                {/* Institution */}
                <Grid item xs={12}>
                  <TextField fullWidth required id={`institution-${education.id}`} label="Institution"
                    value={education.institution || ''}
                    onChange={(e) => handleChange(education.id, 'institution', e.target.value)}
                    placeholder="University or School Name" variant="outlined"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><SchoolIcon color="action" /></InputAdornment>),
                    }} />
                </Grid>
                {/* Degree */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth required id={`degree-${education.id}`} label="Degree"
                    value={education.degree || ''}
                    onChange={(e) => handleChange(education.id, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science" variant="outlined"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><DegreeIcon color="action" /></InputAdornment>),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="View degree suggestions">
                            <IconButton onClick={() => setShowDegreeSuggestions(education.id === showDegreeSuggestions ? null : education.id)} edge="end" size="small">
                              <InfoIcon color={showDegreeSuggestions === education.id ? "primary" : "action"} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }} />
                  {showDegreeSuggestions === education.id && (
                    <Fade in>
                      {/* Suggestions Card... */}
                      <Card variant="outlined" sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                         <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {degreeSuggestions.map((degree, i) => (
                                    <Chip key={i} label={degree} onClick={() => selectDegreeSuggestion(education.id, degree)}
                                        color="primary" variant="outlined" clickable size="small" sx={{ mb: 0.5, mr: 0.5 }}/>
                                ))}
                            </Stack>
                         </CardContent>
                      </Card>
                    </Fade>
                  )}
                </Grid>
                {/* Field of Study */}
                 <Grid item xs={12} md={6}>
                  <TextField fullWidth id={`field-${education.id}`} label="Field of Study"
                    value={education.field || ''}
                    onChange={(e) => handleChange(education.id, 'field', e.target.value)}
                    placeholder="e.g. Computer Science" variant="outlined"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><FieldIcon color="action" /></InputAdornment>),
                       endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="View field suggestions">
                            <IconButton onClick={() => setShowFieldSuggestions(education.id === showFieldSuggestions ? null : education.id)} edge="end" size="small">
                              <InfoIcon color={showFieldSuggestions === education.id ? "primary" : "action"} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }} />
                   {showFieldSuggestions === education.id && (
                    <Fade in>
                       {/* Suggestions Card... */}
                       <Card variant="outlined" sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                         <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {fieldSuggestions.map((field, i) => (
                                    <Chip key={i} label={field} onClick={() => selectFieldSuggestion(education.id, field)}
                                        color="primary" variant="outlined" clickable size="small" sx={{ mb: 0.5, mr: 0.5 }}/>
                                ))}
                            </Stack>
                         </CardContent>
                      </Card>
                    </Fade>
                  )}
                </Grid>
                {/* Location */}
                <Grid item xs={12} md={6}>
                   <TextField fullWidth id={`location-${education.id}`} label="Location"
                    value={education.location || ''}
                    onChange={(e) => handleChange(education.id, 'location', e.target.value)}
                    placeholder="City, State/Country" variant="outlined"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start"><LocationIcon color="action" /></InputAdornment>),
                    }} />
                </Grid>
                {/* Start Date */}
                <Grid item xs={12} md={3}>
                    <TextField fullWidth required id={`startDate-${education.id}`} label="Start Date" type="month"
                        value={education.startDate || ''}
                        onChange={(e) => handleChange(education.id, 'startDate', e.target.value)}
                        InputLabelProps={{ shrink: true }} variant="outlined"
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><CalendarIcon color="action" /></InputAdornment>),
                        }} />
                </Grid>
                {/* End Date */}
                <Grid item xs={12} md={3}>
                     <TextField fullWidth id={`endDate-${education.id}`} label="End Date (or Expected)" type="month"
                        value={education.endDate || ''}
                        onChange={(e) => handleChange(education.id, 'endDate', e.target.value)}
                        InputLabelProps={{ shrink: true }} variant="outlined"
                        InputProps={{
                          startAdornment: (<InputAdornment position="start"><CalendarIcon color="action" /></InputAdornment>),
                        }}/>
                </Grid>
                {/* Description */}
                <Grid item xs={12}>
                     <TextField fullWidth id={`description-${education.id}`} label="Description (Optional)"
                        value={education.description || ''}
                        onChange={(e) => handleChange(education.id, 'description', e.target.value)}
                        placeholder="Notable accomplishments, relevant coursework, thesis, GPA (if high), etc."
                        variant="outlined" multiline rows={3}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ mt: -2, mr: 1, alignSelf: 'flex-start' }}>
                                <DescriptionIcon color="action" />
                            </InputAdornment>
                          ),
                        }} />
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        {/* Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addEducation}
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: 30, // Match theme button style
              px: 3, py: 1, borderStyle: 'dashed', borderWidth: 2,
              // Remove hover effect from default theme if desired for dashed button
              '&:hover': { transform: 'none', boxShadow: 'none', background: 'rgba(147, 112, 219, 0.04)' }
            }}
          >
            Add Another Education
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={prevStep} startIcon={<ArrowBackIcon />} size="large">
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" endIcon={<ArrowForwardIcon />} size="large">
            Continue
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EducationForm;