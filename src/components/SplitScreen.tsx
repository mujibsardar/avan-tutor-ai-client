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
  handleSessionSelect: (session: NewSessionResponse) => void; // Add the function to handle session selection

}

function SplitScreen({ sessions, activeSession, addSession, handleSessionSelect }: SplitScreenProps) {
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

  return (
    <div className="split-screen">
      <SidePanel
        sessions={sessions}
        activeSession={activeSession} // Pass the active session here
        onNewSession={handleNewSession}
        onSessionClick={handleSessionSelect} // Pass the handleSessionSelect function

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
