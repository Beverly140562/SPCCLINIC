import React, { useContext,  useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  if (!userData) {
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;
  }

  // Ensure address object is defined
  const address = userData.address || { line1: '', line2: '' };

  const updateUserProfileData = async () => {
    console.log('Sending FormData:', {
  name: userData.name,
  phone: userData.phone,
  gender: userData.gender,
  dob: userData.dob,
  university_id: userData.university_id,
  medical_history: userData.medical_history,
  address: address,
});

  try {
    const formData = new FormData();
    formData.append('name', userData.name || '');
formData.append('phone', userData.phone || '');
formData.append('gender', userData.gender || 'null');
formData.append('dob', userData.dob || '');
formData.append('university_id', userData.university_id || '');
formData.append('medical_history', userData.medical_history || '');

formData.append('address', JSON.stringify({
  line1: address.line1 || '',
  line2: address.line2 || '',
}));

if (image) {
  formData.append('image', image);
}

    const { data } = await axios.post(
      `${backendUrl}/api/user/update-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      await loadUserProfileData();
      setIsEdit(false);
      setImage(null);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    if (error.response) {
      console.error('Backend error:', error.response.data);
      toast.error(`Update failed: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error('Error:', error.message);
      toast.error('Error updating profile');
    }
  }
};




  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {isEdit ? (
  <label htmlFor="image">
    <div className="inline-block relative cursor-pointer">
      <img
        className="w-36 rounded opacity-75"
        src={image ? URL.createObjectURL(image) : userData.image}
        alt="Profile Preview"
      />
      {!image && (
        <img
          className="w-10 absolute bottom-12 right-12"
          src={assets.uploadIcon}
          alt="Upload Icon"
        />
      )}
    </div>
    <input
      onChange={(e) => setImage(e.target.files[0])}
      type="file"
      id="image"
      hidden
      accept="image/*"
    />
  </label>
) : (
  <img
    className="w-36 h-36 rounded-full object-cover"
    src={userData.image}
    alt="User"
  />
)}


      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name || ''}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <p className="text-blue-500">Email:</p>
        <p>{userData.email || ''}</p>

        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.phone || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        ) : (
          <p className="text-blue-400">{userData.phone}</p>
        )}

        <p className="font-medium">School ID:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.university_id || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, university_id: e.target.value }))}
          />
        ) : (
          <p className="text-blue-400">{userData.university_id}</p>
        )}

        <p className="font-medium">Medical History:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.medical_history || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, medical_history: e.target.value }))}
          />
        ) : (
          <p className="text-blue-400">{userData.medical_history}</p>
        )}

        <p className="font-medium">Date of Birth:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="date"
            value={userData.dob || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
          />
        ) : (
          <p className="text-gray-500">{userData.dob}</p>
        )}

        <p className="font-medium">Gender:</p>
        {isEdit ? (
          <select
            className="bg-gray-100 max-w-52"
            value={userData.gender || ''}
            onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p className="text-gray-500">{userData.gender}</p>
        )}

        <p className="font-medium">Address:</p>
        {isEdit ? (
          <>
            <input
              className="bg-gray-50"
              type="text"
              value={address.line1 || ''}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...address, line1: e.target.value },
                }))
              }
            />
            <input
              className="bg-gray-50"
              type="text"
              value={address.line2 || ''}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...address, line2: e.target.value },
                }))
              }
            />
          </>
        ) : (
          <p className="text-gray-500">
            {address.line1}, {address.line2}
          </p>
        )}
      </div>

      <div>
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
