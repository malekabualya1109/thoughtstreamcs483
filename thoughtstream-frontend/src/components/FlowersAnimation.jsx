// src/components/FlowerAnimation.jsx
import React from 'react';
import "../styles/index.css"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const FlowerAnimation = () => {
  return (
    <div className="flower-animation-container">
      <DotLottieReact
        src="https://lottie.host/3444c7a4-018d-41d0-9e2b-805ce543405d/em8IjAmDt2.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default FlowerAnimation;


