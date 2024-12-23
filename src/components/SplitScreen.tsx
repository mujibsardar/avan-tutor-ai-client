import { useState } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import SidePanel from "./SidePanel.tsx";
import BottomPanel from "./BottomPanel.tsx";

function SplitScreen() {
  const [output, setOutput] = useState<string>("");
  const [sessions, setSessions] = useState<string[]>([]); // Tracks session names
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSession, setActiveSession] = useState<string | null>(null); // Current session

  const handleAPIResponse = (response: string) => {
    setOutput(response);
  };

  const handleNewSession = (sessionName: string) => {
    setSessions([...sessions, sessionName]);
    setActiveSession(sessionName);
  };

  const handleSessionClick = (sessionName: string) => {
    setActiveSession(sessionName);
    // Optionally load session data here
  };

  return (
    <div className="split-screen">
      <SidePanel
        sessions={sessions}
        onNewSession={handleNewSession}
        onSessionClick={handleSessionClick}
      />
      <div className="main-content">
          <InputSection onSubmit={handleAPIResponse} />
          <OutputSection output={output} />
      </div>
      <BottomPanel />
    </div>
  );
}

export default SplitScreen;
