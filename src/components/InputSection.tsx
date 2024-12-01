// src/components/InputSection.js
import { useState } from "react";

function InputSection() {
  const [inputText, setInputText] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

  const handleSubmit = () => {
    // Trigger AI Lambda function or API call here
    console.log("Submitted:", inputText);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle document upload logic here
    if (e.target.files && e.target.files[0]) {
      console.log("Uploaded file:", e.target.files[0]);
    }
  };

  return (
    <div className="input-section-content">
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        rows={10}
        cols={30}
      />
      <div className="input-actions">
        <button onClick={handleSubmit}>Submit</button>
        <input type="file" onChange={handleUpload} />
      </div>
    </div>
  );
}

export default InputSection;
