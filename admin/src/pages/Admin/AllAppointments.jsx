import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments = [], getAllAppointments,cancelAppointment, doctors = [] } = useContext(AdminContext);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const {calculateAge} = useContext(AppContext)

  useEffect(() => {
    if (aToken && selectedDoctor && selectedDate) {
      getAllAppointments(selectedDoctor, selectedDate);
    }
  }, [aToken, selectedDoctor, selectedDate]);


  return (
    <div className='w-full max-w-6xl m-5'>
      {/* Doctor select */}
      <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className="mb-3 p-2 border rounded">
        <option value="">Select Doctor</option>
        {doctors.length > 0 ? (
          doctors.map(doc => (
            <option key={doc.doctor_id} value={doc.doctor_id}>{doc.name}</option>
          ))
        ) : (
          <option disabled>Loading doctors...</option>
        )}
      </select>

      {/* Date select */}
      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
        className="mb-5 p-2 border rounded"
      />

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        {/* Table header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b font-semibold'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          {/* You can add Actions column here */}
        </div>

        {/* Table rows */}
        {
        !selectedDoctor || !selectedDate ? (
          <p className='p-4 text-center text-red-500'>
            Please select both doctor and date before fetching appointments.
          </p>
        )  
        : appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={item.appointment_id || index}
              className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col items-center gap-2 p-3 border-b"
            >
              <p>{index + 1}</p>

              {/* Patient */}
              <div className="flex items-center gap-2">
                <img
                  src={item.userData?.image || '/default-user.png'}
                  alt={item.userData?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>{item.userData?.name || 'Unknown Patient'}</p>
              </div>
              
              {/* Age */}
              <p className='max-sm:hidden'>{calculateAge(item.userData?.dob || '-')}</p>

              {/* Date & Time */}
              <p>{(item.slotDate)}, {item.slotTime}</p>

              {/* Doctor */}
              
              <div className="flex items-center gap-2">
                <img
                  src={item.docData?.image || '/default-user.png'}
                  alt={item.docData?.name || 'Unknown Doctor'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>{item.docData?.name || 'Unknown Patient'}</p>
              </div>

              {/* Fees */}
              <p>{item.docData?.fees ? `₱ ${item.docData.fees}` : '-'}</p>

              {/* Status */}
              {
                item.cancelled 
                ? <p className='text-red-400 text-xs font-medium '>Cancelled</p>
                : <img onClick={()=>cancelAppointment(item.appointment_id,selectedDoctor, selectedDate)} className='w-7 cursor-pointer' src={assets.cancel_icon} alt='' />

              }
              
              {/* You can add buttons or other action controls here */}

            </div>
          ))
        ) : (
          <p className="p-4 text-center">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
