// ResumePreview.js
import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, useTheme, useMediaQuery, SpeedDial, SpeedDialAction, SpeedDialIcon, Snackbar, Alert } from "@mui/material";
import { Download, FormatColorFill, TextFormat, Print } from "@mui/icons-material";

// Import smaller components
import { TemplateSelector } from "./Templates/TemplateSelector";
import { ResumeToolbar } from "./Templates/ResumeToolbar";
import { ExportMenu } from "./Templates/ExportMenu";
import { ColorMenu } from "./Templates/ColorMenu";
import { FontMenu } from "./Templates/FontMenu";
import { ModernTemplate } from "./Templates/ModernTemplate";
import { MinimalTemplate } from "./Templates/MinimalTemplate";
import { CreativeTemplate } from "./Templates/CreativeTemplate";
import { ProfessionalTemplate } from "./Templates/ProfessionalTemplate";
import { PDFGenerator } from "./Templates/PDFGenerator";
import { constants } from "./Templates/constants";
import { injectPrintStyles } from "./utils/pdfUtils";

// Extract the constant values
const { TEMPLATES, FONTS, COLOR_SCHEMES } = constants;

const ResumePreview = ({ resumeData, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const resumeRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES.MODERN);
  const [fontFamily, setFontFamily] = useState(FONTS.POPPINS);
  const [colorScheme, setColorScheme] = useState(COLOR_SCHEMES.BLUE);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [colorMenu, setColorMenu] = useState(null);
  const [fontMenu, setFontMenu] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [starredSections, setStarredSections] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = [],
  } = resumeData;

  // Add print styles to the document when component mounts
  useEffect(() => {
    const cleanup = injectPrintStyles();
    return cleanup;
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleTemplateChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
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

  const toggleStarSection = (section) => {
    if (starredSections.includes(section)) {
      setStarredSections(starredSections.filter((s) => s !== section));
    } else {
      setStarredSections([...starredSections, section]);
    }
  };

  const handleColorMenuOpen = (event) => {
    setColorMenu(event.currentTarget);
  };

  const handleColorMenuClose = () => {
    setColorMenu(null);
  };

  const handleFontMenuOpen = (event) => {
    setFontMenu(event.currentTarget);
  };

  const handleFontMenuClose = () => {
    setFontMenu(null);
  };

  const handleExportMenuOpen = (event) => {
    setExportMenu(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenu(null);
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    handleColorMenuClose();
  };

  const changeFontFamily = (font) => {
    setFontFamily(font);
    handleFontMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const isSectionEmpty = (section) => {
    switch (section) {
      case "personalInfo":
        return !personalInfo || Object.keys(personalInfo).length === 0;
      case "education":
        return !education || education.length === 0;
      case "experience":
        return !experience || experience.length === 0;
      case "skills":
        return !skills || skills.length === 0;
      case "projects":
        return !projects || projects.length === 0;
      default:
        return true;
    }
  };

  // Setup PDF generator component with enhanced PDF generation
  const pdfGenerator = PDFGenerator({
    resumeRef,
    loading,
    setLoading,
    personalInfo,
    onSuccess: (message) => {
      setSnackbar({
        open: true,
        message: message,
        severity: "success",
      });
      handleExportMenuClose();
    },
    onError: (message) => {
      setSnackbar({
        open: true,
        message: message,
        severity: "error",
      });
    }
  });

  // Improved PDF download function that uses our enhanced PDF generator
  const downloadPDF = () => {
    pdfGenerator.downloadPDF();
  };

  const printResume = () => {
    window.print();
    handleExportMenuClose();
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTemplate = () => {
    const commonProps = {
      resumeData,
      formatDate,
      colorScheme,
      fontFamily,
      isSectionEmpty,
      toggleStarSection,
      starredSections,
      getInitials
    };

    switch (activeTemplate) {
      case TEMPLATES.MODERN:
        return <ModernTemplate {...commonProps} />;
      case TEMPLATES.MINIMAL:
        return <MinimalTemplate {...commonProps} />;
      case TEMPLATES.CREATIVE:
        return <CreativeTemplate {...commonProps} />;
      case TEMPLATES.PROFESSIONAL:
        return <ProfessionalTemplate {...commonProps} />;
      default:
        return <ModernTemplate {...commonProps} />;
    }
  };

  const speedDialActions = [
    { icon: <Download />, name: "Download PDF", action: downloadPDF },
    { icon: <Print />, name: "Print", action: printResume },
    { icon: <FormatColorFill />, name: "Change Colors", action: handleColorMenuOpen },
    { icon: <TextFormat />, name: "Change Font", action: handleFontMenuOpen },
  ];

  return (
    <Box sx={{ position: "relative", pb: 6 }}>
      <ResumeToolbar
        onBack={onBack}
        isMobile={isMobile}
        handleColorMenuOpen={handleColorMenuOpen}
        handleFontMenuOpen={handleFontMenuOpen}
        handleExportMenuOpen={handleExportMenuOpen}
      />

      <Paper
        elevation={3}
        sx={{
          p: 0,
          borderRadius: 2,
          mb: 4,
          overflow: "hidden",
        }}
      >
        <TemplateSelector
          activeTab={activeTab}
          handleTemplateChange={handleTemplateChange}
          isMobile={isMobile}
        />

        <Box
          sx={{
            maxHeight: "800px",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: colorScheme.primary,
              borderRadius: "4px",
            },
          }}
        >
          <Box
            ref={resumeRef}
            className="resume-content resume-container"
            sx={{
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
              colorAdjust: 'exact'
            }}
            data-pdf-container="true"
          >
            {renderTemplate()}
          </Box>
        </Box>
      </Paper>

      {isMobile && (
        <SpeedDial
          ariaLabel="Resume actions"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
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

      <ColorMenu
        colorMenu={colorMenu}
        handleColorMenuClose={handleColorMenuClose}
        changeColorScheme={changeColorScheme}
        COLOR_SCHEMES={COLOR_SCHEMES}
      />

      <FontMenu
        fontMenu={fontMenu}
        handleFontMenuClose={handleFontMenuClose}
        changeFontFamily={changeFontFamily}
        FONTS={FONTS}
      />

      <ExportMenu
        exportMenu={exportMenu}
        handleExportMenuClose={handleExportMenuClose}
        downloadPDF={downloadPDF}
        printResume={printResume}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default ResumePreview;