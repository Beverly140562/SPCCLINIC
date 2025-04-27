import express from 'express'
import { registerUser,loginUser, bookAppointment } from '../controllers/usercontroller.js'
import authAdmin from '../middlewares/authAdmin.js'

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)

router.post('/book-appointment',authAdmin,bookAppointment)





export default router;