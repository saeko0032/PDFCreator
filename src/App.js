import React, { useState } from 'react';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { parse } from 'node-html-parser';

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    const htmlFile = content.file(/.*\.html$/i)[0];
    const htmlContent = await htmlFile.async('string');

    const root = parse(htmlContent);
    const tableRows = root.querySelectorAll('.GroupBox tr');
    const data = tableRows.slice(1).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        softwareProduct: cells[0].text,
        productVersion: cells[1].text,
        productDescription: cells[2].text,
        partNumber: cells[3].text,
        usageRights: cells[4].text,
        duration: cells[5].text,
        activationId: cells[6].text,
      };
    });

    const pdfDoc = await PDFDocument.create();
    data.forEach((item, index) => {
      const page = pdfDoc.addPage();
      page.drawText(`Activation ID ${index + 1}: ${item.activationId}`, {
        x: 50,
        y: 750,
        size: 12,
      });
    });

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
