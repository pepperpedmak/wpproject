"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from "./serverAction/serverAction";
import SideNav from './component/SideNav';
import Header from './component/Header';
import Navbar from './component/Navbar';
import ToDoList from './component/Task';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const cookie = await getCookie();
        if (!cookie) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking cookie:", error);
        router.push("/login");
      }
    };

    checkCookie();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex">
        <SideNav />
        <div className="w-screen bg-white shadow-md">
          <Navbar />
<ToDoList></ToDoList>

        </div>
      </div>
    </>
  );
}