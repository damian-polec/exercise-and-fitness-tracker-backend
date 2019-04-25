const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema({
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Reward', rewardSchema);