import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/MyFarm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyFarm() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [farmData, setFarmData] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching farm data for ID:', farmId);
  
        const response = await axios.get(
          `http://localhost:5000/api/farm/myfarm/${farmId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Farm data received:', response.data);
  
        if (response.data) {
          setFarmData({
            farmName: response.data.farmName,
            livestock: response.data.fields?.livestock || [],
            crops: response.data.fields?.crops || [],
            feed: response.data.fields?.feed || []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('농장 데이터 조회 실패:', error);
        console.log('Error details:', error.response?.data);
        if (error.response?.status === 404) {
          navigate('/myfarm-create');
        }
        setLoading(false);
      }
    };
  
    if (farmId) {
      fetchFarmData();
    }
  }, [farmId, navigate]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/homefarm/login');
  };

  const addItem = (item) => {
    if (farmData) {
      const updatedFarmData = {
        ...farmData,
        livestock: [...farmData.livestock, item]
      };
      setFarmData(updatedFarmData);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!farmData) {
    return <div>농장 데이터가 없습니다.</div>;
  }

  return (
    <div className="d-flex">
      {/* 사이드바 */}
      <div className="sidebar bg-dark text-white">
        <div className="sidebar-header p-3">
          <i className="fas fa-tractor me-2"></i>
          <span>농장 관리</span>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              <i className="fas fa-home me-2"></i>
              내 농장
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              <i className="fas fa-chart-line me-2"></i>
              수익 현황
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white" data-bs-toggle="collapse" data-bs-target="#farmComponents">
              <i className="fas fa-plus-circle me-2"></i>
              농장 구성 추가
            </a>
            <div className="collapse" id="farmComponents">
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <a href="#" className="nav-link text-white">
                    <i className="fas fa-horse me-2"></i>
                    동물
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link text-white">
                    <i className="fas fa-seedling me-2"></i>
                    작물
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link text-white">
                    <i className="fas fa-flask me-2"></i>
                    비료
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* 기존 컨텐츠 */}
      <div className="main-content">
        <div className="farm-page-container">
          {/* 네비게이션 바 */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-success">
            <div className="container">
              <a className="navbar-brand" href="#">
                <i className="fas fa-tractor me-2"></i>
                {farmData.farmName}
              </a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <a className="nav-link" href="/tips">
                      <i className="fas fa-lightbulb me-1"></i>
                      꿀팁
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-1"></i>
                      로그아웃
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* 메인 컨텐츠 */}
          <div className="container py-5">
            <div className="row g-4">
              {/* 가축 섹션 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-light">
                    <h2 className="h5 mb-0">
                      <i className="fas fa-horse me-2"></i>
                      가축 현황
                    </h2>
                  </div>
                  <div className="card-body">
                    <p>총 {farmData.livestock.length} 마리</p>
                    {farmData.livestock.map((item, index) => (
                      <div key={index}>
                        <h3>{item.name}</h3>
                        <p>{item.count} 마리</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 농작물 섹션 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-light">
                    <h2 className="h5 mb-0">
                      <i className="fas fa-seedling me-2"></i>
                      농작물 현황
                    </h2>
                  </div>
                  <div className="card-body">
                    <p>총 {farmData.crops.length} 종류</p>
                    {farmData.crops.map((item, index) => (
                      <div key={index}>
                        <h3>{item.name}</h3>
                        <p>{item.count} 개</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 사료 섹션 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-light">
                    <h2 className="h5 mb-0">
                      <i className="fas fa-wheat me-2"></i>
                      사료 현황
                    </h2>
                  </div>
                  <div className="card-body">
                    <p>총 {farmData.feed.length} 종류</p>
                    {farmData.feed.map((item, index) => (
                      <div key={index}>
                        <h3>{item.name}</h3>
                        <p>{item.count} kg</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyFarm;