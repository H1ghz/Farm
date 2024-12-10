const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const Tip = require('../models/Tip');
const protect = require('../middleware/authMiddleware');

// 새로운 농장 생성 라우트 생성
router.post('/create', async (req, res) => {
  try {
    const { farmName, livestock, crops, feed, userId } = req.body;

    // userId 유효성 검사 추가
    if (!userId) {
      return res.status(400).json({ 
        message: '사용자 ID가 필요합니다.' 
      });
    }

    // 이미 농장이 있는지 확인
    const existingFarm = await Farm.findOne({ userId });
    if (existingFarm) {
      return res.status(400).json({ 
        message: '이미 농장이 존재합니다.' 
      });
    }

    // 농장 생성
    const newFarm = new Farm({
      farmName,
      userId,
      livestock: livestock,
      crops: crops,
      feed: feed,
    });

    const savedFarm = await newFarm.save();
    res.status(201).json({ _id: savedFarm._id });  // 저장된 농장 데이터 전체를 반환
  } catch (error) {
    res.status(500).json({ message: '농장 생성 실패', error });
  }
});
router.get('/myfarm/:farmId', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.farmId);
    if (!farm) {
      return res.status(404).json({ message: '농장을 찾을 수 없습니다.' });
    }
    res.status(200).json({
      _id: farm._id,
      farmName: farm.farmName,
      fields: {
        livestock: farm.livestock,
        crops: farm.crops,
        feed: farm.feed
      }
    });
  } catch (error) {
    console.error('농장 조회 에러:', error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

// 꿀팁 생성 (Create)
router.post('/tips', protect, async (req, res) => {
  try {
    const { title, category, content } = req.body;

    // 사용자 정보 가져오기
    const author = req.user._id;

    // 필드 검증
    if (!title || !category || !content) {
      return res.status(400).json({
        message: '제목, 카테고리, 내용은 필수 입력 항목입니다.'
      });
    }

    const newTip = new Tip({
      title,
      category,
      content,
      author  
    });

    const savedTip = await newTip.save();
    console.log('저장된 팁', savedTip);
    
    res.status(201).json({
      message: '꿀팁이 성공적으로 작성되었습니다.',
      tip: savedTip
    });
  } catch (error) {
    console.error('꿀팁 작성 에러 상세:', error);
    res.status(500).json({ 
      message: '꿀팁 작성에 실패했습니다.', 
      error: error.message 
    });
  }
});

// 꿀팁 목록 조회
router.get('/tips', async (req, res) => {
  try {
    const tips = await Tip.find()
      .populate('author', 'username') //추가
      .sort({ createdAt: -1 })
      .select('title category author createdAt');

    res.status(200).json({
      message: '꿀팁 목록 조회 성공',
      tips
    });
  } catch (error) {
    console.error('꿀팁 목록 조회 에러:', error);
    res.status(500).json({ 
      message: '꿀팁 목록 조회에 실패했습니다.', 
      error: error.message 
    });
  }
});

// 꿀팁 수정 (Update)
router.put('/tips/:tipId', async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const updatedTip = await Tip.findByIdAndUpdate(
      req.params.tipId,
      { title, category, content },
      { new: true }
    );

    if (!updatedTip) {
      return res.status(404).json({ message: '꿀팁을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '꿀팁이 성공적으로 수정되었습니다.',
      tip: updatedTip
    });
  } catch (error) {
    console.error('꿀팁 수정 에러:', error);
    res.status(500).json({ 
      message: '꿀팁 수정에 실패했습니다.', 
      error: error.message 
    });
  }
});

// 꿀팁 삭제 (Delete)
router.delete('/tips/:tipId', async (req, res) => {
  try {
    const deletedTip = await Tip.findByIdAndDelete(req.params.tipId);
    if (!deletedTip) {
      return res.status(404).json({ message: '꿀팁을 찾을 수 없습니다.' });
    }
    res.status(200).json({ 
      message: '꿀팁이 성공적으로 삭제되었습니다.' 
    });
  } catch (error) {
    console.error('꿀팁 삭제 에러:', error);
    res.status(500).json({ 
      message: '꿀팁 삭제에 실패했습니다.', 
      error: error.message 
    });
  }
});

// GET 특정 팁 조회
router.get('/tips/:id', async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id)
      .populate('author', 'username')
      .lean(); 

    if (!tip) {
      return res.status(404).json({ message: '팁을 찾을 수 없습니다.' });
    }

    res.json({ tip }); 
  } catch (error) {
    console.error('팁 조회 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

// 사용자의 농장 조회
router.get('/myfarm/user/:userId', async (req, res) => {
  try {
    const farm = await Farm.findOne({ owner: req.params.userId });
    
    if (!farm) {
      return res.status(404).json({ message: '농장을 찾을 수 없습니다.' });
    }

    res.json(farm);
  } catch (error) {
    console.error('농장 조회 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;