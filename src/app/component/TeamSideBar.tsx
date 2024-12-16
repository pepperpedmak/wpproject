import React from 'react';
import {addTeam,addProject} from "../serverAction/serverAction"

const TeamSideBar = () => {
  return (
    <div className="bg-gray-100 border-r border-gray-300 p-4 w-56">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">Work space</span>
        <button className="bg-green-500 text-white px-3 py-2 rounded text-sm">+ Add Group</button>
      </div>
      <div>
        <div className="mb-4">
          <span className="font-bold block mb-2">Team 1</span>
          <div>
            <div className="bg-white p-2 rounded shadow-sm flex justify-between items-center mb-2">
              <span>Project 1</span>
              <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">Save</button>
            </div>
            <div className="bg-white p-2 rounded shadow-sm mb-2">
              <span>Project 2</span>
            </div>
            <div className="bg-white p-2 rounded shadow-sm mb-2">
              <span>Project 3</span>
            </div>
          </div>
        </div>
        <div>
          <span className="font-bold block mb-2">Team 2</span>
        </div>
      </div>
    </div>
  );
};

export default TeamSideBar;