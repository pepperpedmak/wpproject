import React, { useState } from 'react';

export default function MemberSideBar() {

    return (


        <div className="bg-white p-4 w-64">
            <div className="flex justify-between items-center mb-4">

                
                <span className="font-semibold text-xl">Member</span>
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>

            </div>
            <div className="search-bar">
            <input
              type="text"
              placeholder="Search Member"
              className=" px-3 ml-2 border border-gray-300 rounded-lg"
            />
          </div>
            <div className="mt-2 shadow-xl rounded-md p-2 flex gap-20">
                <div className="flex items-center ">
                    <img
                        src={'/icon/default-profile.png'}
                        alt="Profile"
                        className="w-7 h-7 mr-1 rounded-full object-contain"
                    />

                    <div className="font-medium">Name
                        <div className="font-thinbold text-xs">Role</div>
                    </div>
                </div>
                <div className="text-sm">
                    Rank
                </div>
            </div>

        </div>
    );
};


