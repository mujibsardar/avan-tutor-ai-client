// SignUpForm.tsx
import React, { useState } from "react";
import { signUp } from 'aws-amplify/auth';
import '../auth.css';

function SignUpForm() {
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);

    interface SignUpFormState {
        email: string;
        password: string;
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
    }


    const handleOnSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

        const {  email, password }: SignUpFormProps = state;
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
            password: ""
        });
    }
    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Create Account</h1>
                <div className="social-container">
                    <a href="#" className="social">
                        <i className="fab fa-facebook-f" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-google-plus-g" />
                    </a>
                    <a href="#" className="social">
                        <i className="fab fa-linkedin-in" />
                    </a>
                </div>
                <span>or use your email for registration</span>
                <input
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button>Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm;