import React from 'react';
import './App.css';
import HorizontalScrollGallery from './HorizontalScrollGallery/HorizontalScrollGallery';

const App = () => {
  // Replace this array with the names of your art assets.
  const artList = ['aegina_sunset.jpeg', 'balloon_day.jpeg', 'berkeley_fiery_sky.jpeg', 'morro_bay.jpeg', 'friendly_giraffe.jpeg', 'little_boat.jpeg', 'pv_candy_sky.jpeg'];

  return (
    <div className="App">
      <HorizontalScrollGallery artList={artList} />
    </div>
  );
};

export default App;
