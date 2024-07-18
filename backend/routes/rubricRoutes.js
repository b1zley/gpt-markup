const express = require('express');
const router = express.Router({ mergeParams: true });

const multer = require('multer')
const path = require('path')

const upload = multer({dest: path.join(__dirname, '../uploads/STAGING' )})



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

router.post('/csv_upload', upload.single('file'), rubricControllers.handleRequestCSVUploadRubricComponents)



router.post('/:rubric_component_id/rating_range/complete', rubricControllers.handlePostRequestCreateNewRatingRangeComplete)

module.exports = router

