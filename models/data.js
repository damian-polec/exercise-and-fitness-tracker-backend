const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
})

module.exports = mongoose.model('Data', dataSchema);