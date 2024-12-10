import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/TipDetail.css';

function TipDetail() {
  const { tipId } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchTipDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          alert('로그인이 필요합니다.');
          navigate('/homefarm/login');
          return;
        }

        console.log('Fetching tip with ID:', tipId); // 디버깅용

        const response = await axios.get(
          `http://localhost:5000/api/farm/tips/${tipId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('Server response:', response.data); // 디버깅용

        if (response.data.tip) { 
          setTip(response.data.tip);
          setIsAuthor(response.data.tip.author._id === userId);
        } else {
          throw new Error('팁 데이터가 없습니다.');
        }
      } catch (error) {
        console.error('팁 상세 조회 실패:', error);
        console.log('Error response:', error.response); // 디버깅용
        alert(error.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
        navigate('/tips');
      }
    };

    fetchTipDetail();
  }, [tipId, navigate]);

  if (!tip) return <div className="loading">로딩 중...</div>;

  return (
    <div className="tip-detail-container">
      <div className="tip-detail-card">
        <div className="tip-header">
          <span className="category-badge">{tip.category}</span>
          <h1>{tip.title}</h1>
          <div className="tip-meta">
            <span>작성자: {tip.author?.username || '익명'}</span>
            <span>작성일: {new Date(tip.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="tip-content">
          {tip.content}
        </div>

        <div className="tip-actions">
          <button 
            className="back-btn"
            onClick={() => navigate('/tips')}
          >
            목록으로
          </button>
          {isAuthor && (
            <>
              <button 
                className="edit-btn"
                onClick={() => navigate(`/tips/edit/${tipId}`)}
              >
                수정
              </button>
              <button 
                className="delete-btn"
                onClick={async () => {
                  if (window.confirm('정말로 삭제하시겠습니까?')) {
                    try {
                      const token = localStorage.getItem('token');
                      await axios.delete(
                        `http://localhost:5000/api/farm/tips/${tipId}`,
                        {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        }
                      );
                      alert('삭제되었습니다.');
                      navigate('/tips');
                    } catch (error) {
                      console.error('삭제 실패:', error);
                      alert('삭제에 실패했습니다.');
                    }
                  }
                }}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TipDetail; 