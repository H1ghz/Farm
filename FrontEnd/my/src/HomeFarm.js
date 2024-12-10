import React from "react";
import { useNavigate } from "react-router-dom";
import './css/Home.css';

function HomeFarm() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleStart = () => {
    if (userId) {
      navigate(`/myfarm/${userId}`);
    } else {
      navigate('/homefarm/login');
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/image.jpeg)`,
    backgroundSize: '50%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      <div className="welcome-section">
        <div className="title-section">
          <h1 
            className="display-1 fw-bold floating-animation" 
            style={{ 
              background: 'linear-gradient(to right, #ffffff, #198754)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Virtual Farm Simulator !
          </h1>
        </div>
        <div className="button-section">
          <button 
            className="btn btn-info start-button rounded-pill shadow-lg fw-bold text-white" 
            onClick={handleStart}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeFarm;