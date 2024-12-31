// utils/fileReaders.ts
import * as pdfjsLib from "pdfjs-dist";

export const readTextFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  let content = '';

  if (fileType === "application/pdf") {
    // Handle PDF reading
    content = await readPdf(file);
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // Handle DOCX reading
    content = await readDocx(file);
  } else if (fileType === "text/plain") {
    // Handle TXT reading
    content = await readText(file);
  } else if (isCodeFile(fileType)) { 
    content = await readText(file); 
  } else {
    throw new Error("Unsupported file type");
  }

  return content;
};

const readText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const readPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Set the worker source (necessary for pdf.js to work in the browser)
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs", 
      import.meta.url
    ).toString();

    // Load the PDF document
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';

    // Iterate through each page and extract text
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items  .map((item) => ("str" in item ? item.str : "")).join(' ');
    }

    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};

const readDocx = async (file: File): Promise<string> => {
  // Implement DOCX reading using libraries like `mammoth.js` or similar
  const docx = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await docx.extractRawText({ arrayBuffer });
  return result.value;
};

// Helper function to check for common code file extensions
const isCodeFile = (fileType: string): boolean => {
  const codeFileExtensions = [
    // JavaScript
    "application/javascript",
    "text/javascript",
    "application/x-javascript",
    "text/x-javascript",
    
    // HTML
    "text/html",
    "application/xhtml+xml",
  
    // CSS
    "text/css",
  
    // Python
    "text/x-python",
    "application/x-python",
  
    // JSON
    "application/json",

    // TypeScript with JSX
    "application/typescript-jsx", // This is a common MIME type for tsx
    "text/tsx",                 // This is also sometimes used
  
    // XML
    "text/xml",
    "application/xml",
  
    // C/C++
    "text/x-c",
    "text/x-c++",
    "text/x-cpp",
  
    // C#
    "text/x-csharp",
    "application/x-csharp",
  
    // Java
    "text/x-java",
    "text/x-java-source",
  
    // Go
    "text/x-go",
    "application/x-go",
  
    // Ruby
    "text/x-ruby",
    "application/x-ruby",
  
    // PHP
    "text/x-php",
    "application/x-php",
  
    // Swift
    "text/x-swift",
    "application/x-swift",
  
    // Kotlin
    "text/x-kotlin",
    "application/x-kotlin",
  
    // TypeScript
    "application/typescript",
    "text/typescript",
  
    // Markdown
    "text/markdown",
    "text/x-markdown",
  
    // YAML
    "text/yaml",
    "application/x-yaml",
  
    // Shell scripts
    "application/x-sh",
    "text/x-sh",
  
    // SQL
    "text/x-sql",
    "application/sql",
  
    // Perl
    "text/x-perl",
    "application/x-perl",
  
    // R
    "text/x-rsrc",
    "application/x-rsrc",
  
    // Lua
    "text/x-lua",
    "application/x-lua",
  ];
  return codeFileExtensions.includes(fileType);
};
