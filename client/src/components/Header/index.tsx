import Link from 'next/link'
import React from 'react'

function HeaderComp() {
    return (
        <header className='comp-header flex justify-between items-center px-[120px] py-[15px] w-full'>
            <div className='site-title text-[24px] text-[#6366F1] font-[600] tracking-tighter'>
                <Link href='/'>Exclusive <span className='text-[#09090B]'>Messenger</span></Link>
            </div>

            <div className='auth-links flex items-center gap-[30px]'>
                <Link href='/signin' className='text-[#201E23] font-[600]'>Sign In</Link>
                <Link href='/signup' className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B]'>Sign Up</Link>
            </div>
        </header>
    )
}

export default HeaderComp