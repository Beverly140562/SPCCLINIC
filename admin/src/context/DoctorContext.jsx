import { createContext, useState } from "react";


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const value = {
        aToken,setAToken,
        backendUrl
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider