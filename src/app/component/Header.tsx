import React from 'react';

export default function Header(){
    return(
        <header className="bg-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search Task"
                className="px-4 py-2 border border-gray-300 rounded-md"
              />
            </div> 
             <nav>
              <button className="px-4 py-2 mr-4 font-medium">Calendar</button>
              <button className="px-4 py-2 font-medium">Board</button>
            </nav>
          </div>
        </header>
    );
}