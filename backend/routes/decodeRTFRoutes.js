const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../uploads/STAGING') });
const parseRTF = require('rtf-parser');


const fs = require('fs').promises;

/**
 * @swagger
 * tags:
 *   - name: Convert
 *     description: Operations related to RTF conversion
 * 
 */

/**
 * @swagger
 * /convert/RtfToPlainText:
 *   post:
 *     security:
 *       - BearerAuth: []  
 *     tags:
 *       - Convert
 *     summary: Converts an RTF file to plain text
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The RTF file to convert
 *     responses:
 *       '200':
 *         description: Converted plain text from the RTF file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   description: Plain text content extracted from the RTF file
 *       '500':
 *         description: Internal server error
 */
router.post('/RtfToPlainText', upload.single('file'), async (req, res) => {


    try {
        const textData = await fs.readFile(req.file.path, 'utf-8')

        parseRTF.string(textData, (err, doc) => {
            let plainTextString = ''
            const paragraphs = doc.content
            for (const paragraph of paragraphs) {
                const spans = paragraph.content
                for (const span of spans) {
                    plainTextString += span.value
                }
                plainTextString += '\n'
            }

            const responseObject = {
                content: plainTextString
            }

            return res.status(200).json(responseObject)
        })
    } catch(err){
        return res.status(500).send()
    }



})


module.exports = router
