import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/myfarm');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.token && response.data.userId) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        console.log('Stored userId:', response.data.userId);

        if (!localStorage.getItem('hasCreatedFarm')) {
          localStorage.setItem('hasCreatedFarm', 'false');
          navigate('/myfarm-create');
        } else {
          navigate(`/myfarm/${response.data.userId}`);
        }
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/image.jpeg)`,
    backgroundSize: '50%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  
  return (
    <div className="login-container" style={backgroundStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-form">
              <h2 className="login-title mb-4">로그인</h2>
              <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn btn-login">
                  로그인
                </button>
                
                <div className="divider">
                  <span>또는</span>
                </div>

                <button 
                  type="button" 
                  className="btn btn-register"
                  onClick={() => navigate('/homefarm/register')}
                >
                  회원가입
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;