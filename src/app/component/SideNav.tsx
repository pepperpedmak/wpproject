import React from 'react';

export default function SideNav() {
  return (
    <aside className="bg-white w-64 shadow-md p-6">
      <nav>
        <ul>
          <li className="mb-2">
            <a href="userinformation" className="text-blue-500 hover:text-blue-700">
              user
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Home
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Project
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Member
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}