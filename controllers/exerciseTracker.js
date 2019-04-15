const Data = require('../models/data');
const Exercise = require('../models/exercise');
const User = require('../models/user');

exports.getData = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const user = await User.findOne({_id: userId});
    let userData = await Data.find({
      year: currentYear,
      month: currentMonth,
      user: userId
    }).populate('exerciseData');
    console.log(userData);
    if(userData.length > 0) {
      res.json({data: userData})
    } else {
      const dataObjects = [];
      const dayCounts = new Date(currentYear, currentMonth + 1, 0).getDate();
      let i = 0;
      while(i < dayCounts) {
        const data = new Data({
          year: currentYear,
          month: currentMonth,
          day: i + 1,
          user: user
        })
        dataObjects.push(data);
        i++
      }    
      await Data.insertMany(dataObjects);
      dataObjects.forEach(day => {
        user.exerciseData.push(day);
      })
      await user.save();
      userData = await Data.find({
        year: currentYear,
        month: currentMonth,
        user: userId
      }).populate('exerciseData');
      res.json({data: userData})
    }

  } catch (error) {
    console.log(error);
  }
}

exports.addNote = async (req, res, next) => {
  try {
    const dayId = req.body.dayId;

    const noteUpdatedData = req.body.noteData.filter(note => {
      if(note._id) {
        return note;
      }
    })
    const noteNewData = req.body.noteData.filter(note => {
      if(!note._id) {
        return note;
      }
    });
    if(noteUpdatedData.length > 0) {
      const exercises = await Exercise.find({dayId: dayId});
      exercises.forEach((exercise, i) => {
        return exercise.time = noteUpdatedData[i].time
      });
      exercises.map( async (exercise) => await exercise.save());
    }

    if(noteNewData.length > 0) {
      const exercises = noteNewData.map(exercise => {
        const exerciseObj = new Exercise({
          exerciseType: exercise.exerciseType,
          time: exercise.time,
          dayId: dayId
        })
        return exerciseObj;
      })
      await Exercise.insertMany(exercises)
      const day = await Data.findOne({ _id: dayId });
      day.exercises = day.exercises.concat(exercises);
      await day.save();
    }

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