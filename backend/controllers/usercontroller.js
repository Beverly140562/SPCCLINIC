import supabase from '../config/supabaseClient.js';
import validator from 'validator';
import bcrypt from 'bcrypt'


const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, dob } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // validating the email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // validating the strong password
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // validating the hashing password
    const salt = await bcrypt.genSalt(10) 
    const hashedPassword = await bcrypt.hash(password,salt)

    //  Check if email already exists in students table
    const { data: existing, error: existingError } = await supabase
      .from('students')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    //  Register user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      name,
      email,
      password: hashedPassword,
    });

    if (signUpError) {
      return res.json({ success: false, message: signUpError.message });
    }

    const student_id = signUpData?.user?.id;
    if (!student_id) {
      return res.json({ success: false, message: 'User ID not found after signup' });
    }

    // Insert additional profile info into `students` table
    const data = await supabase.from('students').insert([
      {
        student_id: student_id,
        name,
        email,
        phone: phone || 'Not Provided',
        address: JSON.stringify({ line1: address || 'Not Provided', line2: '' }),
        gender: 'Not Specified',
        dob: dob || '2000-01-01',
      },
    ]);

    //  Success response
    return res.json({ success: true, message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API for user log in 
const loginUser = async (req, res) => {

  try {
    
    const {email,password} = req.body

    if (!students) {
        return res.json({success:false,message:"User does not exist"})
    }

    const isMatch = await bcrypt.compare(password,students.password)

    if (isMatch) {
      const students = await supabase.auth.signInWithPassword({ email, password });
      res.json({success:true,students})
    } else {
      res.json({success:false,message:"Invalid credentials"})
    }

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message })
  }
};

// ✅ Sign-out
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error);
};

// API to book appoinment

const bookAppointment = async (req, res) => {
  try {
    const { student_id, doctor_id, slotDate, slotTime } = req.body;

    // Fetch student and doctor data
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', student_id)
      .single();

    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('doctor_id', doctor_id)
      .single();

    if (studentError || doctorError || !studentData || !doctorData) {
      return res.status(404).json({ success: false, message: 'Doctor or student not found' });
    }

    if (!doctorData.available) {
      return res.status(400).json({ success: false, message: 'Doctor not available' });
    }

    let slots_booked = doctorData.slots_booked || {};

    // Check slot availability
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    // Update slots_booked
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    // Remove slots_booked before storing doctorData in appointment
    const { slots_booked: _, ...doctorDataForAppointment } = doctorData;

    // Insert appointment
    const { data: newAppointment, error: insertError } = await supabase.from('appointments').insert([
      {
        student_id,
        doctor_id,
        slot_date: slotDate,
        slot_time: slotTime,
        student_data: studentData,
        doctor_data: doctorDataForAppointment,
        amount: doctorData.fees,
        date: new Date(),
        cancelled: false,
        payment: false,
        is_completed: false,
      },
    ]);

    if (insertError) {
      return res.status(500).json({ success: false, message: 'Failed to create appointment', error: insertError.message });
    }

    // Update doctor's booked slots
    const { error: updateError } = await supabase
      .from('doctors')
      .update({ slots_booked })
      .eq('doctor_id', doctor_id);

    if (updateError) {
      return res.status(500).json({ success: false, message: 'Appointment created but failed to update doctor slots' });
    }

    return res.status(201).json({ success: true, message: 'Appointment booked successfully', data: newAppointment });
  } catch (error) {
    console.error( error);
    return res.json({ success: false, message:error.message });
  }
};


export { registerUser, loginUser, signOut, bookAppointment  };
