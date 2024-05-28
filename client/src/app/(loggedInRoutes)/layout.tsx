'use client';
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { addSvg, fakeRequestData, notificationSvg, searchSvg } from "@/helpers/constants";
import { Input, Modal, Popover } from "antd";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const bgColors = ['bg-[#153448]', 'bg-[#0C0C0C]', 'bg-[#430A5D]', 'bg-[#5F5D9C]', 'bg-[#114232]', 'bg-[#35374B]'];
    const [chatSelection, setChatSelection] = useState('chat');
    const [addFriendModal, setIsAddFriend] = useState(false);
    const [addFriendString, setAddFriendString] = useState('');
    const tempCurrUser = {
        firstName: 'Abhishek',
        lastName: 'Choudhari',
        email: 'abhishek@gmail.com',
        username: 'abhishek@gmail.com',
        userId: '1'
    }
    const router = useRouter();

    const signOutApi = async () => {
        try {
            const logOut = await fetch('http://localhost:5000/user/signout', {
                method: 'POST',
                // body: JSON.stringify(reqBody),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const logOutParsed = await logOut.json();

            if (logOutParsed?.title === 'Logged Out') {
                toast.success(`${logOutParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => router.push('/signin'), 1000);
            }
            else {
                toast.error(`${logOutParsed?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }

        } catch (err: any) {
            toast.error(`${err?.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const profileContent = (
        <div className="flex flex-col gap-[10px]">
            <p className="text-[18px] font-[600]">{`${tempCurrUser.firstName} ${tempCurrUser.lastName}`}</p>
            <p className="text-[16px] font-[600]">{`${tempCurrUser.email}`}</p>
            <button onClick={() => signOutApi()} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B]'>
                SIGN OUT
            </button>
        </div>
    );

    const notificationContent = (
        <div className="">
            <div className="flex items-center justify-between p-[10px] border-b-[2px] border-[#E5E1DA] mb-[20px]">
                <p className="text-[18px] text-[#09090B] cursor-pointer border-b-[2px] border-[#09090B]">Notifications</p>
                <p className="text-[#808080] text-[18px] cursor-pointer">Mark all as read</p>
            </div>
            <ul className="flex flex-col gap-[10px]">
                {fakeRequestData.map((item, index) =>
                    <li key={index} className="flex items-center justify-between gap-[10px]">
                        <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{item.firstName[0]}{item.lastName[0]}</span>
                        <span className="text-[16px]"><span className="font-[600]">{item.firstName}</span>{` sent you a friend request.`}</span>
                        <div className="flex gap-[10px]">
                            <button type="submit" className='text-[#FEEFFF] font-[500] text-[16px] px-[10px] py-[5px] rounded-[5px] bg-[#6366F1]'>
                                Accept
                            </button>
                            <button type="submit" className='text-[#09090B] font-[500] text-[16px] px-[9px] py-[4px] rounded-[5px] outline outline-[2px] outline-[#6366F1]'>
                                Decline
                            </button>
                        </div>
                    </li>)}
            </ul>
        </div>
    );

    const handleAddFriendSearch = () => {
        console.log('Add Friend String--------->', addFriendString);
        //Handle Add Friend Logic Here
    }

    const cookieCheckerApi = async () => {
        const cookieCheck = await fetch('http://localhost:5000', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include',
        });

        const cookieCheckParse = cookieCheck.json();
        console.log('cookieCheckParse----->', cookieCheckParse);
    }

    useLayoutEffect(() => {
        cookieCheckerApi();
    }, []);

    return (
        <div className='container-user-layout flex flex-col min-h-[100vh] border-solid bg-[white]'>
            <header className='flex items-center justify-between px-[20px] py-[10px] outline outline-[#E5E1DA] outline-[1px]'>
                <div className='site-logo'>
                    <Link href='/' className="text-[28px] text-[#6366F1] font-[600] tracking-tighter whitespace-nowrap">Exclusive <span className='text-[#09090B]'>Messenger</span></Link>
                </div>

                <div className='site-search flex items-center justify-center gap-[10px]'>
                    <Input className='border-[2px] py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px]' type='text' placeholder="Search Something..." />
                    <span className="ml-[-50px] z-[10]">
                        {searchSvg}
                    </span>
                </div>

                <div className='site-user-info flex items-center justify-center gap-[10px]'>
                    <Popover content={notificationContent} title="" trigger="click" className="cursor-pointer">
                        {notificationSvg}
                    </Popover>

                    <Popover content={profileContent} title="" trigger="click">
                        <span className='min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer'>A</span>
                    </Popover>
                </div>
            </header>

            <div className='container-childred flex justify-between grow-[1]'>
                <div className='container-sidebar basis-[15%] outline outline-[#E5E1DA] outline-[1px] p-[10px]'>

                    <div className='chat-type-toggle flex items-center gap-[5px] justify-center mb-[10px]'>
                        <div className='custom-toggle px-[2px] py-[4px] bg-[#f0f0f1] rounded-[5px] flex items-center gap-[5px]'>
                            <span className={`${chatSelection === 'chat' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chat')}>Chats</span>
                            <span className={`${chatSelection === 'chatai' ? 'bg-[#fff] rounded-[5px] text-[#090D22] shadow-lg' : 'text-[#75737E]'} text-[14px] font-[600] px-[10px] py-[5px] cursor-pointer`} onClick={() => setChatSelection('chatai')}>AI Chats</span>
                        </div>
                    </div>

                    <div className="friend-add">
                        <ul className='flex justify-between gap-[5px]'>
                            {fakeRequestData.map((item, index) => <li className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`} key={index}>{item.firstName[0]}</li>)}

                            <li onClick={() => setIsAddFriend(true)} className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer outline outline-[#6366F1] outline-[1px]`}>{addSvg}</li>
                        </ul>
                    </div>

                    <div className="friend-list py-[30px]">
                        <ul className="flex flex-col gap-[10px]">
                            {fakeRequestData.map((item, index) =>
                                <Link href={`/chats/${item.userId.toLowerCase()}`} key={index}>
                                    <li key={index} className="flex items-center justify-between cursor-pointer border-b-[1px] border-[#E5E1DA] pb-[10px]">
                                        <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{item.firstName[0]}</span>

                                        <div className='flex flex-col justify-center mr-[auto] ml-[10px]'>
                                            <p className='text-[14px] font-[600]'>{`${item.firstName} ${item.lastName}`}</p>
                                            <p className='text-[14px] font-[500]'>{`Hey, I have something to tell...!`}</p>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className="text-[12px] font-[500]">2:34 PM</span>
                                            <span className="text-[12px] font-[500] flex items-center justify-center max-w-[20px] min-h-[20px] rounded-[200px] bg-[#6366F1] text-[#F5F7F9] text-center">1</span>
                                        </div>
                                    </li>
                                </Link>)}
                        </ul>
                    </div>
                </div>

                <div className='container-main-section flex-1'>
                    {children}
                </div>
            </div>
            <Modal title="" open={addFriendModal} footer={null} onCancel={() => {
                setIsAddFriend(false);
                setAddFriendString('');
            }} centered>
                <div className='add-friend-modal flex flex-col gap-[10px]'>
                    <p className='text-[22px]'>Search Friend using Username or Email.</p>
                    <Input onChange={(e) => setAddFriendString(e.target.value)} value={addFriendString} onPressEnter={handleAddFriendSearch} className='border-[2px] py-[10px] px-[20px] min-w-[300px] rounded-[100px] bg-[#F5F7F9] hover:bg-[#F5F7F9] hover:border-[#6366F1] focus:border-[#6366F1] focus:bg-[#F5F7F9] text-[16px] hover:border-[2px]' type='text' placeholder="Search Friend..." />
                    <button onClick={handleAddFriendSearch} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B] mx-[auto]'>
                        SEARCH
                    </button>
                </div>
            </Modal>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                // pauseOnHover
                theme="dark"
            // transition: Bounce
            />
        </div>
    );
}