import supabase from '../config/supabaseClient.js';


const getDoctors = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;  // Make sure you're sending page and limit
  const offset = (page - 1) * limit;

  try {
    console.log('Request received:', req.headers['authorization']);  // Log token

    // Fetch data
    const { data: doctors, error: fetchError } = await supabase
      .from('doctors')
      .select('*')
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error("Error fetching doctors:", fetchError);
      return res.status(500).json({ message: 'Error fetching doctors' });
    }

    const { data: totalData, error: countError } = await supabase
      .from('doctors')
      .select('doctor_id', { count: 'exact' });

    if (countError) {
      console.error("Error fetching count:", countError);
      return res.status(500).json({ message: 'Error counting doctors' });
    }

    res.status(200).json({
      success: true,
      doctors,
      total: totalData.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};



export const addDoctor = async (req, res) => {
  try {
    
    // your logic here
    res.status(201).json({ message: 'Doctor added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor' });
  }
};


const changeAvailability = async (req, res) => {
  console.log("Availability change request received for:", req.body.doctor_id);

  try {
    const { doctor_id } = req.body;

    const { data: doctors, error: fetchError } = await supabase
      .from('doctors')
      .select('available')
      .eq('doctor_id', doctor_id)
      .single();

    if (fetchError || !doctors) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const newAvailability = !doctors.available;

    const { error: updateError } = await supabase
      .from('doctors')
      .update({ available: newAvailability })
      .eq('doctor_id', doctor_id);

    if (updateError) {
      return res.status(500).json({ success: false, message: updateError.message });
    }

    res.json({ success: true, message: 'Availability updated' });
  } catch (error) {
    console.error('Error in changeAvailability:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route /api/doctor/list?doctor_id

const doctorList = async (req, res) => {
  try {
    const { data: doctors, error } = await supabase
      .from('doctors')
      .select('doctor_id, name, image, speciality, available, experience');
      
    if (error) throw error; // This will trigger if there is an error with the query.

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'No doctors found' });
    }

    res.json({ success: true, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error); 
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};



export { getDoctors, changeAvailability, doctorList };
