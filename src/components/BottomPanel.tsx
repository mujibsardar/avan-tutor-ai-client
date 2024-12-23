import React, { useState } from "react";

function BottomPanel() {
  const [chatInput, setChatInput] = useState<string>("");

  const handleSend = () => {
    if (chatInput.trim()) {
      console.log("Sending message:", chatInput); // Replace with API call
      setChatInput("");
    }
  };

  return (
    <div className="bottom-panel">
      <textarea
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default BottomPanel;
