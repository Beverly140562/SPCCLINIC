import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* -------- Left Section -------- */}
        <div>
            <img className='mb-5 w-30' src={assets.logo} alt="" />
            <span className='text-2xl font-semibold text-blue-600'>SPC Dental Clinic</span>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>SPC offers a vibrant campus life that encourages students to engage in extracurricular activities, clubs, and organizations from student government to sports teams, cultural events, and community service projects, for personal and social development.</p>
        </div>

        {/* -------- Center Section -------- */}
        <div>
            <p className='text-xl font-medium mb-5'>St.Peters College</p>
            <ul className='flex flex-col gap-2 text-gray-600'> 
                <li>Home</li>
                <li>About us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/* -------- Right Section -------- */}
        <div>
            <p className='text-xl font-medium mb-5'>Contact Us</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Monday – Friday: <br /> 8:00 AM - 12:00 Noon <br /> 1:30 PM - 6:00 PM <br /> Saturday: <br /> 08:00 AM - 12:00 Noon</li>
                <li>No. 042 Sabayle St., Iligan City, Philippines</li>
                <li>(+63) 221-6246</li>
                <li>spcregistrar@gmail.com</li>
            </ul>
        </div>
      </div>

        {/* -------- Copyright Section -------- */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>© 2025 St. Peter's College Iligan. All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
