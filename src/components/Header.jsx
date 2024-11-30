import React from "react";

function Header({ signOut, user }) {
  return (
    <header className="header">
      <h1>Avantutor.ai</h1>
      {!user ? (
        <h2>Welcome</h2>
      ) : (
        <>
          <h2>Welcome, {user?.signInDetails?.loginId}</h2>
          <p>Credits: 10</p> {/* Replace with dynamic credits */}
          <button onClick={signOut}>Log Out</button>
        </>
      )}
    </header>
  );
}

export default Header;
