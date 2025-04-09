// Templates/PDFGenerator.js
import React, { useEffect } from 'react';
import { generateResumePDF, generateSimplePDF } from '../utils/DirectPDFExport';

export const PDFGenerator = ({
  resumeRef,
  loading,
  setLoading,
  personalInfo,
  onSuccess,
  onError
}) => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }
        
        .resume-container {
          width: 100% !important;
          max-width: 210mm !important;
          height: auto !important;
          overflow: visible !important;
          page-break-inside: avoid !important;
        }
      }
    `;
    styleElement.id = 'pdf-print-styles';
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById('pdf-print-styles');
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, []);

  const downloadPDF = async () => {
    if (!resumeRef.current) {
      onError("Resume reference not found. Please try again.");
      return;
    }

    setLoading(true);
    console.log("Starting PDF generation process...");

    try {
      await generateResumePDF(
        resumeRef.current,
        `${personalInfo.fullName || "Resume"}.pdf`
      );

      setLoading(false);
      onSuccess("Resume downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);

      try {
        await generateSimplePDF(
          resumeRef.current,
          `${personalInfo.fullName || "Resume"}.pdf`
        );

        setLoading(false);
        onSuccess("A simplified version of your resume was downloaded. For better quality, try using the Print option.");
      } catch (fallbackError) {
        setLoading(false);
        onError("Could not generate PDF. Try using Print instead.");

        setTimeout(() => {
          if (window.confirm("PDF generation failed. Would you like to try printing instead?")) {
            window.print();
          }
        }, 500);
      }
    }
  };

  return {
    downloadPDF,
    loading
  };
};

export default PDFGenerator;