"use client";

import React, { useState, useEffect, useRef } from "react";
import { getUser } from "../serverAction/serverAction";
import SideNav from '../component/SideNav';
import Header from '../component/Header';

// Define the shape of the user data
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  picture_dir?: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser();
        if (data) {
          setUserData(data);
          setEditedData(data);
        }
      } catch (error) {
        console.error("Error setting user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // Here you would typically send the updated data to your backend
    if (editedData) {
      // TODO: Implement file upload logic
      // if (selectedImage) {
      //   // Upload image logic
      // }
      
      setUserData(editedData);
      setIsEditing(false);
      // Add API call to update user data
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>No user data found.</p>;
  }

  return (
    <div className="bg-blue-400 h-screen flex">
      <SideNav />
      <div className="flex-1 bg-white shadow-md rounded-l-lg overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-6 font-sans">
          <div className="flex justify-end mb-4">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

          <div className="flex flex-col items-center space-y-6">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={previewImage || userData.picture_dir || '/icon/default-profile.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={triggerFileInput}
                >
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Profile Information */}
            <div className="w-full max-w-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editedData?.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editedData?.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData?.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedData?.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedData?.bio || ''}
                    onChange={handleInputChange}
                    placeholder="Write something about yourself..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}