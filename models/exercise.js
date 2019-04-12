const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  exerciseType: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  dayId: {
    type: Schema.Types.ObjectId,
    ref: 'Data',
    required: true
  }
})


module.exports = mongoose.model('Exercise', exerciseSchema);