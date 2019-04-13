const Data = require('../models/data');
const Exercise = require('../models/exercise');

exports.getData = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const userData = await Data.find({
      year: currentYear,
      month: currentMonth,
      user: userId
    }).populate('exerciseData');
    res.json({data: userData})
  } catch (error) {
    console.log(error);
  }
}

exports.addNote = async (req, res, next) => {
  try {
    const dayId = req.body.dayId;
    const noteData = req.body.noteData.filter(note => {
      if(!note._id) {
        return note;
      }
    });
    const day = await Data.findOne({ _id: dayId });
    const exercises = noteData.map(exercise => {
      const exerciseObj = new Exercise({
        exerciseType: exercise.exerciseType,
        time: exercise.time,
        dayId: dayId
      })
      return exerciseObj;
    })
    await Exercise.insertMany(exercises)
    day.exercises = day.exercises.concat(exercises);
    await day.save();
    res.json({message: 'Note added'});
  } catch(err) {
    res.json(err);
  }
}

exports.getNote = async ( req, res, next ) => {
  const noteId = req.params.noteId;
  const note = await Data.findOne({_id: noteId}).populate('exercises');
  res.json({data: note});
}