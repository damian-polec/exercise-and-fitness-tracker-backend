const express = require('express');

const trackerController = require('../controllers/exerciseTracker');

const router = express.Router();

router.post('/getData', trackerController.getData);

module.exports = router;