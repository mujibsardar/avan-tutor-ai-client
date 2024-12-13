import React, { useState } from "react";
import { fetchAIResponse } from "../utils/api";
import * as pdfjsLib from "pdfjs-dist";

interface InputSectionProps {
  onSubmit: (response: string) => void; // Function to handle API response
}

function InputSection({ onSubmit }: InputSectionProps) {
  const [inputText, setInputText] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

  const handleSubmit = async () => {
    try {
      const response = await fetchAIResponse(inputText);
      onSubmit(response.aiGuidance); // Adjust according to your API response structure
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      // Check if the uploaded file is a PDF
      if (!file.type.startsWith("application/pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
  
      try {
        // Lock the textarea and upload button while processing
        setIsLocked(true);
        setInputText("Extracting text from file...");
  
        // Reset file input value to allow subsequent uploads
        e.target.value = "";
  
        // Read the uploaded file as an array buffer
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
  
        // Process the file after reading
        reader.onload = async () => {
          const pdfData = reader.result;
          
          if (pdfData instanceof ArrayBuffer) {
            // Create a copy of the ArrayBuffer
            const pdfDataCopy = new Uint8Array(pdfData);
            
            // Use PDF.js to extract text from the copy
            const text = await extractTextFromPdf(pdfDataCopy);
            console.log(`Extracted text:`, text);
            setInputText(text);
          } else {
            throw new Error("Failed to read file as ArrayBuffer.");
          }
        };
        
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          alert("An error occurred while reading the file.");
          setIsLocked(false);
        };
      } catch (error) {
        console.error("Error processing file:", error);
        alert("An error occurred while processing the file.");
      } finally {
        setIsLocked(false); // Unlock UI in both success and error scenarios
      }
    }
  };

  async function extractTextFromPdf(pdfData: ArrayBuffer) {
    try {
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const page = await pdfDoc.getPage(1); // Assuming only 1st page needed
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map(item => ('str' in item ? item.str : ''))
      .join('');
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
  }


  const handleClear = () => {
    setInputText("");
    setIsLocked(false);
  };

  return (
    <div className="input-section-content">
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        rows={10}
        cols={30}
        disabled={isLocked} // Lock the textarea if locked
      />
      <div className="input-actions">
        <button onClick={handleSubmit} disabled={isLocked}>
          Submit
        </button>
        <input
          type="file"
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isLocked} // Lock the upload button if locked
        />
        {isLocked && (
          <button onClick={handleClear}>
            Clear / Start Over
          </button>
        )}
      </div>
    </div>
  );
}

export default InputSection;
