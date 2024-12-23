import { useState } from "react";
import InputSection from "./InputSection";
import OutputSection from "./OutputSection";
import SidePanel from "./SidePanel.tsx";
import BottomPanel from "./BottomPanel.tsx";
import { getCurrentUser } from 'aws-amplify/auth';
import { createNewSession } from "../utils/api"; 

function SplitScreen() {
  const [output, setOutput] = useState<string>("");
  const [sessions, setSessions] = useState<string[]>([]); // Tracks session names
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSession, setActiveSession] = useState<string | null>(null); // Current session

  const getStudentId = async (): Promise<string> => {
    try {
      const { userId } = await getCurrentUser();
      return userId; // This is the Cognito user ID
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw new Error("Unable to fetch student ID.");
    }
  };

  const handleAPIResponse = (response: string) => {
    setOutput(response);
  };

  const handleNewSession = async (sessionName: string) => {
    
    try {
      const studentId = await getStudentId();
  
      // Call the API to create or fetch a new session
      const newSession = await createNewSession({ sessionName, studentId });
  
      console.log("Session data loaded successfully:", newSession);
  
      // Update state with the active session's name and its details (optional)
      setActiveSession(newSession.sessionName);
  
      // Optionally, you can update other UI elements or load additional session data here
      // For example, if you have session history, set it in state:
      // setSessionHistory(newSession.history);
  
      // If the output should display something specific to the session:
      setOutput(`Loaded session: ${newSession.sessionName}`);
    } catch (error) {
      console.error("Error handling session click:", error);
      // Optionally display an error message to the user
    }
  };

  const handleSessionClick = async (sessionName: string) => {
    setActiveSession(sessionName);
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
