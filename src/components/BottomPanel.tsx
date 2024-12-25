import React, { useState } from "react";

interface BottomPanelProps {
  onSend: (inputText: string) => void; // Callback for sending input
}

function BottomPanel({ onSend }: BottomPanelProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);

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

  return (
    <div className="bottom-panel">
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
