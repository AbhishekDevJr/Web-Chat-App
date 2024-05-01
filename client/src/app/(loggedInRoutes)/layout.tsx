'use client';
import Link from "next/link";
import { useState } from "react";
import { addFriendSvg, fakeRequestData, friendListSvg, friendReqSvg, logOutSvg, notificationSvg, searchSvg, sendSvg } from "@/helpers/constants";
import { Input } from "antd";

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const [chatSelection, setChatSelection] = useState('chat');
    return (
        <div className='container-user-layout flex flex-col min-h-[100vh] border-solid bg-[white]'>
            {/* <div className='container-sidebar flex flex-col justify-between border-[E4E4E7] border-x-[2px] grow-0 shrink-0 basis-[15%]'>
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
                        <Link href='/addfriend' className="text-[#090D22] p-[10px] rounded-lg hover:bg-[#6366F1] hover:text-[#F5F5F5] focus:bg-[#6366F1] focus:text-[#F5F5F5] duration-200">
                            <li className="flex items-center gap-[5px]">{addFriendSvg}Add Friend</li>
                        </Link>

                        <Link href='/friendlist' className="text-[#090D22] p-[10px] rounded-lg hover:bg-[#6366F1] hover:text-[#F5F5F5] focus:bg-[#6366F1] focus:text-[#F5F5F5] duration-200">
                            <li className="flex items-center gap-[5px]">{friendListSvg}Friend List</li>
                        </Link>
                        <Link href='/friendrequests' className="text-[#090D22] p-[10px] rounded-lg hover:bg-[#6366F1] hover:text-[#F5F5F5] focus:bg-[#6366F1] focus:text-[#F5F5F5] duration-200">
                            <li className="flex items-center gap-[5px]">{friendReqSvg}Friend Requests</li>
                        </Link>
                        <Link href='/' className="text-[#090D22] p-[10px] rounded-lg hover:bg-[#6366F1] hover:text-[#F5F5F5] focus:bg-[#6366F1] focus:text-[#F5F5F5] duration-200">
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
            </div> */}

            <header className='flex items-center justify-between px-[20px] py-[10px]'>
                <div className='site-logo'>
                    <Link href='/' className="text-[28px] text-[#6366F1] font-[600] tracking-tighter whitespace-nowrap">Exclusive <span className='text-[#09090B]'>Messenger</span></Link>
                </div>

                <div className='site-search flex items-center justify-center gap-[10px]'>
                    <Input className='py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] focus:bg-[#F5F7F9]' type='text' placeholder="Search" />
                    <span className="text-[#F5F5F5] font-[500] px-[20px] py-[8px] rounded-[8px] bg-[#6366F1] cursor-pointer">
                        {searchSvg}
                    </span>
                </div>

                <div className='site-user-info flex items-center justify-center gap-[10px]'>
                    {notificationSvg}
                    <span className='min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9]'>A</span>
                </div>
            </header>

            <div className='container-childred flex justify-between grow-[1] p-[15px]'>
                <div className='container-sidebar basis-[15%] outline outline-[cyan] outline-[1px]'>
                    <div className="friend-add">
                        <ul className='flex justify-between gap-[5px]'>
                            {fakeRequestData.map((item, index) => <li className="min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9]" key={index}>{item.firstName[0]}</li>)}

                            <li className="min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9]">+</li>
                        </ul>
                    </div>

                    <div className="friend-list">
                        <ul>
                            {fakeRequestData.map((item, index) =>
                                <li key={index}>

                                </li>)}
                        </ul>
                    </div>
                </div>

                <div className='container-main-section flex-1'>
                    {children}
                </div>
            </div>
        </div>
    );
}