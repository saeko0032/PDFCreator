import React, { useState } from 'react';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const htmlFile = content.file(/.*\.html$/i)[0];
    const htmlContent = await htmlFile.async('string');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText(htmlContent);

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  };

  return (
    <div className="App">
      <h1>PDF Creator</h1>
      <input type="file" accept=".zip" onChange={handleFileUpload} />
      {pdfUrl && (
        <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview"></iframe>
      )}
    </div>
  );
};

export default App;
