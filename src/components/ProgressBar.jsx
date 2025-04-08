import React from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  StepConnector, 
  styled,
  Box 
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon
} from '@mui/icons-material';

// Custom connector with gradient
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: 'linear-gradient(95deg, #9370DB 0%, #7B68EE 50%, #9370DB 100%)',
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: 'linear-gradient(95deg, #9370DB 0%, #7B68EE 50%, #9370DB 100%)',
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 1,
  },
}));

// Custom step icon
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.grey[200],
  zIndex: 1,
  color: theme.palette.text.secondary,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(136deg, #9370DB 0%, #7B68EE 100%)',
    boxShadow: '0 4px 10px 0 rgba(123, 104, 238, 0.3)',
    color: '#fff',
    transform: 'scale(1.1)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(136deg, #9370DB 0%, #7B68EE 100%)',
    color: '#fff',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <PersonIcon />,
    2: <SchoolIcon />,
    3: <WorkIcon />,
    4: <PsychologyIcon />,
    5: <CodeIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    'Personal Info',
    'Education',
    'Experience',
    'Skills',
    'Projects'
  ];

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper 
        alternativeLabel 
        activeStep={currentStep - 1} 
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;