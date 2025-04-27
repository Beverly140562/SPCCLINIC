import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'; // Import your default profile image

const MyProfile = () => {
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(assets.profile_pic);


  const [userData, setUserData] = useState({
    name: '',
    image: assets.profile_pic, // Default image
    email: '',
    phone: '',
    university_id: '',
    medical_history: '',
    gender: 'Male',
    dob: '2000-01-01',
    address: { line1: '', line2: '' },
  });

  const [isEdit, setIsEdit] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', userId)
        .single();
    
      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUserData({
          name: data.name || '',
          image: data.image || '', // just the path
          email: data.email || '',
          phone: data.phone || '',
          university_id: data.university_id || '',
          medical_history: data.medical_history || '',
          gender: data.gender || 'Male',
          dob: data.dob || '2000-01-01',
          address: data.address ? JSON.parse(data.address) : { line1: '', line2: '' },
        });
    
        if (data.image) {
          const { data: imageUrlData } = supabase.storage.from('profile.pics').getPublicUrl(data.image);
          if (imageUrlData?.publicUrl) {
            setPreviewUrl(imageUrlData.publicUrl);
          }
        }
      }
    };
    

    fetchUserData();
  }, [userId]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;
  
    setUploading(true);
  
    const filePath = `${userId}/${Date.now()}_${file.name}`;
  
    const { error } = await supabase.storage
      .from('profile.pics')
      .upload(filePath, file, { upsert: true });
  
    if (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      return;
    }
  
    // Get public URL for immediate display
    const { data: urlData } = supabase.storage
      .from('profile.pics')
      .getPublicUrl(filePath);
  
      const publicUrl = urlData?.publicUrl;
      setPreviewUrl(publicUrl);
  
    // Update UI: save filePath for DB, publicUrl for preview
    setUserData((prev) => ({
      ...prev,
      image: filePath, // stored path
    }));;
  
    setUploading(false);
  };
  
  
  
  // Save the updated profile data
  const updateProfile = async () => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: userData.name,
          phone: userData.phone,
          gender: userData.gender,
          dob: userData.dob,
          university_id: userData.university_id,
          medical_history: userData.medical_history,
          address: JSON.stringify(userData.address),
          image: userData.image,
        })
        .eq('student_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        alert('Profile updated successfully!');
        setIsEdit(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <label htmlFor="imageUpload" className="cursor-pointer">
      <img
  className="w-36 h-36 rounded-full object-cover"
  src={previewUrl}
  alt="Profile"
  onError={(e) => (e.target.src = assets.profile_pic)}
/>


      </label>

      {isEdit && (
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      )}

      {uploading && <p className="text-red-500">Uploading...</p>}

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <p className="text-blue-500">Email:</p>
        <p>{userData.email}</p>

        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.phone}
            onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        ) : (
          <p className="text-blue-400">{userData.phone}</p>
        )}

        <p className="font-medium">School_id:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 max-w-52"
            type="text"
            value={userData.university_id}
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
            value={userData.medical_history}
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
            value={userData.dob}
            onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
          />
        ) : (
          <p className="text-gray-500">{userData.dob}</p>
        )}

        <p className="font-medium">Gender:</p>
        {isEdit ? (
          <select
            className="bg-gray-100 max-w-52"
            value={userData.gender}
            onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
          >
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
              value={userData.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              type="text"
            />
            <input
              className="bg-gray-50"
              value={userData.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              type="text"
            />
          </>
        ) : (
          <p className="text-gray-500">
            {userData.address.line1}, {userData.address.line2}
          </p>
        )}
      </div>

      <button
        onClick={isEdit ? updateProfile : () => setIsEdit(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        {isEdit ? 'Save Information' : 'Edit'}
      </button>
    </div>
  );
};

export default MyProfile;
