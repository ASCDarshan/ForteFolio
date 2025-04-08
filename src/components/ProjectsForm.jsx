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
  Checkbox,
  FormControlLabel,
  Avatar,        // Added for consistency
  InputAdornment // Added for consistency
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Code as CodeIcon,          // Icon for header/fields
  Link as LinkIcon,          // Icon for link field
  Build as BuildIcon,        // Icon for technologies
  CalendarMonth as CalendarIcon, // Icon for dates
  Notes as NotesIcon         // Icon for description
} from '@mui/icons-material';
import { Zoom, Tooltip } from '@mui/material'; // Added Zoom and Tooltip

// Default structure for a single project entry
const defaultProjectEntry = {
  id: 1,
  title: '',
  link: '',
  description: '',
  technologies: '',
  startDate: '',
  endDate: '',
  current: false
};

const ProjectsForm = ({ data, updateData, nextStep, prevStep }) => {
  // Initialize state with the default entry structure
  const [projects, setProjects] = useState([defaultProjectEntry]);

  useEffect(() => {
    // Sync with data prop from App.js (which gets it from Firebase)
    if (data && data.length > 0) {
      setProjects(data);
    } else if (data && data.length === 0) {
      // If Firebase returns an empty array, reset to the default single entry state.
      setProjects([defaultProjectEntry]);
    }
    // If data is initially undefined/null, keep the default state.
  }, [data]); // Dependency array is correct

  const handleChange = (id, field, value) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleCurrentProjectChange = (id, checked) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id ? { ...project, current: checked, endDate: checked ? '' : project.endDate } : project
      )
    );
  };

  const addProject = () => {
    // Ensure unique IDs
    const newId = projects.length > 0 ? Math.max(0, ...projects.map(project => project.id)) + 1 : 1;
    setProjects(prevProjects => [
      ...prevProjects,
      {
        // Use default structure for new entries
        ...defaultProjectEntry,
        id: newId,
      }
    ]);
  };

  const removeProject = (id) => {
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.filter(project => project.id !== id);
      // If removing the last item, add back a default blank entry
      if (updatedProjects.length === 0) {
        return [defaultProjectEntry];
      }
      return updatedProjects;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out potentially empty default entries before saving if needed
    const dataToSave = projects.filter(proj =>
         !(proj.id === 1 && !proj.title && !proj.link && !proj.description && !proj.technologies && !proj.startDate && !proj.endDate && !proj.current)
    );
    updateData(dataToSave); // Pass the current state up to App.js
    nextStep(); // Proceed to the next step (which should be Preview)
  };

  // --- JSX Rendering ---
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
         <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
            <CodeIcon />
          </Avatar>
          <Typography variant="h5" component="h2">Projects</Typography>
          {/* Optional: Add completion chip here if desired */}
      </Box>

      <form onSubmit={handleSubmit}>
         {/* Ensure projects is an array before mapping */}
        {Array.isArray(projects) && projects.map((project, index) => (
          <Zoom in key={project.id || index} style={{ transitionDelay: `${index * 50}ms` }}>
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
                      Project #{index + 1}
                    </Typography>
                </Box>

                 {/* Remove Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: -1, mr: -1 }}>
                    {projects.length > 1 && (
                    <Tooltip title="Remove this project entry">
                        <IconButton
                        color="error"
                        onClick={() => removeProject(project.id)}
                        size="small"
                        >
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    )}
                </Box>

              {/* Form Grid */}
              <Grid container spacing={3}>
                {/* Project Title */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth required id={`title-${project.id}`} label="Project Title"
                    value={project.title || ''}
                    onChange={(e) => handleChange(project.id, 'title', e.target.value)}
                    placeholder="My Awesome Project" variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><CodeIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Project Link */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth id={`link-${project.id}`} label="Project Link (Optional)"
                    value={project.link || ''}
                    onChange={(e) => handleChange(project.id, 'link', e.target.value)}
                    placeholder="https://github.com/user/repo or https://live-demo.com" variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LinkIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Technologies */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth id={`technologies-${project.id}`} label="Technologies Used (Optional)"
                    value={project.technologies || ''}
                    onChange={(e) => handleChange(project.id, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, Firebase, CSS" variant="outlined"
                     InputProps={{ startAdornment: (<InputAdornment position="start"><BuildIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Start Date */}
                <Grid item xs={12} md={6}>
                   <TextField fullWidth id={`startDate-${project.id}`} label="Start Date (Optional)" type="month"
                    value={project.startDate || ''}
                    onChange={(e) => handleChange(project.id, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }} variant="outlined"
                    InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarIcon color="action"/></InputAdornment>)}}
                    />
                </Grid>
                {/* Current Project Checkbox & End Date */}
                 <Grid item xs={12} container spacing={3} alignItems="center">
                     <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                checked={!!project.current} // Ensure boolean
                                onChange={(e) => handleCurrentProjectChange(project.id, e.target.checked)}
                                name={`current-${project.id}`}
                                color="primary"
                                />
                            }
                            label="This is an ongoing project"
                            />
                     </Grid>
                     {/* End Date (only show if not current) */}
                    {!project.current && (
                         <Grid item xs={12} sm={6}>
                            <TextField fullWidth id={`endDate-${project.id}`} label="End Date (Optional)" type="month"
                                value={project.endDate || ''}
                                onChange={(e) => handleChange(project.id, 'endDate', e.target.value)}
                                InputLabelProps={{ shrink: true }} variant="outlined"
                                InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarIcon color="action"/></InputAdornment>)}}
                                />
                         </Grid>
                    )}
                </Grid>
                {/* Project Description */}
                <Grid item xs={12}>
                   <TextField fullWidth id={`description-${project.id}`} label="Project Description (Optional)"
                    value={project.description || ''}
                    onChange={(e) => handleChange(project.id, 'description', e.target.value)}
                    placeholder="Describe the project, its purpose, key features, and your contributions."
                    variant="outlined" multiline rows={4}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: -4, mr: 1, alignSelf: 'flex-start' }}>
                            <NotesIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    />
                </Grid>
              </Grid>
            </Paper>
          </Zoom>
        ))}

        {/* Add Project Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button startIcon={<AddIcon />} onClick={addProject} variant="outlined" color="primary"
             sx={{
              borderRadius: 30, px: 3, py: 1, borderStyle: 'dashed', borderWidth: 2,
              '&:hover': { transform: 'none', boxShadow: 'none', background: 'rgba(147, 112, 219, 0.04)' }
            }}
          >
            Add Another Project
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={prevStep} startIcon={<ArrowBackIcon />} size="large">
            Back
          </Button>
          {/* This is the last step before preview */}
          <Button type="submit" variant="contained" color="primary" endIcon={<ArrowForwardIcon />} size="large">
            Go to Preview
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProjectsForm;