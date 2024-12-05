import { useState } from "react";
import { fetchAIResponse } from "../utils/api"; // Assuming you've set up the API utility

interface InputSectionProps {
  onSubmit: (response: string) => void; // Function to handle API response
}

function InputSection({ onSubmit }: InputSectionProps) {
  const [inputText, setInputText] = useState<string>("");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

  const handleSubmit = async () => {
    // Call the API and pass the result to onSubmit
    try {
      const response = await fetchAIResponse(inputText);
      onSubmit(response.aiGuidance); // Adjust according to your API response structure
    } catch (error) {
      console.error("Error:", error);
    }
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
