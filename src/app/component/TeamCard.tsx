import React, { useState } from "react";
import { saveProjectCookie, editTeamName, deleteTeam } from "../serverAction/serverAction";

interface Project {
  _id: string;
  projectName: string;
}

interface TeamData {
  _id: string;
  teamName: string;
  projects?: Project[];
}

interface TeamCardProps {
  teamData: TeamData;
  refreshTeamData: () => void; // Function to refresh team data
}

const TeamCard: React.FC<TeamCardProps> = ({ teamData, refreshTeamData }) => {
  const [isTeamOpen, setIsTeamOpen] = useState(false); // Toggle to show projects
  const [isHovering, setIsHovering] = useState(false); // Hover state
  const [isEditing, setIsEditing] = useState(false); // Edit mode for team name
  const [teamName, setTeamName] = useState(teamData.teamName);

  const toggleTeam = () => setIsTeamOpen((prev) => !prev);
  const projects = teamData.projects || [];

  const handleProjectClick = async (projectID: string) => {
    try {
      await saveProjectCookie(teamData._id, projectID);
      console.log("Project selected and cookie updated!");
    } catch (error) {
      console.error("Failed to update cookie:", error);
    }
  };

  const handleEditTeam = async () => {
    try {
      await editTeamName(teamData._id, teamName);
      console.log("Team name updated successfully!");
      setIsEditing(false);
      refreshTeamData(); // Refresh the parent data
    } catch (error) {
      console.error("Failed to edit team name:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(teamData._id);
      console.log("Team deleted successfully!");
      refreshTeamData(); // Refresh the parent data
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  return (
    <div className="flex flex-col ">
      {/* Team Name and Actions */}
      <div
        className="flex items-center ml-5 mb-2 relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Folder Icon */}
        <button onClick={toggleTeam} className="mr-2">
          {isTeamOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
          )}
        </button>

        {/* Team Name */}
        {isEditing ? (
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onBlur={handleEditTeam}
            autoFocus
            className="text-lg font-medium border-b border-blue-500 outline-none w-44"
          />
        ) : (
          <span
            onClick={toggleTeam} // Toggle projects on name click
            className="text-lg font-medium"
          >
            {teamName}
          </span>
        )}

        {/* Buttons shown on hover */}
        {isHovering && (
          <div className="absolute right-0 flex space-x-2">
            {/* Edit Button */}
            <button onClick={() => setIsEditing(true)} title="Edit Team">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            </button>

            {/* Delete Button */}
            <button onClick={handleDeleteTeam} title="Delete Team">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            </button>
          </div>
        )}
      </div>

      {/* Projects List */}
      {isTeamOpen && (
        <div className="ml-8 space-y-2">
          {projects.length > 0 ? (
            projects.map((project) => (
              <p
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
                className="text-sm text-blue-500 cursor-pointer hover:underline"
              >
                {project.projectName}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No projects found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamCard;
