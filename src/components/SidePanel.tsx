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

  const handlePromptSummaryClick = (session: NewSessionResponse, index: number) => {
    onSessionClick(session); // Switch to the correct session first
    setTimeout(() => {
      const element = document.getElementById(`prompt-${session.sessionId}-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Adjust timeout as needed
  };

  return (
    <div className="side-panel">
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
              className={activeSession?.sessionId === session.sessionId ? "active" : ""} // Add active class
              >
              <div 
                onClick={() => onSessionClick(session)} 
              > 
                {session.sessionName}
              </div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {session.history.map((item, index) => (
                  item.sender === "user" && item.promptSummary && (
                    <li key={index} style={{ marginLeft: "15px", cursor: "pointer" }}> {/* Added cursor pointer to li */}
                       <a
                        href={`#prompt-${session.sessionId}-${index}`}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default link behavior
                          handlePromptSummaryClick(session, index); // Call the new handler
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SidePanel;
