import { createContext, useState } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [DToken, setDToken] = useState(localStorage.getItem('aToken') || '');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    DToken,
    setDToken,
    backendUrl
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
