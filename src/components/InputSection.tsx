import React, { useState } from "react";
import { fetchAIResponse } from "../utils/api";
import * as pdfjsLib from "pdfjs-dist";

interface InputSectionProps {
  onSubmit: (response: string) => void; // Function to handle API response
}

function InputSection({ onSubmit }: InputSectionProps) {
  const [inputText, setInputText] = useState<string>("");
  const [resourceName, setResourceName] = useState<string>(""); // State for resource name
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setResourceName(e.target.value);

  const handleSubmit = async () => {
    if (!resourceName.trim()) {
      alert("Please provide a name for the resource.");
      return;
    }
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

      if (!file.type.startsWith("application/pdf")) {
        alert("Please upload a PDF file.");
        return;
      }

      try {
        setIsLocked(true);
        setInputText("Extracting text from file...");
        e.target.value = "";

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
          const pdfData = reader.result;

          if (pdfData instanceof ArrayBuffer) {
            const pdfDataCopy = new Uint8Array(pdfData);
            const text = await extractTextFromPdf(pdfDataCopy);
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
        setIsLocked(false);
      }
    }
  };

  async function extractTextFromPdf(pdfData: ArrayBuffer) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdfDoc.getPage(1);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join("");
      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw error;
    }
  }

  const handleClear = () => {
    setInputText("");
    setResourceName("");
    setIsLocked(false);
  };

  return (
    <div className="input-section-content">
      <h2>Upload Center</h2>
      <p className="input-caption">
        Share assignment instructions, code snippets, or reference materials here. 
        You can type directly, paste content, or upload a file to extract its content.
      </p>
      <input
        className="input-resource-name"
        type="text"
        value={resourceName}
        onChange={handleNameChange}
        placeholder="Enter resource title (e.g., 'Assignment 1')"
        disabled={isLocked}
      />
      <div className="upload-container">
        <input
          type="file"
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isLocked}
          className="upload-button"
        />
      </div>
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="The extracted text will appear here. You can also type or paste directly."
        rows={10}
        cols={30}
        disabled={isLocked}
      />
      <div className="input-actions">
        <button onClick={handleClear} disabled={!isLocked}>
          Clear / Start Over
        </button>
        <button onClick={handleSubmit} disabled={isLocked} className="submit-button">
          Upload
        </button>
      </div>
    </div>
  );
}

export default InputSection;
