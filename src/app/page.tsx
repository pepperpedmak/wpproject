"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from "./serverAction/serverAction";
import SideNav from './component/SideNav';
import Header from './component/Header';
import Navbar from './component/Navbar';

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
  <Header/>
    <div className="bg-blue-400 h-screen flex">
      <SideNav />
      <div className="flex-1 bg-white shadow-md rounded-l-lg overflow-hidden">
        
        <Navbar />
        <main className="container mx-auto py-8 grid grid-cols-4 gap-8">
          <section className="to-do bg-purple-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">TO DO</h2>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md">
              Add New Task
            </button>
          </section>

          <section className="in-progress bg-blue-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">IN PROGRESS</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add New Task
            </button>
          </section>

          <section className="testing bg-yellow-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">TESTING</h2>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
              Add New Task
            </button>
          </section>

          <section className="complete bg-green-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">COMPLETE</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Add New Task
            </button>
          </section>
        </main>
      </div>
    </div>
    </>
  );
}