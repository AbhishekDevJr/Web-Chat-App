'use client';

import Lottie from 'react-lottie';
import leftArrow from '../../../Lottie/leftArrow.json';

export default function UserDashboard() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: leftArrow,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className='container-home-comp flex flex-col items-center justify-center flex-grow w-full gap-[20px] min-h-[100%]'>
            <h1 className='text-[44px] font-[700] text-center mt-[-70px] leading-[45px] text-[#111827]'>Chat With Friends, Chat With Ai<br /> Whats The Difference?!</h1>
            <p className='text-[#4B5563] text-[18px]'>Messenger With Built in ChatBot for when your Friends are too Busy.</p>
            <div className="flex justify-center items-center">
                <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150}
                />
                <p className='text-[#4B5563] text-[16px]'>Friends added will Appear in this Section.</p>
            </div>
        </div>
    );
}