import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import doctorRouter from "./routes/doctorRoutes.js";
import router from "./routes/adminRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
dotenv.config();

// app config
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", router); 
app.use("/api/doctor", doctorRouter);
app.use('/api/user', studentRoutes); // ✅ Make sure path is correct
app.use('/api/student', studentRouter);
app.use('/api/doctor', doctorRoutes);

app.get('/', (req, res) => {
  res.send("Backend is running!");
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
