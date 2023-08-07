// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HorizontalScrollGallery from './HorizontalScrollGallery/HorizontalScrollGallery';
import LoginPage from './LoginPage/LoginPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const App = () => {
  // Replace this array with the names of your art assets.
  const artList = ['aegina_sunset.jpeg', 'balloon_day.jpeg', 'berkeley_fiery_sky.jpeg', 'morro_bay.jpeg', 'friendly_giraffe.jpeg', 'little_boat.jpeg', 'pv_candy_sky.jpeg'];

  // State to keep track of user authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Function to handle changes in the user's authentication state
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set isAuthenticated to true
        setIsAuthenticated(true);
      } else {
        // User is signed out, set isAuthenticated to false
        setIsAuthenticated(false);
      }
      // Mark authentication check as finished
      setIsAuthChecked(true);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Render a loading state while the authentication check is in progress
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Redirect to login page if not authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/gallery" /> : <Navigate to="/login" />
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          {/* Protected routes */}
          {isAuthenticated ? (
            <Route path="/gallery" element={<HorizontalScrollGallery artList={artList} />} />
          ) : (
            <Route path="/gallery" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
