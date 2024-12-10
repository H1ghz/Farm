import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/TipWrite.css';

function TipWrite() {
  const navigate = useNavigate();
  const [tipData, setTipData] = useState({
    title: '',
    category: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        alert('로그인이 필요합니다.');
        navigate('/homefarm/login');
        return;
      }

      // 디버깅을 위한 토큰 확인
      console.log('토큰:', token);
      console.log('userId:', userId);

      const response = await axios.post(
        'http://localhost:5000/api/farm/tips',
        { 
          title: tipData.title,
          category: tipData.category,
          content: tipData.content
          // author는 서버의 authMiddleware에서 설정되도록 제거
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('서버 응답:', response.data);  // 응답 확인

      if (response.data) {
        alert('꿀팁이 성공적으로 작성되었습니다.');
        navigate('/tips');
      }
    } catch (error) {
      console.error('팁 작성 에러:', error.response?.data || error);
      if (error.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.clear(); 
        navigate('/homefarm/login');
      } else if (error.response?.status === 400) {
        alert(error.response.data.message || '입력 정보를 확인해주세요.');
      } else {
        alert('글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="tip-write-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/tips">
            <img src="/images/logo.png" alt="Farm Logo" className="logo-img" />
            <span className="brand-text">농장 꿀팁</span>
          </a>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">새로운 꿀팁 작성</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">카테고리</label>
                    <select
                      id="category"
                      name="category"
                      className="form-select"
                      value={tipData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">카테고리 선택</option>
                      <option value="가축">가축</option>
                      <option value="농작물">농작물</option>
                      <option value="사료">사료</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">제목</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={tipData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="content" className="form-label">내용</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      rows="6"
                      value={tipData.content}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success">작성</button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/tips')}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TipWrite; 