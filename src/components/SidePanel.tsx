import { useState, useEffect, useCallback } from "react";
import { NewSessionResponse } from "../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faShieldAlt,
  faLock,
  faPlus,
  faHistory,
  faCalendarAlt,
  faUserGraduate,
  faBrain,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { transformHistory } from "../utils/fromAPI/transformHistory";
import './SidePanel.css';

interface SidePanelProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  onNewSession: (sessionName: string) => void;
  onSessionClick: (session: NewSessionResponse) => void;
  onDeleteSession: (sessionId: string) => void;
  loadingSessions: boolean;
}

function SidePanel({
  sessions,
  activeSession,
  onNewSession,
  onSessionClick,
  onDeleteSession,
  loadingSessions
}: SidePanelProps) {
  const [newSessionName, setNewSessionName] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPromptSummaries, setShowPromptSummaries] = useState<{ [sessionId: string]: boolean }>({});
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure active session highlight updates correctly
  useEffect(() => {
    if (activeSession) {
      console.log("Active session changed:", activeSession.sessionName);
    }
  }, [activeSession]);

  const handleNewSessionSubmit = useCallback(async () => {
    if (!newSessionName.trim()) return;

    setIsCreatingSession(true);
    setError(null);

    try {
      await onNewSession(newSessionName);
      setNewSessionName("");
      // Show success feedback
      setTimeout(() => {
        setIsCreatingSession(false);
      }, 1000);
    } catch (err) {
      setError("Failed to create session. Please try again.");
      setIsCreatingSession(false);
    }
  }, [newSessionName, onNewSession]);

  const handleToggleSummaries = useCallback((sessionId: string) => {
    setShowPromptSummaries(prevState => ({
      ...prevState,
      [sessionId]: !prevState[sessionId]
    }));
  }, []);

  const handleDeleteSession = useCallback((sessionId: string, sessionName: string) => {
    if (window.confirm(`Are you sure you want to delete "${sessionName}"? This action cannot be undone.`)) {
      onDeleteSession(sessionId);
    }
  }, [onDeleteSession]);

  // Sort sessions based on modifiedAt or createdAt, newest first
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = a.modifiedAt ? new Date(a.modifiedAt) : new Date(a.createdAt);
    const dateB = b.modifiedAt ? new Date(b.modifiedAt) : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Function to group sessions by date categories
  const groupSessionsByDate = useCallback(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const grouped: { [key: string]: NewSessionResponse[] } = {
      "Today": [],
      "Yesterday": [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      "Older": [],
    };

    sortedSessions.forEach((session) => {
      const sessionDate = session.modifiedAt ? new Date(session.modifiedAt) : new Date(session.createdAt);
      if (sessionDate.toDateString() === today.toDateString()) {
        grouped["Today"].push(session);
      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        grouped["Yesterday"].push(session);
      } else if (sessionDate >= sevenDaysAgo) {
        grouped["Previous 7 Days"].push(session);
      } else if (sessionDate >= thirtyDaysAgo) {
        grouped["Previous 30 Days"].push(session);
      } else {
        grouped["Older"].push(session);
      }
    });

    // Remove empty groups
    const filteredGroups = Object.fromEntries(
      Object.entries(grouped).filter(([_, sessions]) => sessions.length > 0)
    );

    return filteredGroups;
  }, [sortedSessions]);

  const groupedSessions = groupSessionsByDate();

  const renderSessionList = useCallback((sessions: NewSessionResponse[]) => {
    return sessions.map((session) => (
      <li
        key={session.sessionId}
        className={`session-item ${activeSession?.sessionId === session.sessionId ? 'active' : ''}`}
        onClick={() => onSessionClick(session)}
      >
        <div className="session-header">
          <div className="session-info">
            <span className="session-name">{session.sessionName}</span>
            <span className="session-date">
              {new Date(session.modifiedAt || session.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSession(session.sessionId, session.sessionName);
            }}
            title="Delete session"
            aria-label={`Delete session: ${session.sessionName}`}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>

        {session.history.some(item => item.sender === "user" && item.promptSummary) && (
          <div className="session-summaries">
            <button
              className="toggle-summaries-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSummaries(session.sessionId);
              }}
              aria-expanded={showPromptSummaries[session.sessionId] ?? true}
              aria-label="Toggle prompt summaries"
            >
              <FontAwesomeIcon
                icon={(showPromptSummaries[session.sessionId] ?? true) ? faChevronUp : faChevronDown}
                className="toggle-icon"
              />
              <span>Prompt History</span>
            </button>

            {(showPromptSummaries[session.sessionId] ?? true) && (
              <ul className="summaries-list">
                {transformHistory(session.history).map((item, index) => (
                  <li key={index} className="summary-item">
                    <a
                      href={`#prompt-${session.sessionId}-${index}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSessionClick(session);
                        setTimeout(() => {
                          const element = document.getElementById(`prompt-${session.sessionId}-${index}`);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }, 100);
                      }}
                      className="summary-link"
                      title={item.prompt.promptSummary}
                    >
                      {item.prompt.promptSummary && item.prompt.promptSummary.length > 40
                        ? item.prompt.promptSummary.substring(0, 40) + "..."
                        : item.prompt.promptSummary}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    ));
  }, [activeSession, showPromptSummaries, handleToggleSummaries, handleDeleteSession, onSessionClick]);

  const renderLoadingSkeleton = () => (
    <div className="loading-skeleton">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-subtitle"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`side-panel ${isMinimized ? 'minimized' : ''}`}>
      {/* Trust & Security Header */}
      <div className="trust-header">
        <div className="security-badges">
          <div className="security-badge" title="End-to-end encryption">
            <FontAwesomeIcon icon={faLock} className="security-icon" />
            <span>Encrypted</span>
          </div>
          <div className="security-badge" title="Secure AWS infrastructure">
            <FontAwesomeIcon icon={faShieldAlt} className="security-icon" />
            <span>AWS Secure</span>
          </div>
        </div>
      </div>

      {/* Minimize Button - Always Visible */}
      <div
        className="minimize-button"
        onClick={() => setIsMinimized(!isMinimized)}
        data-tooltip={isMinimized ? "Expand AI Tutor Panel" : "Collapse AI Tutor Panel"}
        title={isMinimized ? "Expand AI Tutor Panel" : "Collapse AI Tutor Panel"}
      >
        <FontAwesomeIcon
          icon={isMinimized ? faChevronRight : faChevronLeft}
          className="minimize-icon"
        />
      </div>

      {!isMinimized && (
        <>
          {/* Header Section */}
          <div className="panel-header">
            <div className="header-icon">
              <FontAwesomeIcon icon={faBrain} className="brain-icon" />
            </div>
            <h1 className="panel-title">AI Prompt Tutor</h1>
            <p className="panel-subtitle">Master AI interactions & prompt engineering</p>
          </div>

          {/* New Session Section */}
          <div className="new-session-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faPlus} className="section-icon" />
              Start New AI Session
            </h2>
            <div className="new-session-form">
              <input
                type="text"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Enter AI prompt session name..."
                className="session-input"
                onKeyPress={(e) => e.key === 'Enter' && handleNewSessionSubmit()}
                disabled={isCreatingSession}
              />
              <button
                onClick={handleNewSessionSubmit}
                className={`create-btn ${isCreatingSession ? 'creating' : ''}`}
                disabled={!newSessionName.trim() || isCreatingSession}
              >
                {isCreatingSession ? (
                  <>
                    <div className="spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} />
                    Start AI Session
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="error-message">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {error}
              </div>
            )}
          </div>

          {/* Sessions List Section */}
          <div className="sessions-section">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faHistory} className="section-icon" />
              AI Prompt Sessions
            </h2>

            {loadingSessions ? (
              renderLoadingSkeleton()
            ) : sessions.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faUserGraduate} className="empty-icon" />
                <p>No AI sessions yet</p>
                <span>Start your first AI prompt session to begin learning!</span>
              </div>
            ) : (
              <div className="sessions-list">
                {Object.entries(groupedSessions).map(([category, categorySessions]) => (
                  <div key={category} className="session-category">
                    <h3 className="category-title">
                      <FontAwesomeIcon icon={faCalendarAlt} className="category-icon" />
                      {category}
                      <span className="session-count">({categorySessions.length})</span>
                    </h3>
                    <ul className="sessions-ul">
                      {renderSessionList(categorySessions)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Trust Indicators */}
          <div className="panel-footer">
            <div className="trust-indicators">
              <div className="trust-item">
                <FontAwesomeIcon icon={faCheckCircle} className="trust-icon" />
                <span>GDPR Compliant</span>
              </div>
              <div className="trust-item">
                <FontAwesomeIcon icon={faShieldAlt} className="trust-icon" />
                <span>AI-Safe & Secure</span>
              </div>
            </div>
            <div className="version-info">
              v1.0.0 • AI Prompt Tutor • Powered by AWS
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SidePanel;