import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { doctor_id } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, } = useContext(AppContext)
  const daysofWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // Fetch doctor info when doctor_id changes
  const fetchDocInfo = async () => {
    console.log('Doctor ID from URL:', doctor_id)
    const data = doctors.find(doc => doc.doctor_id === doctor_id)
    console.log('Fetched doctor data:', data)
    setDocInfo(data)
  }


  const getAvailableSlots = async () => {
    setDocSlots([]); // reset previous slots
  
    const today = new Date();
  
    for (let i = 0; i < 7; i++) { // check next 7 days
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      const dayOfWeek = currentDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue; // skip weekends
      }
  
      const slots = [];
      const start = new Date(currentDate.setHours(8, 0, 0, 0)); // 8:00 AM
      const end = new Date(currentDate.setHours(17, 0, 0, 0));  // 5:00 PM
  
      const slotTime = new Date(start);
  
      while (slotTime < end) {
        slots.push({
          datetime: new Date(slotTime),
          time: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }
  
      setDocSlots(prev => [...prev, slots]);
    }
  };
  


  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    try {
      
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day +"_"+ month + year

      console.log(slotDate);

    } catch (error) {
      
    }

  }

  useEffect(() => {
    if (doctor_id && doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, doctor_id])

  useEffect(() => {
    getAvailableSlots()
  },[docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

 

  return docInfo && (
    <div>
      {/* Doctor Info */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <img className='bg-primary w-full sm:w-72 rounded-lg' src={docInfo.image} alt='' />
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0 '>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div className='mt-3'>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>
              About <img src={assets.info_icon} alt='' />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>

        {/* Day Buttons */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
  {
    docSlots.length > 0 && docSlots.map((item, index) => (
      <div
        key={index}
        onClick={() => setSlotIndex(index)}
        className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
      >
        <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
        <p>{item[0] && item[0].datetime.getDate()}</p>
      </div>
    ))
  }
</div>


        {/* Time Slots */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          }
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors doctor_id={doctor_id} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
