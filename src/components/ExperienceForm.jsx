import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Tooltip,
  IconButton,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  Stack, // Stack wasn't used but keeping imports consistent if needed later
  Avatar, // Added for consistency
  InputAdornment // Added for consistency
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  WorkOutline as WorkIcon, // Using outline version for input fields
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  Notes as NotesIcon // Icon for responsibilities
} from '@mui/icons-material';
import { Zoom } from '@mui/material'; // Added Zoom for consistency

// Default structure for a single experience entry
const defaultExperienceEntry = {
  id: 1,
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  responsibilities: [''] // Start with one empty responsibility
};

const ExperienceForm = ({ data, updateData, nextStep, prevStep }) => {
  // Initialize state with the default entry structure
  const [experiences, setExperiences] = useState([defaultExperienceEntry]);

  useEffect(() => {
    // Sync with data prop from App.js (which gets it from Firebase)
    if (data && data.length > 0) {
      // Ensure responsibilities is always an array
      const sanitizedData = data.map(exp => ({
        ...exp,
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : ['']
      }));
      setExperiences(sanitizedData);
    } else if (data && data.length === 0) {
      // If Firebase returns an empty array, reset to the default single entry state.
      setExperiences([defaultExperienceEntry]);
    }
    // If data is initially undefined/null, keep the default state.
  }, [data]); // Dependency array is correct

  const handleChange = (id, field, value) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleResponsibilityChange = (expId, index, value) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp => {
        if (exp.id === expId) {
          // Ensure responsibilities exist and is an array
          const currentResponsibilities = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
          const updatedResponsibilities = [...currentResponsibilities];
          updatedResponsibilities[index] = value;
          return { ...exp, responsibilities: updatedResponsibilities };
        }
        return exp;
      })
    );
  };

  const addResponsibility = (expId) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp => {
        if (exp.id === expId) {
           const currentResponsibilities = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
          return {
            ...exp,
            responsibilities: [...currentResponsibilities, ''] // Add a new empty string
          };
        }
        return exp;
      })
    );
  };

  const removeResponsibility = (expId, index) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp => {
        if (exp.id === expId) {
           const currentResponsibilities = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
           // Only remove if there's more than one responsibility
          if (currentResponsibilities.length > 1) {
            const updatedResponsibilities = [...currentResponsibilities];
            updatedResponsibilities.splice(index, 1);
            return { ...exp, responsibilities: updatedResponsibilities };
          }
        }
        return exp;
      })
    );
  };

  const addExperience = () => {
    // Ensure unique IDs
    const newId = experiences.length > 0 ? Math.max(0, ...experiences.map(exp => exp.id)) + 1 : 1;
    setExperiences(prevExperiences => [
      ...prevExperiences,
      {
        // Use default structure for new entries
        ...defaultExperienceEntry,
        id: newId,
        responsibilities: [''] // Ensure new entry has the responsibility array
      }
    ]);
  };

  const removeExperience = (id) => {
     setExperiences(prevExperiences => {
      const updatedExperiences = prevExperiences.filter(exp => exp.id !== id);
      // If removing the last item, add back a default blank entry
      if (updatedExperiences.length === 0) {
        return [defaultExperienceEntry];
      }
      return updatedExperiences;
    });
  };

  const handleCurrentJobChange = (id, checked) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp =>
        exp.id === id ? { ...exp, current: checked, endDate: checked ? '' : exp.endDate } : exp
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out potentially empty default entries before saving if needed
     const dataToSave = experiences.filter(exp =>
         !(exp.id === 1 && !exp.company && !exp.position && !exp.location && !exp.startDate && !exp.endDate && !exp.current && exp.responsibilities.length === 1 && !exp.responsibilities[0])
    );
    updateData(dataToSave); // Pass the current state up to App.js
    nextStep();
  };

  // --- JSX Rendering ---
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
         <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
            <WorkIcon />
          </Avatar>
          <Typography variant="h5" component="h2">Work Experience</Typography>
          {/* Optional: Add completion chip here if desired */}
      </Box>

      <form onSubmit={handleSubmit}>
         {/* Ensure experiences is an array before mapping */}
        {Array.isArray(experiences) && experiences.map((experience, index) => (
          <Zoom in key={experience.id || index} style={{ transitionDelay: `${index * 50}ms` }}>
            <Paper
              elevation={2} // Use consistent elevation
              sx={{
                p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, position: 'relative',
                border: '1px solid', borderColor: 'divider', // Use theme divider
              }}
            >
              {/* Badge */}
              <Box sx={{
                    position: 'absolute', top: -15, left: 20, bgcolor: 'primary.main',
                    color: 'primary.contrastText', py: 0.5, px: 2, borderRadius: 5, boxShadow: 1
                }}>
                    <Typography variant="body2" fontWeight="medium">
                    Experience #{index + 1}
                    </Typography>
                </Box>

                {/* Remove Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: -1, mr: -1 }}>
                    {experiences.length > 1 && (
                    <Tooltip title="Remove this experience entry">
                        <IconButton
                        color="error"
                        onClick={() => removeExperience(experience.id)}
                        size="small"
                        >
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    )}
                </Box>

              {/* Form Grid */}
              <Grid container spacing={3}>
                {/* Company */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth required id={`company-${experience.id}`} label="Company"
                    value={experience.company || ''}
                    onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                    placeholder="Company Name" variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Position */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth required id={`position-${experience.id}`} label="Position"
                    value={experience.position || ''}
                    onChange={(e) => handleChange(experience.id, 'position', e.target.value)}
                    placeholder="Job Title" variant="outlined"
                     InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Location */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth id={`location-${experience.id}`} label="Location"
                    value={experience.location || ''}
                    onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
                    placeholder="City, State/Country" variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LocationIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Start Date */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth required id={`startDate-${experience.id}`} label="Start Date" type="month"
                    value={experience.startDate || ''}
                    onChange={(e) => handleChange(experience.id, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }} variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Current Job Checkbox & End Date */}
                <Grid item xs={12} container spacing={3} alignItems="center">
                     <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                checked={!!experience.current} // Ensure boolean value
                                onChange={(e) => handleCurrentJobChange(experience.id, e.target.checked)}
                                name={`current-${experience.id}`}
                                color="primary"
                                />
                            }
                            label="I currently work here"
                            />
                     </Grid>
                    {!experience.current && (
                        <Grid item xs={12} sm={6}>
                        <TextField fullWidth id={`endDate-${experience.id}`} label="End Date" type="month"
                            value={experience.endDate || ''}
                            onChange={(e) => handleChange(experience.id, 'endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }} variant="outlined"
                            InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarIcon color="action"/></InputAdornment>)}}
                            />
                        </Grid>
                    )}
                </Grid>

                {/* Responsibilities */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                     <NotesIcon color="action" sx={{ mr: 1 }}/> Responsibilities & Achievements
                  </Typography>
                  {/* Ensure responsibilities is an array */}
                  {Array.isArray(experience.responsibilities) && experience.responsibilities.map((resp, respIndex) => (
                    <Box key={respIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <TextField fullWidth value={resp || ''}
                        onChange={(e) => handleResponsibilityChange(experience.id, respIndex, e.target.value)}
                        placeholder={`Responsibility or achievement #${respIndex + 1}`}
                        variant="outlined" size="small" multiline
                      />
                      <Tooltip title="Remove responsibility">
                         {/* Disable remove button if only one responsibility exists */}
                         <span> {/* Wrap IconButton in span for Tooltip when disabled */}
                            <IconButton color="error" size="small"
                                onClick={() => removeResponsibility(experience.id, respIndex)}
                                disabled={experience.responsibilities.length <= 1}
                                sx={{ ml: 1 }}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                         </span>
                      </Tooltip>
                    </Box>
                  ))}
                  <Button startIcon={<AddIcon />} onClick={() => addResponsibility(experience.id)}
                    size="small" sx={{ mt: 1 }}
                  >
                    Add Responsibility
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        {/* Add Experience Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button startIcon={<AddIcon />} onClick={addExperience} variant="outlined" color="primary"
             sx={{
              borderRadius: 30, px: 3, py: 1, borderStyle: 'dashed', borderWidth: 2,
              '&:hover': { transform: 'none', boxShadow: 'none', background: 'rgba(147, 112, 219, 0.04)' }
            }}
          >
            Add Another Experience
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={prevStep} startIcon={<ArrowBackIcon />} size="large">
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary" endIcon={<ArrowForwardIcon />} size="large">
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ExperienceForm;