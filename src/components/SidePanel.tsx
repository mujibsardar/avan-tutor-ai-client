import { useState, useEffect } from "react";
import { NewSessionResponse } from "../utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { transformHistory } from "../utils/fromAPI/transformHistory";

interface SidePanelProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  onNewSession: (sessionName: string) => void;
  onSessionClick: (session: NewSessionResponse) => void;
  onDeleteSession: (sessionId: string) => void;
  loadingSessions: boolean;
}

function SidePanel({ sessions, activeSession, onNewSession, onSessionClick, onDeleteSession, loadingSessions }: SidePanelProps) {
  const [newSessionName, setNewSessionName] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPromptSummaries, setShowPromptSummaries] = useState<{ [sessionId: string]: boolean }>({});

  // Ensure active session highlight updates correctly
  useEffect(() => {
    if (activeSession) {
      console.log("Active session changed:", activeSession.sessionName);
    }
  }, [activeSession]);

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


    // Sort sessions based on modifiedAt or createdAt, newest first
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = a.modifiedAt ? new Date(a.modifiedAt) : new Date(a.createdAt);
    const dateB = b.modifiedAt ? new Date(b.modifiedAt) : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  // Function to group sessions by date categories
    const groupSessionsByDate = () => {
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
          const sessionDate = session.modifiedAt ? new Date(session.modifiedAt) : new Date(session.createdAt)
           if (sessionDate.toDateString() === today.toDateString()) {
                grouped["Today"].push(session);
             } else if (sessionDate.toDateString() === yesterday.toDateString()) {
                grouped["Yesterday"].push(session);
            } else if (sessionDate >= sevenDaysAgo) {
                grouped["Previous 7 Days"].push(session);
            } else if (sessionDate >= thirtyDaysAgo) {
                 grouped["Previous 30 Days"].push(session);
            }
            else {
                 grouped["Older"].push(session);
            }

        });

         // Remove empty groups
       const filteredGroups = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(grouped).filter(([_, sessions]) => sessions.length > 0)
         );

       return filteredGroups;
    };

    const groupedSessions = groupSessionsByDate();

    const renderSessionList = (sessions: NewSessionResponse[]) => {
      return sessions.map((session) => (
         <li key={session.sessionId}
                  style={{
                    marginBottom: "5px",
                  }}
                  className={activeSession?.sessionId === session.sessionId ? "active" : ""}
                >
                  <div
                    onClick={() => onSessionClick(session)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                 >
                    {session.sessionName}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Are you sure you want to delete this session?")) {
                          onDeleteSession(session.sessionId);
                        }
                      }}
                      style={{
                        marginLeft: "5px",
                        padding: "5px",
                        border: "none",
                        color: "grey",
                        cursor: "pointer",
                        backgroundColor: "transparent",
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
                        <FontAwesomeIcon
                          icon={(showPromptSummaries[session.sessionId] ?? true) ? faChevronUp : faChevronDown}
                          style={{
                            fontSize: "1rem",
                            color: "#555",
                            cursor: "pointer",
                            transition: "color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#007BFF")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        />
                      </span>
                      {(showPromptSummaries[session.sessionId] ?? true) && (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          {transformHistory(session.history).map((item, index) => (
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
                                  - {item.prompt.promptSummary && item.prompt.promptSummary.length > 30 ? item.prompt.promptSummary.substring(0, 30) + "..." : item.prompt.promptSummary}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </>
                  )}
                </li>
      ));
    }

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
             {loadingSessions ? (
                   <ul>
                 { Array.from({ length: 3 }).map((_, index) => (
                   <li key={index} className="placeholder-session" style={{marginBottom: "5px", backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
                     <div style={{height: '20px', width: '80%', backgroundColor: 'lightgrey', borderRadius: '4px'}}></div>
                    </li>
                  ))}
                </ul>
            ) : Object.entries(groupedSessions).map(([category, sessions]) => (
                <div key={category}>
                   <h4>{category}</h4>
                    <ul>
                      {renderSessionList(sessions)}
                  </ul>
             </div>
           ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SidePanel;