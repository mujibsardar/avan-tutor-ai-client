import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HistoryItem } from "../utils/api";


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
const HistoryItemDisplay: React.FC<HistoryItem & { sessionId: string; index: number }> = ({ message, sender, timestamp, score, feedback, confidence, concerns, promptSummary, sessionId, index }) => {
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

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, sessionId, aiResults }) => {
    const historyDisplayRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("openai");

    useEffect(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    useEffect(() => {
        if (historyDisplayRef.current) {
            historyDisplayRef.current.scrollTop = historyDisplayRef.current.scrollHeight;
        }
    }, [history]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };


    return (
        <div className="history-display" ref={historyDisplayRef}>
            {history.map((item, index) => (
                <HistoryItemDisplay key={index} {...item} sessionId={sessionId} index={index} />
            ))}
            {aiResults && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', borderBottom: '2px solid #ccc' }}>
                    <button
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: activeTab === 'openai' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'openai' ? 'white' : '#f0f0f0',
                            fontWeight: activeTab === 'openai' ? 'bold' : 'normal'
                        }}
                        onClick={() => handleTabClick('openai')}
                    >
                        OpenAI
                    </button>
                    <button
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: activeTab === 'gemini' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'gemini' ? 'white' : '#f0f0f0',
                            fontWeight: activeTab === 'gemini' ? 'bold' : 'normal'
                        }}
                        onClick={() => handleTabClick('gemini')}
                    >
                        Gemini
                    </button>
                    <button
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: activeTab === 'search' ? '2px solid #007bff' : 'none',
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'search' ? 'white' : '#f0f0f0',
                            fontWeight: activeTab === 'search' ? 'bold' : 'normal'
                        }}
                        onClick={() => handleTabClick('search')}
                    >
                        Search Results
                    </button>
                </div>

                <div style={{ padding: '15px', backgroundColor: '#fff', border: '1px solid #ccc' }}>
                    {activeTab === 'openai' && (
                          <>
                             <h4>AI Guidance (OpenAI)</h4>
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
                                 {aiResults.openai?.aiGuidance}
                             </ReactMarkdown>
                            {aiResults.openai?.confidence && (
                                <p>Confidence: {aiResults.openai.confidence}%</p>
                            )}
                            {aiResults.openai?.concerns && (
                                <p>Concerns: {aiResults.openai.concerns}</p>
                            )}
                            {aiResults.prompt?.score && (
                                <p>Score: {aiResults.prompt.score}%</p>
                            )}
                           {aiResults.prompt?.feedback && (
                                <p>Feedback: {aiResults.prompt.feedback}</p>
                           )}
                             {aiResults.prompt?.promptSummary && (
                                 <p>Prompt Summary: {aiResults.prompt.promptSummary}</p>
                             )}
                             </>
                    )}

                    {activeTab === 'gemini' && (
                        <>
                            <h4>AI Guidance (Gemini)</h4>
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
                                {aiResults.gemini?.aiGuidance}
                            </ReactMarkdown>
                            {aiResults.gemini?.confidence && (
                                <p>Confidence: {aiResults.gemini.confidence}%</p>
                            )}
                            {aiResults.gemini?.concerns && (
                                <p>Concerns: {aiResults.gemini.concerns}</p>
                            )}
                            </>
                    )}


                    {activeTab === 'search' && (
                        <>
                            <h4>Google Search Results</h4>
                            {aiResults.search?.results.map((result, index) => (
                                <p key={index}>
                                    <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
                                </p>
                            ))}
                            {aiResults.search?.results.length === 0 && (
                                <p>No search results to display</p>
                            )}
                               </>
                    )}
                </div>
              </div>
            )}
          </div>
    );
};

export default HistoryDisplay;


