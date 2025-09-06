import { useState } from "react";
import { signIn } from 'aws-amplify/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../auth.css';

interface SignInFormProps {
    onAuthSuccess?: () => void;
}

function SignInForm({ onAuthSuccess }: SignInFormProps) {
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    interface SignInFormState {
        email: string;
        password: string;
    }

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setState((prevState: SignInFormState) => ({
            ...prevState,
            [evt.target.name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleOnSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setLoading(true);
        setError(null);

        const { email, password } = state;

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            await signIn({
                username: email,
                password
            });
            console.log('Signed in successfully!');

            // Clear form
            setState({ email: "", password: "" });

            // Notify parent component of successful authentication
            if (onAuthSuccess) {
                onAuthSuccess();
            }

            // The Hub listener in App.tsx will handle the state update
            // No need for manual page reload - the auth state will update automatically

        } catch (error: unknown) {
            console.error('Failed to sign in', error);
            if (error instanceof Error) {
                // Improve error messages for better UX
                const errorMessage = error.message.includes('Incorrect username or password')
                    ? 'Invalid email or password. Please try again.'
                    : error.message.includes('User is not confirmed')
                        ? 'Please check your email and confirm your account before signing in.'
                        : error.message;
                setError(errorMessage);
            } else {
                setError('An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit} className="auth-form">
                <div className="form-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your AI tutoring sessions</p>
                </div>

                <div className="brand-message">
                    <p className="brand-text">
                        <span className="brand-name">AvanAI Tutor</span> is backed by <a href="https://aicodingtutor.org" target="_blank" rel="follow noopener noreferrer" className="brand-link">AICodingTutor.org</a>
                    </p>
                </div>

                <div className="input-group">
                    <div className="input-wrapper">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={state.email}
                            onChange={handleChange}
                            autoComplete="email"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-wrapper">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={state.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            disabled={loading}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <FontAwesomeIcon icon={faEnvelope} className="error-icon" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <a href="#" className="forgot-password">
                        Forgot your password?
                    </a>
                </div>
            </form>
        </div>
    );
}

export default SignInForm;