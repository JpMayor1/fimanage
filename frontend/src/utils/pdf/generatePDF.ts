// PDF generation utility using print functionality
// This creates a print-friendly version of the report

export const generatePDF = (title: string, content: HTMLElement) => {
  // Clone the content to avoid modifying the original
  const clonedContent = content.cloneNode(true) as HTMLElement;
  
  // Remove any buttons or interactive elements
  const buttons = clonedContent.querySelectorAll("button, .no-print");
  buttons.forEach((btn) => btn.remove());
  
  // Create print window
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download the PDF");
    return;
  }
  
  // Get styles from the current page
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 40px;
            background: #fff;
            color: #000;
            line-height: 1.6;
          }
          h1, h2, h3 {
            color: #1a1a1a;
            margin-bottom: 16px;
          }
          h1 { font-size: 28px; }
          h2 { font-size: 22px; }
          h3 { font-size: 18px; }
          .rounded-2xl, .rounded-lg {
            border-radius: 8px;
          }
          .border {
            border: 1px solid #e5e5e5;
          }
          .bg-zinc-950, .bg-primary {
            background: #f9f9f9;
          }
          .text-white {
            color: #000;
          }
          .text-white\\/60, .text-white\\/80 {
            color: #666;
          }
          .text-income {
            color: #10b981;
          }
          .text-expense {
            color: #ef4444;
          }
          .text-balance {
            color: #3b82f6;
          }
          .text-yellow {
            color: #f59e0b;
          }
          .grid {
            display: grid;
          }
          .gap-3, .gap-4 {
            gap: 16px;
          }
          .p-4, .p-6 {
            padding: 20px;
          }
          .mb-2, .mb-4 {
            margin-bottom: 16px;
          }
          .space-y-2 > * + * {
            margin-top: 8px;
          }
          .space-y-4 > * + * {
            margin-top: 16px;
          }
          .space-y-6 > * + * {
            margin-top: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          th, td {
            border: 1px solid #e5e5e5;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          @media print {
            body {
              padding: 20px;
            }
            @page {
              margin: 1cm;
            }
          }
          ${styles}
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${clonedContent.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

