// src/components/OutputSection.js
import React, { useState, useEffect } from "react";

function OutputSection() {
  const [output, setOutput] = useState("");

  useEffect(() => {
    // Simulate an AI response after submitting input
    setTimeout(() => {
      setOutput("AI's response to your input will appear here...");
    }, 2000);
  }, []);

  return (
    <div className="output-section-content">
      <h2>AI Response:</h2>
      <p>{output}</p>
    </div>
  );
}

export default OutputSection;
