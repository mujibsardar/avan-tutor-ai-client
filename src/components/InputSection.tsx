import React, { useState } from "react";
import { fetchAIResponse, uploadFileToApi } from "../utils/api";

interface InputSectionProps {
  onSubmit: (response: string) => void; // Function to handle API response
}

function InputSection({ onSubmit }: InputSectionProps) {
  const [inputText, setInputText] = useState<string>("");
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

  const handleSubmit = async () => {
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

      // Prepare form data to send to the API
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Lock the textarea and upload button while uploading
        setIsLocked(true);
        setInputText("Uploading file...");

        // Reset file input value to allow subsequent uploads
        e.target.value = "";

        // Send the file to the backend
        const response = await uploadFileToApi(formData);

        console.log("File upload response in InputSection:", JSON.stringify(response,null,2));

        // Display response from API
        setInputText(response.message); // Adjust based on your API response
      } catch (error) {
        console.error("Error processing file:", error);
        alert("An error occurred while processing the file.");
      } finally {
        setIsLocked(false); // Unlock UI in both success and error scenarios
      }
    }
  };

  const handleClear = () => {
    setInputText("");
    setIsLocked(false);
  };

  return (
    <div className="input-section-content">
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
        rows={10}
        cols={30}
        disabled={isLocked} // Lock the textarea if locked
      />
      <div className="input-actions">
        <button onClick={handleSubmit} disabled={isLocked}>
          Submit
        </button>
        <input
          type="file"
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isLocked} // Lock the upload button if locked
        />
        {isLocked && (
          <button onClick={handleClear}>
            Clear / Start Over
          </button>
        )}
      </div>
    </div>
  );
}

export default InputSection;
