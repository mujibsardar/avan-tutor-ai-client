import React, { useState } from "react";
import { signUp } from 'aws-amplify/auth';
import '../auth.css';

function SignUpForm() {
    const [state, setState] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);

    interface SignUpFormState {
        email: string;
        password: string;
        confirmPassword: string;
    }

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
        setState((prevState: SignUpFormState) => ({
            ...prevState,
            [evt.target.name]: value
        }));
    };

    interface SignUpFormProps {
      email: string;
      password: string;
      confirmPassword: string;
    }

    const handleOnSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      const { email, password, confirmPassword }: SignUpFormProps = state;

      if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
      }

        try {
          await signUp({
            username: email,
              password,
          });
          console.log('Signed up successfully!');
        } catch (error: unknown) {
          console.error('Failed to sign up', error);
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        }
        setState({
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Create Account</h1>
                <span>or use your email for registration</span>
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
        </div>
    );
}

export default SignUpForm;