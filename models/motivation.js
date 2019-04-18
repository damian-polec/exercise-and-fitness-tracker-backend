const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const motivationSchema = new Schema({
  quote: {
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

module.exports = mongoose.model('Motivation', motivationSchema);