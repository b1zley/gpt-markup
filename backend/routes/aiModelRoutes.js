const express = require('express');
const router = express.Router({ mergeParams: true });

const aiModelControllers = require('../controllers/aiModelControllers')


router.get('/', aiModelControllers.getAllHandler )


module.exports = router