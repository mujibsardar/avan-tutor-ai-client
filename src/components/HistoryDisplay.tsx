import { useState } from "react";
import { HistoryItem } from "../utils/api";

// Utility to format the timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(); // Example: 8:36:51 AM
};

// Component to display a single history item
const HistoryItemDisplay = ({ message, sender, timestamp, score, feedback, confidence, concerns, promptSummary }: HistoryItem) => { // Add promptSummary prop
  const formattedTime = formatTimestamp(timestamp);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Determine score color based on score value
  const scoreColor =
    (score ?? 0) >= 90 ? "#28a745" : // Green for excellent scores
    (score ?? 0) >= 70 ? "#ffc107" : // Yellow for good scores
    (score ?? 0) >= 50 ? "#fd7e14" : // Orange for average scores
    "#dc3545"; // Red for low scores

  // Determine confidence color based on confidence value
  const confidenceColor =
    (confidence ?? 0) >= 90 ? "#28a745" : // Green for high confidence
    (confidence ?? 0) >= 70 ? "#ffc107" : // Yellow for moderate confidence
    "#dc3545"; // Red for low confidence

  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: sender === "user" ? "#f0f8ff" : "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <strong style={{ color: sender === "user" ? "#007BFF" : "#28a745" }}>
          {sender === "user" ? "User" : "AI"} <span style={{ fontWeight: "normal" }}>({formattedTime})</span>
        </strong>
        {sender === "user" && score !== undefined && (
          <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.1em",
                color: scoreColor,
                fontFamily: "Arial, sans-serif",
              }}
            >
              Score: {score}%
            </span>
            <div
              style={{ marginLeft: "5px", cursor: "pointer", position: "relative" }}
              onMouseEnter={() => setHoveredInfo("feedback")}
              onMouseLeave={() => setHoveredInfo(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              {hoveredInfo === "feedback" && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "0",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: "15px", // Increased padding for better spacing
                    borderRadius: "5px",
                    zIndex: 10,
                    width: "300px", // Adjusted width for better readability
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow for a more polished look
                  }}
                >
                  {feedback}
                </div>
              )}
              {promptSummary && ( // Conditionally render promptSummary
              <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                {promptSummary}
              </span>
            )}
            </div>
          </div>
        )}
        {sender === "ai" && confidence !== undefined && (
          <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.1em",
                color: confidenceColor,
                fontFamily: "Arial, sans-serif",
              }}
            >
              Confidence: {confidence}%
            </span>
            <div
              style={{ marginLeft: "5px", cursor: "pointer", position: "relative" }}
              onMouseEnter={() => setHoveredInfo("concerns")}
              onMouseLeave={() => setHoveredInfo(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              {hoveredInfo === "concerns" && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "0",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    padding: "15px", // Increased padding for better spacing
                    borderRadius: "5px",
                    zIndex: 10,
                    width: "300px", // Adjusted width for better readability
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Added shadow for a more polished look
                  }}
                >
                  {concerns}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <pre
        style={{
          marginTop: "5px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "monospace",
        }}
      >
        {message}
      </pre>
    </div>
  );
};

// Component to display the entire history
interface HistoryDisplayProps {
  history: HistoryItem[];
}

const HistoryDisplay = ({ history }: HistoryDisplayProps) => {
  return (
    <div className="history-display">
      {history.map((item, index) => (
        <HistoryItemDisplay key={index} {...item} />
      ))}
    </div>
  );
};

export default HistoryDisplay;
