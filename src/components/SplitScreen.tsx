import { useState } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";
interface SplitScreenProps {
  sessions: NewSessionResponse[];
  addSession: (newSession: string) => void;
}

function SplitScreen({ sessions, addSession }: SplitScreenProps) {
  const [output, setOutput] = useState<string>("");
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const handleAPIResponse = (response: string) => {
    setOutput(response);
  };

  const handleNewSession = async (sessionName: string) => {
    try {
      await addSession(sessionName); // Update session list in App
      setActiveSession(sessionName);
      setOutput(`Started session: ${sessionName}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSessionClick = (session: NewSessionResponse) => {
    setActiveSession(session.sessionName);
    setOutput(`Loaded session: ${session.sessionName}`);
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
