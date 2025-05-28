import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function DoctorProfile() {

  const {DToken, backendUrl, data, setProfileData, getProfileData} = useContext(DoctorContext);
 
  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {

    try {
      const updatedData = {
        address: data.address,
        available: data.available
      } 

      const {data: result} = await axios.post(backendUrl + '/api/doctor/update-profile', updatedData, {
        headers: {
          Authorization: `Bearer ${DToken}`
        }
      });
      if ( result.success) {
        toast.success( result.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(result.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }
   
  useEffect(()=>{
    if (DToken) {
      getProfileData()
    }
  },[DToken])


  return data && (
    <div>

      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-primary-80 w-full sm:max-w-64 rounded-lg' src={data.image} alt='' />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

          {/* ----- Doctor information ----- */}

          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{data.name}</p>        
            <div className='flex items-center gap-2 mt-1 text-gray-600'>
              <p>{data.degree} - {data.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{data.experience}</button>
            </div>

          {/* ----- Doctor About ----- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {data.about}
            </p>
          </div>

          <p className='text-gray-600 font-medium mt-4'> 
            Appointment fee: < span className='text-gray-800 m-1'>Paid On Tuition</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? <input type='text' onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line1:e.target.value}}))} value={data.address.line1} />: data.address.line1}
              <br />
              {isEdit ? <input type='text' onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line2:e.target.value}}))} value={data.address.line2} />:data.address.line2}
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input onChange={()=> isEdit && setProfileData(prev => ({...prev, available: !prev.available}))} checked={data.available} type='checkbox' name='' id='' />
            <label htmlFor=''>Available</label>
          </div>

          {
            isEdit
            ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all '>Save</button>
            : <button onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all '>Edit</button>
          }
        </div>
      </div>
      
    </div>
  )
}

export default DoctorProfile
