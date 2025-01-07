import { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";
import { fetchAIResponse, deleteSession } from "../utils/api";
import { formatHistory } from "../utils/formatHistory";
import HistoryDisplay from "./HistoryDisplay";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import the Lottie component

interface SplitScreenProps {
    sessions: NewSessionResponse[];
    setSessions: (sessions: NewSessionResponse[]) => void;
    activeSession: NewSessionResponse | null;
    setActiveSession: (session: NewSessionResponse | null) => void;
    addSession: (newSession: string) => void;
    handleSessionSelect: (session: NewSessionResponse) => void;
    userId: string;
}

function SplitScreen({ sessions, setSessions, activeSession, setActiveSession, addSession, handleSessionSelect, userId }: SplitScreenProps) {
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Add loading state for AI response
    const [loadingNewSession, setLoadingNewSession] = useState<boolean>(false);  // Add loading state for new session
    const [loadingSessions, setLoadingSessions] = useState<boolean>(true); //Loading state for sessions in the sidepanel

    useEffect(() => {
        // Check if sessions prop is available. If it is, we can stop the loading state for the sessions in the side panel.
        if (sessions && sessions.length > 0) {
            setLoadingSessions(false);
        }
        else if (sessions && sessions.length == 0) {
            setLoadingSessions(false);
        }
    }, [sessions]);

    const handleNewSession = async (sessionName: string) => {
        try {
             setLoadingNewSession(true); //Start loading new session
             await addSession(sessionName);
            setOutput(`Started session: ${sessionName}`);
        } catch (error) {
            console.error("Error creating session:", error);
        } finally {
          setLoadingNewSession(false);  // Stop loading for new session
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

            setLoading(true); // Start loading

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
        } finally {
            setLoading(false); // End loading regardless of success/failure
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            // Call the API to delete the session
            await deleteSession(sessionId, userId);

            setOutput(`Deleted session`);

            // Wait for a few seconds before refreshing the session list
            setTimeout(() => {
                // Remove the deleted session from the sessions array
                const updatedSessions = sessions.filter(session => session.sessionId !== sessionId);

                // Update the sessions state to reflect the deletion
                setSessions(updatedSessions);

                // Optionally clear the active session if it was the one deleted
                if (activeSession?.sessionId === sessionId) {
                    setActiveSession(null);
                }

                // Clear the output message after the refresh
                setOutput("");
            }, 2000); // Delay of 2000ms (2 seconds)
        } catch (error) {
            console.error("Error deleting session:", error);
            setOutput("Error deleting session.");
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
                onDeleteSession={handleDeleteSession}
                loadingSessions={loadingSessions} // Pass loadingSessions
            />
            <div className="main-content">
                {(loading || loadingNewSession) ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute', // Use absolute positioning
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', // semi-transparent white background
                        zIndex: 1000, // Ensure it's on top of other elements
                    }}>
                        <DotLottieReact
                            src="https://lottie.host/5c5db42a-6e06-4bc9-8263-e80bbda3da00/FOR5UnuGNS.lottie"
                            loop
                            autoplay
                            style={{ height: '200px', width: '200px' }} // Adjust size as needed
                        />
                    </div>
                ) : (
                    <>
                        {activeSession && activeSession.history && activeSession.history.length > 0 ? (
                            <HistoryDisplay history={activeSession.history} sessionId={activeSession.sessionId} />
                        ) : output && (
                            <div className="output-section">
                                <p>{output}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <BottomPanel onSend={handleSendToAI} activeSession={activeSession} />
        </div>
    );
}

export default SplitScreen;