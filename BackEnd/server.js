require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const farmRoutes = require("./routes/farmRoutes");
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const tipRoutes = require('./routes/tipRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/tips', tipRoutes);

io.on('connection', (socket) => {
  console.log('사용자가 연결되었습니다.');

  socket.on('disconnect', () => {
    console.log('접속을 종료했습니다.');
  });
});


app.get('/', (req, res) => {
  res.send('가상농장 시뮬레이션에 오신 것을 환영합니다.');
});


server.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중`);
});