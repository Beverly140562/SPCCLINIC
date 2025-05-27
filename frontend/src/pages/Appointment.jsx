import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { doctor_id } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  useEffect(() => {
    const docInfo = doctors.find(doc => doc.doctor_id === doctor_id);
    setDocInfo(docInfo);
  }, [doctors, doctor_id]);

  useEffect(() => {
    if (docInfo) {
      generateAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    setSlotTime('');
  }, [slotIndex]);

  const generateAvailableSlots = () => {
    const slotsArray = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      let dayDate = new Date();
      dayDate.setDate(today.getDate() + i);

      const start = new Date(dayDate);
      const end = new Date(dayDate);
      start.setHours(i === 0 ? Math.max(today.getHours() + 1, 10) : 8, i === 0 ? today.getMinutes() + 30 : 0);
      end.setHours(17, 0);

      const timeSlots = [];

      while (start < end) {
        const time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateKey = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`;
        const isBooked = docInfo?.slots_booked?.[dateKey]?.includes(time);

        if (!isBooked) {
          timeSlots.push({ datetime: new Date(start), time });
        }
        start.setMinutes(start.getMinutes() + 30);
      }

      slotsArray.push(timeSlots);
    }

    setDocSlots(slotsArray);
  };

  const bookAppointment = async () => {
  if (!token) {
    toast.warn('Please login to book an appointment');
    return navigate('/login');
  }

  if (!slotTime) {
    toast.error('Please select a time slot');
    return;
  }

  const selectedSlot = docSlots[slotIndex]?.find(slot => slot.time === slotTime);
  if (!selectedSlot) {
    toast.error('Invalid slot selected');
    return;
  }

  const date = selectedSlot.datetime;
  const slotDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      { doctor_id, slotDate, slotTime },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(data.message);
      getDoctorsData(); // Refresh doctors to update slot availability
      navigate('/my-appointments');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || error.message);
  }
};


  if (!docInfo) return null;

  return (
    <div>
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-4">
        <img className="bg-primary w-full sm:w-72 rounded-lg" src={docInfo.image} alt="" />
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <div className="mt-3">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>

        {/* Day Buttons */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((slots, index) => {
            const firstSlot = slots[0];
            if (!firstSlot) return null;
            const date = firstSlot.datetime;
            return (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
                }`}
              >
                <p>{daysofWeek[date.getDay()]}</p>
                <p>{date.getDate()}</p>
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((slot, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(slot.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                slot.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
              }`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors doctor_id={doctor_id} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
