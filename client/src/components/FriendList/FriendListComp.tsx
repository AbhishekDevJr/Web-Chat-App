'use client';

import { chatSvg, fakeRequestData } from '@/helpers/constants';
import React, { useEffect, useState } from 'react'

function FriendListComp() {
    const [friendList, setFriendList] = useState<any>([]);

    useEffect(() => {
        //Mimic API Call
        setFriendList(fakeRequestData);
    }, []);

    return (
        <div className='container-friendlist p-[50px]'>
            <h1 className='text-[38px] text-[#09090B] font-[600]'>Friend List</h1>
            <div className='flex items-center p-[10px] outline outline-[#E4E4E7] outline-[2px] rounded-xl'>
                <div className='rounded-xl p-[40px] flex flex-col gap-[20px]'>
                    <p>Found <span className="font-[600]">{friendList.length} People</span></p>
                    {friendList.map((item: any, index: any) =>
                        <>
                            <div key={index} className='flex items-center justify-between gap-[10px]'>
                                <span className="bg-[#E4E4E7] min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[100px]">{item.firstName[0]}</span>
                                <p className={`text-[#6366F1] font-[600]`}>{`${item.firstName} ${item.lastName}`}</p>
                                <p className="text-[#6C6468]">{`${item.email}`}</p>
                                <div className='user-found-actions flex gap-[10px]'>
                                    <button className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B] flex justify-center items-center gap-[10px]'>Chat{chatSvg}</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FriendListComp