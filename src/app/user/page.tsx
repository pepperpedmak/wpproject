"use client";

import React from 'react';
import SideNav from '../component/SideNav';
import Header from '../component/Header';

export default function Home(){      
        return (
            <div className="max-w-4xl mx-auto p-6 font-sans">
            <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
            
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src="/profile-picture-placeholder.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
      
              {/* Profile Information */}
              <div className="w-full max-w-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-semibold text-gray-700">Name</label>
                    <p className="text-gray-900">Charnatip</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Surname</label>
                    <p className="text-gray-900">Keawchaoon</p>
                  </div>
                </div>
      
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900">Myemail@gmail.com</p>
                </div>
      
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700">Phone Number</label>
                  <p className="text-gray-900">0647905019</p>
                </div>
      
                <div>
                  <label className="block font-semibold text-gray-700">Bio</label>
                  <textarea
                    placeholder="Write something about yourself..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
    );
}