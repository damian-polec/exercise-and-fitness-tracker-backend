const express = require('express');

const trackerController = require('../controllers/exerciseTracker');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/getData', isAuth, trackerController.getData);

router.post('/addGoal', isAuth, trackerController.addGoal);

router.post('/getGoals', isAuth, trackerController.getGoals);

router.post('/addQuote', isAuth, trackerController.addQuote);

router.post('/getQuote', isAuth, trackerController.getQuote);

router.post('/addNote', isAuth, trackerController.addNote);

router.post('/addReward', isAuth, trackerController.addReward);

router.post('/getReward', isAuth, trackerController.getReward);

router.get('/getNoteData/:noteId', isAuth, trackerController.getNote);

module.exports = router;