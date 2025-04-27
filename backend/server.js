import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ Make sure path is correct
import doctorRoutes from "./routes/doctorRoutes.js";
import studentRoutes from './routes/studentRoutes.js'
dotenv.config();

// app config
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/admin", adminRoutes); 
app.use('/api/doctors', doctorRoutes );
app.use('/api/all-doctors', doctorRoutes );
app.use('/api/doctor', doctorRoutes)
app.use('/api/student', studentRoutes)



app.get('/', (req, res) => {
  res.send("Backend is running!");
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
