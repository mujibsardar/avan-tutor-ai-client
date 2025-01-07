import  { useState } from "react";
import { signIn } from 'aws-amplify/auth';
import '../auth.css'; // Import auth.css

function SignInForm() {
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);

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
    };

    interface SignInFormProps {
        email: string;
        password: string;
    }

    const handleOnSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const { email, password }: SignInFormProps = state;
        try {
            await signIn({
                username: email,
                password
            });
            window.location.reload();
            // If sign in was successful, you can redirect to another page or
            // update some state to indicate the user is logged in
            console.log('Signed in successfully!');

        } catch (error: unknown) {
            console.error('Failed to sign in', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }

        for (const key in state) {
            setState({
                ...state,
                [key]: ""
            });
        }
    };
    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleOnSubmit}>
                <h1>Sign in</h1>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    autoComplete="email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <a href="#">Forgot your password?</a>
                <button>Sign In</button>
            </form>
        </div>
    );
}
export default SignInForm;