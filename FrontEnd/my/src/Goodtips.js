import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/GoodTips.css';

function GoodTips() {
  const [tips, setTips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/farm/tips');
      setTips(response.data.tips);
    } catch (error) {
      console.error('팁 목록 조회 실패:', error);
    }
  };

  const goToMyFarm = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('로그인이 필요합니다.');
        navigate('/homefarm/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/farm/farms/user/${userId}`);
      
      if (response.data && response.data._id) {
        navigate(`/myfarm/${response.data._id}`);
      } else {
        navigate('/myfarm-create');
      }
    } catch (error) {
      console.error('농장 조회 실패:', error);
      navigate('/myfarm-create');
    }
  };

  return (
    <div className="tips-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container">
          <span className="navbar-brand">
            <i className="fas fa-lightbulb me-2"></i>
            농장 꿀팁
          </span>
          <div className="navbar-nav ms-auto">
            <button 
              className="btn btn-outline-light me-2"
              onClick={goToMyFarm}
            >
              <i className="fas fa-home me-1"></i>
              내 농장으로
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row mb-4">
          <div className="col d-flex justify-content-between align-items-center">
            <h2 className="mb-0">꿀팁 목록</h2>
            <button 
              className="btn btn-success"
              onClick={() => navigate('/tips/write')}
            >
              <i className="fas fa-plus me-1"></i>
              새 꿀팁 작성
            </button>
          </div>
        </div>

        <div className="row g-4">
          {tips.map((tip) => (
            <div key={tip._id} className="col-md-6 col-lg-4">
              <div 
                className="card h-100 tip-card shadow-sm" 
                onClick={() => navigate(`/tips/${tip._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <div className="category-badge mb-3">
                    <span className="badge bg-success">
                      {tip.category}
                    </span>
                  </div>
                  <h5 className="card-title mb-3">{tip.title}</h5>
                  <p className="card-text text-muted">{tip.content}</p>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      {tip.author?.username || '익명'}
                    </small>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GoodTips;
