import { jsPDF } from 'jspdf';

const handlePdfDownload = () => {
  const doc = new jsPDF();

  // Add content to PDF
  doc.text("Sales Report", 20, 20);
  doc.text("Total Sales: ₹5000", 20, 30);
  doc.text("Total Orders: 50", 20, 40);

  // Save the PDF
  doc.save("sales_report.pdf");
};
