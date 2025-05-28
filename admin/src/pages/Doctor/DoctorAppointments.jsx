import { useEffect, useState, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

function DoctorAppointments() {
  const { DToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return '-';
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const slotDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (DToken && selectedDate) {
      getAppointments(selectedDate);
    }
  }, [DToken, selectedDate]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <p className="mb-3 text-lg font-semibold">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Table headers */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 py-3 px-6 border-b font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Action</p>
        </div>

        {/* Appointment list */}
        {appointments.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No appointments found.</p>
        ) : (
          appointments.reverse().map((item, index) => (
            <div
              key={item.appointment_id || index}
              className="flex flex-wrap justify-between max-sm:gap-4 max-sm:text-sm sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] items-center gap-1 text-gray-600 px-6 border-b hover:bg-gray-50 py-3"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex gap-2 items-center">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData?.image || '/default-user.png'}
                  alt={item.userData?.name || 'User'}
                />
                <p>{item.userData?.name || 'Unknown'}</p>
              </div>

              {/* Payment Status */}
              <p className="text-xs inline border border-green-500 text-green-600 px-2 py-0.5 rounded-full">
                Paid
              </p>

              {/* Age */}
              <p className="max-sm:hidden">{item.userData?.dob ? calculateAge(item.userData.dob) : '-'}</p>

              {/* Date & Time */}
              <p>{slotDate(item.slotDate)}, {item.slotTime}</p>

              {/* Action Icons */}
              {
                item.cancelled 
                  ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                  : item.is_completed
                    ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                    : <div className="flex gap-2 items-center">
                      <img
                        onClick={() => cancelAppointment(item.appointment_id, item.doctor_id, item.slotDate)}
                        className="w-5 cursor-pointer hover:scale-105"
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                      <img
                        onClick={() => completeAppointment(item.appointment_id, item.doctor_id, item.slotDate)}
                        className="w-5 cursor-pointer hover:scale-105"
                        src={assets.tick_icon}
                        alt="Complete"
                      />
                    </div>
              }        
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;
