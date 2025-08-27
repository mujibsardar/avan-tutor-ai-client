import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HistoryItem } from "../utils/api";
import { transformHistory, TransformedHistoryItem } from "../utils/fromAPI/transformHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCopy,
    faCheck,
    faUser,
    faRobot,
    faSearch,
    faInfoCircle,
    faChevronDown,
    faChevronUp,
    faExternalLinkAlt,
    faComments
} from '@fortawesome/free-solid-svg-icons';
import './HistoryDisplay.css';


// Interface for CodeBlock props
interface CodeBlockProps {
    language: string;
    value: string;
}
const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className="code-block-container">
            <div className="code-block-header">
                <span className="code-language">{language}</span>
                <button
                    className={`copy-button ${isCopied ? 'copied' : ''}`}
                    onClick={() => handleCopyToClipboard(value)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    title={isCopied ? "Copied!" : "Copy code"}
                >
                    <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} />
                    {isCopied ? "Copied" : "Copy"}
                </button>
                {showTooltip && !isCopied && (
                    <div className="copy-tooltip">
                        Copy to clipboard
                    </div>
                )}
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: 'var(--gray-800)',
                }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

// Utility to format the timestamp
const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
};

// Utility to get sender information
const getSenderInfo = (sender: string) => {
    switch (sender) {
        case 'user':
            return { name: 'You', avatar: 'U', class: 'user' };
        case 'openai':
            return { name: 'AI (OpenAI)', avatar: 'AI', class: 'openai' };
        case 'gemini':
            return { name: 'AI (Gemini)', avatar: 'AI', class: 'gemini' };
        default:
            return { name: 'Unknown', avatar: '?', class: 'user' };
    }
};

// Component to display a single history item
const HistoryItemDisplay: React.FC<HistoryItem & { sessionId: string; index: number }> = ({ message, sender, timestamp, score, feedback, confidence, concerns, promptSummary }) => {
    const formattedTime = formatTimestamp(timestamp);
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    // Safety check: if message is undefined, show a fallback
    if (!message) {
        return (
            <div className={`history-item ${sender}-message error`}>
                <div className="message-header">
                    <div className="sender-info">
                        <div className={`sender-avatar ${sender}`}>
                            {getSenderInfo(sender).avatar}
                        </div>
                        <div>
                            <div className={`sender-name ${sender}`}>
                                {getSenderInfo(sender).name}
                            </div>
                            <div className="message-timestamp">
                                {formattedTime}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="message-content error">
                    <p className="error-message">
                        <FontAwesomeIcon icon={faInfoCircle} className="error-icon" />
                        Message content is not available
                    </p>
                </div>
            </div>
        );
    }

    // Determine metric classes based on values
    const getScoreClass = (score: number) => {
        if (score >= 90) return 'excellent';
        if (score >= 70) return 'good';
        if (score >= 50) return 'fair';
        return 'poor';
    };

    const getConfidenceClass = (confidence: number) => {
        if (confidence >= 90) return 'excellent';
        if (confidence >= 70) return 'good';
        if (confidence >= 50) return 'fair';
        return 'poor';
    };

    const senderInfo = getSenderInfo(sender);
    const isLongMessage = message.split('\n').length > 8 || message.length > 800;


    return (
        <div className={`history-item ${sender}-message ${senderInfo.class}`}>
            <div className="message-header">
                <div className="sender-info">
                    <div className={`sender-avatar ${senderInfo.class}`}>
                        {senderInfo.avatar}
                    </div>
                    <div>
                        <div className={`sender-name ${senderInfo.class}`}>
                            {senderInfo.name}
                        </div>
                        <div className="message-timestamp">
                            {formattedTime}
                        </div>
                    </div>
                </div>

                <div className="message-metrics">
                    {/* User Score */}
                    {sender === "user" && score !== undefined && (
                        <div className="metric-item">
                            <div className={`metric-score ${getScoreClass(score)}`}>
                                Score: {score}%
                            </div>
                            {feedback && (
                                <div className="info-icon-wrapper">
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="info-icon"
                                        onMouseEnter={() => setHoveredInfo("feedback")}
                                        onMouseLeave={() => setHoveredInfo(null)}
                                    />
                                    {hoveredInfo === "feedback" && (
                                        <div className="metric-tooltip">
                                            {feedback}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI Confidence */}
                    {(sender === "openai" || sender === "gemini") && confidence !== undefined && (
                        <div className="metric-item">
                            <div className={`metric-score ${getConfidenceClass(confidence)}`}>
                                Confidence: {confidence}%
                            </div>
                            {concerns && (
                                <div className="info-icon-wrapper">
                                    <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        className="info-icon"
                                        onMouseEnter={() => setHoveredInfo("concerns")}
                                        onMouseLeave={() => setHoveredInfo(null)}
                                    />
                                    {hoveredInfo === "concerns" && (
                                        <div className="metric-tooltip">
                                            {concerns}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Prompt Summary */}
                    {promptSummary && (
                        <div className="prompt-summary">
                            {promptSummary}
                        </div>
                    )}
                </div>
            </div>

            <div className={`message-content ${isLongMessage && !expanded ? 'expandable' : ''} ${expanded ? 'expanded' : ''}`}>
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

                {isLongMessage && !expanded && (
                    <button className="expand-button" onClick={() => setExpanded(true)}>
                        <FontAwesomeIcon icon={faChevronDown} /> Show More
                    </button>
                )}
            </div>

            {expanded && isLongMessage && (
                <button className="collapse-button" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faChevronUp} /> Show Less
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
                        <FontAwesomeIcon icon={faRobot} className="tab-icon" />
                        OpenAI
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'gemini' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gemini')}
                    >
                        <FontAwesomeIcon icon={faRobot} className="tab-icon" />
                        Gemini
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <FontAwesomeIcon icon={faSearch} className="tab-icon" />
                        Search Results
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
                        <div className="search-results">
                            <h3 className="search-results-title">
                                <FontAwesomeIcon icon={faSearch} />
                                Search Results
                            </h3>
                            <ul className="search-results-list">
                                {responses.search.message
                                    .split('\n\n')
                                    .map((resultBlock, idx) => {
                                        const titleMatch = resultBlock.match(/Title:\s*(.+)/);
                                        const linkMatch = resultBlock.match(/Link:\s*(https?:\/\/\S+)/);
                                        const descriptionMatch = resultBlock.match(/Description:\s*(.+)/);
                                        const sourceMatch = resultBlock.match(/Source:\s*(\S+)/);

                                        if (titleMatch && linkMatch) {
                                            const title = titleMatch[1].trim();
                                            const url = linkMatch[1].trim();
                                            const description = descriptionMatch ? descriptionMatch[1].trim() : "No description available.";
                                            const source = sourceMatch ? sourceMatch[1].trim() : "Unknown Source";

                                            return (
                                                <li key={idx} className="search-result-item">
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="search-result-title"
                                                    >
                                                        {title}
                                                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginLeft: '8px', fontSize: '0.8em' }} />
                                                    </a>
                                                    <div className="search-result-url">
                                                        <span className="search-result-source">{source}</span> - {url}
                                                    </div>
                                                    <p className="search-result-description">{description}</p>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })
                                    .filter(Boolean)}
                            </ul>
                        </div>
                    )}

                    {/* Show appropriate message when no response is available */}
                    {activeTab === 'openai' && !responses.openai && (
                        <div className="no-response-message">
                            <FontAwesomeIcon icon={faRobot} className="no-response-icon" />
                            <p>No OpenAI response available for this prompt.</p>
                        </div>
                    )}
                    {activeTab === 'gemini' && !responses.gemini && (
                        <div className="no-response-message">
                            <FontAwesomeIcon icon={faRobot} className="no-response-icon" />
                            <p>No Gemini response available for this prompt.</p>
                        </div>
                    )}
                    {activeTab === 'search' && !responses.search && (
                        <div className="no-response-message">
                            <FontAwesomeIcon icon={faSearch} className="no-response-icon" />
                            <p>No search results available for this prompt.</p>
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
            {transformedHistory.length === 0 ? (
                <div className="history-empty">
                    <FontAwesomeIcon icon={faComments} className="history-empty-icon" />
                    <h2 className="history-empty-title">No conversation yet</h2>
                    <p className="history-empty-description">
                        Start a conversation with your AI tutor by typing a message or uploading a document below.
                    </p>
                </div>
            ) : (
                transformedHistory.map((item, index) => (
                    <HistoryBundleDisplay key={index} {...item} sessionId={sessionId} index={index} />
                ))
            )}
        </div>
    );
};

export default HistoryDisplay;


