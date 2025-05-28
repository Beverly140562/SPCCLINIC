import supabase from "../config/supabaseClient.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Fetch doctors 
const getDoctors = async (req, res) => {
 
  try {
    console.log('Request received:', req.headers['authorization']);  // Log token for debugging

    // Fetch doctors 
    const { data: doctors, error: fetchError } = await supabase
      .from('doctors')
      .select('*')
      

    if (fetchError) {
      console.error("Error fetching doctors:", fetchError);
      return res.json({ message: 'Error fetching doctors' });
    }

    // Count the total number of doctors 
    const { data: totalData, error: countError } = await supabase
      .from('doctors')
      .select('doctor_id', { count: 'exact' });

    if (countError) {
      console.error("Error fetching count:", countError);
      return res.json({ message: 'Error counting doctors' });
    }

    res.json({
      success: true,
      doctors,
      total: totalData.length,  // Return the total number of doctors
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ message: 'Error fetching doctors' });
  }
};

// Change doctor's availability
const changeAvailability = async (req, res) => {
  console.log("Availability change request received for doctor ID:", req.body.doctor_id);

  try {
    const { doctor_id } = req.body;

    // Fetch the current available of the doctor
    const { data: doctor, error: fetchError } = await supabase
      .from('doctors')
      .select('available')
      .eq('doctor_id', doctor_id)
      .single();  //  single row for doctor should be unique id

    if (fetchError || !doctor) {
      console.error("Error fetching doctor:", fetchError);
      return res.json({ success: false, message: 'Doctor not found' });
    }

    // current available for debugging purposes
    console.log("Current availability for doctor:", doctor.available);

    // Toggle the availability: If available is true, set it to false, and vice versa
    const newAvailability = !doctor.available;
    console.log("New availability for doctor:", newAvailability);

    // Update the doctor's availability in the database
    const { error: updateError } = await supabase
      .from('doctors')
      .update({ available: newAvailability })  // Update the availability field
      .eq('doctor_id', doctor_id);  // Target the specific doctor by doctor_id

    if (updateError) {
      console.error("Error updating doctor availability:", updateError);
      return res.json({ success: false, message: updateError.message });
    }

    // Successfully updated, respond with the new availability
    console.log("Availability updated successfully.");
    res.json({
      success: true,
      message: 'Availability updated',
      newAvailability,
      doctor_id,  // Include the doctor_id and updated status for confirmation
    });
  } catch (error) {
    console.error('Error in changeAvailability:', error.message);
    res.json({ success: false, message: error.message });
  }
};


const doctorList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;  
    const offset = (page - 1) * limit;

    // Fetch the doctors 
    const { data: doctors, error: fetchError } = await supabase
      .from('doctors')
      .select('doctor_id, name, image, speciality, available, experience')
      .range(offset, offset + limit - 1);

    if (fetchError) throw fetchError;

    // total count of doctors
    const { data: totalData, error: countError } = await supabase
      .from('doctors')
      .select('doctor_id', { count: 'exact' });

    if (countError) throw countError;

    res.json({
      success: true,
      doctors,
      total: totalData.length, // Return total count 
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.json({ success: false, message: error.message });
  }
};

// API doctor login 
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch the doctor using the provided email
    const { data: doctor, error } = await supabase
      .from("doctors")
      .select("*") // you need password and doctor_id too
      .eq("email", email)
      .single();

    // Check if the doctor exists
    if (error || !doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ doctor_id: doctor.doctor_id }, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }

  } catch (error) {
    console.error('Error logging in doctor:', error);
    res.json({ success: false, message: "Server error" });
  }
};

// API to get doctor 
const appointmentsDoctor = async (req, res) => {
  const { slotDate } = req.query;
  const doctor_id = req.doctor_id;

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
    slotTime,
    cancelled,
    is_completed,
    doctor_id,
    docData:doctors(doctor_id,name, fees, image),
    userData:students(name, image,dob)
  `)
  .eq('doctor_id', doctor_id)
  .eq('slotDate', slotDate);

if (error) {
  return res.status(500).json({ success: false, message: error.message });
}

return res.json({ success: true, appointments: data });

};

// API to mark completed appointment for doctor
const appointmentComplete = async (req, res) => {
  try {
    const { doctor_id, appointment_id } = req.body;

    const { data, error } = await supabase
      .from('appointments')
      .update({ is_completed: true })
      .eq('appointment_id', appointment_id)
      .select()

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    // ✅ Verify the doctor owns this appointment
    if (data[0].doctor_id === doctor_id) {
      return res.json({ success: true, message: "Appointment Completed." });
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized: Doctor mismatch." });
    }

  } catch (error) {
    console.error('Error completing appointment:', error.message);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// API to cancel appointment for doctor

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

// API dashboard for doctor
const doctorDashboard = async (req, res) => {
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
        slotTime,
        cancelled,
        is_completed,
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

    let patients = []

    appointments.map((item)=>{
      if (!patients.includes(item.userData.student_id)) {
        patients.push(item.userData.student_id);
        
      }
    })

    // Dashboard summary data
    const dashData = {
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).reverse(),
    };

    // Return all data + dashboard summary
    return res.status(200).json({
      success: true,
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

// API doctor profile 

// Get logged-in doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const doctor_id = req.doctor_id;

    if (!doctor_id) {
      return res.status(400).json({ success: false, message: 'Doctor ID missing' });
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', doctor_id)  // <-- corrected here
      .single();

    if (error) {
      console.error('DB error:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



// Update logged-in doctor's profile
const updateProfile = async (req, res) => {
  try {
    console.log("Incoming doctor profile update request");
    console.log("Body:", req.body);

    const { available, address } = req.body; // ✅ CORRECT
    const doctors_id = req.doctor_id; // ✅ From decoded JWT

    if (!doctors_id) {
      return res.status(400).json({ success: false, message: 'Doctor ID missing' });
    }

    const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

    const { data, error: dbError } = await supabase
      .from('doctors')
      .update({    
        available,
        address: parsedAddress,
      })
      .eq('doctor_id', doctors_id) // ✅ Use the correct column name
      .select();

    if (dbError) {
      console.error("Supabase error:", dbError);
      throw dbError;
    }

    return res.json({ success: true, message: "Doctor profile updated successfully", data });
  } catch (err) {
    console.error("Update Doctor Profile Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update doctor profile" });
  }
};



export { getDoctors, changeAvailability, doctorList, loginDoctor, appointmentsDoctor,appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateProfile };