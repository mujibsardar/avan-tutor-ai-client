import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faCopy,
  faDownload,
  faRefresh,
  faCheckCircle,
  faExclamationTriangle,
  faLightbulb,
  faSpinner,
  faRocket
} from '@fortawesome/free-solid-svg-icons';
import './OutputSection.css';

interface OutputSectionProps {
  output: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  responseTime?: number;
  wordCount?: number;
}

function OutputSection({ output, isLoading = false, error = null, onRetry, responseTime, wordCount }: OutputSectionProps) {
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (output && !isLoading && !error) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [output, isLoading, error]);

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    // Error State
    if (error) {
      return (
        <div className="output-error">
          <FontAwesomeIcon icon={faExclamationTriangle} className="output-error-icon" />
          <h3 className="output-error-title">Something went wrong</h3>
          <p className="output-error-message">{error}</p>
          {onRetry && (
            <button className="output-retry-btn" onClick={onRetry}>
              <FontAwesomeIcon icon={faRefresh} />
              Try Again
            </button>
          )}
        </div>
      );
    }

    // Loading State
    if (isLoading) {
      return (
        <div className="output-loading">
          <div className="output-loading-spinner"></div>
          <h3 className="output-loading-text">AI is thinking</h3>
          <p className="output-loading-subtext">
            Generating your response
            <span className="output-loading-dots">
              <span className="output-loading-dot"></span>
              <span className="output-loading-dot"></span>
              <span className="output-loading-dot"></span>
            </span>
          </p>
        </div>
      );
    }

    // Empty State
    if (!output) {
      return (
        <div className="output-empty">
          <FontAwesomeIcon icon={faRocket} className="output-empty-icon" />
          <h3 className="output-empty-title">Ready for your question</h3>
          <p className="output-empty-description">
            Ask me anything! I'm here to help you learn and understand complex topics through AI-powered tutoring.
          </p>
          <div className="output-empty-hint">
            <FontAwesomeIcon icon={faLightbulb} className="output-hint-icon" />
            <span>Try asking about a specific topic, uploading a document, or requesting explanations</span>
          </div>
        </div>
      );
    }

    // Content State
    return (
      <>
        {showSuccess && (
          <div className="output-success-banner">
            <FontAwesomeIcon icon={faCheckCircle} className="output-success-icon" />
            <span className="output-success-text">Response generated successfully!</span>
          </div>
        )}
        
        <div className={`output-response ${output ? 'has-content' : ''}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {output}
          </ReactMarkdown>
        </div>

        {(responseTime || wordCount) && (
          <div className="output-stats">
            {responseTime && (
              <div className="output-stat">
                <span className="output-stat-value">{responseTime.toFixed(1)}s</span>
                <span className="output-stat-label">Response Time</span>
              </div>
            )}
            {wordCount && (
              <div className="output-stat">
                <span className="output-stat-value">{wordCount}</span>
                <span className="output-stat-label">Words</span>
              </div>
            )}
            <div className="output-stat">
              <span className="output-stat-value">{output.length}</span>
              <span className="output-stat-label">Characters</span>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="output-section-content">
      <div className="output-header">
        <h2 className="output-title">
          <FontAwesomeIcon icon={faRobot} className="output-title-icon" />
          AI Response
        </h2>
        
        <div className="output-actions">
          <button
            className="output-action-btn"
            onClick={handleCopy}
            disabled={!output || isLoading}
            title={copied ? "Copied!" : "Copy response"}
          >
            <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
          </button>
          
          <button
            className="output-action-btn"
            onClick={handleDownload}
            disabled={!output || isLoading}
            title="Download response"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
          
          {onRetry && (
            <button
              className="output-action-btn"
              onClick={onRetry}
              disabled={isLoading}
              title="Regenerate response"
            >
              <FontAwesomeIcon icon={isLoading ? faSpinner : faRefresh} />
            </button>
          )}
        </div>
      </div>

      <div className="output-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default OutputSection;
