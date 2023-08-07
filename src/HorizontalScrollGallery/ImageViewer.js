// ImageViewer.js
import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import './ImageViewer.css';



const ImageViewer = ({ art, onClose }) => {

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      const getImageUrl = async () => {
        try {
          const storage = getStorage();
          const imageUrl = await getDownloadURL(ref(storage, art.resource));
          setImageUrl(imageUrl);
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      };
  
      getImageUrl();
    }, [art.resource]);


  return (
    <div className="image-viewer-container" onClick={onClose}>
      <img src={imageUrl} alt="Full Size" className="full-image" />
    </div>
  );
};

export default ImageViewer;
