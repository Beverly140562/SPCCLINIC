import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';

const AddDoctor = () => {
  const { aToken } = useContext(AdminContext);
  

  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState('');
  const [available, setAvailable] = useState(true);
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState("General Dentist");
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();


    try {
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('available', available ? 'true' : 'false');
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        'http://localhost:4000/api/doctors/add-doctor',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "atoken": aToken,
          },
        }
      );
      
  
      // Check the response from the backend
      if (data.success) {
        toast.success(data.message);
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAvailable(true)
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Log error for debugging
      console.error("Error occurred during doctor addition:", error);
  
      // Check if the error is from the server or the request itself
      if (error.response) {
        // Server responded with an error (e.g., 400, 500)
        console.error("Response error:", error.response);
        toast.error(`Server Error: ${error.response.data.message || "Something went wrong"}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Request error:", error.request);
        toast.error("No response received from server. Please check your connection.");
      } else {
        // Something else went wrong while setting up the request
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };
  

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area_icon} alt='' />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type='file' id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Doctor Name */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="name" className="font-medium text-gray-700">Doctor Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Enter full name"
                autoComplete="name"
                id="name"
                name="name"
                required
              />
            </div>

            {/* Doctor Email */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="email" className="font-medium text-gray-700">Doctor Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="email"
                placeholder="Enter email address"
                autoComplete="email"
                id="email"
                name="email"
                required
              />
            </div>

            {/* Doctor Password */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="password" className="font-medium text-gray-700">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                id="password"
                name="password"
                required
              />
            </div>

            {/* Experience */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="experience-select" className="font-medium text-gray-700">Experience</label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="experience"
                name="experience"
                id="experience-select"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                ))}
              </select>
            </div>

            {/* Consultation Fees */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="fees" className="font-medium text-gray-700">Consultation Fees</label>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="number"
                placeholder="Enter fee amount"
                autoComplete="fees"
                id="fees"
                name="fees"
                required
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {/* Speciality */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="speciality-select" className="font-medium text-gray-700">Speciality</label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                autoComplete="speciality"
                name="speciality"
                id="speciality-select"
              >
                <option value="General Dentist">General Dentist</option>
                <option value="Orthodontist">Orthodontist</option>
                <option value="Pediatric Dentist">Pediatric Dentist</option>
                <option value="Periodontist">Periodontist</option>
                <option value="Prosthodontist">Prosthodontist</option>
              </select>
            </div>

            {/* Education */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="degree" className="font-medium text-gray-700">Education</label>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Enter degree or qualification"
                autoComplete="degree"
                id="degree"
                name="degree"
                required
              />
            </div>

            {/* Address Lines */}
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="address1" className="font-medium text-gray-700">Address Line 1</label>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="Street, Locality"
                autoComplete="address-line1"
                id="address1"
                name="address1"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="address2" className="font-medium text-gray-700">Address Line 2</label>
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                placeholder="City, ZIP Code"
                autoComplete="address-line2"
                id="address2"
                name="address2"
                required
              />
            </div>

            {/* Available Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                name="available"
                id="available"
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <label htmlFor="available" className="font-medium text-gray-700">Available</label>
            </div>
          </div>
        </div>

        {/* About Field */}
        <div className="mt-4">
          <label htmlFor="about" className="font-medium text-gray-700">About</label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write a short bio about the doctor"
            rows={5}
            id="about"
            name="about"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
