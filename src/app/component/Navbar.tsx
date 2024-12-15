import React from 'react';

export default function Navbar() {
  return (
    <nav>
      <div className="bg-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Task"
              className="px-3 py-1 ml-2 border border-gray-300 rounded-lg"
            />
          </div>
          <nav>
            <button className="px-2 py-2 mr-1 font-medium">Calendar</button>
            <button className="px-2 py-2 mr-1 font-medium">Board</button>
          </nav>
        </div>
      </div>
    </nav>
  );
}