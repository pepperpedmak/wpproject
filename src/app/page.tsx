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
          <main className="container mx-auto p-4 grid grid-cols-4 gap-6">
            <section className="to-do bg-purple-100 p-6 rounded-md">
              <h2 className="text-lg font-bold mb-6">TO DO</h2>
              <button className="bg-purple-500 text-white p-2 rounded-md mt-4 w-full boder border-dotted border-[2px] border-green-100">
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Add New Task</span>
                </div>
              </button>
            </section>

            <section className="in-progress bg-blue-100 p-4 rounded-md">
              <h2 className="text-lg font-bold mb-6">IN PROGRESS</h2>
              <button className="bg-blue-500 text-white p-2 rounded-md mt-4 w-full boder border-dotted border-[2px] border-green-100">
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Add New Task</span>
                </div>
              </button>
            </section>

            <section className="testing bg-yellow-100 p-4 rounded-md">
              <h2 className="text-lg font-bold mb-6">TESTING</h2>
              <button className="bg-yellow-500 text-white p-2 rounded-md mt-4 w-full boder border-dotted border-[2px] border-green-100">
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Add New Task</span>
                </div>
              </button>
            </section>

            <section className="complete bg-green-100 p-6 rounded-md">


              <h2 className="text-lg font-bold mb-6">COMPLETE</h2>

              <button className="bg-green-500 text-white p-2 rounded-md mt-4 w-full boder border-dotted border-[2px] border-green-100">
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Add New Task</span>
                </div>
              </button>
            </section>
          </main>
<ToDoList></ToDoList>

        </div>
      </div>
    </>
  );
}