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

    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'Slot not available' });
    }

    // Update slots_booked
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    // Remove slots_booked from doctorData before saving it in appointment
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
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
