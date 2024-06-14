const express = require('express');
const router = express.Router({ mergeParams: true });

const rubricControllers = require('../controllers/rubricControllers')


// router.get('/', )

router.delete('/:rubric_component_id', rubricControllers.handleRemoveRubricFromExam)
router.post('/', rubricControllers.handlePostNewRubricToExam)


router.get('/:rubric_component_id', rubricControllers.handleGetRubricComponentById)

router.put('/:rubric_component_id', rubricControllers.handlePutUpdateRubricComponentById)


// rating range

/**
 * create
 */
router.post('/:rubric_component_id/rating_range/', rubricControllers.handlePostRatingRangeInRubricComponent )

/**
 * update
 */
router.put('/:rubric_component_id/rating_range/:rating_range_id', rubricControllers.handlePutRequestRatingRange)

/**
 * delete rating range
 */
router.delete('/:rubric_component_id/rating_range/:rating_range_id', rubricControllers.handleDeleteRatingRange)

module.exports = router

