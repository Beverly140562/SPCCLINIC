import express from 'express';
import { addDoctor } from '../controllers/adminController.js';
import { getDoctors } from '../controllers/doctorController.js';
import upload from '../middlewares/multer.js'; 
import { doctorList } from '../controllers/doctorController.js';
const router = express.Router();

// Add doctor with image upload
router.post('/add-doctor', upload.single("image"), addDoctor);

// Get all doctors
router.get('/all', getDoctors);
router.get('/list', doctorList )


  

  
export default router;
