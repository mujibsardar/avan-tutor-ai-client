// src/components/InputSection.js
import React, { useState } from "react";

function InputSection() {
  const [inputText, setInputText] = useState("");

  const handleTextChange = (e) => setInputText(e.target.value);

  const handleSubmit = () => {
    // Trigger AI Lambda function or API call here
    console.log("Submitted:", inputText);
  };

  const handleUpload = (e) => {
    // Handle document upload logic here
    console.log("Uploaded file:", e.target.files[0]);
  };

  return (
    <div className="input-section-content">
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        rows="10"
        cols="30"
      />
      <div className="input-actions">
        <button onClick={handleSubmit}>Submit</button>
        <input type="file" onChange={handleUpload} />
      </div>
    </div>
  );
}

export default InputSection;
