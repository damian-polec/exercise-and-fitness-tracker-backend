const express = require('express');

const trackerController = require('../controllers/exerciseTracker');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/getData', isAuth, trackerController.getData);

router.post('/addNote', isAuth, trackerController.addNote);

router.get('/getNoteData/:noteId', isAuth, trackerController.getNote);

module.exports = router;