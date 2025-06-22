import express from 'express'
import {download_URL_qr_code,generate_URL_qr_code,   } from '../controllers/codegenerator.controller'
import multer from 'multer';


const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });


router.route('/').post(upload.single('logo'), generate_URL_qr_code)
router.route('/download').post(upload.single('logo'), download_URL_qr_code)




export default router 