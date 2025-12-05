import type { ReportData } from "@/types/report/report.type";
import { formatAmount } from "@/utils/amount/formatAmount";
import dayjs from "dayjs";
import jsPDF from "jspdf";

export const generatePDF = async (title: string, reportData: ReportData) => {
  try {
    // Create PDF document
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to draw a line
    const drawLine = (y: number) => {
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Financial Report", margin, yPosition);
    yPosition += 8;

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    const periodText = `${
      reportData.period.charAt(0).toUpperCase() + reportData.period.slice(1)
    } Report`;
    pdf.text(periodText, margin, yPosition);
    yPosition += 6;

    // Report Information
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Period: ${dayjs(reportData.dateRange.start).format(
        "MMM D, YYYY"
      )} - ${dayjs(reportData.dateRange.end).format("MMM D, YYYY")}`,
      margin,
      yPosition
    );
    yPosition += 5;
    pdf.text(
      `Generated: ${dayjs().format("MMMM D, YYYY h:mm A")}`,
      margin,
      yPosition
    );
    yPosition += 5;
    pdf.text(`Account: ${reportData.account.name}`, margin, yPosition);
    yPosition += 5;
    pdf.text(
      `Daily Limit: ${formatAmount(reportData.account.limit)}`,
      margin,
      yPosition
    );
    yPosition += 10;

    drawLine(yPosition);
    yPosition += 8;

    // Summary Section
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary", margin, yPosition);
    yPosition += 8;

    // Summary Table
    const summaryData = [
      ["Total Income", formatAmount(reportData.summary.totalIncome)],
      ["Total Expense", formatAmount(reportData.summary.totalExpense)],
      ["Total Balance", formatAmount(reportData.summary.totalBalance)],
      ["Net Flow", formatAmount(reportData.summary.netFlow)],
      [
        "Total Dept Remaining",
        formatAmount(reportData.summary.totalDeptRemaining),
      ],
      [
        "Total Receiving Remaining",
        formatAmount(reportData.summary.totalReceivingRemaining),
      ],
    ];

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    summaryData.forEach(([label, value]) => {
      checkPageBreak(6);
      pdf.setTextColor(0, 0, 0);
      pdf.text(label, margin + 5, yPosition);
      pdf.setFont("helvetica", "bold");
      pdf.text(value, pageWidth - margin - 5, yPosition, { align: "right" });
      pdf.setFont("helvetica", "normal");
      yPosition += 6;
    });

    yPosition += 5;
    drawLine(yPosition);
    yPosition += 8;

    // Period Statistics
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Period Statistics", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Period Income: ${formatAmount(reportData.summary.periodIncome)}`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Period Expense: ${formatAmount(reportData.summary.periodExpense)}`,
      margin + 5,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Total Transactions: ${reportData.totalTransactions}`,
      margin + 5,
      yPosition
    );
    yPosition += 10;

    drawLine(yPosition);
    yPosition += 8;

    // Transaction Breakdown
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Transaction Breakdown", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    Object.entries(reportData.transactionBreakdown).forEach(([type, count]) => {
      checkPageBreak(6);
      pdf.text(
        `${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`,
        margin + 5,
        yPosition
      );
      yPosition += 6;
    });

    yPosition += 5;
    drawLine(yPosition);
    yPosition += 8;

    // Overdue Items
    if (
      reportData.overdueDepts.length > 0 ||
      reportData.overdueReceivings.length > 0
    ) {
      checkPageBreak(30);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(245, 158, 11); // Yellow
      pdf.text("Overdue Items", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);

      if (reportData.overdueDepts.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Overdue Depts (${reportData.overdueDepts.length}):`,
          margin + 5,
          yPosition
        );
        yPosition += 6;
        pdf.setFont("helvetica", "normal");
        reportData.overdueDepts.forEach((dept) => {
          checkPageBreak(12);
          pdf.text(`  ${dept.lender}`, margin + 10, yPosition);
          yPosition += 5;
          pdf.text(
            `    Remaining: ${formatAmount(dept.remaining)}`,
            margin + 15,
            yPosition
          );
          yPosition += 5;
          pdf.text(`    Due: ${dept.dueDate}`, margin + 15, yPosition);
          yPosition += 6;
        });
      }

      if (reportData.overdueReceivings.length > 0) {
        checkPageBreak(20);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Overdue Receivings (${reportData.overdueReceivings.length}):`,
          margin + 5,
          yPosition
        );
        yPosition += 6;
        pdf.setFont("helvetica", "normal");
        reportData.overdueReceivings.forEach((receiving) => {
          checkPageBreak(12);
          pdf.text(`  ${receiving.borrower}`, margin + 10, yPosition);
          yPosition += 5;
          pdf.text(
            `    Remaining: ${formatAmount(receiving.remaining)}`,
            margin + 15,
            yPosition
          );
          yPosition += 5;
          pdf.text(`    Due: ${receiving.dueDate}`, margin + 15, yPosition);
          yPosition += 6;
        });
      }

      yPosition += 5;
      drawLine(yPosition);
      yPosition += 8;
    }

    // Top Sources by Expense
    if (reportData.sourceExpenses.length > 0) {
      checkPageBreak(40);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Top Sources by Expense", margin, yPosition);
      yPosition += 8;

      // Table header
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("#", margin + 5, yPosition);
      pdf.text("Source Name", margin + 15, yPosition);
      pdf.text("Income", pageWidth - margin - 80, yPosition, {
        align: "right",
      });
      pdf.text("Expense", pageWidth - margin - 50, yPosition, {
        align: "right",
      });
      pdf.text("Balance", pageWidth - margin - 5, yPosition, {
        align: "right",
      });
      yPosition += 6;

      drawLine(yPosition);
      yPosition += 4;

      // Table rows
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      reportData.sourceExpenses.forEach((source, index) => {
        checkPageBreak(8);
        pdf.text((index + 1).toString(), margin + 5, yPosition);
        pdf.text(source.name.substring(0, 25), margin + 15, yPosition);
        pdf.text(
          formatAmount(source.income),
          pageWidth - margin - 80,
          yPosition,
          { align: "right" }
        );
        pdf.text(
          formatAmount(source.expense),
          pageWidth - margin - 50,
          yPosition,
          { align: "right" }
        );
        pdf.text(
          formatAmount(source.balance),
          pageWidth - margin - 5,
          yPosition,
          { align: "right" }
        );
        yPosition += 6;
      });

      yPosition += 5;
      drawLine(yPosition);
      yPosition += 8;
    }

    // Monthly Summary (if year period)
    if (reportData.monthlySummary.length > 0) {
      checkPageBreak(50);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Monthly Summary", margin, yPosition);
      yPosition += 8;

      // Table header
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Month", margin + 5, yPosition);
      pdf.text("Income", pageWidth - margin - 100, yPosition, {
        align: "right",
      });
      pdf.text("Expense", pageWidth - margin - 50, yPosition, {
        align: "right",
      });
      pdf.text("Net", pageWidth - margin - 5, yPosition, { align: "right" });
      yPosition += 6;

      drawLine(yPosition);
      yPosition += 4;

      // Table rows
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      reportData.monthlySummary.forEach((month) => {
        checkPageBreak(8);
        const monthName = dayjs(month.month).format("MMM YYYY");
        const net = month.income - month.expense;
        pdf.text(monthName, margin + 5, yPosition);
        pdf.text(
          formatAmount(month.income),
          pageWidth - margin - 100,
          yPosition,
          { align: "right" }
        );
        pdf.text(
          formatAmount(month.expense),
          pageWidth - margin - 50,
          yPosition,
          { align: "right" }
        );
        pdf.setTextColor(
          net >= 0 ? 16 : 239,
          net >= 0 ? 185 : 68,
          net >= 0 ? 129 : 68
        );
        pdf.text(formatAmount(net), pageWidth - margin - 5, yPosition, {
          align: "right",
        });
        pdf.setTextColor(0, 0, 0);
        yPosition += 6;
      });

      yPosition += 5;
      drawLine(yPosition);
      yPosition += 8;
    }

    // Daily Expense Summary (limited to last 30 days)
    if (reportData.dailyExpenseSummary.length > 0) {
      checkPageBreak(50);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Daily Expense Summary (Last 30 Days)", margin, yPosition);
      yPosition += 8;

      // Table header
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Date", margin + 5, yPosition);
      pdf.text("Expense", pageWidth - margin - 80, yPosition, {
        align: "right",
      });
      pdf.text("Limit", pageWidth - margin - 50, yPosition, { align: "right" });
      pdf.text("Usage", pageWidth - margin - 5, yPosition, { align: "right" });
      yPosition += 6;

      drawLine(yPosition);
      yPosition += 4;

      // Table rows (last 30 days)
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      reportData.dailyExpenseSummary.slice(0, 30).forEach((day) => {
        checkPageBreak(8);
        const dateStr = dayjs(day.date).format("MMM D, YYYY");
        const usage = `${day.percentage.toFixed(0)}%`;
        pdf.text(dateStr, margin + 5, yPosition);
        pdf.text(
          formatAmount(day.expense),
          pageWidth - margin - 80,
          yPosition,
          { align: "right" }
        );
        pdf.text(formatAmount(day.limit), pageWidth - margin - 50, yPosition, {
          align: "right",
        });

        // Color code usage percentage
        if (day.percentage > 100) {
          pdf.setTextColor(239, 68, 68); // Red
        } else if (day.percentage >= 75) {
          pdf.setTextColor(245, 158, 11); // Yellow
        } else {
          pdf.setTextColor(16, 185, 129); // Green
        }
        pdf.text(usage, pageWidth - margin - 5, yPosition, { align: "right" });
        pdf.setTextColor(0, 0, 0);
        yPosition += 6;
      });
    }

    // Footer on last page
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
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
