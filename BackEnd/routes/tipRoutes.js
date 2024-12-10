const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');
const protect = require('../middleware/authMiddleware');

// 팁 작성 라우트
router.post('/', protect, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('User object:', req.user);
    
    const { title, category, content } = req.body;
    
    // 필수 필드 검증
    if (!title || !category || !content) {
      return res.status(400).json({
        message: '제목, 카테고리, 내용은 필수 입력 항목입니다.'
      });
    }

    // req.user 존재 여부 확인
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: '사용자 인증 정보가 없습니다.'
      });
    }

    const newTip = new Tip({
      title,
      category,
      content,
      author: req.user._id 
    });

    console.log('Creating tip with data:', newTip);

    const savedTip = await newTip.save();
    
    res.status(201).json({
      message: '팁이 성공적으로 작성되었습니다.',
      tip: savedTip
    });
  } catch (error) {
    console.error('팁 작성 에러 상세:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({ 
      message: '팁 작성에 실패했습니다.', 
      error: error.message 
    });
  }
});

// 팁 목록 조회 라우트
router.get('/', async (req, res) => {
  try {
    const tips = await Tip.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username'); 
    
    res.status(200).json(tips);
  } catch (error) {
    console.error('팁 목록 조회 에러:', error);
    res.status(500).json({ 
      message: '팁 목록 조회에 실패했습니다.', 
      error: error.message 
    });
  }
});

module.exports = router; 