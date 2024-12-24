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
            <li
              key={session.sessionId}
              onClick={() => onSessionClick(session)}
              style={{
                backgroundColor: activeSession?.sessionId === session.sessionId ? "#ffe6a5" : "transparent",
                cursor: "pointer", // Add pointer cursor for clickable sessions
              }}
            >
              {session.sessionName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SidePanel;
