import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HistoryItem } from "../utils/api";
import { transformHistory, TransformedHistoryItem } from "../utils/fromAPI/transformHistory";


// Interface for CodeBlock props
interface CodeBlockProps {
    language: string;
    value: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [buttonText, setButtonText] = useState("Copy");

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setButtonText("Copied!");
                setTimeout(() => {
                    setButtonText("Copy");
                }, 2000);
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    };


    return (
        <div style={{ position: "relative" }}>
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
                    transition: "transform 0.2s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
                onClick={() => handleCopyToClipboard(value)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
                {isHovered && (
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
                        {buttonText}
                    </div>
                )}
            </div>
        </div>
    );
};

// Utility to format the timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

// Component to display a single history item
const HistoryItemDisplay: React.FC<HistoryItem & { sessionId: string; index: number }> = ({ message, sender, timestamp, score, feedback, confidence, concerns, promptSummary}) => {
    const formattedTime = formatTimestamp(timestamp);
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    // Determine score color based on score value
    const scoreColor =
        (score ?? 0) >= 90 ? "#28a745" :
            (score ?? 0) >= 70 ? "#ffc107" :
                (score ?? 0) >= 50 ? "#fd7e14" :
                    "#dc3545";

    // Determine confidence color based on confidence value
    const confidenceColor =
        (confidence ?? 0) >= 90 ? "#28a745" :
            (confidence ?? 0) >= 70 ? "#ffc107" :
                "#dc3545";


    const maxLines = 5;
    const lineHeight = 20;
    const maxHeight = maxLines * lineHeight;


    return (
        <div
            className="history-item"
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
                    {sender === "user" ? "User" : (sender === "openai" ? "AI (OpenAI)" : "AI (Gemini)")} <span style={{ fontWeight: "normal" }}>({formattedTime})</span>
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
                                        position: "absolute", // Keeps it relative to the parent
                                        top: "25px", // Adjust the position
                                        left: "0", // Align with the info icon
                                        backgroundColor: "white", // Ensure visibility
                                        border: "1px solid #ccc", // Optional border for clarity
                                        padding: "15px",
                                        borderRadius: "5px",
                                        zIndex: 9999, // High z-index to place it on top
                                        width: "300px", // Define the width to prevent layout shifts
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a shadow for better visibility
                                        overflow: "hidden", // Prevent internal scrolls
                                        whiteSpace: "normal", // Prevent single-line overflow
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
                {(sender === "openai" || sender === "gemini") && confidence !== undefined && (
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
            <div
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
                    position: "relative",
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

                {!expanded && sender === "user" && message.split("\n").length > maxLines && (
                    <span
                        style={{
                            position: "absolute",
                            bottom: "0px",
                            left: "80%",
                            fontSize: "0.8em",
                            cursor: "pointer",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            padding: "3px 8px",
                            borderRadius: "4px",
                        }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        ... See More
                    </span>
                )}
            </div>

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

const HistoryBundleDisplay: React.FC<TransformedHistoryItem & { sessionId: string; index: number }> = ({
  prompt,
  responses,
  sessionId,
  index,
}) => {
  const [activeTab, setActiveTab] = useState('openai'); // Default tab

  return (
    <div
      className="history-bundle"
      id={`prompt-${sessionId}-${index}`}
    >
      <div className="history-card">
        {/* Prompt */}
        <HistoryItemDisplay {...prompt} sessionId={sessionId} index={index} />

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'openai' ? 'active' : ''}`}
            onClick={() => setActiveTab('openai')}
          >
            OpenAI
          </button>
          <button
            className={`tab-button ${activeTab === 'gemini' ? 'active' : ''}`}
            onClick={() => setActiveTab('gemini')}
          >
            Gemini
          </button>
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Google Search
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'openai' && responses.openai && (
            <HistoryItemDisplay {...responses.openai} sessionId={sessionId} index={index} />
          )}
          {activeTab === 'gemini' && responses.gemini && (
            <HistoryItemDisplay {...responses.gemini} sessionId={sessionId} index={index} />
          )}
          {activeTab === 'search' && responses.search && (
  <div>
    <strong>Search Results:</strong>
    <ul>
    {activeTab === 'search' && responses.search && (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <strong style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Search Results:</strong>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
            {responses.search.message
                .split('\n\n') // Split by double newlines to separate results
                .map((resultBlock, idx) => {
                const titleMatch = resultBlock.match(/Title:\s*(.+)/);
                const linkMatch = resultBlock.match(/Link:\s*(https?:\/\/\S+)/);
                const descriptionMatch = resultBlock.match(/Description:\s*(.+)/);
                const sourceMatch = resultBlock.match(/Source:\s*(\S+)/); // Extract the source

                if (titleMatch && linkMatch) {
                    const title = titleMatch[1].trim();
                    const url = linkMatch[1].trim();
                    const description = descriptionMatch ? descriptionMatch[1].trim() : "No description available.";
                    const source = sourceMatch ? sourceMatch[1].trim() : "Unknown Source";

                    return (
                    <li key={idx} style={{ marginBottom: '20px' }}>
                        <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: '#1a73e8',
                            textDecoration: 'none',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px'
                        }}
                        >
                        {title}
                        </a>
                        <p style={{ color: '#4d5156', marginBottom: '5px' }}>
                        <span style={{ color: '#70757a' }}>{source} - </span>
                        {url}
                        </p>
                        <p style={{ color: '#70757a', fontSize: '14px' }}>{description}</p>
                    </li>
                    );
                }
                return null; // Skip blocks that don't match the expected format
                })
                .filter(Boolean)} {/* Remove null entries */}
            </ul>
        </div>
    )}
    </ul>
  </div>
)}

        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
};



interface AIResults {
    prompt: {
        score: number | null;
        feedback: string | null;
        promptSummary: string | null;
    };
    openai: {
        aiGuidance: string | null;
        confidence: number | null;
        concerns: string | null;
    };
    gemini: {
        aiGuidance: string | null;
        confidence: number | null;
        concerns: string | null;
    };
    search: {
        results: string[];
    };
}
// Component to display the entire history
interface HistoryDisplayProps {
    history: HistoryItem[];
    sessionId: string;
    aiResults?: AIResults;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, sessionId }) => {
    const historyDisplayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    useEffect(() => {
        if (historyDisplayRef.current) {
            historyDisplayRef.current.scrollTop = historyDisplayRef.current.scrollHeight;
        }
    }, [history]);

    console.log(' ');
    console.log(`==> history: ${JSON.stringify(history, null, 2)}`);
    console.log(' ');
    console.log(' ');


    const transformedHistory = transformHistory(history);

    console.log(' ');
    console.log(`==> transformedHistory: ${JSON.stringify(transformedHistory, null, 2)}`);
    console.log(' ');
    console.log(' ');

    return (
        <div className="history-display" ref={historyDisplayRef}>
          {transformedHistory.map((item, index) => (
              <HistoryBundleDisplay key={index} {...item} sessionId={sessionId} index={index} />
          ))}
        </div>
    );
};

export default HistoryDisplay;


