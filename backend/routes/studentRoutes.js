const express = require('express');
const router = express.Router({ mergeParams: true });

const studentControllers = require('../controllers/studentControllers')


router.get('/search', studentControllers.handleGetRequestSearchStudent)

module.exports = router
