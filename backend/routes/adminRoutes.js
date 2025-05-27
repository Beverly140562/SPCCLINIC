import express from "express";
import multer from "multer";
import { addDoctor, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/add-doctor",authAdmin ,upload.single("image"), addDoctor);
router.post('/login', loginAdmin);
router.get('/doctors', authAdmin, allDoctors);
router.post('/change-availability', authAdmin, changeAvailability);
router.get('/appointments',authAdmin,appointmentsAdmin)
router.post('/cancel-appointment',authAdmin,appointmentCancel)
router.get('/dashboard',authAdmin,adminDashboard)

export default router;
