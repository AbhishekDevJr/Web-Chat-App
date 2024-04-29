'use client';
import Link from "next/link";
import { useState } from "react";
import { addFriendSvg, friendListSvg, friendReqSvg, logOutSvg } from "@/helpers/constants";

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const [chatSelection, setChatSelection] = useState('chat');
    return (
        <div className='container-user-layout flex flex-1 min-h-[100vh] border-solid '>
            <div className='container-sidebar flex flex-col justify-between border-[E4E4E7] border-x-[2px] grow-0 shrink-0 basis-[15%]'>
                <div className='chat-info flex flex-col justify-between items-center gap-[10px] border-solid border-[#E4E4E7] border-b-[2px] p-[20px]'>
                    <Link href='/' className="text-[28px] text-[#6366F1] font-[600] tracking-tighter whitespace-nowrap">Exclusive <span className='text-[#09090B]'>Messenger</span></Link>
                    <Link href='/signup' className='text-[#F5F5F5] font-[600] px-[35px] py-[8px] rounded-[8px] bg-[#18181B]'>AI CHAT</Link>
                    <div className='chat-type-toggle flex items-center gap-[5px]'>
                        <div className='custom-toggle px-[2px] py-[4px] bg-[#f0f0f1] rounded-[5px] flex items-center gap-[5px]'>
                            <span className={`${chatSelection === 'chat' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chat')}>Chats</span>
                            <span className={`${chatSelection === 'chatai' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chatai')}>AI Chats</span>
                        </div>
                    </div>

                    {chatSelection === 'chat' ?
                        <div className=''>
                            Chat
                        </div>
                        :
                        <div className=''>
                            AI Chat
                        </div>
                    }
                </div>

                <div className='friend-info p-[20px] border-solid border-[E4E4E7] border-b-[2px]'>
                    <ul className="flex flex-col gap-[20px]">
                        <Link href='/addfriend' className="text-[#090D22] hover:underline decoration-solid decoration-[#000000]">
                            <li className="flex items-center gap-[5px]">{addFriendSvg}Add Friend</li>
                        </Link>

                        <Link href='/friendlist' className="text-[#090D22] hover:underline decoration-solid decoration-[#000000]">
                            <li className="flex items-center gap-[5px]">{friendListSvg}Friend List</li>
                        </Link>
                        <Link href='/friendrequests' className="text-[#090D22] hover:underline decoration-solid decoration-[#000000]">
                            <li className="flex items-center gap-[5px]">{friendReqSvg}Friend Requests</li>
                        </Link>
                        <Link href='/' className="text-[#090D22] hover:underline decoration-solid decoration-[#000000]">
                            <li className="flex items-center gap-[5px]">{logOutSvg}Log Out</li>
                        </Link>
                    </ul>
                </div>

                <div className='user-info flex items-center gap-[10px] p-[20px] border-solid border-[E4E4E7] border-b-[2px]'>
                    <span className="bg-[#F4F4F5] min-w-[40px] min-h-[40px] flex items-center justify-center rounded-[100px]">{`A`}</span>
                    <div className='flex flex-col items-center'>
                        <span className="font-[600] text-[#090D22]">{`Abhishek Choudhari`}</span>
                        <span className="text-[#090D22]">{`abhishek@gmail.com`}</span>
                    </div>
                </div>
            </div>

            <div className='container-main-section flex-1'>
                {children}
            </div>
        </div>
    );
}