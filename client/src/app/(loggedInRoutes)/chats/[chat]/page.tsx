'use client';

import { fakeChat, fakeRequestData } from "@/helpers/constants";
import { useEffect, useState } from "react";

export default function ChatUser({ params }: { params: any }) {
    console.log('params------->', params.chat);
    const [currUser, setCurrUser] = useState<any>({});

    const getCurrUser = () => {
        const user = fakeRequestData.find((item) => item.userId === params.chat);
        if (user?.username) {
            setCurrUser(user);
        }
        else {
            setCurrUser({});
        }
    }

    useEffect(() => {
        getCurrUser();
    }, []);

    return (
        <>
            {currUser?.username ?
                <div className='container-chat flex flex-col min-h-[100%]'>
                    {/* {params.chat.toUpperCase()} User Chat Route */}
                    <div className='header-chat border-b-[1px] border-[#E5E1DA] flex justify-end items-center gap-[5px] py-[5px] px-[20px] flex-none'>
                        <div className=''>
                            <p className="text-[#09090B] font-[600] text-left">{`${currUser.firstName} ${currUser.lastName}`}</p>
                            <p className="text-[#09090B] text-[14px]">{`${currUser.username}`}</p>
                        </div>

                        <span className="min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUser.firstName[0]}</span>
                    </div>

                    <div className='body-chat flex-1 flex-grow'>
                        <ul>
                            {fakeChat.map((item, index) =>
                                <li key={index}>
                                    <span className="min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{item.user.includes('unknown') ? currUser.firstName[0] : item.user[0].toUpperCase()}</span>
                                    <span>{item.user.includes('unknown') ? currUser.firstName : 'Abhishek'}</span>
                                    <p>{item.msg}</p>
                                </li>
                            )}
                        </ul>

                        <div className="">

                        </div>
                    </div>
                </div>
                :
                <h1>No Such User Found!</h1>
            }
        </>
    );
}