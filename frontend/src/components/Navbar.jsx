import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient'; 

const Navbar = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null); 

  // 🔹 Fetch user profile when session is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("students")
          .select("image")
          .eq("student_id", session.user.id)
          .single(); 

          

          if (data && data.image) {
            // Get the public URL for the image from Supabase storage
            const { data: imageUrlData } = supabase.storage
              .from("profile.pics")
              .getPublicUrl(data.image);
    
            if (imageUrlData?.publicUrl) {
              setProfilePic(imageUrlData.publicUrl); // Set the public URL
            }
          } else {
            console.error("Error fetching user profile:", error);
          }
        }
    };

    fetchUserProfile();
  }, [session]);

  
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='flex justify-between items-center text-sm py-4 mb-5 border-b border-gray-400 px-5'>
   
      <div className='flex items-center gap-2 cursor-pointer'>
        <img onClick={() => navigate('/')} className='h-10' src={assets.logo} alt="SPC Dental Clinic Logo" />
        <span className='text-2xl font-semibold text-red-600'>SPC Dental Clinic</span>
      </div>

  
      <ul className='hidden md:flex items-center gap-5 font-medium'>
        {["/", "/doctors", "/about", "/contact"].map((path, index) => {
          const labels = ["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"];
          return (
            <li key={path} className="flex flex-col items-center">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `hover:text-blue-500 transition ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : ""}`
                }
              >
                {labels[index]}
              </NavLink>
            </li>
          );
        })}
      </ul>

 
      <div className='flex items-center gap-4'>
        {session ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            
            <img
              className='w-10 h-10 rounded-full object-cover'
              src={profilePic || assets.profile_pic}
              alt="Profile"
            />

            <img className='w-5' src={assets.dropdown} alt="Dropdown" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                <p onClick={handleSignOut} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-blue-600 text-white px-6 py-2 rounded-full font-light hidden md:block hover:bg-blue-700 transition'>
            Create Account
          </button>
        )}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt='Menu' />

        {/* Mobile Menu */}
        <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-35' src={assets.logo} alt="SPC Logo" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
