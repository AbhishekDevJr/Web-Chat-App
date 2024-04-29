'use client';

import { searchSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useState } from "react";
import { fakeRequestData } from "@/helpers/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddFriendComp() {
    const [searchString, setSearchString] = useState('');
    const [userFound, setUserFound] = useState<any>(undefined);

    const handleSearch = () => {
        const user = fakeRequestData.find((item) => item.username.includes(searchString));
        setUserFound(user);
        console.log('user------>', user);

        if (user) {
            toast.success('User Found.', {
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
        else {
            toast.error('User Not Found.', {
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
                <Input className="bg-[transparent] min-w-[250px] min-h-[40px] hover:border-[#18181B] focus:border-[#18181B] text-[16px]" type="text" onChange={(e) => setSearchString(e.target.value)} value={searchString} />
                <span className="text-[#F5F5F5] font-[600] px-[16px] py-[8px] rounded-[5px] bg-[#18181B] cursor-pointer" onClick={() => handleSearch()}>{searchSvg}</span>
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