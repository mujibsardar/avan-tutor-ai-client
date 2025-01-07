import React, { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import "../auth.css";

function SignUpForm() {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "", // For OTP input
  });
  const [error, setError] = useState<string | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP step

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setState((prevState) => ({
      ...prevState,
      [evt.target.name]: value,
    }));
  };

  const handleSignUpSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { email, password, confirmPassword } = state;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
        setIsOtpSent(true); // Proceed to OTP confirmation step
      } else {
        console.log("Sign-up complete!");
      }
    } catch (error) {
      console.error("Failed to sign up", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleOtpSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { email, otp } = state;

    try {
      const response = await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      if (response.nextStep?.signUpStep === "DONE") {
        console.log("Sign-up confirmed and complete!");
        setState({
          email: "",
          password: "",
          confirmPassword: "",
          otp: "",
        });
        setIsOtpSent(false);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to confirm sign-up", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="form-container sign-up-container">
      {!isOtpSent ? (
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={state.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button>Sign Up</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <h1>Confirm Sign Up</h1>
          <span>Enter the OTP sent to your email (wait at least 5 minutes)...don't forget to check your spam folder</span>
          <input
            type="text"
            name="otp"
            value={state.otp}
            onChange={handleChange}
            placeholder="OTP"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button>Confirm</button>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
