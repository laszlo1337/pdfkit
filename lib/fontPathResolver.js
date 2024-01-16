import path from 'path';
import fs from 'fs';

let resolvedPath = null;

try {
  // Attempt to resolve PDFKit main file path
  const pdfKitMainPath = require.resolve('pdfkit.js');

  // Calculate the path to the 'data' directory
  const dataPath = path.join(pdfKitMainPath, '..', 'data');

  // Check if the 'data' directory exists
  if (fs.existsSync(dataPath)) {
    resolvedPath = dataPath;
  }
} catch (e) {
  console.error("Can't find pdfkit.js");
}

export default resolvedPath;
