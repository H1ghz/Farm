const mongoose = require('mongoose'); // MongoDB 모듈 불러오기
const bcrypt = require('bcryptjs'); // 비밀번호 암호화 모듈 불러오기

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// 비밀번호 저장 전에 해시 처리
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 사용자 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = User;