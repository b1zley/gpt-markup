const express = require('express');
const router = express.Router({ mergeParams: true });

const rubricControllers = require('../controllers/rubricControllers')


// router.get('/', )

router.delete('/:rubric_component_id', rubricControllers.handleRemoveRubricFromExam)
router.post('/', rubricControllers.handlePostNewRubricToExam)


router.get('/:rubric_component_id', rubricControllers.handleGetRubricComponentById)

router.put('/:rubric_component_id', rubricControllers.handlePutUpdateRubricComponentById)


module.exports = router

