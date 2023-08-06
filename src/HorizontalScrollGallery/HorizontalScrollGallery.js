import React, { useEffect, useState } from 'react';
import './HorizontalScrollGallery.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ImageWithMetadata from './ImageWithMetadata';
import ImageUploadForm from './ImageUploadForm';

const HorizontalScrollGallery = () => {
  const [artList, setArtList] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

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
  }, []);

  const handleAddToGallery = () => {
    // Open the form when the "Add to Gallery" button is clicked
    setShowForm(true);
  };

  const handleCloseForm = () => {
    // Close the form when the form is submitted or when clicking the cancel button
    setShowForm(false);
  };

  return (
    <div>
    <h1 className='big-message'>Welcome to Matt's Art Gallery</h1>
      <div className="horizontal-scroll-container">
        {artList.map((art, index) => (
          <div key={index} className="art-item">
            <ImageWithMetadata art={art} />
          </div>
        ))}
      </div>
      <button className="add-to-gallery-btn" onClick={handleAddToGallery}>
        Add to Gallery
      </button>
      {showForm && <ImageUploadForm onClose={handleCloseForm} />}
    </div>
  );
};

export default HorizontalScrollGallery;
