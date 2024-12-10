import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';

const Home = () => {
  return (
    <div className="home-container d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="welcome-section text-center">
          <h1 className="display-1 fw-bold text-white mb-5 floating-animation">
            Virtual Farm Simulator
          </h1>

          <button className="btn btn-info btn-lg px-5 py-3 rounded-pill shadow-lg fw-bold text-white">
            START
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
