import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (!Array.isArray(doctors)) return;

    if (speciality) {
      setFilteredDoctors(doctors.filter((doctors) => doctors.speciality === speciality));
    } else {
      setFilteredDoctors(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className='text-gray-600'>Browse doctors by speciality.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <button
            onClick={() => navigate(speciality === 'dentist' ? '/doctors' : '/doctors/dentist')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'dentist' ? 'bg-indigo-100 text-black' : ''
            }`}
          >
            General Dentist
          </button>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((item) => (
              <div
                key={item.doctor_id}
                onClick={() => navigate(`/appointment/${item.doctor_id}`)}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              >
                <img className='bg-blue-50' src={item.image} alt={item.name} />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                    <p className='w-2 h-2 bg-green-500 rounded-full '></p>
                    <p>Available</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-900 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500 mt-4'>No doctors found for this specialty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
