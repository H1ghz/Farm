const express = require('express');
const router = express.Router();

router.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router; 