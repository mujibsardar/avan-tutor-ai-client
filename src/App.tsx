import { useEffect, useState } from "react";
import Header from "./components/Header";
import SplitScreen from "./components/SplitScreen";
import { AuthUser } from "./types";
import { fetchSessions, NewSessionResponse, createNewSession } from "./utils/api";
import "./App.css"; // Import main App CSS
import "./auth.css";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { Helmet } from "react-helmet";

type SessionsState = NewSessionResponse[];

function App() {
    const [user, setUser] = useState<AuthUser | null>(null); // Use local state for user
    const [sessions, setSessions] = useState<SessionsState>([]);
    const [activeSession, setActiveSession] = useState<NewSessionResponse | null>(null);
    const [authForm, setAuthForm] = useState<'signIn' | 'signUp' | null>(null);
    const [isLoading, setIsLoading] = useState(true); // New state for loading indicator

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    // Function to fetch and set user data
    const fetchUser = async () => {
        try {
            const userData = await getCurrentUser();
            if (userData.signInDetails?.loginId) {
                setUser({
                    username: userData.signInDetails?.loginId,
                    userId: userData.userId,
                });
            } else {
                throw new Error("No user data found");
            }
        } catch (error) {
            // User is not signed in, that's fine we just set the state to null
            setUser(null);
        } finally {
            setIsLoading(false); // Set loading to false after user data is fetched or error
        }
    };

    useEffect(() => {
        // Initial user fetch
        fetchUser();

        // Set up authentication state listener
        const unsubscribe = Hub.listen('auth', ({ payload }) => {
            switch (payload.event) {
                case 'signedIn':
                    console.log('User signed in, fetching user data...');
                    fetchUser();
                    break;
                case 'signedOut':
                    console.log('User signed out');
                    setUser(null);
                    break;
                case 'tokenRefresh':
                    console.log('Token refreshed');
                    fetchUser();
                    break;
                case 'tokenRefresh_failure':
                    console.log('Token refresh failed');
                    setUser(null);
                    break;
                default:
                    break;
            }
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
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

    const handleAuthSuccess = () => {
        // Immediately fetch user data after successful authentication
        fetchUser();
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
            ) : isLoading ? (
                <div className="auth-wrapper">
                    <div className="auth-page">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="auth-wrapper">
                    <div className="auth-page">
                        <div className={"container " + (authForm === "signUp" ? "right-panel-active" : "")} id="container">
                            <SignUpForm onAuthSuccess={handleAuthSuccess} onSwitchToSignIn={() => handleAuthForm("signIn")} />
                            <SignInForm onAuthSuccess={handleAuthSuccess} />
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