import supabase from '../config/supabaseClient.js';
import validator from 'validator';
import jwt from 'jsonwebtoken'
import cloudinary from "../config/cloudinary.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      dob,
      gender,
      university_id,
      medical_history
    } = req.body;

    const file = req.file;

    if (!name || !email || !password || !phone || !address || !dob || !gender || !university_id) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Parse address (expects JSON string from frontend)
    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid address format' });
    }

    // Supabase Auth registration
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      console.error("Auth signUp error:", signUpError.message);
      return res.status(400).json({ success: false, message: signUpError.message });
    }

    const { user } = signUpData;
    console.log("Inserting student:", {
  student_id: user.id,
  name,
  email,
  phone,
  gender,
  dob,
  university_id,
  medical_history: medical_history || '',
  address:  JSON.stringify(parsedAddress),

});


    // Insert into students table
    const { data: studentData, error: insertError } = await supabase
      .from("students")
      .insert([{
        student_id: user.id,
        name,
        email,
        phone,
        gender,
        dob,
        university_id,
        medical_history: medical_history || '',
        address: JSON.stringify(parsedAddress),
      }])
      .select()
      .single();

    if (insertError) {
      console.error("DB insert error:", insertError.message);
      return res.status(500).json({ success: false, message: "Error saving student profile" });
    }

    return res.status(201).json({ success: true, user: studentData });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// API for user log in 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Supabase login error:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }

    const { user } = data;
    const student_id = user.id;

    const { data: studentProfile, error: profileError } = await supabase
      .from("students")
      .select("student_id, name, email, phone, image, university_id, medical_history, address, gender, dob")
      .eq("student_id", student_id)
      .single();

    if (profileError) {
      console.error("Error fetching student profile:", profileError.message);
      return res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }

    // Sign your own JWT
const token = jwt.sign({ student_id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });



    return res.json({
      success: true,
      token,
      user: studentProfile,
    });

  } catch (error) {
    console.error("Login exception:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// ✅ Sign-out
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error);
};

// API to book appoinment

 const bookAppointment = async (req, res) => {
  const { doctor_id, slotDate, slotTime } = req.body;
  const student_id = req.user?.student_id;

  if (!student_id) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing user info' });
  }

  try {
    // Fetch doctor slots_booked
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('slots_booked')
      .eq('doctor_id', doctor_id)
      .single();

    if (doctorError) {
      console.error('Error fetching doctor:', doctorError);
      throw doctorError;
    }

    const slots_booked = doctorData.slots_booked || {};

    const slotsBookedForDate = Array.isArray(slots_booked[slotDate]) ? slots_booked[slotDate] : [];

    if (slotsBookedForDate.includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is already booked. Please choose another slot.',
      });
    }

    // Insert appointment
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .insert([{ doctor_id, student_id, slotDate, slotTime, status: 'pending' }]);

    if (appointmentError) {
      console.error('Error inserting appointment:', appointmentError);
      throw appointmentError;
    }

    // Update slots_booked
    if (!Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    const { error: updateError } = await supabase
      .from('doctors')
      .update({ slots_booked })
      .eq('doctor_id', doctor_id);

    if (updateError) {
      console.error('Error updating doctor slots:', updateError);
      throw updateError;
    }

    return res.status(201).json({ success: true, message: 'Appointment booked successfully' });

  } catch (err) {
    console.error('Server error in booking appointment:', err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};





const getProfile = async (req, res) => {
  try {
    const student_id = req.user.student_id;

    if (!student_id) {
      return res.status(400).json({ success: false, message: 'User ID missing' });
    }
    // Example with supabase or db call
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', student_id)
      .single();

    if (error) {
      console.error('DB error:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};







// API update profile
const updateProfile  = async (req, res) => {
  try {
    // Log request body and file
    console.log("Incoming update profile request");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const {
      name,
      phone,
      gender,
      dob,
      university_id,
      medical_history,
      address
    } = req.body;

    // Parse the address if it's a JSON string
    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    // image uploaded via multer (check your multer setup)
    let imageUrl = req.user.image;
    if (req.file) {
      // Cloudinary upload
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "users"
      });
      imageUrl = result.secure_url;
    }

    const { student_id } = req.user;
    
    const { data, error: dbError } = await supabase
      .from("students")
      .update({
        name,
        phone,
        gender,
        dob,
        university_id,
        medical_history,
        address: parsedAddress,
        image: imageUrl,
      })
      .eq("student_id", student_id)
      .select();

    if (dbError) {
      throw dbError;
    }

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

//  API get the uder appointments
const listAppointment = async (req, res) => {

  try {

      const student_id = req.user.student_id;

      const { data, error } = await supabase
        .from('appointments')
        .select(`*, doctors(*)`)
        .eq('student_id', student_id)
        .order('slotDate', { ascending: false });
        
        return res.json({ success: true, appointments: data });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
 
};

 // API to cancel appointment
const cancelAppointments = async (req, res) => {
  try {
    const { student_id, appointment_id } = req.body;

    // Mark appointment as cancelled
    const { data: appointmentData, error: updateError } = await supabase
      .from('appointments')
      .update({ cancelled: true })
      .match({ student_id, appointment_id })
      .select()
      .single();  // Expecting single appointment

    if (updateError) throw updateError;

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




export { registerUser, loginUser, getProfile, updateProfile, signOut, bookAppointment, listAppointment, cancelAppointments  };
