import { HistoryItem } from "../utils/api"; // Assuming parseHistory is in a utils file

// Utility to format the timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(); // Example: 8:36:51 AM
};

// Component to display a single history item
const HistoryItemDisplay = ({ message, sender, timestamp }: HistoryItem) => {
  const formattedTime = formatTimestamp(timestamp);

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
      <strong style={{ color: sender === "user" ? "#007BFF" : "#28a745" }}>
        {sender === "user" ? "User" : "AI"} <span style={{ fontWeight: "normal" }}>({formattedTime})</span>
      </strong>
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
