import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
        username,
        email, 
        password 
      });
      console.log('서버 응답', response);
      alert('회원 가입을 축하드립니다');
      navigate('/homefarm/login');
    } catch (error) {
      console.log('에러 상세 :', error.response);
      setError(error.response?.data?.message || '알 수 없는 오류가 발생했습니다');
      console.error('회원가입 오류:', error);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/image.jpeg)`,
    backgroundSize: '50%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="register-container" style={backgroundStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="register-form">
              <h2 className="register-title mb-4">회원가입</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="이름"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingName">이름</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingEmail">이메일</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">비밀번호</label>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    {error}
                  </div>
                )}

                <button type="submit" className="register-button">
                  회원가입
                </button>

                <div className="divider">
                  <span>또는</span>
                </div>

                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => navigate('/homefarm/login')}
                >
                  뒤로가기
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;