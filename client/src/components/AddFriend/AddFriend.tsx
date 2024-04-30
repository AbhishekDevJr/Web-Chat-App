'use client';

import { searchSvg, sendSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useState } from "react";
import { fakeRequestData } from "@/helpers/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "../Spinner/Spinner";

export default function AddFriendComp() {
    const [searchString, setSearchString] = useState('');
    const [userFound, setUserFound] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        setUserFound([]);

        //Mimicing API Call
        if (searchString) {
            setLoading(true);
            setTimeout(() => {
                const userList = fakeRequestData.filter((item) => item.username.toLowerCase().includes(searchString.toLowerCase()));
                console.log('UserList------->', userList);
                setUserFound(userList);
                setLoading(false);
            }, 3000);
        }
        else {
            toast.error('Please enter a Username to Search.', {
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

    return (
        <div className='comp-add-friend p-[50px] flex flex-col items-center gap-[10px]'>
            <h1 className='text-[38px] text-[#09090B] font-[600]'>Add a Friend</h1>
            <div className='search-box flex items-center gap-[10px]'>
                <Input className="bg-[transparent] min-w-[250px] min-h-[40px] hover:border-[#18181B] focus:border-[#18181B] text-[16px]" type="text" onChange={(e) => setSearchString(e.target.value)} value={searchString} onPressEnter={() => handleSearch()} />
                <span className="text-[#F5F5F5] font-[600] px-[16px] py-[8px] rounded-[5px] bg-[#18181B] cursor-pointer" onClick={() => handleSearch()}>{searchSvg}</span>
            </div>
            <p>Search By Username</p>

            {loading ?
                <Spinner />
                :
                <div className='search-result'>
                    {userFound.length ?
                        <div className='outline outline-[#E4E4E7] outline-[2px] rounded-xl shadow-lg p-[40px] flex flex-col gap-[20px]'>
                            <p>Found <span className="font-[600]">{userFound.length} People</span></p>
                            {userFound.map((item: any, index: any) =>
                                <>
                                    <div key={index} className='flex items-center justify-between gap-[10px]'>
                                        <span className="bg-[#E4E4E7] min-h-[40px] min-w-[40px] flex items-center justify-center rounded-[100px]">{item.firstName[0]}</span>
                                        <p className={`text-[#C35BB6] font-[600]`}>{`${item.firstName} ${item.lastName}`}</p>
                                        <p className="text-[#6C6468]">{`${item.email}`}</p>
                                        <div className='user-found-actions'>
                                            <button className='text-[#F5F5F5] font-[600] px-[15px] py-[10px] rounded-[5px] bg-[#18181B] flex justify-center items-center gap-[10px]'>Add Friend {sendSvg}</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        :
                        <p>No User Found!</p>}
                </div>}

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