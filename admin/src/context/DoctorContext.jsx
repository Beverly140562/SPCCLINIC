import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [DToken, setDToken] = useState(localStorage.getItem('DToken') || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false)
  const [data,setProfileData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAppointments = async (slotDate) => {
  if (!slotDate) {
    toast.error("Please select a date before fetching appointments");
    return;
  }

  try {
    const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
      headers: { Authorization: `Bearer ${DToken}` },
      params: { slotDate },  // no need to pass doctor_id explicitly
    });

    if (data.success) {
      setAppointments(data.appointments);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Error fetching appointments: " + (error.response?.data?.message || error.message));
  }
};


const completeAppointment = async (appointment_id, doctor_id, slotDate) => {
  if (!doctor_id || !slotDate) {
    toast.error("Please select both doctor and date before completing an appointment.");
    return;
  }

  try {
    const { data } = await axios.post(
      backendUrl + '/api/doctor/complete-appointment',
      { appointment_id,doctor_id,
      slotDate },
      { headers: { Authorization: `Bearer ${DToken}` } }
    );

    if (data.success) {
      toast.success(data.message);
      getAppointments(slotDate); // ✅ Fix: only pass slotDate
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const cancelAppointment = async (appointment_id, doctor_id, slotDate) => {
  if (!doctor_id || !slotDate) {
    toast.error("Please select both doctor and date before canceling an appointment.");
    return;
  }

  try {
    const { data } = await axios.post(
      backendUrl + '/api/doctor/cancel-appointment',
      { appointment_id,doctor_id,
      slotDate },
      { headers: { Authorization: `Bearer ${DToken}` } }
    );

    if (data.success) {
      toast.success(data.message);
      getAppointments(slotDate);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
     console.log(error);
    toast.error(error.message)
  }
};

const getDashData = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
      headers: { Authorization: `Bearer ${DToken}` },
    });

    if (data.success) {
      setDashData(data.dashboard); // ✅ Use "dashboard" not "dashData"
      console.log(data.dashboard);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
};

const getProfileData = async () => {
  try {

    const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
      headers: { Authorization: `Bearer ${DToken}` },
    });
    if (data.success) {
      setProfileData(data.data)
      console.log(data.data)
      
    }
    
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
  
}





  const value = {
    DToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,setDashData,
    getDashData,
    data,setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
