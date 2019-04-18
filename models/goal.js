const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  month: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  goals: [{
    id: {
      type: Schema.Types.ObjectId
    }, 
    goal: {
      type: String,
      required: true
    },
    isFinished: {
      type: Boolean
    }
  }]
})

module.exports = mongoose.model('Goal', goalSchema);