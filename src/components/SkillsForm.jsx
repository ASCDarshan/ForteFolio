import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Grid, // Keep Grid if layout needs it later
  Button,
  Box,
  IconButton,
  Divider,
  Paper,
  Avatar,        // Added for consistency
  InputAdornment // Added for consistency
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Psychology as PsychologyIcon, // Icon for header
  Category as CategoryIcon, // Icon for category name
  CheckCircleOutline as SkillIcon // Icon for individual skill
} from '@mui/icons-material';
import { Zoom, Tooltip } from '@mui/material'; // Added Zoom and Tooltip

// Default structure for skill categories
const defaultSkillCategories = [
  {
    id: 1,
    name: 'Technical Skills',
    skills: [''] // Start with one empty skill slot
  },
  {
    id: 2,
    name: 'Soft Skills',
    skills: [''] // Start with one empty skill slot
  }
];

const SkillsForm = ({ data, updateData, nextStep, prevStep }) => {
  // Initialize state with the default structure
  const [skillCategories, setSkillCategories] = useState(defaultSkillCategories);

  useEffect(() => {
    // Sync with data prop from App.js (which gets it from Firebase)
    if (data && data.length > 0) {
       // Ensure each category has a 'skills' array
       const sanitizedData = data.map(cat => ({
        ...cat,
        skills: Array.isArray(cat.skills) ? cat.skills : ['']
       }));
      setSkillCategories(sanitizedData);
    } else if (data && data.length === 0) {
      // If Firebase returns an empty array, reset to default categories.
      setSkillCategories(defaultSkillCategories);
    }
    // If data is initially undefined/null, keep the default state.
  }, [data]); // Dependency array is correct

  const handleCategoryNameChange = (id, name) => {
    setSkillCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id ? { ...category, name: name } : category
      )
    );
  };

  const handleSkillChange = (categoryId, index, value) => {
    setSkillCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
           // Ensure skills exists and is an array
           const currentSkills = Array.isArray(category.skills) ? category.skills : [];
          const updatedSkills = [...currentSkills];
          updatedSkills[index] = value;
          return { ...category, skills: updatedSkills };
        }
        return category;
      })
    );
  };

  const addSkill = (categoryId) => {
    setSkillCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
           const currentSkills = Array.isArray(category.skills) ? category.skills : [];
          return {
            ...category,
            skills: [...currentSkills, ''] // Add a new empty string
          };
        }
        return category;
      })
    );
  };

  const removeSkill = (categoryId, index) => {
    setSkillCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
           const currentSkills = Array.isArray(category.skills) ? category.skills : [];
           // Only remove if there's more than one skill
          if (currentSkills.length > 1) {
            const updatedSkills = [...currentSkills];
            updatedSkills.splice(index, 1);
            return { ...category, skills: updatedSkills };
          } else {
             // If removing the last skill, leave one empty skill string
             return { ...category, skills: [''] };
          }
        }
        return category;
      })
    );
  };

  const addCategory = () => {
    // Ensure unique IDs
    const newId = skillCategories.length > 0
      ? Math.max(0, ...skillCategories.map(category => category.id)) + 1
      : 1;

    setSkillCategories(prevCategories => [
      ...prevCategories,
      {
        id: newId,
        name: `New Category ${newId}`, // Default name
        skills: [''] // Start with one empty skill
      }
    ]);
  };

  const removeCategory = (id) => {
     setSkillCategories(prevCategories => {
        // Prevent removing the last category
        if(prevCategories.length <= 1) return prevCategories;

        const updatedCategories = prevCategories.filter(category => category.id !== id);
        return updatedCategories;
     });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out categories with no name AND only empty skills
    // Also filter out empty skills within categories
    const filteredData = skillCategories
      .map(category => ({
        ...category,
        // Ensure name is not empty, default if needed
        name: category.name && category.name.trim() ? category.name.trim() : `Category ${category.id}`,
        // Filter out empty/whitespace-only skills
        skills: Array.isArray(category.skills) ? category.skills.map(s => s.trim()).filter(skill => skill !== '') : []
      }))
      // Keep category only if it has a name and at least one skill after filtering
      .filter(category => category.name && category.skills.length > 0);

    updateData(filteredData); // Pass the cleaned state up to App.js
    nextStep();
  };

  // --- JSX Rendering ---
  return (
    <Box>
      {/* Header */}
       <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
         <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2 }}>
            <PsychologyIcon />
          </Avatar>
          <Typography variant="h5" component="h2">Skills</Typography>
           {/* Optional: Add completion chip here if desired */}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
        List your relevant skills, grouping them into categories (e.g., Programming Languages, Tools, Soft Skills).
      </Typography>

      <form onSubmit={handleSubmit}>
         {/* Ensure skillCategories is an array before mapping */}
        {Array.isArray(skillCategories) && skillCategories.map((category, categoryIndex) => (
          <Zoom in key={category.id || categoryIndex} style={{ transitionDelay: `${categoryIndex * 50}ms` }}>
            <Paper
              elevation={2} // Use consistent elevation
              sx={{
                p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, position: 'relative',
                border: '1px solid', borderColor: 'divider', // Use theme divider
              }}
            >
              {/* Category Name & Remove Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField label="Skill Category Name" required
                  value={category.name || ''}
                  onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                  variant="outlined" size="small"
                  sx={{ flexGrow: 1, mr: 1 }}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><CategoryIcon color="action"/></InputAdornment>)}}
                />
                 <Tooltip title="Remove this category">
                    {/* Disable remove button if only one category exists */}
                    <span> {/* Wrap IconButton in span for Tooltip when disabled */}
                        <IconButton
                        color="error"
                        onClick={() => removeCategory(category.id)}
                        size="small"
                        disabled={skillCategories.length <= 1}
                        >
                        <DeleteIcon fontSize="small" />
                        </IconButton>
                    </span>
                 </Tooltip>
              </Box>

              {/* Skills List */}
               {/* Ensure skills is an array */}
              {Array.isArray(category.skills) && category.skills.map((skill, skillIndex) => (
                <Box key={skillIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, pl: 1 }}>
                   <SkillIcon color="action" sx={{ mr: 1.5, fontSize: '1.2rem' }} /> {/* Icon for skill item */}
                   <TextField fullWidth value={skill || ''}
                    onChange={(e) => handleSkillChange(category.id, skillIndex, e.target.value)}
                    placeholder={`Enter skill #${skillIndex + 1}`} variant="standard" // Use standard variant for list feel
                    size="small" sx={{mr: 1}}
                  />
                   <Tooltip title="Remove skill">
                      {/* Disable remove button if only one skill exists */}
                     <span> {/* Wrap IconButton in span for Tooltip when disabled */}
                        <IconButton color="error" size="small"
                            onClick={() => removeSkill(category.id, skillIndex)}
                            // Allow removing the last skill, which leaves an empty string field
                            // disabled={category.skills.length <= 1}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                     </span>
                  </Tooltip>
                </Box>
              ))}
              {/* Add Skill Button */}
              <Button startIcon={<AddIcon />} onClick={() => addSkill(category.id)}
                size="small" sx={{ mt: 2, ml: 1 }}
              >
                Add Skill to Category
              </Button>
            </Paper>
          </Zoom>
        ))}

        {/* Add Category Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 4 }}>
          <Button startIcon={<AddIcon />} onClick={addCategory} variant="outlined" color="primary"
             sx={{
              borderRadius: 30, px: 3, py: 1, borderStyle: 'dashed', borderWidth: 2,
              '&:hover': { transform: 'none', boxShadow: 'none', background: 'rgba(147, 112, 219, 0.04)' }
            }}
          >
            Add Skill Category
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

export default SkillsForm;