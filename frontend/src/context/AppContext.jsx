import { createContext,  useEffect,  useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [userData, setUserData] = useState(null);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // AppContext.jsx
const loadUserProfileData = async () => {
  if (!token || token === "undefined") {
    console.warn("No valid token found. Skipping profile load.");
    return;
  }

  console.log("Sending token:", token);

  try {
    const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUserData(data.data);
  } catch (error) {
    console.error("Failed to load profile:", error.response?.data || error.message);
  }
};





  // Load doctors on first render
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Load user profile if token is set
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
