import { useState } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";

interface SplitScreenProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  addSession: (newSession: string) => void;
}

function SplitScreen({ sessions, activeSession, addSession }: SplitScreenProps) {
  const [output, setOutput] = useState<string>("");

  const handleAPIResponse = (response: string) => {
    setOutput(response);
  };

  const handleNewSession = async (sessionName: string) => {
    try {
      await addSession(sessionName); // Update session list in App
      setOutput(`Started session: ${sessionName}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSessionClick = (session: NewSessionResponse) => {
    setOutput(`Loaded session: ${session.sessionName}`);
  };

  return (
    <div className="split-screen">
      <SidePanel
        sessions={sessions}
        activeSession={activeSession} // Pass the active session here
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
