import { useState } from "react";
import { NewSessionResponse } from "../utils/api";

interface SidePanelProps {
  sessions: NewSessionResponse[];
  onNewSession: (sessionName: string) => void;
  onSessionClick: (session: NewSessionResponse) => void;
}

function SidePanel({ sessions, onNewSession, onSessionClick }: SidePanelProps) {
  const [newSessionName, setNewSessionName] = useState<string>("");

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
            <li key={session.sessionId} onClick={() => onSessionClick(session)}>
              {session.sessionName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SidePanel;
