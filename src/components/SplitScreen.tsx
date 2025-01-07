import { useState, useEffect } from "react";
import SidePanel from "./SidePanel";
import BottomPanel from "./BottomPanel";
import { NewSessionResponse } from "../utils/api";
import { fetchAIResponse, deleteSession } from "../utils/api";
import { formatHistory } from "../utils/formatHistory";
import HistoryDisplay from "./HistoryDisplay";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingNewSession, setLoadingNewSession] = useState<boolean>(false);
    const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
    const [sortedSessions, setSortedSessions] = useState<NewSessionResponse[]>([]); // New state to hold sorted sessions

    useEffect(() => {
        if (sessions && sessions.length > 0) {
            setLoadingSessions(false);
        }
        else if (sessions && sessions.length == 0) {
            setLoadingSessions(false);
        }
    }, [sessions]);

     // Function to sort sessions
    const sortSessions = (sessionsToSort: NewSessionResponse[]) => {
      const sorted = [...sessionsToSort].sort((a, b) => {
        const dateA = a.modifiedAt ? new Date(a.modifiedAt) : new Date(a.createdAt);
        const dateB = b.modifiedAt ? new Date(b.modifiedAt) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
        });
    return sorted;
    }

    // Update the sortedSessions whenever the sessions array changes.
    useEffect(() => {
      if (sessions) {
        setSortedSessions(sortSessions(sessions));
      }
      }, [sessions]);


    const handleNewSession = async (sessionName: string) => {
        try {
            setLoadingNewSession(true);
            await addSession(sessionName);
            setOutput(`Started session: ${sessionName}`);
        } catch (error) {
            console.error("Error creating session:", error);
        } finally {
            setLoadingNewSession(false);
        }
    };

    const handleSendToAI = async (inputText: string) => {
        try {
            const sessionId = activeSession?.sessionId;

            if (!sessionId) {
                console.error("Session ID is required for this request.");
                setOutput("Error: Session ID is missing. Please select or start a new session.");
                return;
            }

            setLoading(true);

            const aiResponse = await fetchAIResponse(inputText, sessionId);
            console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

            const updatedHistory = aiResponse.updatedHistory;

              if (activeSession) {
                const updatedActiveSession = {
                  ...activeSession,
                  history: updatedHistory,
                };
                setActiveSession(updatedActiveSession);
                
                 // Update the session in the sessions array.
                const updatedSessions = sessions.map((session) => {
                    if (session.sessionId === sessionId) {
                        return updatedActiveSession;
                    }
                   return session;
                });

                setSessions(updatedSessions);

            } else {
                console.error("Active session is null.");
            }


        } catch (error) {
            console.error("Error fetching AI response:", error);
            setOutput("Error fetching response from AI.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            await deleteSession(sessionId, userId);

            setOutput(`Deleted session`);

            setTimeout(() => {
                const updatedSessions = sessions.filter(session => session.sessionId !== sessionId);
                setSessions(updatedSessions);

                if (activeSession?.sessionId === sessionId) {
                    setActiveSession(null);
                }
                setOutput("");
            }, 2000);
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
            const formattedHistory = formatHistory(activeSession.history);
            setOutput(formattedHistory);
        }
    }, [activeSession]);


    return (
        <div className="split-screen">
            <SidePanel
                sessions={sortedSessions} // Pass sorted sessions here
                activeSession={activeSession}
                onNewSession={handleNewSession}
                onSessionClick={handleSessionSelect}
                onDeleteSession={handleDeleteSession}
                loadingSessions={loadingSessions}
            />
            <div className="main-content">
                {(loading || loadingNewSession) ? (
                   <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 1000,
                    }}>
                        <DotLottieReact
                            src="https://lottie.host/5c5db42a-6e06-4bc9-8263-e80bbda3da00/FOR5UnuGNS.lottie"
                            loop
                            autoplay
                            style={{ height: '200px', width: '200px' }}
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