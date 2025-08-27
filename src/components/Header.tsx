import { AuthUser } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faBrain,
  faShieldAlt,
  faLock,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './Header.css';

interface HeaderProps {
  signOut: () => void;
  user?: AuthUser | null;
}

function Header({ signOut, user }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Brand Section */}
        <div className="header-brand">
          <FontAwesomeIcon icon={faBrain} className="header-icon" />
          <h1>AvanAITutor.com</h1>
        </div>

        {/* Trust Indicators */}
        <div className="header-trust">
          <div className="trust-badge" title="End-to-end encryption">
            <FontAwesomeIcon icon={faLock} className="trust-badge-icon" />
            <span>Encrypted</span>
          </div>
          <div className="trust-badge" title="Secure AWS infrastructure">
            <FontAwesomeIcon icon={faShieldAlt} className="trust-badge-icon" />
            <span>AWS Secure</span>
          </div>
          <div className="trust-badge" title="GDPR Compliant">
            <FontAwesomeIcon icon={faCheckCircle} className="trust-badge-icon" />
            <span>GDPR</span>
          </div>
        </div>

        {/* User Section */}
        {!user ? (
          <div className="user-welcome">
            <h2>Welcome to AI Tutoring</h2>
            <p className="user-status">Please sign in to continue</p>
          </div>
        ) : (
          <div className="user-info">
            <div className="user-welcome">
              <h2>Welcome, {user.username}</h2>
              <p className="user-status">AI Prompt Tutor • Ready to learn</p>
            </div>

            <div className="user-profile">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="user-actions">
              <button
                onClick={signOut}
                className="btn-primary"
                title="Sign out of your account"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="header-button-icon" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
