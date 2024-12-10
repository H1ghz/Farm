const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livestock: [{
    name: String,
    count: Number
  }],
  crops: [{
    name: String,
    count: Number
  }],
  feed: [{
    name: String,
    count: Number
  }]
});

module.exports = mongoose.model('Farm', farmSchema);