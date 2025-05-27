import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') );
  const [doctors, setDoctors] = useState([]);
  const [appointments,setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure correct .env setup

  const getAllDoctors = async () => {
    try {
      console.log("Sending request to fetch doctors...");
      console.log("Current aToken:", aToken);
  
      const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });
  
      console.log("Response data:", data);
  
      if (data.success) {
        setDoctors(data.doctors);
        console.log("Doctors fetched:", data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error while fetching doctors:", error);
  
      // Check for token expiration
      if (error.response?.status === 401 && error.response?.data?.message === 'Token has expired') {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('aToken');
        setAToken('');
        // Optional redirect to login page
        window.location.href = '/admin/login';
      } else {
        toast.error("Failed to fetch doctors: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const changeAvailability = async (doctor_id) => {
    console.log("Request URL:", `${backendUrl}/api/admin/change-availability`);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { doctor_id },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
  
      if (data.success) {
        toast.success(data.message);
        
        // update the availability of the doctor 
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.doctor_id === doctor_id
              ? { ...doctor, available: !doctor.available }
              : doctor
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error changing availability: " + (error.message || error.response?.data?.message));
    }
  };

  const getAllAppointments = async (doctor_id, slotDate) => {
  if (!doctor_id || !slotDate) {
    toast.error("Please select both doctor and date before fetching appointments");
    return;
  }

  try {
    const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
      headers: { Authorization: `Bearer ${aToken}` },
      params: { doctor_id, slotDate },  // <-- pass these as query params!
    });

    if (data.success) {
      setAppointments(data.appointments);
      console.log("Appointments fetched:", data.appointments);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Error fetching appointments: " + (error.response?.data?.message || error.message));
  }
};

const cancelAppointment = async (appointment_id, doctor_id, slotDate) => {
  if (!doctor_id || !slotDate) {
    toast.error("Please select both doctor and date before canceling an appointment.");
    return;
  }

  try {
    const { data } = await axios.post(
      backendUrl + '/api/admin/cancel-appointment',
      { appointment_id },
      { headers: { Authorization: `Bearer ${aToken}` } }
    );

    if (data.success) {
      toast.success(data.message);
      getAllAppointments(doctor_id, slotDate);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

const getDashData = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${aToken}` },
    });

    if (data.success) {
      setDashData(data.dashboard); // ✅ Use "dashboard" not "dashData"
      console.log(data.dashboard);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};






  
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors, 
    changeAvailability,
    appointments,setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,getDashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;