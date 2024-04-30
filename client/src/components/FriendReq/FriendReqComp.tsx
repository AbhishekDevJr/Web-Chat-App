'use client';

import React, { useEffect, useState } from 'react'
import { acceptReq, deleteSvg, fakeRequestData, sendSvg } from '@/helpers/constants';

function FriendReqComp() {
    const [friendList, setFriendList] = useState<any>([]);

    useEffect(() => {
        //Call GET FriendList API Here
        setFriendList(fakeRequestData);
    }, []);

    return (
        <div className='container-friendReq flex flex-col items-center justify-center p-[50px]'>
            <h1 className='text-[38px] text-[#09090B] font-[600] text-center'>Friend Request</h1>
            <div className='outline outline-[#E4E4E7] outline-[2px] rounded-xl shadow-lg p-[40px] flex flex-col gap-[20px]'>
                <p>Found <span className="font-[600]">{friendList.length} People</span></p>
                {friendList.map((item: any, index: any) =>
                    <>
                        <div key={index} className='flex items-center justify-between gap-[10px]'>
                            <span className="bg-[#E4E4E7] min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[100px]">{item.firstName[0]}</span>
                            <p className={`text-[#C35BB6] font-[600]`}>{`${item.firstName} ${item.lastName}`}</p>
                            <p className="text-[#6C6468]">{`${item.email}`}</p>
                            <div className='user-found-actions flex gap-[10px]'>
                                <button className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B] flex justify-center items-center gap-[10px]'>Accept{acceptReq}</button>
                                <button className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#E72929] flex justify-center items-center gap-[10px]'>Delete{deleteSvg}</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FriendReqComp