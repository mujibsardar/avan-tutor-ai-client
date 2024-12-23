import { AuthUser } from "../types";

interface HeaderProps {
  signOut: () => void;
  user?: AuthUser;
}

function Header({ signOut, user }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Avantutor.ai</h1>
        {!user ? (
          <h2>Welcome</h2>
        ) : (
          <div className="user-info">
            <div className="user-welcome">
              <h2>Welcome, {user.signInDetails?.loginId}</h2>
              </div>
            <div className="user-actions">
              <p>Credits: 10</p> {/* Replace with dynamic credits */}
              <button onClick={signOut}>Log Out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
