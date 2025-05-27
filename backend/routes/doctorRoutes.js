import express from 'express';
import { addDoctor } from '../controllers/adminController.js';
import { getDoctors, loginDoctor } from '../controllers/doctorController.js';
import upload from '../middlewares/multer.js'; 
import { doctorList } from '../controllers/doctorController.js';
import authAdmin from '../middlewares/authAdmin.js';

const doctorRouter = express.Router();

// Add doctor with image upload
doctorRouter.post('/add-doctor', upload.single("image"),authAdmin, addDoctor);

// Get all doctors
doctorRouter.get('/all', getDoctors);
doctorRouter.get('/list', doctorList )
doctorRouter.post('/login',loginDoctor)



  

  
export default doctorRouter;
