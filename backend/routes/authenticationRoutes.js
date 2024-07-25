const express = require('express');
const router = express.Router({ mergeParams: true });

const authenticationControllers = require('../controllers/authenticationControllers')

router.post('/create', authenticationControllers.handlePostCreateNewUserCodeValidate)

router.post('/login', authenticationControllers.handlePostLogin)

router.delete('/delete/:super_user_id', authenticationControllers.verifyJwt, authenticationControllers.handleDeleteSuperUserRequest)

module.exports = router