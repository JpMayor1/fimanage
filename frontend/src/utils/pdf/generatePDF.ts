import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (title: string, content: HTMLElement) => {
  try {
    // Clone content to avoid modifying the original
    const clonedContent = content.cloneNode(true) as HTMLElement;

    // Remove buttons and interactive elements that shouldn't be in PDF
    const buttons = clonedContent.querySelectorAll("button, .no-print");
    buttons.forEach((btn) => btn.remove());

    // Convert all computed styles to inline RGB styles to avoid oklab parsing
    const convertStylesToInlineRGB = (element: HTMLElement) => {
      const allElements = element.querySelectorAll("*");
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        try {
          const computedStyle = window.getComputedStyle(htmlEl);

          // Convert and inline all color-related properties
          const properties = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
          ];

          properties.forEach((prop) => {
            try {
              const value = computedStyle.getPropertyValue(prop);
              if (
                value &&
                value.trim() &&
                value !== "rgba(0, 0, 0, 0)" &&
                value !== "transparent"
              ) {
                // Force conversion to RGB by setting and reading back
                const originalValue = htmlEl.style.getPropertyValue(prop);
                htmlEl.style.setProperty(prop, value);
                const computed = window
                  .getComputedStyle(htmlEl)
                  .getPropertyValue(prop);
                if (computed && computed.includes("rgb")) {
                  htmlEl.style.setProperty(prop, computed, "important");
                } else {
                  htmlEl.style.setProperty(prop, originalValue);
                }
              }
            } catch (e) {
              // Ignore individual property errors
            }
          });
        } catch (e) {
          // Ignore element errors
        }
      });
    };

    // Inject style override directly into cloned content to ensure it's processed first
    const styleOverride = document.createElement("style");
    styleOverride.id = "pdf-color-override";
    styleOverride.textContent = `
      /* Force all colors to RGB to avoid oklab parsing errors */
      * {
        /* Override computed styles */
      }
    `;
    clonedContent.insertBefore(styleOverride, clonedContent.firstChild);

    // Also add to document head for global override
    const globalStyle = document.createElement("style");
    globalStyle.id = "pdf-global-override";
    globalStyle.textContent = `
      /* Comprehensive color overrides for html2canvas compatibility */
      .text-white, [class*="text-white"] { color: rgb(255, 255, 255) !important; }
      .text-income { color: rgb(16, 185, 129) !important; }
      .text-expense { color: rgb(239, 68, 68) !important; }
      .text-balance { color: rgb(59, 130, 246) !important; }
      .text-yellow { color: rgb(245, 158, 11) !important; }
      .text-red { color: rgb(239, 68, 68) !important; }
      .text-green { color: rgb(16, 185, 129) !important; }
      .text-blue-400 { color: rgb(96, 165, 250) !important; }
      .bg-zinc-950, .bg-primary { background-color: rgb(255, 255, 255) !important; }
      [class*="bg-zinc-950"] { background-color: rgb(24, 24, 27) !important; }
      [class*="bg-income"] { background-color: rgba(16, 185, 129, 0.1) !important; }
      [class*="bg-expense"] { background-color: rgba(239, 68, 68, 0.1) !important; }
      [class*="bg-balance"] { background-color: rgba(59, 130, 246, 0.1) !important; }
      [class*="bg-yellow"] { background-color: rgba(245, 158, 11, 0.1) !important; }
      [class*="bg-white"] { background-color: rgba(255, 255, 255, 0.1) !important; }
      [class*="bg-green"] { background-color: rgba(16, 185, 129, 0.1) !important; }
      [class*="bg-red"] { background-color: rgba(239, 68, 68, 0.1) !important; }
      [class*="border-white"] { border-color: rgba(255, 255, 255, 0.1) !important; }
      [class*="border-income"] { border-color: rgba(16, 185, 129, 0.4) !important; }
      [class*="border-expense"] { border-color: rgba(239, 68, 68, 0.4) !important; }
      [class*="border-balance"] { border-color: rgba(59, 130, 246, 0.4) !important; }
      [class*="border-yellow"] { border-color: rgba(245, 158, 11, 0.4) !important; }
    `;
    document.head.appendChild(globalStyle);

    // Temporarily append to body for better rendering
    clonedContent.style.position = "absolute";
    clonedContent.style.left = "-9999px";
    clonedContent.style.top = "0";
    clonedContent.style.width = `${content.offsetWidth}px`;
    clonedContent.style.backgroundColor = "#ffffff";
    document.body.appendChild(clonedContent);

    // Convert all styles to inline RGB to avoid oklab parsing issues
    convertStylesToInlineRGB(clonedContent);

    // Wait for styles to apply and DOM to update
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Configure html2canvas options for better quality
    // Use foreignObjectRendering: false to avoid CSS parsing issues
    const canvas = await html2canvas(clonedContent, {
      scale: 2, // Higher quality (2x)
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff", // White background for better PDF readability
      windowWidth: clonedContent.scrollWidth,
      windowHeight: clonedContent.scrollHeight,
      allowTaint: true,
      foreignObjectRendering: false, // Disable foreignObject to avoid CSS parsing issues
      ignoreElements: () => {
        // Ignore elements that might cause issues
        return false;
      },
      onclone: (clonedDoc, element) => {
        // Convert all computed styles to RGB in the cloned document
        // This prevents html2canvas from trying to parse oklab colors
        const walker = clonedDoc.createTreeWalker(
          element,
          NodeFilter.SHOW_ELEMENT,
          null
        );

        let node;
        while ((node = walker.nextNode())) {
          const htmlEl = node as HTMLElement;
          if (!htmlEl.style) continue;

          try {
            const computedStyle =
              clonedDoc.defaultView?.getComputedStyle(htmlEl);
            if (!computedStyle) continue;

            // Convert color to RGB
            const color = computedStyle.color;
            if (color && color !== "rgba(0, 0, 0, 0)") {
              // Create a temporary element to get RGB value
              const temp = clonedDoc.createElement("div");
              temp.style.color = color;
              clonedDoc.body.appendChild(temp);
              const rgbColor =
                clonedDoc.defaultView?.getComputedStyle(temp).color;
              clonedDoc.body.removeChild(temp);
              if (rgbColor && rgbColor.includes("rgb")) {
                htmlEl.style.color = rgbColor;
              }
            }

            // Convert background-color to RGB
            const bgColor = computedStyle.backgroundColor;
            if (
              bgColor &&
              bgColor !== "rgba(0, 0, 0, 0)" &&
              bgColor !== "transparent"
            ) {
              const temp = clonedDoc.createElement("div");
              temp.style.backgroundColor = bgColor;
              clonedDoc.body.appendChild(temp);
              const rgbBg =
                clonedDoc.defaultView?.getComputedStyle(temp).backgroundColor;
              clonedDoc.body.removeChild(temp);
              if (rgbBg && rgbBg.includes("rgb")) {
                htmlEl.style.backgroundColor = rgbBg;
              }
            }

            // Convert border-color to RGB
            const borderColor = computedStyle.borderColor;
            if (borderColor && borderColor !== "rgba(0, 0, 0, 0)") {
              const temp = clonedDoc.createElement("div");
              temp.style.borderColor = borderColor;
              clonedDoc.body.appendChild(temp);
              const rgbBorder =
                clonedDoc.defaultView?.getComputedStyle(temp).borderColor;
              clonedDoc.body.removeChild(temp);
              if (rgbBorder && rgbBorder.includes("rgb")) {
                htmlEl.style.borderColor = rgbBorder;
              }
            }
          } catch (e) {
            // Ignore errors and continue
          }
        }
      },
    });

    // Clean up cloned element and style overrides
    document.body.removeChild(clonedContent);
    const globalStyleEl = document.getElementById("pdf-global-override");
    if (globalStyleEl) {
      document.head.removeChild(globalStyleEl);
    }

    // Calculate PDF dimensions (A4: 210mm x 297mm)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const pdfX = 0;
    const pdfY = 0;

    // Calculate image dimensions to fit PDF width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png", 1.0);

    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / pdfHeight);

    // Add image to PDF, splitting across multiple pages if needed
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate the y position for this page (negative to shift image up)
      const yPosition = pdfY - i * pdfHeight;

      pdf.addImage(imgData, "PNG", pdfX, yPosition, imgWidth, imgHeight);
    }

    // Download the PDF
    const fileName = `${title.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
