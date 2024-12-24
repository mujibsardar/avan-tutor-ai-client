import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Header from "./components/Header";
import SplitScreen from "./components/SplitScreen";
import { AuthUser } from "./types";
import { fetchSessions, NewSessionResponse, createNewSession } from "./utils/api"; // API function to fetch sessions
import "./App.css";

// Define the type for sessions state directly
type SessionsState = NewSessionResponse[]; // Just an array of session objects

function App() {
  const { user, signOut } = useAuthenticator();
  const [sessions, setSessions] = useState<SessionsState>([]); // Manage sessions in App

  // Ensure TypeScript knows what 'user' looks like
  const authUser = user as AuthUser;

  useEffect(() => {
    const loadSessions = async () => {
      if (authUser) {
        try {
          const userSessions = await fetchSessions(authUser.userId);
          setSessions(userSessions.sessions);
        } catch (error) {
          console.error("Error loading sessions:", error);
        }
      }
    };

    loadSessions();
  }, [authUser]);

  const addSession = async (sessionName: string) => {
    if (authUser) {
      try {
        const newSession = await createNewSession({studentId: authUser.userId, sessionName}); // Make API call to create the session
        setSessions((prevSessions) => [...prevSessions, newSession]); // Add the session to the state
      } catch (error) {
        console.error("Error creating session:", error);
      }
    }
  };


  return (
    <div className="App">
      <Header signOut={signOut} user={authUser} />
      {authUser ? (
        <SplitScreen sessions={sessions} addSession={addSession} />
      ) : (
        <div>
          <h1>Welcome to avantutor.ai</h1>
        </div>
      )}
    </div>
  );
}

export default App;
