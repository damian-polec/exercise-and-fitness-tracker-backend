const express = require('express');

const trackerController = require('../controllers/exerciseTracker');

const router = express.Router();

router.post('/getData', trackerController.getData);

router.post('/addNote', trackerController.addNote);

router.get('/getNoteData/:noteId', trackerController.getNote);

module.exports = router;