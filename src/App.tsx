import { useEffect, useState } from "react";
import Header from "./components/Header";
import SplitScreen from "./components/SplitScreen";
import { AuthUser } from "./types";
import { fetchSessions, NewSessionResponse, createNewSession } from "./utils/api";
import "./App.css"; // Import main App CSS
import "./auth.css";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { Helmet } from "react-helmet";


type SessionsState = NewSessionResponse[];

function App() {
    const [user, setUser] = useState<AuthUser | null>(null); // Use local state for user
    const [sessions, setSessions] = useState<SessionsState>([]);
    const [activeSession, setActiveSession] = useState<NewSessionResponse | null>(null);
    const [authForm, setAuthForm] = useState<'signIn' | 'signUp' | null>(null);

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (userData.signInDetails?.loginId) {
                    setUser({
                        username: userData.signInDetails?.loginId,
                        userId: userData.userId,
                    });
                }
                else {
                    throw new Error("No user data found");
                }
            } catch (error) {
                // User is not signed in, that's fine we just set the state to null
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const loadSessions = async () => {
            if (user) {
                try {
                    const userSessions = await fetchSessions(user.userId);
                    setSessions(userSessions.sessions);
                } catch (error) {
                    console.error("Error loading sessions:", error);
                }
            }
        };
        loadSessions();
    }, [user]);

    const addSession = async (sessionName: string) => {
        if (user) {
            try {
                const newSession = await createNewSession({ studentId: user.userId, sessionName });
                setSessions((prevSessions) => [...prevSessions, newSession]);
                setActiveSession(newSession);
            } catch (error) {
                console.error("Error creating session:", error);
            }
        }
    };

    const handleSessionSelect = (session: NewSessionResponse) => {
        setActiveSession(session);
    };

    const handleAuthForm = (type: 'signIn' | 'signUp' | null) => {
        setAuthForm(type);
    }

    return (
        <div className="App">
            <Helmet>
                <title>AvanAiTutor - Master AI interactions & prompt engineering</title>
                <meta
                    name="description"
                    content="AvanAiTutor is an AI tutoring platform that uses ChatGPT and Gemini to help students learn and study more effectively."
                />
                <link rel="icon" href="/favicon.ico" />
            </Helmet>

            {user ? (
                <>
                    <Header signOut={handleSignOut} user={user} />
                    <SplitScreen
                        sessions={sessions}
                        setSessions={setSessions}
                        activeSession={activeSession}
                        setActiveSession={setActiveSession}
                        addSession={addSession}
                        handleSessionSelect={handleSessionSelect}
                        userId={user.userId}
                    />
                </>
            ) : (
                <div className=".auth-wrapper">
                    <div className="auth-page">
                        <div className={"container " + (authForm === "signUp" ? "right-panel-active" : "")} id="container">
                            <SignUpForm />
                            <SignInForm />
                            <div className="overlay-container">
                                <div className="overlay">
                                    <div className="overlay-panel overlay-left">
                                        <h1>Welcome Back!</h1>
                                        <p>
                                            We saved all your stuff for you.
                                        </p>
                                        <button
                                            className="ghost"
                                            id="signIn"
                                            onClick={() => handleAuthForm("signIn")}
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                    <div className="overlay-panel overlay-right">
                                        <h1>Hello, Student!</h1>
                                        <p>Just enter your email and choose a password to get started</p>
                                        <button
                                            className="ghost "
                                            id="signUp"
                                            onClick={() => handleAuthForm("signUp")}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;