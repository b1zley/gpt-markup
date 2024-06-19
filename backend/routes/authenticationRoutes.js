const express = require('express');
const router = express.Router({ mergeParams: true });

const authenticationControllers = require('../controllers/authenticationControllers')

router.post('/create', authenticationControllers.handlePostCreateNewUser)

router.post('/login', authenticationControllers.handlePostLogin)

module.exports = router