import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([])
  const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  const getDoctorsData = async () => {
    try {

      const response = await axios.get(`${backendUrl}/api/doctor/list`);
      console.log(response.data); 
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <AppContext.Provider value={{ doctors,getDoctorsData,aToken,setAToken,
      backendUrl }}>
      {props.children}
    </AppContext.Provider>
  );
};
