import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {

  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500 '>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt='' />

        <div className='flex flex-col justify-center items-start gap-4'>
          <p className='font-semibold text-lg text-gray-600'>Our CLINIC @SPC</p>
          <p className='text-gray-500'>No. 042 Sabayle St., <br /> Iligan City, Philippines.</p>
          <p className='text-gray-500'>Tel: (+63) 221-6246 <br /> Email: spcregistrar@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers @SPC</p>
          <p className='text-gray-500'>Learn more about our school policy.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore @SPC</button>
        </div>

      </div>
      
    </div>
  )
}

export default Contact
