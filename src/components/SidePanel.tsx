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
    <div className="side-panel" style={{ width: isMinimized ? '50px' : '20%', overflowY: "auto" }}> {/* Conditionally set width */}
     <div 
        className="minimize-button" 
        onClick={() => setIsMinimized(!isMinimized)} // Toggle minimized state
        style={{ 
          position: "absolute", 
          top: "50%", 
          right: isMinimized ? "96%" : "79%", // Adjust position based on minimized state
          transform: "translateY(-50%)", 
          backgroundColor: "#f9f9f9", 
          border: "1px solid #ccc", 
          borderRadius: "50%", 
          padding: "8px", 
          cursor: "pointer",
        }}
      >
        {/* Use a suitable icon for minimize/maximize */}
        {isMinimized ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"> {/* Adjusted viewBox */}
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/> {/* Arrow right path */}
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"> {/* Adjusted viewBox */}
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/> {/* Arrow left path */}
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
      <div className="sessions-list"> {/* Add scroll */}
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
      </>
      )}
    </div>
  );
}

export default SidePanel;
