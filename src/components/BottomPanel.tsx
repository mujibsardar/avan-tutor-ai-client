import React, { useState } from "react";
import { readTextFile } from "../utils/fileReaders"; // Assuming this handles reading files like .txt, .pdf, .docx

interface BottomPanelProps {
  onSend: (inputText: string) => void; // Callback for sending input
}

function BottomPanel({ onSend }: BottomPanelProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
  };

  const handleSend = () => {
    if (chatInput.trim() && !isLocked) {
      setIsLocked(true);
      onSend(chatInput);
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
        // Extract the content of the file (could be PDF, DOCX, TXT, etc.)
        const content = await readTextFile(file);
        setChatInput(content); // Set the extracted content into chat input
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
      <textarea
        value={chatInput}
        onChange={handleTextChange}
        onKeyDown={handleKeyPress} // Listen for the Enter key
        placeholder="Type a message or drag a file here (PDF, DOCX, TXT)"
        disabled={isLocked}
      />
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
