const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '../uploads/STAGING') });
const parseRTF = require('rtf-parser');


const fs = require('fs').promises;

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
