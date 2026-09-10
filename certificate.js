// Certificate generation using jsPDF

function downloadCertificate() {
  if (!currentModule || !scores[currentModule]) {
    alert("No certificate data found for this module.");
    return;
  }

  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    alert("PDF library failed to load. Check your internet connection.");
    return;
  }

  const userName = localStorage.getItem('currentUserNameForCertificate') || "Participant";

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(13, 110, 253);
  doc.text("Certificate of Completion", 105, 40, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(80);
  doc.text("Act 29 Mining Training • MHSA Compliant", 105, 52, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("This is to certify that", 105, 72, { align: "center" });

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(userName.toUpperCase(), 105, 92, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully demonstrated competency in the module", 105, 112, { align: "center" });

  doc.setFontSize(18);
  doc.setTextColor(40, 167, 69);
  doc.text(moduleNames[currentModule] || currentModule, 105, 130, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Score achieved: ${scores[currentModule].percentage}%`, 105, 150, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(80);
  doc.text(`Completed on: ${scores[currentModule].timestamp}`, 105, 168, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("This certificate confirms completion of an MHSA-aligned competency module.", 105, 190, { align: "center" });
  doc.text("Act 29 Mining Training Platform • Issued " + new Date().toLocaleDateString('en-ZA'), 105, 200, { align: "center" });

  const safeName = (moduleNames[currentModule] || currentModule).replace(/\s+/g, '_');
  const fileName = `Certificate_${safeName}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function downloadSpecificCertificate(moduleKey) {
  const originalModule = currentModule;
  currentModule = moduleKey;
  downloadCertificate();
  currentModule = originalModule;
}
