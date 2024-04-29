'use client';

import { searchSvg } from "@/helpers/constants";
import { Input } from "antd";
import { useState } from "react";

export default function AddFriendComp() {
    const [searchString, setSearchString] = useState('');
    return (
        <div className='comp-add-friend p-[50px] flex flex-col items-center gap-[10px]'>
            <h1 className='text-[38px] text-[#09090B] font-[600]'>Add a Friend</h1>
            <div className='search-box flex items-center gap-[10px]'>
                <Input className="bg-[transparent] min-w-[250px] min-h-[40px] hover:border-[#18181B] focus:border-[#18181B] text-[16px]" type="text" onChange={(e) => setSearchString(e.target.value)} value={searchString} />
                <span className="text-[#F5F5F5] font-[600] px-[16px] py-[8px] rounded-[5px] bg-[#18181B] cursor-pointer">{searchSvg}</span>
            </div>
        </div>
    );
}