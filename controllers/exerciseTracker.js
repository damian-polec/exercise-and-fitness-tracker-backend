const Data = require('../models/data');
const Exercise = require('../models/exercise');
const User = require('../models/user');
const Goal = require('../models/goal');
const Motivation = require('../models/motivation');


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

// Goals Controller functions
exports.getGoals = async ( req, res, next ) => {
  try {
    const goal = await Goal.findOne({ user: req.userId, month: req.body.month });
    if(!goal) {
      const error = new Error('Data not found');
      throw error;
    }
    res.status(200).json(goal.goals);
  } catch(err) {
    res.json(err);
  }
}
exports.addGoal = async( req, res, next ) => {
  try {
    const user = await User.findById({_id: req.userId});
    if(!user) {
      const error = new Error('User Not Found');
      throw error;
    }

    const bodyData = {
      month: req.body.month,
      user: req.userId,
      goals: [{
        goal: req.body.goal,
        isFinished: false
      }]
    };
    const newGoal = new Goal(bodyData);
    const goal = await Goal.findOne({user: req.userId, month: req.body.month});
    if(!goal) {
      await newGoal.save();
      res.status(201).json({message: 'Goal Added', data: newGoal.goals})
    } else {
      goal.goals.push(bodyData.goals[0]);
      await goal.save();
      res.status(201).json({message: 'Goal added', data: goal.goals})
    }
  } catch(error) {
    next(error);
  }

}
//Motivation Controller functions
exports.getQuote = async ( req, res, next ) => {
  try {
    const quote = await Motivation.findOne({ user: req.userId, month: req.body.month });
    console.log(quote);
    if(!quote) {
      res.status(404).json({quote: 'Your Motivational Quote of the Month'})
    }
    res.status(200).json(quote);
  } catch(err) {
    next(err);
  }
}
exports.addQuote = async ( req, res, next ) => {
  const quote = req.body.quote;
  const month = req.body.month;
  try {
    const user = await User.findById({_id: req.userId});
    if(!user) {
      const error = new Error('User Not Found');
      throw error;
    }
    const isQuote = await Motivation.findOne({user: req.userId, month: month});
    if(isQuote) {
      isQuote.quote = quote;
      await isQuote.save();
      res.status(201).json({message: 'Quote editing success', data: isQuote});
    } else {
      const newQuote = new Motivation({
        quote: quote,
        month: month,
        user: req.userId
      })
      await newQuote.save();
      res.status(201).json({message: 'Quote creation success', data: newQuote});
    }
  } catch(error) {
    next(error);
  }
}
//Note Controller functions
exports.getNote = async ( req, res, next ) => {
  const noteId = req.params.noteId;
  const note = await Data.findOne({_id: noteId}).populate('exercises');
  res.json({data: note});
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

