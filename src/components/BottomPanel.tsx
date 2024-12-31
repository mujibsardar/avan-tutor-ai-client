import React, { useState } from "react";
import { readTextFile } from "../utils/fileReaders"; // Assuming this handles reading files like .txt, .pdf, .docx

interface BottomPanelProps {
  onSend: (inputText: string) => void; // Callback for sending input
}

function BottomPanel({ onSend }: BottomPanelProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null); // Add state for file name

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const handleSend = () => {
    if (chatInput.trim() && !isLocked) {
      setIsLocked(true);
      onSend(chatInput);
      setFileName(null); // Clear file name after sending
      setChatInput(""); // Clear input after sending
      setIsLocked(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSend();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      try {
        const content = await readTextFile(file);
        setChatInput(content);
        setFileName(file.name); // Store the file name in state
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  return (
    <div
      className={`bottom-panel ${dragActive ? "drag-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div style={{ 
        border: "1px solid #ccc", 
        padding: "10px", 
        borderRadius: "5px",
      }}> 
        {fileName && ( // Conditionally render the file name
          <div style={{ 
            fontWeight: "bold", 
            marginBottom: "5px" 
          }}>
            {fileName}
          </div>
        )}
        <textarea
          value={chatInput}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress} 
          placeholder="Type a message, drag a document file (PDF, DOCX, TXT) or code file to upload"
          disabled={isLocked}
          style={{ 
            border: "none", 
            resize: "none", 
            padding: 0,
            width: "100%"
          }}
        />
      </div>
      <div className="actions">
        <button onClick={handleSend} disabled={isLocked}>
          Send
        </button>
      </div>
      {dragActive && <div className="drag-overlay">Drop your file here</div>}
    </div>
  );
}

export default BottomPanel;
