import { useState, useEffect } from "react";
import { NewSessionResponse } from "../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface SidePanelProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  onNewSession: (sessionName: string) => void;
  onSessionClick: (session: NewSessionResponse) => void;
  onDeleteSession: (sessionId: string) => void; // Add onDeleteSession prop
}

function SidePanel({ sessions, activeSession, onNewSession, onSessionClick, onDeleteSession }: SidePanelProps) {
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
          right: isMinimized ? "95.5%" : "78.5%",
          transform: "translateY(-50%)",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: "50%",
          padding: "15px",
          cursor: "pointer",
        }}
      >
        {isMinimized ? ( 
          <FontAwesomeIcon icon={faChevronRight} /> 
        ) : (
          <FontAwesomeIcon icon={faChevronLeft} />
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
                  <div 
                    onClick={() => onSessionClick(session)} 
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} // Add space-between
                 > 
                    {session.sessionName}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Stop the click event from propagating to the parent
                        if (window.confirm("Are you sure you want to delete this session?")) {
                          onDeleteSession(session.sessionId);
                        }
                      }} 
                      style={{ 
                        marginLeft: "5px", 
                        padding: "5px", 
                        border: "none", // Add this line
                        color: "grey", // Add this line
                        cursor: "pointer",
                        backgroundColor: "transparent", // Add this line
                      }}
                    >
                       <FontAwesomeIcon icon={faTrash} /> 
                    </button>
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
                        <span
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "20px",
                            lineHeight: "20px",
                            textAlign: "center",
                            border: "1px solid gray",
                            borderRadius: "50%",
                            fontWeight: "bold",
                            backgroundColor: "#f0f0f0",
                            marginRight: "5px",
                          }}
                        >
                          {(showPromptSummaries[session.sessionId] ?? true) ? "-" : "+"}
                        </span>
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
