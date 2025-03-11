'use client';

import { Input, Popover, Spin } from 'antd';
import { capitalize, isEmpty } from 'lodash';
import Link from 'next/link'
import React from 'react'

function HeaderComp(
    {
        searchSvg,
        friendRequestData,
        bgColors,
        handleAcceptFriendReq,
        handleRejectFriendReq,
        getNotificationData,
        notificationSvg,
        profileContent,
        currUserData,
        notiLoading
    }
        :
        {
            searchSvg: any,
            friendRequestData: any,
            bgColors: String[],
            handleAcceptFriendReq: any,
            handleRejectFriendReq: any,
            getNotificationData: any,
            notificationSvg: any,
            profileContent: any,
            currUserData: any,
            notiLoading: boolean
        }
) {

    const notificationContent = (
        <>
            <Spin tip="Fetching..." size="large" fullscreen={false} spinning={notiLoading}>
                <div className="min-w-[400px]">
                    <div className="flex items-center justify-between p-[10px] border-b-[2px] border-[#E5E1DA] mb-[20px]">
                        <p className="text-[18px] text-[#09090B] cursor-pointer border-b-[2px] border-[#09090B]">Notifications</p>
                        <p className="text-[#808080] text-[18px] cursor-pointer">Mark all as read</p>
                    </div>
                    <ul className="flex flex-col gap-[10px]">
                        {!isEmpty(friendRequestData) ? friendRequestData.map((item: any, index: any) =>
                            <li key={index} className="flex items-center justify-between gap-[10px]">
                                <span className={`min-w-[40px] min-h-[40px] rounded-[100px] flex items-center justify-center text-[#F5F7F9] ${bgColors[index % bgColors.length]} cursor-pointer`}>{item.firstName[0]?.toUpperCase()}{item.lastName[0]?.toUpperCase()}</span>
                                <span className="text-[16px]"><span className="font-[600]">{capitalize(item.firstName)} {capitalize(item.lastName)}</span>{` sent you a friend request.`}</span>
                                <div className="flex gap-[10px]">
                                    <button onClick={() => handleAcceptFriendReq(item)} type="submit" className='text-[#6366F1] text-[16px] font-[500] px-[15px] py-[5px] rounded-[5px] outline outline-[2px] outline-[#6366F1] hover:bg-[#6366F1] hover:text-[#F5F7F9] duration-300 hover:duration-300'>
                                        Accept
                                    </button>
                                    <button onClick={() => handleRejectFriendReq(item)} type="submit" className='text-[#E72929] text-[16px] font-[500] px-[15px] py-[5px] rounded-[5px] outline outline-[2px] outline-[#E72929] hover:bg-[#E72929] hover:text-[#F5F7F9] duration-300 hover:duration-300'>
                                        Decline
                                    </button>
                                </div>
                            </li>)
                            :
                            <p className="text-[#09090B] font-[500] text-[16px] text-center">No New Notifications</p>
                        }

                    </ul>
                </div>
            </Spin>
        </>
    );


    return (
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
                    <span onClick={() => getNotificationData()}>
                        {notificationSvg}
                    </span>
                </Popover>

                <Popover content={profileContent} title="" trigger="click">
                    <span className='min-w-[40px] min-h-[40px] bg-[#6366F1] rounded-[100px] flex items-center justify-center text-[#F5F7F9] cursor-pointer'>{currUserData?.first_name && capitalize(currUserData?.first_name[0])}</span>
                </Popover>
            </div>
        </header>
    )
}

export default HeaderComp