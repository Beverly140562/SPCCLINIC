import validator from "validator";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import supabase from "../config/supabaseClient.js";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  console.log("Form Data Body:", req.body);
  console.log("File Upload:", req.file);

  try {
    const {
      name,
      email,
      password,
      experience,
      fees,
      about,
      speciality,
      degree,
      address, // JSON string from admin
      available,
    } = req.body;

    const docImg = req.file;

    // Validation
    if (
      !name || !email || !password || !experience || !fees ||
      !about || !speciality || !degree || !address || !docImg
    ) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const parsedAddress = JSON.parse(address);
    if (!parsedAddress.line1 || !parsedAddress.line2) {
      return res.status(400).json({ success: false, message: "Address must have line1 and line2" });
    }

    //  Check for Existing Doctor 
    const { data: existingDoctor } = await supabase
      .from("doctors")
      .select("*")
      .eq("email", email)
      .single();

    if (existingDoctor) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    //  Hash Password 
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Upload to Cloudinary 
    const uploadedImage = await cloudinary.uploader.upload(docImg.path, {
      folder: "clinic/doctors",
    });

    //  Data of the doctor
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      experience,
      fees: Number(fees),
      about,
      speciality,
      degree,
      address: parsedAddress,
      available: available === 'true' || available === true,
      image: uploadedImage.secure_url,
     
    };

    //  Insert into Supabase 
    const { error } = await supabase.from("doctors").insert([doctorData]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ success: false, message: "Database insert failed" });
    }

    return res.status(200).json({ success: true, message: "Doctor added successfully" });

  } catch (error) {
    console.error("Add doctor error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // secure data, not just email+password
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
   

    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('doctor_id, name, image, speciality, available');

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch doctors from database',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      doctors,
    });

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching doctors',
      error: err.message,
    });
  }
};



export { addDoctor, loginAdmin, allDoctors };
