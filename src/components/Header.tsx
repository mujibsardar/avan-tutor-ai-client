import { AuthUser } from "../types";

interface HeaderProps {
  signOut: () => void;
  user?: AuthUser | null;
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
              <h2>Welcome, {user.username}</h2>
              </div>
            <div className="user-actions">
              <button onClick={signOut}>Log Out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
