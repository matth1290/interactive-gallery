// HorizontalScrollGallery.js
import React, { useEffect, useState } from 'react';
import './HorizontalScrollGallery.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ImageWithMetadata from './ImageWithMetadata';
import ImageUploadForm from './ImageUploadForm';

const HorizontalScrollGallery = () => {
  const navigate = useNavigate();
  const [artList, setArtList] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [userEmail, setUserEmail] = useState('');

  const fetchImageMetadata = async () => {
    try {
      const db = getFirestore();
      const artRef = collection(db, 'art');
      const snapshot = await getDocs(artRef);

      const fetchedArtList = snapshot.docs.map((doc) => doc.data());
      // Sort the fetchedArtList alphabetically based on title
      fetchedArtList.sort((a, b) => a.title.localeCompare(b.title));
      setArtList(fetchedArtList);
    } catch (error) {
      console.error('Error fetching image metadata:', error);
    }
  };

  useEffect(() => {
    fetchImageMetadata();

    // Get the user's email after authentication
    const auth = getAuth();
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }
  }, []);

  const handleAddToGallery = () => {
    // Open the form when the "Add to Gallery" button is clicked
    setShowForm(true);
  };

  const handleCloseForm = () => {
    // Close the form when the form is submitted or when clicking the cancel button
    setShowForm(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="horizontal-scroll-gallery">
      <div className="top-right">
        <button className="leave-btn" onClick={handleSignOut}>
          Leave Gallery
        </button>
      </div>
      <h1 className="big-message">Welcome to Matt's Art Gallery</h1>
      <div className="horizontal-scroll-container">
        {artList.map((art, index) => (
          <div key={index} className="art-item">
            <ImageWithMetadata art={art} />
          </div>
        ))}
      </div>
      {userEmail === 'matth1290@berkeley.edu' && (
        <button className="add-to-gallery-btn" onClick={handleAddToGallery}>
          Add to Gallery
        </button>
      )}
      {showForm && <ImageUploadForm onClose={handleCloseForm} />}
    </div>
  );
};

export default HorizontalScrollGallery;
