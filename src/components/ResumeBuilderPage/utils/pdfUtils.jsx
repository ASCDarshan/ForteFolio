// utils/pdfUtils.js
import html2pdf from "html2pdf.js";

/**
 * Enhanced PDF generation function for better output quality and proper rendering
 * 
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {Object} options - Configuration options
 * @returns {Promise} - Promise that resolves when PDF is generated
 */
export const generatePDF = (element, options = {}) => {
  return new Promise((resolve, reject) => {
    // Get user's filename or use default
    const filename = options.filename || "Resume.pdf";
    
    // Create a clone to avoid modifying the original element
    const clone = element.cloneNode(true);
    
    // Apply optimization styles for better PDF rendering
    applyPDFOptimizationStyles(clone);
    
    // Configure PDF generation options
    const pdfOptions = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: filename,
      image: { type: "jpeg", quality: 1.0 }, // Higher quality for better rendering
      html2canvas: { 
        scale: 3, // Higher scale for better resolution
        useCORS: true,
        logging: true,
        letterRendering: true,
        allowTaint: true,
        foreignObjectRendering: true,
        windowWidth: element.scrollWidth + 20,
        windowHeight: element.scrollHeight + 20,
      },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      ...options
    };
    
    // Give the browser a moment to fully render the clone
    setTimeout(() => {
      html2pdf()
        .from(clone)
        .set(pdfOptions)
        .save()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("PDF generation error:", error);
          reject(error);
        });
    }, 500);
  });
};

/**
 * Apply special styles to optimize elements for PDF rendering
 * Particularly important for preserving colors, borders, and backgrounds
 * 
 * @param {HTMLElement} element - The DOM element to style
 * @returns {HTMLElement} - The modified element
 */
export const applyPDFOptimizationStyles = (element) => {
  if (!element) return element;

  // Apply print color settings to root element
  element.style.WebkitPrintColorAdjust = 'exact';
  element.style.printColorAdjust = 'exact';
  element.style.colorAdjust = 'exact';

  // Process all children to ensure backgrounds, colors, and borders are preserved
  processElementsForPDF(element);
  
  // Ensure proper dimensions and layout for PDF format
  element.style.width = '8.5in';
  element.style.margin = '0';
  element.style.padding = '0.5in';
  
  return element;
};

/**
 * Recursively process all elements in the DOM tree to optimize for PDF rendering
 * 
 * @param {HTMLElement} rootElement - The parent element to process
 */
const processElementsForPDF = (rootElement) => {
  const allElements = rootElement.querySelectorAll('*');
  
  allElements.forEach(el => {
    // Apply print color settings to all elements
    el.style.WebkitPrintColorAdjust = 'exact';
    el.style.printColorAdjust = 'exact';
    el.style.colorAdjust = 'exact';
    
    // Get computed styles to preserve exact appearance
    try {
      const computedStyle = window.getComputedStyle(el);
      
      // Special handling for elements that typically have backgrounds/colors
      if (el.classList.contains('MuiChip-root') || 
          el.classList.contains('MuiPaper-root') || 
          el.classList.contains('MuiAvatar-root') ||
          el.tagName === 'BUTTON' ||
          el.classList.contains('MuiIconButton-root')) {
        
        // Apply critical styles inline
        el.style.backgroundColor = computedStyle.backgroundColor;
        el.style.color = computedStyle.color;
        el.style.border = computedStyle.border;
        el.style.boxShadow = 'none'; // Remove shadows for cleaner PDF
      }
      
      // Special handling for dividers and borders
      if (el.classList.contains('MuiDivider-root') || 
          computedStyle.borderBottomWidth !== '0px' ||
          computedStyle.borderTopWidth !== '0px') {
        el.style.borderColor = computedStyle.borderColor;
        el.style.borderWidth = computedStyle.borderWidth;
        el.style.borderStyle = computedStyle.borderStyle;
      }

      // Ensure SVG elements are properly rendered
      if (el.tagName === 'svg') {
        el.style.color = computedStyle.color;
        el.setAttribute('data-pdf-preserve-color', 'true');
      }
      
      // Handle pseudo-elements like ::before and ::after which often contain styling
      if (computedStyle.position === 'relative' || computedStyle.position === 'absolute') {
        el.setAttribute('data-pdf-has-pseudo', 'true');
      }
    } catch (e) {
      console.warn('Error computing style for element', e);
    }
  });
};

/**
 * Generate inline CSS for @media print to be injected into the document
 * This helps ensure proper rendering in the PDF
 * 
 * @returns {string} CSS string for print media
 */
export const generatePrintCss = () => {
  return `
    @media print {
      /* Force background colors and images to print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      /* Ensure all elements have their correct dimensions */
      .resume-container {
        width: 8.5in !important;
        height: auto !important;
        overflow: visible !important;
      }
      
      /* Make sure fonts render properly */
      body {
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
      }

      /* Fix for elements with background colors */
      .MuiPaper-root, .MuiChip-root, .MuiAvatar-root, .MuiButton-root, .MuiIconButton-root {
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Ensure borders print correctly */
      [class*="MuiDivider"], [class*="MuiBorder"] {
        border-color-adjust: exact !important;
      }
      
      /* Fix specific issues with Material-UI components */
      .MuiSvgIcon-root {
        color-adjust: exact !important;
      }
      
      /* Ensure grid layouts are preserved */
      .MuiGrid-container {
        display: flex !important;
      }
      
      /* Handle page breaks */
      .no-break {
        page-break-inside: avoid !important;
      }
    }
  `;
};

/**
 * Helper function to inject the print CSS into the document head
 */
export const injectPrintStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = generatePrintCss();
  styleElement.id = 'pdf-print-styles';
  document.head.appendChild(styleElement);
  
  return () => {
    const element = document.getElementById('pdf-print-styles');
    if (element) {
      document.head.removeChild(element);
    }
  };
};