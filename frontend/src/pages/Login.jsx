import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (state === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/signup`, {
          name,
          email,
          password,
          phone,
          university_id: universityId,
          medical_history: medicalHistory,
          dob,
          gender,
          address: JSON.stringify({
  line1: addressLine1,
  line2: addressLine2,
}),
        });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
      console.error("Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p className='text-gray-500'>Please {state === 'Sign Up' ? 'Sign up' : 'Log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className='w-full'>
              <p>Phone</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className='w-full'>
              <p>School ID</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={universityId} onChange={(e) => setUniversityId(e.target.value)} required />
            </div>

            <div className='w-full'>
              <p>Medical History</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
            </div>

            <div className='w-full'>
              <p>Date of Birth</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='date' value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>

            <div className='w-full'>
              <p>Gender</p>
              <select className='border border-zinc-300 rounded w-full p-2 mt-1' value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            </div>

            <div className='w-full'>
              <p>Address Line 1</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
            </div>

            <div className='w-full'>
              <p>Address Line 2</p>
              <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='text' value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type='submit' className='w-full py-2 rounded-md text-base text-white bg-blue-600 hover:bg-blue-700 transition-colors'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className='text-sm'>
          {state === 'Sign Up' ? (
            <p>
              Already have an account?
              <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'> Login here</span>
            </p>
          ) : (
            <p>
              Don't have an account?
              <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'> Sign up here</span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
