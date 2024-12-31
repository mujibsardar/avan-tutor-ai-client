import { useState, useEffect } from "react";
import { NewSessionResponse } from "../utils/api";

interface SidePanelProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  onNewSession: (sessionName: string) => void;
  onSessionClick: (session: NewSessionResponse) => void;
}

function SidePanel({ sessions, activeSession, onNewSession, onSessionClick }: SidePanelProps) {
  const [newSessionName, setNewSessionName] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false); // State to track minimized state
  const [showPromptSummaries, setShowPromptSummaries] = useState<{ [sessionId: string]: boolean }>({}); // State for toggling prompt summaries per session


   // Ensure active session highlight updates correctly
   useEffect(() => {
    // This hook ensures we react to any changes in the activeSession prop
    if (activeSession) {
      console.log("Active session changed:", activeSession.sessionName);
    }
  }, [activeSession]); // React when activeSession changes

  const handleNewSessionSubmit = () => {
    if (newSessionName.trim()) {
      onNewSession(newSessionName);
      setNewSessionName("");
    }
  };

  const handleToggleSummaries = (sessionId: string) => {
    setShowPromptSummaries(prevState => ({
      ...prevState,
      [sessionId]: !prevState[sessionId]
    }));
  };


  return (
    <div className="side-panel" style={{ width: isMinimized ? '50px' : '20%', overflowY: "auto" }}>
      <div
        className="minimize-button"
        onClick={() => setIsMinimized(!isMinimized)}
        style={{
          position: "absolute",
          top: "50%",
          right: isMinimized ? "96%" : "79%",
          transform: "translateY(-50%)",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
        }}
      >
        {isMinimized ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        )}
      </div>
      {!isMinimized && (
        <>
          <h2>Tutoring Log</h2>
          <div className="new-session">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="New session name"
            />
            <button onClick={handleNewSessionSubmit}>Start Session</button>
          </div>
          <div className="sessions-list">
            <h3>Sessions</h3>
            <ul>
              {sessions.map((session) => (
                <li key={session.sessionId}
                  style={{
                    marginBottom: "5px",
                  }}
                  className={activeSession?.sessionId === session.sessionId ? "active" : ""}
                >
                  <div onClick={() => onSessionClick(session)}>
                    {session.sessionName}
                  </div>
                  {session.history.some(item => item.sender === "user" && item.promptSummary) && (
                    <>
                      <span
                        onClick={() => handleToggleSummaries(session.sessionId)}
                        style={{
                          marginLeft: "10px",
                          fontSize: "0.8em",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <i className={`fas fa-chevron-${(showPromptSummaries[session.sessionId] ?? true) ? 'down' : 'right'}`} style={{ marginRight: "5px" }}></i>
                        {(showPromptSummaries[session.sessionId] ?? true) ? "Hide Session Log" : "Show Session Log"}
                      </span>
                      {(showPromptSummaries[session.sessionId] ?? true) && (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {session.history.map((item, index) => (
                            item.sender === "user" && item.promptSummary && (
                              <li key={index} style={{ marginLeft: "15px", cursor: "pointer" }}>
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
                                  style={{
                                    color: "gray",
                                    textDecoration: "none",
                                    fontSize: "0.9em",
                                  }}
                                >
                                  - {item.promptSummary.length > 30 ? item.promptSummary.substring(0, 30) + "..." : item.promptSummary}
                                </a>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}


export default SidePanel;
