import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MyFarm from './MyFarm';
import HomeFarm from './HomeFarm';
import Register from './Register';
import MyFarmCreate from './MyFarmCreate';
import Goodtips from './Goodtips';
import TipWrite from './TipWrite';
import TipEdit from './TipEdit';
import TipDetail from './TipDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeFarm />} />
        <Route path="/homefarm" element={<HomeFarm />} />
        <Route path="/homefarm/login" element={<Login />} />
        <Route path="/homefarm/register" element={<Register />} />
        
        {/* 농장 관련 라우트 */}
        
        <Route path="/myfarm/:farmId" element={<MyFarm />} />   
        <Route path="/myfarm-create" element={<MyFarmCreate />} />
        
        {/* 팁 관련 라우트 */}
        <Route path="/tips/write" element={<TipWrite />} />
        <Route path="/tips/edit/:tipId" element={<TipEdit />} />
        <Route path="/tips/:tipId" element={<TipDetail />} />
        <Route path="/tips" element={<Goodtips />} />
      </Routes>
    </Router>
  );
}

export default App;