import React, { useState } from 'react';
import axios from 'axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 비밀번호 재설정 api 호출
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
      alert('비밀번호 재설정 성공');
    } catch (error) {
      alert('오류 발생');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">비밀번호 재설정</button>
    </form>
  );
}

export default ResetPassword;