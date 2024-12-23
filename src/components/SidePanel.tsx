import { useState } from "react";

interface SidePanelProps {
  sessions: string[];
  onNewSession: (sessionName: string) => void;
  onSessionClick: (sessionName: string) => void;
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
      <ul>
        {sessions.map((session) => (
          <li key={session} onClick={() => onSessionClick(session)}>
            {session}
          </li>
        ))}
      </ul>
      <div className="new-session">
        <input
          type="text"
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
          placeholder="New session name"
        />
        <button onClick={handleNewSessionSubmit}>Start Session</button>
      </div>
    </div>
  );
}

export default SidePanel;
