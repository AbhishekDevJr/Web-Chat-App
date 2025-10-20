'use client';

import Link from 'next/link'
import React, { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';

function HomeComp() {
    const router = useRouter();

    useLayoutEffect(() => {
        const userinfo = localStorage.getItem('userinfo');
        if (userinfo) {
            router.push('/userdashboard');
        }
    }, []);

    return (
        <div className='container-home-comp flex flex-col items-center justify-center flex-grow w-full gap-[20px]'>
            <h1 className='text-[44px] font-[700] text-center mt-[-70px] leading-[45px] text-[#111827]'>Chat With Friends, Chat With Ai<br /> Whats The Difference?!</h1>

            <p className='text-[#4B5563] text-[18px]'>Messenger With Built in ChatBot for when your Friends are too Busy</p>

            <Link href='/signup' className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B]'>Sign Up</Link>
        </div>
    )
}

export default HomeComp