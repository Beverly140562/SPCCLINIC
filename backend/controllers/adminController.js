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


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
 const { doctor_id, slotDate } = req.query;

if (!doctor_id || !slotDate) {
  return res.status(400).json({ success: false, message: 'doctor_id and slotDate are required' });
}

// Validate slotDate format, if needed

const { data, error } = await supabase
  .from('appointments')
  .select(`
    appointment_id,
    status,
    slotDate,
    cancelled,
    docData:doctors(name, fees, image),
    userData:students(name, image,dob)
  `)
  .eq('doctor_id', doctor_id)
  .eq('slotDate', slotDate);

if (error) {
  return res.status(500).json({ success: false, message: error.message });
}

return res.json({ success: true, appointments: data });

};

// API for appointment cancellation

const appointmentCancel = async (req, res) => {
  try {
    const {  appointment_id } = req.body;

    // Mark appointment as cancelled
    const { data: appointmentData, error: updateError } = await supabase
      .from('appointments')
      .update({ cancelled: true })
      .match({  appointment_id })
      .select()
      .single();  // Expecting single appointment

    if (updateError) throw updateError;

    // verify appointment user
    if (!appointmentData) {
      return res.json({ success: false, message: "No matching appointment found or already cancelled." });
    }

    const { doctor_id, slotDate, slotTime } = appointmentData;

    // Fetch doctor slots_booked
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('slots_booked')
      .eq('doctor_id', doctor_id)
      .single();

    if (doctorError) throw doctorError;

    let slots_booked = doctorData.slots_booked || {};

    // Remove cancelled slot time from booked slots
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
      
      // If no slots remain on that date, you might want to delete the date key:
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate];
      }
    }

    // Update doctor's slots_booked in DB
    const { error: slotsUpdateError } = await supabase
      .from('doctors')
      .update({ slots_booked })
      .eq('doctor_id', doctor_id);

    if (slotsUpdateError) throw slotsUpdateError;

    return res.json({ success: true, message: "Appointment cancelled successfully." });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    // Fetch all doctors
    const { data: doctors, error: doctorsError } = await supabase
      .from('doctors')
      .select('doctor_id, name, image, speciality, available');

    if (doctorsError) {
      console.error('Doctors fetch error:', doctorsError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch doctors',
        error: doctorsError.message,
      });
    }

    // Fetch all students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('student_id, name, phone, gender, dob, university_id, medical_history, address, image');

    if (studentsError) {
      console.error('Students fetch error:', studentsError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch students',
        error: studentsError.message,
      });
    }

    // Fetch all appointments with joined doctor and student data
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        appointment_id,
        status,
        slotDate,
        cancelled,
        doctor_id,
        student_id,
        docData:doctors(name, fees, image),
        userData:students(name, image, dob)
      `);

    if (appointmentsError) {
      console.error('Appointments fetch error:', appointmentsError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments',
        error: appointmentsError.message,
      });
    }

    // Dashboard summary data
    const dashData = {
      totalDoctors: doctors.length,
      totalStudents: students.length,
      totalAppointments: appointments.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    // Return all data + dashboard summary
    return res.status(200).json({
      success: true,
      doctors,
      students,
      appointments,
      dashboard: dashData,
    });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error',
      error: error.message,
    });
  }
};


export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };