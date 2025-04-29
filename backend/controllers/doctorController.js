import supabase from '../config/supabaseClient.js';

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

// Fetch list of doctors with details
export { getDoctors, changeAvailability, doctorList };
