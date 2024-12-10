import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/MyFarmCreate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyFarmCreate() {
  const navigate = useNavigate();
  const [farmName, setFarmName] = useState('');
  const [livestock, setLivestock] = useState([]);
  const [crops, setCrops] = useState([]);
  const [feed, setFeed] = useState([]);

  const addItem = (category) => {
    if (category === 'livestock') {
      setLivestock([...livestock, { name: '', count: 0 }]);
    } else if (category === 'crops') {
      setCrops([...crops, { name: '', count: 0 }]);
    } else if (category === 'feed') {
      setFeed([...feed, { name: '', count: 0 }]);
    }
  };

  const removeItem = (category, index) => {
    if (category === 'livestock') {
      setLivestock(livestock.filter((_, i) => i !== index));
    } else if (category === 'crops') {
      setCrops(crops.filter((_, i) => i !== index));
    } else if (category === 'feed') {
      setFeed(feed.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (category, index, field, value) => {
    if (category === 'livestock') {
      const newItems = [...livestock];
      newItems[index][field] = field === 'count' ? Number(value) : value;
      setLivestock(newItems);
    } else if (category === 'crops') {
      const newItems = [...crops];
      newItems[index][field] = field === 'count' ? Number(value) : value;
      setCrops(newItems);
    } else if (category === 'feed') {
      const newItems = [...feed];
      newItems[index][field] = field === 'count' ? Number(value) : value;
      setFeed(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/homefarm/login');
        return;
      }

      console.log('전송할 데이터:', { farmName, livestock, crops, feed, userId });

      const response = await axios.post('http://localhost:5000/api/farm/create', {
        farmName,
        livestock,
        crops,
        feed,
        userId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('서버 응답:', response.data);  // 전체 응답 데이터 확인

      
      if (response.data) {
        const farmId = response.data._id || response.data.farmId || response.data.id;
        if (farmId) {
          console.log('생성된 농장 ID:', farmId);
          navigate(`/myfarm/${farmId}`);
        } else {
          console.error('응답 데이터:', response.data);
          console.error('농장 ID를 찾을 수 없습니다.');
        }
      } else {
        console.error('서버 응답이 비어있습니다.');
      }
    } catch (error) {
      console.error('농장 생성 실패:', error);
      console.log('에러 상세:', error.response?.data);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/image.jpeg)`,
    backgroundSize: '50%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="farm-create-container" style={backgroundStyle}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="text-center mb-4">
                  <i className="fas fa-tractor me-2"></i>새로운 농장 만들기
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="farmName">
                      농장 이름
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="farmName"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="section">
                    <h2>가축</h2>
                    {livestock.map((item, index) => (
                      <div key={index} className="item-row">
                        <input
                          type="text"
                          placeholder="가축 이름"
                          className="form-control"
                          value={item.name}
                          onChange={(e) => handleItemChange('livestock', index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="수량"
                          className="form-control"
                          value={item.count}
                          onChange={(e) => handleItemChange('livestock', index, 'count', e.target.value)}
                          min="0"
                        />
                        <button type="button" className="btn btn-danger" onClick={() => removeItem('livestock', index)}>삭제</button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn btn-outline-success w-100"
                      onClick={() => addItem('livestock')}
                    >
                      <i className="fas fa-plus me-2"></i>추가
                    </button>
                  </div>

                  <div className="section">
                    <h2>농작물</h2>
                    {crops.map((item, index) => (
                      <div key={index} className="item-row">
                        <input
                          type="text"
                          placeholder="농작물 이름"
                          className="form-control"
                          value={item.name}
                          onChange={(e) => handleItemChange('crops', index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="수량"
                          className="form-control"
                          value={item.count}
                          onChange={(e) => handleItemChange('crops', index, 'count', e.target.value)}
                          min="0"
                        />
                        <button type="button" className="btn btn-danger" onClick={() => removeItem('crops', index)}>삭제</button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn btn-outline-success w-100"
                      onClick={() => addItem('crops')}
                    >
                      <i className="fas fa-plus me-2"></i>추가
                    </button>
                  </div>

                  <div className="section">
                    <h2>사료</h2>
                    {feed.map((item, index) => (
                      <div key={index} className="item-row">
                        <input
                          type="text"
                          placeholder="사료 이름"
                          className="form-control"
                          value={item.name}
                          onChange={(e) => handleItemChange('feed', index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="수량"
                          className="form-control"
                          value={item.count}
                          onChange={(e) => handleItemChange('feed', index, 'count', e.target.value)}
                          min="0"
                        />
                        <button type="button" className="btn btn-danger" onClick={() => removeItem('feed', index)}>삭제</button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn btn-outline-success w-100"
                      onClick={() => addItem('feed')}
                    >
                      <i className="fas fa-plus me-2"></i>추가
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary">농장 생성 완료</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyFarmCreate; 