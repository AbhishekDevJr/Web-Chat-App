'use client';

import { fakeChat, fakeRequestData, sendSvg } from "@/helpers/constants";
import { Input } from "antd";
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

                    <div className='body-chat flex-1 flex-grow p-[20px] flex flex-col items-center justify-between'>
                        <ul className="min-w-[100%]">
                            {fakeChat.map((item, index) =>
                                <li key={index} className={`flex items-center gap-[5px] ${index % 2 === 0 ? 'justify-start' : 'justify-end'} ${index !== 0 ? 'mt-[-20px]' : ''}`}>
                                    {index % 2 === 0 ?
                                        <>
                                            <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#09090B] cursor-pointer">{currUser.firstName[0].toUpperCase()}</span>
                                            <div className="text-[#09090B] font-[600]">
                                                <span className="text-[#09090B] text-[14px]">{currUser.firstName}</span>
                                                <p className="bg-[#e2e2e2] p-[15px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[400px]">{item.msg}</p>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="text-[white] font-[600] flex flex-col justify-end">
                                                <span className="text-[#09090B] text-[14px] ml-[auto]">{'Abhishek'}</span>
                                                <p className="bg-[#6366F1] p-[15px] rounded-br-[20px] rounded-bl-[20px] rounded-tl-[20px] max-w-[400px]">{item.msg}</p>
                                            </div>

                                            <span className="mt-[-30px] min-w-[40px] min-h-[40px] max-w-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] bg-[#153448] cursor-pointer">{`A`}</span>
                                        </>
                                    }
                                </li>
                            )}
                        </ul>

                        <div className="flex items-center min-w-[50%]">
                            <Input className='py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px] border-[2px]' type='text' placeholder="Say Something..." />
                            <span className="ml-[-40px] z-[10]">
                                {sendSvg}
                            </span>
                        </div>
                    </div>
                </div>
                :
                <h1>No Such User Found!</h1>
            }
        </>
    );
}