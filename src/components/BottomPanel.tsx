import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { readTextFile } from "../utils/fileReaders"; // Make sure you have helper functions for DOCX and TXT

function BottomPanel() {
  const [chatInput, setChatInput] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  // Handle sending the message
  const handleSend = () => {
    if (chatInput.trim()) {
      console.log("Sending message:", chatInput); // Replace with API call
      setChatInput(""); // Clear input after sending
    }
  };

  // Handle file drop (drag-and-drop)
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setIsLocked(true); // Disable interaction while processing

    if (file.type.startsWith("application/pdf")) {
      const text = await extractTextFromPdf(file);
      setChatInput(text);
    } else if (file.type === "text/plain") {
      const text = await readTextFile(file);
      setChatInput(text);
      // TODO: Handle TXT file
    // } else if (file.name.endsWith(".docx")) {
    //   const text = await readDocxFile(file);
    //   setChatInput(text);
    } else {
      alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
    }

    setIsLocked(false); // Re-enable interaction after processing
  };

  // Extract text from PDF file
  const extractTextFromPdf = async (file: File) => {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
              "pdfjs-dist/build/pdf.worker.min.mjs",
              import.meta.url
            ).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdfDoc.getPage(1); // Get the first page (you can handle multi-page later)
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join("");
      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return "Error extracting text from PDF.";
    }
  };

  // Prevent default behavior on dragover
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="bottom-panel"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <textarea
        value={chatInput}
        onChange={handleTextChange}
        placeholder="Type a message or drag a file here (PDF, DOCX, TXT)"
        rows={10}
        cols={30}
        disabled={isLocked}
      />
      <div className="actions">
        <button onClick={handleSend} disabled={isLocked}>
          Send
        </button>
      </div>
    </div>
  );
}

export default BottomPanel;
