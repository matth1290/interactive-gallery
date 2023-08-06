import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ImageUploadForm.css'; // Import the CSS file

const ImageUploadForm = ({ onClose }) => {
  const [imageFile, setImageFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState('');
  const [showForm, setShowForm] = useState(true); // State to control form visibility

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || artists.length === 0 || !title) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    try {
      if (description.length > 180) {
        alert('Description must be shorter than 180 characters.');
        return;
      }

      if (medium.length > 20) {
        alert('Medium must be shorter than 20 characters.');
        return;
      }

      if (title.length > 40) {
        alert('Title must be shorter than 40 characters.');
        return;
      }

      if (artists.length > 5 || artists.some((artist) => artist.length > 30)) {
        alert('Artists must be a list of up to 5 names, each shorter than 30 characters.');
        return;
      }

      if (imageFile.size > 10 * 1024 * 1024) {
        alert('Image file size must be less than 10MB.');
        return;
      }

      // Upload the image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `art/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      // Save image metadata to Firestore
      const db = getFirestore();
      const artCollectionRef = collection(db, 'art');
      await addDoc(artCollectionRef, {
        artists,
        title,
        description,
        medium,
        resource: `art/${imageFile.name}`,
        show: true,
        date_added: serverTimestamp(), // Set the current timestamp
      });

      // Reset form values
      setImageFile(null);
      setArtists([]);
      setTitle('');
      setDescription('');
      setMedium('');

      // Close the form after successful upload
      onClose();
    } catch (error) {
      console.error('Error uploading image and metadata:', error);
    }
  };

  const handleCancel = () => {
    // Set the state to close the form
    setShowForm(false);
    // Call the onClose function after a short delay to allow the form animation to complete
    setTimeout(onClose, 200);
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" onChange={handleImageChange} />
        </div>

        <div>
          <label htmlFor="artists">Artists (separate names with commas):</label>
          <input
            type="text"
            id="artists"
            value={artists.join(', ')}
            onChange={(e) => setArtists(e.target.value.split(',').map((name) => name.trim()))}
          />
        </div>

        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 180))}
          />
        </div>

        <div>
          <label htmlFor="medium">Medium:</label>
          <input
            type="text"
            id="medium"
            value={medium}
            onChange={(e) => setMedium(e.target.value.slice(0, 20))}
          />
        </div>

        <div>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploadForm;
