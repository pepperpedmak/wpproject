import React, { useState } from 'react';
import Link from 'next/link';
import TeamSideBar from './TeamSideBar';
import MemberSideBar from './MemberSideBar';

export default function SideNav() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isTeamSideBarVisible, setIsTeamSideBarVisible] = useState(false);
  const [isMemberSideBarVisible, setIsMemberSideBarVisible] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string>(''); // Track active menu item

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleTeamSideBar = () => {
    setIsTeamSideBarVisible(!isTeamSideBarVisible);
  };
  const toggleMemberSideBar = () => {
    setIsMemberSideBarVisible(!isMemberSideBarVisible);
  };

  const activeMenu = (menu: string) => {
    setActiveMenuItem(menu); // Set the active menu item
    if (menu !== 'project') setIsTeamSideBarVisible(false);
    if (menu !== 'member') setIsMemberSideBarVisible(false);
  };

  return (

    <div className="flex">
      <aside
        className={`bg-white shadow-md p-2 space-y-6 transition-all duration-300 ${isSidebarExpanded ? 'w-44' : 'w-16'} relative`}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 ${isSidebarExpanded ? 'right-[-1rem]' : 'right-[-1rem]'} bg-blue-400 text-white font-bold font-momo p-2 rounded-full shadow-md focus:outline-none`}
        >
          {isSidebarExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>

        <nav>
          <ul className='overflow-hidden'>
            <li
              className={`flex items-center rounded-md text-black  
                ${activeMenuItem === 'user'
                  ? 'bg-blue-400 text-white'
                  : ' hover:bg-blue-400 hover:text-white'}`}
              onClick={() => activeMenu('user')}
            >
              <Link href="user">
                <div className="flex items-center p-2 m-1 ">
                  <img
                    src={'/icon/default-profile.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-contain"
                  />
                  <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-44 ml-1' : 'w-0'}`}>
                    <div className="font-medium">User</div>
                  </span>
                </div>
              </Link>
            </li>

            <li
              className={`flex items-center rounded-md text-black  
                ${activeMenuItem === 'home'
                  ? 'bg-blue-400 text-white'
                  : ' hover:bg-blue-400 hover:text-white'}`}
              onClick={() => activeMenu('home')}
            >
              <Link href="/">
                <div className="flex items-center p-2 m-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-6 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
                    />
                  </svg>
                  <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-44 ml-1' : 'w-0'}`}>
                    <div className="font-medium ">Home</div>
                  </span>
                </div>
              </Link>
            </li>

            <li
              className={`flex items-center rounded-md text-black 
                ${activeMenuItem === 'project'
                  ? 'bg-blue-400 text-white'
                  : ' hover:bg-blue-400 hover:text-white'}`}
              onClick={() => {
                activeMenu('project');
                toggleTeamSideBar();
              }}
            >
              <Link href="/">
                <div className="flex items-center p-2 m-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-6 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                  <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-44 ml-1' : 'w-0'}`}>
                    <div className="font-medium">Project</div>
                  </span>
                </div>
              </Link>
            </li>
            <li
              className={`flex items-center rounded-md text-black  
                ${activeMenuItem === 'member'
                  ? 'bg-blue-400 text-white'
                  : 'hover:bg-blue-400 hover:text-white'}`}
              onClick={() => {
                activeMenu('member');
                toggleMemberSideBar();
              }}
            >
              <Link href="/">
                <div className="flex items-center p-2 m-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="size-6 stroke-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>
                  <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-44 ml-1' : 'w-0'}`}>
                    <div className="font-medium">Member</div>
                  </span>
                </div>
              </Link>
            </li>
            <li
              className={`flex items-center rounded-md text-black  
                ${activeMenuItem === 'leaderboard'
                  ? 'bg-blue-400 text-white'
                  : 'hover:bg-blue-400 hover:text-white'}`}
              onClick={() => {
                activeMenu('leaderboard');
              }}
            >
              <Link href="/team">
                <div className="flex items-center p-2 m-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 stroke-2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                  </svg>

                  <span className={`overflow-hidden transition-all ${isSidebarExpanded ? 'w-44 ml-1' : 'w-0'}`}>
                    <div className="font-medium">LeaderBoard</div>
                  </span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      {isTeamSideBarVisible && <TeamSideBar />}
      {isMemberSideBarVisible && <MemberSideBar />}
    </div>
  );
}
