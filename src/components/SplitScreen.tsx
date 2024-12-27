import { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";
import { fetchAIResponse } from "../utils/api";
import { formatHistory } from "../utils/formatHistory";
import HistoryDisplay from "./HistoryDisplay";

interface SplitScreenProps {
  sessions: NewSessionResponse[];
  setSessions: (sessions: NewSessionResponse[]) => void; // Add setSessions prop
  activeSession: NewSessionResponse | null;
  setActiveSession: (session: NewSessionResponse | null) => void; // Add setActiveSession prop
  addSession: (newSession: string) => void;
  handleSessionSelect: (session: NewSessionResponse) => void;
}

function SplitScreen({ sessions, setSessions, activeSession, setActiveSession, addSession, handleSessionSelect }: SplitScreenProps) {
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
      const sessionId = activeSession?.sessionId;
  
      // Validate sessionId
      if (!sessionId) {
        console.error("Session ID is required for this request.");
        setOutput("Error: Session ID is missing. Please select or start a new session.");
        return;
      }
  
      const aiResponse = await fetchAIResponse(inputText, sessionId);
      console.log("AI Response:", JSON.stringify(aiResponse, null, 2));
  
      // Update history in the active session with the new response
      const updatedHistory = aiResponse.updatedHistory;
      if (activeSession) {
        setActiveSession({
          ...activeSession,
          history: updatedHistory, // Update only the history property
        });
      } else {
        console.error("Active session is null.");
      }
      
      // Explicitly type the updated sessions array
      const updatedSessions = sessions.map((session) => {
        if (session.sessionId === sessionId) {
          return {
            ...session,
            history: updatedHistory, // Update only the history property
          };
        }
        return session;
      });

    // Now set the updated sessions
    setSessions(updatedSessions);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setOutput("Error fetching response from AI.");
    }
  };

  useEffect(() => {
    if (!activeSession) {
      setOutput("No session selected. Please select or start a session.");
    } else if (activeSession && (!activeSession.history || activeSession.history.length === 0)) {
      setOutput("No history available for the active session.");
    } else if (activeSession?.history) {
      // Format the history and display it if available
      const formattedHistory = formatHistory(activeSession.history);
      setOutput(formattedHistory);
    }
  }, [activeSession]);

  return (
    <div className="split-screen">
      <SidePanel
        sessions={sessions}
        activeSession={activeSession}
        onNewSession={handleNewSession}
        onSessionClick={handleSessionSelect}
      />
      <div className="main-content">
        {activeSession && activeSession.history && activeSession.history.length > 0 ? (
          <HistoryDisplay history={activeSession.history} sessionId={activeSession.sessionId} />
        ) : output && (
          <div className="output-section">
            <p>{output}</p>
          </div>
        )}
      </div>
      <BottomPanel onSend={handleSendToAI} />
    </div>
  );
}

export default SplitScreen;
