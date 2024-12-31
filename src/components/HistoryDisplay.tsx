import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import the plugin
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a theme
import { HistoryItem } from "../utils/api";

// Interface for CodeBlock props
interface CodeBlockProps {
  language: string;
  value: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [isHovered, setIsHovered] = useState(false); // Add hover state
  const [buttonText, setButtonText] = useState("Copy"); // Add state for button text

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setButtonText("Copied!"); // Change button text on success
        setTimeout(() => {
          setButtonText("Copy"); // Reset button text after a delay
        }, 2000); // Adjust delay as needed
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };
  

  return (
    <div style={{ position: "relative" }}> {/* Wrap SyntaxHighlighter with a div */}
      <SyntaxHighlighter style={dracula} language={language} PreTag="div">
        {value}
      </SyntaxHighlighter>
      <div
        style={{
          position: "absolute",
          top: "45px",
          right: "30px",
          cursor: "pointer",
          fontSize: "1.2em",
          color: "white",
          transition: "transform 0.2s ease", // Add transition for smooth animation
          transform: isHovered ? "scale(1.1)" : "scale(1)", // Scale on hover
        }}
        onClick={() => handleCopyToClipboard(value)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
        {isHovered && ( // Show tooltip on hover
          <div 
            style={{ 
              position: "absolute", 
              top: "-140%", 
              left: "80%", 
              transform: "translateX(-70%)", 
              backgroundColor: "rgba(0, 0, 0, 0.8)", 
              color: "white", 
              padding: "3px 8px", 
              borderRadius: "4px", 
              fontSize: "0.8em", 
              whiteSpace: "nowrap" 
            }}
          >
            {buttonText} {/* Display buttonText in the tooltip */}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility to format the timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(); // Example: 8:36:51 AM
};

// Component to display a single history item
const HistoryItemDisplay = ({ message, sender, timestamp, score, feedback, confidence, concerns, promptSummary, sessionId, index }: HistoryItem) => {
  const formattedTime = formatTimestamp(timestamp);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

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



   // Calculate the number of lines to show when minimized
   const maxLines = 5; 
   const lineHeight = 20; // Adjust this value based on your line-height style
   const maxHeight = maxLines * lineHeight;



   return (
    <div
      className="history-item"
      id={`prompt-${sessionId}-${index}`}
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
                    padding: "15px",
                    borderRadius: "5px",
                    zIndex: 10,
                    width: "300px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {feedback}
                </div>
              )}
              {promptSummary && (
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
                    padding: "15px",
                    borderRadius: "5px",
                    zIndex: 10,
                    width: "300px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {concerns}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div // Added a wrapping div for the message content
        style={{
          marginTop: "5px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          backgroundColor: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          fontFamily: "monospace",
          maxHeight: sender === "user" && !expanded ? `${maxHeight}px` : "none",
          overflow: sender === "user" && !expanded ? "hidden" : "visible",
          position: "relative", // Add position relative to contain the ellipsis
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {message}
        </ReactMarkdown>
  
        {/* Conditionally render the ellipsis for truncated user messages */}
        {!expanded && sender === "user" && message.split("\n").length > maxLines && (
          <span 
            style={{
              position: "absolute",
              bottom: "5px", // Position it slightly above the bottom
              left: "10px",
              fontSize: "0.8em",
              cursor: "pointer",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent background
              padding: "3px 8px",
              borderRadius: "4px",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            ... See More
          </span>
        )}
      </div>
  
      {/* Conditionally render the "Show Less" button for expanded user messages */}
      {expanded && sender === "user" && message.split("\n").length > maxLines && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ marginTop: "5px", fontSize: "0.8em", padding: "3px 8px", borderRadius: "4px" }}
        >
          Show Less
        </button>
      )}
    </div>
  );
};

// Component to display the entire history
interface HistoryDisplayProps {
  history: HistoryItem[];
  sessionId: string;
}

const HistoryDisplay = ({ history, sessionId }: HistoryDisplayProps) => {
  const historyDisplayRef = useRef<HTMLDivElement>(null); // Create a ref for the HistoryDisplay div

  // Clear the hashtag from the URL when the component mounts
  useEffect(() => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Scroll to bottom when the component mounts or the history changes
  useEffect(() => {
    if (historyDisplayRef.current) {
      historyDisplayRef.current.scrollTop = historyDisplayRef.current.scrollHeight;
    }
  }, [history]); // Run this effect whenever the history changes 

  return (
    <div className="history-display" ref={historyDisplayRef}>
      {history.map((item, index) => {
        return (
          <HistoryItemDisplay key={index} {...item} sessionId={sessionId} index={index} />
        )
      }
      )}
    </div>
  );
};

export default HistoryDisplay;
