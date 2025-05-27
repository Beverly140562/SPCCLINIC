import { useState} from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';


const Navbar = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken,userData } = useContext(AppContext);


  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/login');
  }

  return (
    <div className='flex justify-between items-center text-sm py-4 mb-5 border-b border-gray-400 px-5'>
   
      <div className='flex items-center gap-2 cursor-pointer'>
        <img onClick={() => navigate('/')} className='h-10' src={assets.logo} alt="SPC Dental Clinic Logo" />
        <span className='text-2xl font-semibold text-red-600'>SPC Dental Clinic</span>
      </div>
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
        <p className='py-1'>HOME</p>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
        <p className='py-1'>ALL DOCTORS</p>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
        <p className='py-1'>ABOUT</p>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
        <p className='py-1'>CONTACT</p>
        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

 
      <div className='flex items-center gap-4'>
        { 
        token 
         ? 
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            
            <img
              className='w-10 h-10 rounded-full object-cover'
              src={userData?.image || "/default-profile.png"} alt="profile"
            />

            <img className='w-5' src={assets.dropdown} alt="Dropdown" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
              </div>
            </div>
          </div>
         : 
          <button onClick={() => navigate('/login')} className='bg-blue-600 text-white px-6 py-2 rounded-full font-light hidden md:block hover:bg-blue-700 transition'>
            Create Account
          </button>
        }
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