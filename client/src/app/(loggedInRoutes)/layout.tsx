'use client';
import { useLayoutEffect, useState } from "react";
import { addSvg, notificationSvg, searchSvg } from "@/helpers/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { capitalize } from 'lodash';
import { jwtDecode } from 'jwt-decode'; // For JWT parsing
import Cookies from 'js-cookie';

import LoginHeader from "../../components/LoginHeader/LoginHeader";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {
    const bgColors = ['bg-[#153448]', 'bg-[#0C0C0C]', 'bg-[#430A5D]', 'bg-[#5F5D9C]', 'bg-[#114232]', 'bg-[#35374B]'];


    const router = useRouter();
    const [friendRequestData, setFriendRequestData] = useState<any>([]);
    const [currUserData, setCurrUserData] = useState<any>({});
    const [userFriendList, setUserFriendList] = useState(JSON.parse(localStorage.getItem('friendList') || "[]"));

    const profileContent = (
        <div className="flex flex-col gap-[10px] min-w-[200px]">
            <p className="text-[18px] font-[600]">{`${capitalize(currUserData.firstName)} ${capitalize(currUserData.lastName)}`}</p>
            <p className="text-[16px] font-[600]">{`${currUserData.username}`}</p>
            <button onClick={() => signOutApi()} type="submit" className='text-[#F5F5F5] font-[600] px-[25px] py-[10px] rounded-[5px] bg-[#18181B]'>
                SIGN OUT
            </button>
        </div>
    );


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
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 1000);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(logOutParsed?.title)) {
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
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 2000);
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

    const acceptFriendReqApi = async (username: String) => {
        try {
            const friendReqAcceptRes = await fetch('http://localhost:5000/user/requests/accept', {
                method: 'POST',
                body: JSON.stringify({ sender: username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const friendReqAcceptResJson = await friendReqAcceptRes.json();

            if (friendReqAcceptResJson?.title === 'Friend Request Accepted') {
                toast.success(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setFriendRequestData(friendReqAcceptResJson?.pendingRequestData);
                setUserFriendList(friendReqAcceptResJson?.friendList);
                localStorage.setItem('friendList', JSON.stringify(friendReqAcceptResJson?.friendList));
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(friendReqAcceptResJson?.title)) {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 2000);
            }
            else {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
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

    const rejectFriendReqApi = async (username: String) => {
        try {
            const friendReqAcceptRes = await fetch('http://localhost:5000/user/requests/reject', {
                method: 'POST',
                body: JSON.stringify({ sender: username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const friendReqAcceptResJson = await friendReqAcceptRes.json();

            if (friendReqAcceptResJson?.title === 'Friend Request Rejected') {
                toast.success(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setFriendRequestData(friendReqAcceptResJson?.pendingRequestData);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(friendReqAcceptResJson?.title)) {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 2000);
            }
            else {
                toast.error(`${friendReqAcceptResJson?.msg}`, {
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

    const handleAcceptFriendReq = (item: any) => {
        acceptFriendReqApi(item?.email);
    }

    const handleRejectFriendReq = (item: any) => {
        rejectFriendReqApi(item?.email);
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
    }

    const getNotificationDataApi = async () => {
        try {
            const notificationData = await fetch('http://localhost:5000/user/notifications', {
                method: 'GET',
                // body: JSON.stringify({ username }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            });

            const notificationDataJson = await notificationData.json();
            if (['Request User Data', 'No Friend Requests Found'].includes(notificationDataJson?.title)) {
                setFriendRequestData(notificationDataJson?.data);
            }
            else if (['Unathorized Access', 'Invalid JWT Token'].includes(notificationDataJson?.title)) {
                toast.error(`${notificationDataJson?.msg}`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                console.log('Noti Invalid---------->',);
                localStorage.removeItem('friendList');
                setTimeout(() => router.push('/signin'), 2000);
            }
            else {
                toast.error(`${notificationDataJson?.msg}`, {
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

    const getCurrentUserInfo = () => {
        const userinfo = Cookies.get('userinfo');

        if (userinfo) {
            try {
                const decoded = jwtDecode(userinfo);
                setCurrUserData(decoded);
            } catch (err) {
                console.error('Error Decoding JWT Token------->', err);
            }
        }
    }

    const getNotificationData = () => {
        getNotificationDataApi();
    }

    useLayoutEffect(() => {
        cookieCheckerApi();
        getCurrentUserInfo();
    }, []);

    console.log('RoomId------------>', userFriendList, currUserData);

    return (
        <div className='container-user-layout flex flex-col min-h-[100vh] border-solid bg-[white]'>
            <LoginHeader
                searchSvg={searchSvg}
                friendRequestData={friendRequestData}
                bgColors={bgColors}
                handleAcceptFriendReq={handleAcceptFriendReq}
                handleRejectFriendReq={handleRejectFriendReq}
                getNotificationData={getNotificationData}
                notificationSvg={notificationSvg}
                profileContent={profileContent}
                currUserData={currUserData}
            />

            <div className='container-childred flex justify-between grow-[1]'>
                <Sidebar
                    userFriendList={userFriendList}
                    bgColors={bgColors}
                    addSvg={addSvg}
                    currUserData={currUserData}
                />

                <div className='container-main-section flex-1'>
                    {children}
                </div>
            </div>
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