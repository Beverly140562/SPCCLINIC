import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);



  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return dashData && (
    <div className="m-5">

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.doctor_icon} alt="Doctor" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.totalDoctors}</p>
            <p className="text-gray-400">Doctors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="Appointment" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.totalAppointments}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patient_icon} alt="Patient" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{dashData.totalStudents}</p>
            <p className="text-gray-400">Students</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white mt-10 rounded border">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <img src={assets.logo} alt="Logo" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={item.appointment_id || index}
              className="flex items-center justify-between gap-4 px-4 py-3 border-t hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <img className="w-12 h-12 rounded-full object-cover" src={item.docData?.image} alt="Doctor" />
                <div>
                  <p className="font-medium">{item.docData?.name}</p>
                  <p className="text-sm text-gray-500">{new Date(item.slotDate).toLocaleString()}</p>
                </div>
              </div>
              <div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : (
                  <img
                    onClick={() =>
                      cancelAppointment(item.appointment_id, item.doctor_id, item.slotDate)
                    }
                    className="w-6 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    title="Cancel Appointment"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
