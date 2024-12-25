import { useState } from "react";
import OutputSection from "./OutputSection";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";
import { fetchAIResponse } from "../utils/api";

interface SplitScreenProps {
  sessions: NewSessionResponse[];
  activeSession: NewSessionResponse | null;
  addSession: (newSession: string) => void;
  handleSessionSelect: (session: NewSessionResponse) => void;
}

function SplitScreen({ sessions, activeSession, addSession, handleSessionSelect }: SplitScreenProps) {
  const [output, setOutput] = useState<string>("");

  const handleNewSession = async (sessionName: string) => {
    try {
      await addSession(sessionName);
      setOutput(`Started session: ${sessionName}`);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleSendToAI = async (inputText: string) => {
    try {
      const aiResponse = await fetchAIResponse(inputText);
      console.log("AI Response:", JSON.stringify(aiResponse,null,2));
      setOutput(aiResponse.aiGuidance); // Update the output with AI's response
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setOutput("Error fetching response from AI.");
    }
  };

  return (
    <div className="split-screen">
      <SidePanel
        sessions={sessions}
        activeSession={activeSession}
        onNewSession={handleNewSession}
        onSessionClick={handleSessionSelect}
      />
      <div className="main-content">
        <OutputSection output={output} />
      </div>
      <BottomPanel onSend={handleSendToAI} />
    </div>
  );
}

export default SplitScreen;
