// utils/DirectPDFExport.js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generateResumePDF = async (resumeElement, filename) => {
  if (!resumeElement) {
    throw new Error("Resume element not found");
  }
  
  console.log("Starting direct PDF export process...");
  
  // Step 1: Create a clean clone of the resume with absolute positioning
  const clone = resumeElement.cloneNode(true);
  document.body.appendChild(clone);
  
  // Style the clone for optimal rendering
  Object.assign(clone.style, {
    position: 'absolute',
    top: '0',
    left: '-9999px',
    width: '210mm', // A4 width
    height: 'auto',
    backgroundColor: '#ffffff',
    margin: '0',
    padding: '0',
    transform: 'none',
    boxSizing: 'border-box',
    overflow: 'visible'
  });
  
  // Step 2: Apply explicit styles to ensure everything renders correctly
  applyExplicitStyles(clone);
  
  try {
    // Step 3: Create canvas from the styled clone
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
      allowTaint: true,
      removeContainer: false // Keep our positioned clone
    });
    
    console.log("Canvas created successfully:", canvas.width, "x", canvas.height);
    
    // Step 4: Create PDF from canvas
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.width / canvas.height;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / aspectRatio;
    
    // Handle content that may span multiple pages
    if (imgHeight > pdfHeight) {
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    } else {
      // Content fits on a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    }
    
    // Step 5: Save the PDF
    pdf.save(filename);
    console.log("PDF saved successfully");
    
    // Clean up by removing the clone
    document.body.removeChild(clone);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    
    // Clean up if error occurs
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
    
    throw error;
  }
};

// Helper function to apply explicit styles to all elements
const applyExplicitStyles = (element) => {
  // Process all elements in the tree
  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    if (!el.style) return;
    
    // Force color-adjust properties
    el.style.WebkitPrintColorAdjust = 'exact';
    el.style.printColorAdjust = 'exact';
    
    try {
      const computedStyle = window.getComputedStyle(el);
      
      // Apply computed background colors directly
      if (computedStyle.backgroundColor && 
          computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
          computedStyle.backgroundColor !== 'transparent') {
        el.style.backgroundColor = computedStyle.backgroundColor;
      }
      
      // Apply computed text colors directly
      if (computedStyle.color) {
        el.style.color = computedStyle.color;
      }
      
      // Apply computed borders directly
      if (computedStyle.borderWidth !== '0px') {
        el.style.borderColor = computedStyle.borderColor;
        el.style.borderWidth = computedStyle.borderWidth;
        el.style.borderStyle = computedStyle.borderStyle;
      }
      
      // Fix SVG icons
      if (el.tagName === 'svg') {
        el.style.color = computedStyle.color;
        
        // Make sure all paths have their fill color set
        const paths = el.querySelectorAll('path');
        paths.forEach(path => {
          if (!path.getAttribute('fill') || 
              path.getAttribute('fill') === 'currentColor') {
            path.setAttribute('fill', computedStyle.color);
          }
        });
      }
      
      // Disable any animations or transitions
      el.style.transition = 'none';
      el.style.animation = 'none';
      
      // Fix Material-UI specific elements
      if (el.classList.contains('MuiPaper-root') || 
          el.classList.contains('MuiChip-root') || 
          el.classList.contains('MuiAvatar-root')) {
        el.style.boxShadow = 'none';
      }
    } catch (e) {
      console.warn('Style computation error for element:', e);
    }
  });
  
  return element;
};

// Backup method using simpler rendering if html2canvas fails
export const generateSimplePDF = async (resumeElement, filename) => {
  if (!resumeElement) {
    throw new Error("Resume element not found");
  }
  
  try {
    console.log("Using simplified PDF generation...");
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add a title
    doc.setFontSize(16);
    doc.text("Your Resume", 105, 20, { align: 'center' });
    
    // Add note about using print instead
    doc.setFontSize(12);
    doc.text("For better results, please use the Print option instead", 105, 30, { align: 'center' });
    
    // Save the simplified PDF
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error("Error generating simplified PDF:", error);
    throw error;
  }
};