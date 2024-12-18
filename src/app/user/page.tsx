"use client";

import React, { useState, useEffect, useRef } from "react";
import { getUser, updateUser } from "../serverAction/serverAction";
import SideNav from '../component/SideNav';
import Header from '../component/Header';
import Navbar from "../component/Navbar";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser();
        console.log('Fetched User Data:', data);

        if (data) {
          setUserData(data);
          setEditedData(data);
          setLoading(false);
        } else {
          setLoading(false);
          router.push('/login');
        }
      } catch (error) {
        console.error("Error setting user data:", error);
        setLoading(false);
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const data = await getUser();
      console.log('Fetched User Data:', data);

      if (data) {
        setUserData(data);
        setEditedData(data);
        setLoading(false);
      } else {
        setLoading(false);
        router.push('/login');
      }
    } catch (error) {
      console.error("Error setting user data:", error);
      setLoading(false);
      router.push('/login');
    }
  }

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

  const handleSave = async () => {
    if (!editedData) return;

    const formData = new FormData();
    formData.append("firstName", editedData.firstName);
    formData.append("lastName", editedData.lastName);
    formData.append("phone", editedData.phone);
    formData.append("bio", editedData.bio);

    try {
      const updatedUser = await updateUser(formData);
      setUserData(updatedUser);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewImage(null);
      fetchUserData();
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancel = () => {
    setEditedData(null);
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
    <>
      <Header />
      <div className="min-h-screen flex">
        <SideNav />
        <div className="w-screen bg-white shadow-md">
          <Navbar />
          <div className="flex-1 overflow-auto p-6 font-sans">
            <div className="flex justify-end mb-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-400 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-400 text-white p-2 rounded-lg hover:bg-green-600 w-16"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-400 text-white p-2 rounded-lg hover:bg-red-600 w-16"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-center mb-8">Profile</h2>

            <div className="flex flex-col space-y-6 justify-center items-center ">
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
              <div className="w-full max-w-2xl ml-28">
                <div className="grid grid-cols-2 gap-7 mb-4">
                  <div className="flex item-center">
                    <label className="block text-gray-700 mr-2 pt-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editedData?.firstName || ''}
                        onChange={handleInputChange}
                        className="w-52 h-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <p className="text-black font-semibold p-2">{userData.firstName}</p>
                    )}
                  </div>
                  <div className="flex item-center">
                    <label className="block text-gray-700 mr-2 pt-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editedData?.lastName || ''}
                        onChange={handleInputChange}
                        className="w-52 h-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : (
                      <p className="text-black font-semibold pt-2">{userData.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div className="flex item-center pt-2">
                    <label className="block text-gray-700 mr-2 ">Email</label>
                    <p className="text-black font-semibold">{userData.email}</p>
                  </div>

                  <div className="flex item-center">
                    <label className="block text-gray-700 mr-2 pt-2">Phone </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editedData?.phone || ''}
                        onChange={handleInputChange}
                        className="w-60 h-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-black font-semibold pt-2">{userData.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editedData?.bio || ''}
                      onChange={handleInputChange}
                      placeholder="Write something about yourself..."
                      className="w-full h-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-black w-5/6 h-28 border border-blue-400 rounded-md p-2 ">{userData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}