import React, { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import "../auth.css";

interface SignUpFormProps {
  onAuthSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

function SignUpForm({ onAuthSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setState((prevState) => ({
      ...prevState,
      [evt.target.name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";

    return null;
  };

  const handleSignUpSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { email, password, confirmPassword } = state;

    // Validation
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (response.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        setIsOtpSent(true);
        setSuccess("Account created! Please check your email for the verification code.");
      } else {
        setSuccess("Sign-up complete!");
      }
    } catch (error) {
      console.error("Failed to sign up", error);
      if (error instanceof Error) {
        const errorMessage = error.message.includes('UsernameExistsException')
          ? 'An account with this email already exists. Please sign in instead.'
          : error.message.includes('InvalidPasswordException')
            ? 'Password does not meet requirements. Please try again.'
            : error.message;
        setError(errorMessage);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setLoading(true);
    setError(null);

    const { email, otp } = state;

    if (!otp.trim()) {
      setError("Please enter the verification code");
      setLoading(false);
      return;
    }

    try {
      const response = await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      if (response.nextStep?.signUpStep === "DONE") {
        setSuccess("Account verified successfully! You can now sign in.");
        setTimeout(() => {
          // Reset form and go back to sign up
          setState({
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
          });
          setIsOtpSent(false);
          setSuccess(null);
          
          // Switch to sign in form for immediate login
          if (onSwitchToSignIn) {
            onSwitchToSignIn();
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to confirm sign-up", error);
      if (error instanceof Error) {
        const errorMessage = error.message.includes('CodeMismatchException')
          ? 'Invalid verification code. Please check your email and try again.'
          : error.message;
        setError(errorMessage);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBackToSignUp = () => {
    setIsOtpSent(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="form-container sign-up-container">
      {!isOtpSent ? (
        <form onSubmit={handleSignUpSubmit} className="auth-form">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Join AvanAiTutor and start your AI learning journey</p>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                value={state.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="auth-form">
          <div className="form-header">
            <button
              type="button"
              className="back-button"
              onClick={goBackToSignUp}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </button>
            <h1>Verify Your Email</h1>
            <p>We sent a verification code to {state.email}</p>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="text"
                name="otp"
                value={state.otp}
                onChange={handleChange}
                placeholder="Enter verification code"
                disabled={loading}
                required
                maxLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
              <span>{success}</span>
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
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </button>
          </div>

          <div className="otp-help">
            <p>Didn't receive the code? Check your spam folder or wait a few minutes.</p>
            <p>The code is valid for 24 hours.</p>
          </div>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
