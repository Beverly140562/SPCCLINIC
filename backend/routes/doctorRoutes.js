import express from 'express';
import { addDoctor } from '../controllers/adminController.js';
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorProfile, getDoctors, loginDoctor, updateProfile } from '../controllers/doctorController.js';
import upload from '../middlewares/multer.js'; 
import { doctorList } from '../controllers/doctorController.js';
import authAdmin from '../middlewares/authAdmin.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// Add doctor with image upload
doctorRouter.post('/add-doctor', upload.single("image"),authAdmin, addDoctor);

// Get all doctors
doctorRouter.get('/all', getDoctors);
doctorRouter.get('/list', doctorList )
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateProfile)

  

  
export default doctorRouter;
