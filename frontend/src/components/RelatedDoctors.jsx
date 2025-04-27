import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality,doctor_id}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDocs] = useState([])

    useEffect(()=>{
        if (doctors.length > 0 && speciality ) {
            const data = doctors.filter((doctor_id)=> doctor_id.speciality === speciality && doctor_id.doctor_id !== doctor_id)
            setRelDocs(data)
        }
    },[doctors,speciality,doctor_id])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>All Doctors</h1>
      <p className='sm:w1/3 text-center text-sm'>Place where a dentist performs schedule your appointment hassle-free.</p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0,5).map((item,index)=>(
            <div onClick={()=>{navigate(`/appointment/${item.doctor_id}`); scrollTo(0,0)}} className='border border-red-900 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50' src={item.image} alt="" />
                <div className='p-4'>
                    <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                        <p className='w-2 h-2 bg-green-500 rounded-full '></p><p>Available</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-900 text-sm '>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
      <button onClick={()=>{ navigate('/doctor'); scrollTo(0,0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
    </div>
  )
}

export default RelatedDoctors
