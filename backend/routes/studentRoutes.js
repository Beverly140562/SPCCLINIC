import express from 'express'
import { registerUser,loginUser, bookAppointment, getProfile, updateProfile, listAppointment, cancelAppointments } from '../controllers/usercontroller.js'
import upload from '../middlewares/multer.js'
import verifyToken from '../middlewares/verifyToken.js'
const studentRouter = express.Router()

studentRouter.post('/signup',registerUser)
studentRouter.post('/login',loginUser)
studentRouter.post('/book-appointment', verifyToken, bookAppointment);

studentRouter.get('/profile',verifyToken,getProfile);
studentRouter.post('/update-profile',verifyToken,upload.single('image'),updateProfile);
studentRouter.get('/appointments', verifyToken, listAppointment)
studentRouter.post('/cancel-appointment',verifyToken,cancelAppointments)

export default studentRouter;