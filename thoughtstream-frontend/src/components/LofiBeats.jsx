import React from 'react';
import "../styles/index.css";

const LofiBeats = () => {
  return (
    <div>
    <div className="Hello">Listen to some beats as you write</div>
    <div className="lofiBeats">
      <iframe
        width="100%"
        height="420"
        src="https://www.youtube.com/embed/oq7sozUfrCQ?autoplay=1&loop=1&playlist=oq7sozUfrCQ&controls=0&modestbranding=1&rel=0"
        title="Lofi Beats"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
    </div>
  );
};

export default LofiBeats;

