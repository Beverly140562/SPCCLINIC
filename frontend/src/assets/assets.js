import appointment_img from './appointment_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.png'
import dropdown from './dropdown.svg'
import menu_icon from './menu_icon.png'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.png'
import verified_icon from './verified_icon.png'
import arrow_icon from './arrow_icon.png'
import info_icon from './info_icon.png'
import uploadIcon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import pay_logo from './pay_logo.png'
import beverly from './beverly.jpg'
import dentist from './dentist.png'
import Lloyd from './Lloyd.jpg'
import Jobillee from './Jobillee.jpg'
import Sam from './Sam.jpg'
import clinic from './clinic.png'

export const assets = {
    appointment_img,
    group_profiles,
    profile_pic,
    contact_image,
    about_image,
    logo,
    dropdown,
    menu_icon,
    cross_icon,
    chats_icon,
    verified_icon,
    arrow_icon,
    info_icon,
    uploadIcon,
    stripe_logo,
    pay_logo,
    beverly,
    Lloyd,
    Jobillee,
    Sam,
    clinic
}

export const specialityData = [
    {
        speciality: 'Dentist',
        image: dentist
    }
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Beverly',
        image: beverly,
        speciality: 'dentist',
        degree: 'DMD',
        experience: '2 Years',
        about: 'Dr. Bev is a doctor who diagnoses and treats oral health conditions.',
        fees: "Charge in your miscellaneous.",
        address: {
            line1: 'Sabayle Street',
            line2: 'St. Peters College'
        }
        
    },
    {
        _id: 'doc2',
        name: 'Dr. Lloyd',
        image: Lloyd,
        speciality: 'dentist',
        degree: 'DMD',
        experience: '2 Years',
        about: 'Dr. Lloyd is a doctor who diagnoses and treats oral health conditions.',
        fees: " Charge in your miscellaneous.",
        address: {
            line1: 'Sabayle Street',
            line2: 'St. Peters College'
        }
        
    },
    {
        _id: 'doc3',
        name: 'Dr. Jobillee',
        image: Jobillee,
        speciality: 'dentist',
        degree: 'DMD',
        experience: '2 Years',
        about: 'Dr. Jobillee is a doctor who diagnoses and treats oral health conditions.',
        fees: "Charge in your miscellaneous.",
        address: {
            line1: 'Sabayle Street',
            line2: 'St. Peters College'
        }
        
    },
    {
        _id: 'doc4',
        name: 'Dr. Sam',
        image: Sam,
        speciality: 'dentist',
        degree: 'DMD',
        experience: '2 Years',
        about: 'Dr. Sam is a doctor who diagnoses and treats oral health conditions.',
        fees: "Charge in your miscellaneous.",
        address: {
            line1: 'Sabayle Street',
            line2: 'St. Peters College'
        }
        
    },
    
]