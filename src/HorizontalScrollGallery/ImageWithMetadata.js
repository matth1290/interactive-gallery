import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ImageWithMetadata = ({ art }) => {
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
    <div className="image-container">
      {imageUrl ? (
        <img src={imageUrl} alt={`Art ${art.title}`} />
      ) : (
        <p>Loading image...</p>
      )}

      <div className="metadata-container">
        <p>{art.title}</p>
        <p>{Array.isArray(art.artists) ? art.artists.join(', ') : art.artists}</p>
        <p>{art.description}</p>
      </div>
    </div>
  );
};

export default ImageWithMetadata;
