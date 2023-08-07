// LoginPage.js
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(true); // State to control the visibility of the title
  const [showMessage, setShowMessage] = useState(false); // State to control the visibility of the message
  const [showButtons, setShowButtons] = useState(false); // State to control the visibility of login buttons
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Call onLogin after successful login
      onLogin();
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleAnonymousLogin = async () => {
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
      // Call onLogin after successful login
      onLogin();
      navigate('/');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  // Use useEffect to set the visibility of login buttons after the login-message finishes typing
  useEffect(() => {
    // Set a timer to show the title after a short delay
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 500); // Adjust the delay as needed

    // Set a timer to show the message after the title animation completes
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 2000); // Adjust the delay as needed

    // Set a timer to show the buttons after the message animation completes
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 4650); // Adjust the delay as needed

    // Clean up the timers when the component unmounts
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(messageTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  return (
    <div className="login-page-container">
      {/* Rain animation */}
      <div className="rain-animation"></div>

      <div className="login-form-container">
        <div className="login-content-container">
          {showTitle && ( // Show the title only when showTitle is true
            <h1 className="login-form-title">Welcome to the Gallery</h1>
          )}
          {showMessage && ( // Show the message only when showMessage is true
            <p className="login-message">Please authenticate to view the art.</p>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {showButtons && ( // Render the login buttons only when showButtons is true
            <div className="login-buttons-container">
              <button className="login-button" onClick={handleGoogleLogin}>
                Login with Google
              </button>
              <button className="login-button" onClick={handleAnonymousLogin}>
                Login Anonymously
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;