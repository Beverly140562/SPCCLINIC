import express from "express";
import multer from "multer";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js"; // ✅ correct path
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/add-doctor",authAdmin ,upload.single("image"), addDoctor);
router.post('/login', loginAdmin);
router.get('/doctors', authAdmin, allDoctors);
router.post('/change-availability', authAdmin, changeAvailability);


export default router;
