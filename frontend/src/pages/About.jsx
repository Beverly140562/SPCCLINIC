import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 text-gray-500 '>
          <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justoify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>SPC offers a vibrant campus life that encourages students to engage in extracurricular activities, clubs, and organizations from student government to sports teams, cultural events, and community service projects, for personal and social development.</p>
          <b className='text-gray-800'>Vision Statement</b>
          <p>St. Peter’s College, a school founded in 1952 in Iligan City, is a leading institution in providing quality education infused with technology, research, community extension, environmental preservation and internationalization.</p>
          <b className='text-gray-800'>Mission Statement</b>
          <p>Our mission is to provide a holistic and transformative education that equips students with knowledge, skills, values and strong character to become globally competitive individuals. We aim to nurture intellectual curiosity, critical thinking, social responsibility and moral integrity through innovative practices and collaborative partnerships with the community.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Appoinment schedule that fits into your busy day.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Reminders to help you stay on top of your teeth.</p>
      </div>
    </div>
  </div>
  )
}

export default About
