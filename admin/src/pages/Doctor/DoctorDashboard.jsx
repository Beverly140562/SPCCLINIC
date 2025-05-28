import { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  const { DToken, dashData, getDashData, cancelAppointment,completeAppointment } = useContext(DoctorContext);

   const slotDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (DToken) {
      getDashData();
    }
  }, [DToken]);

  return dashData && (
    <div className='m-5'>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="Appointment" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.appointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patient_icon} alt="Patient" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.patients}</p>
            <p className="text-gray-400">Students</p>
          </div>
        </div>

        <div className="bg-white mt-10 rounded border w-full">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.logo} alt="Logo" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4">
            {dashData.latestAppointments.reverse().map((item, index) => (
              <div
                key={item.appointment_id || index}
                className="flex items-center justify-between gap-4 px-4 py-3 border-t hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover" src={item.userData?.image} alt="Student" />
                  <div>
                    <p className="font-medium">{item.userData?.name}</p>
                    <p className="text-sm text-gray-500">{slotDate(item.slotDate)}, {item.slotTime}</p>
                  </div>
                </div>
                <div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
