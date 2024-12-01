import { useAuthenticator } from '@aws-amplify/ui-react';
import Header from "./components/Header";
import SplitScreen from "./components/SplitScreen";
import { AuthUser } from "./types";
import "./App.css";

function App() {
  const { user, signOut } = useAuthenticator();

  // Ensure TypeScript knows what 'user' looks like
  const authUser = user as AuthUser;

  return (
    <div className="App">
      <Header signOut={signOut} user={authUser} />
      {authUser ? (
        <SplitScreen />
      ) : (
        <div>
          <h1>Welcome to avantutor.ai</h1>
        </div>
      )}
    </div>
  );
}

export default App;
