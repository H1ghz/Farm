import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/TipEdit.css';

function TipEdit() {
  const { tipId } = useParams();
  const navigate = useNavigate();
  const [tipData, setTipData] = useState({
    title: '',
    category: '',
    content: '',
    author: null
  });

  useEffect(() => {
    fetchTipData();
  }, [tipId]);

  const fetchTipData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        alert('로그인이 필요합니다.');
        navigate('/homefarm/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/farm/tips/${tipId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const tip = response.data.tip;
      
      if (tip.author._id !== userId) {
        alert('자신이 작성한 글만 수정할 수 있습니다.');
        navigate('/tips');
        return;
      }

      setTipData({
        title: tip.title,
        category: tip.category,
        content: tip.content,
        author: tip.author
      });
    } catch (error) {
      console.error('팁 데이터 조회 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
      navigate('/tips');
    }
  };

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
      
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/homefarm/login');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/farm/tips/${tipId}`,
        {
          title: tipData.title,
          category: tipData.category,
          content: tipData.content
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert('수정이 완료되었습니다.');
      navigate('/tips');
    } catch (error) {
      console.error('팁 수정 실패:', error);
      if (error.response?.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.clear();
        navigate('/homefarm/login');
      } else {
        alert('수정에 실패했습니다.');
      }
    }
  };

  return (
    <div className="tip-edit-container">
      <h1>꿀팁 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            name="category"
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
        <div className="input-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={tipData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={tipData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-btn">수정완료</button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/tips')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default TipEdit; 