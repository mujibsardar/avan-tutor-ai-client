import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import Header from "./components/Header";
import SplitScreen from "./components/SplitScreen";
import "./App.css";


function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <div className="App">
      <Header signOut={signOut} user={user} />
      {user ? (
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
