const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config(); 

// JWT 토큰 생성 함수
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

// 사용자 등록 라우트
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('회원가입 요청 데이터:', { email, password });

    // 새 사용자 생성
    const newUser = new User({
      username,
      email,
      password: password  
    });
    await newUser.save();
    console.log('새 사용자 저장 완료');

    res.status(201).json({ message: '사용자가 성공적으로 등록되었습니다' });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 사용자 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.json({
        token: generateToken(user._id),
        userId: user._id.toString(),
        email: user.email,
        name: user.username
      });
    } else {
      res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 비밀번호 재설정
router.patch('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: '비밀번호가 재설정 되었습니다.' });
  } catch (error) {
    console.error('에러 /reset-password:', error);
    res.status(500).json({ message: '서버 에러' });
  }
});

module.exports = router;