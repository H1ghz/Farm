import React from 'react';
import { useHistory } from 'react-router-dom'; //유저 히스토리 불러오기

function Logout() {
  const history = useHistory(); 

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');  // 토큰 제거
      alert('로그아웃이 성공적으로 되었습니다 !');
      history.push('/login');  
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
      console.error('로그아웃 오류:', error);
      
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="logout-button"
    >
      로그아웃
    </button> 
  );
}

export default Logout;