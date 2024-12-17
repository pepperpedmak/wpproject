import React, { useState } from "react";

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
}

const TeamCard: React.FC<TeamCardProps> = ({ teamData }) => {
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  const toggleTeam = () => setIsTeamOpen(!isTeamOpen);

  const projects = teamData.projects || [];

  const OpenFolderIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 mr-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
      />
    </svg>
  );

  const ClosedFolderIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6 mr-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
      />
    </svg>
  );

  return (
    <div className="flex flex-col">
      {/* Team Button */}
      <button
        onClick={toggleTeam}
        className="font-medium text-lg flex items-center ml-5 mb-2"
      >
        {isTeamOpen ? <OpenFolderIcon /> : <ClosedFolderIcon />}
        {teamData.teamName}
      </button>

      {/* Map through projects */}
      {isTeamOpen && projects && projects.length > 0 && (
        <div className="ml-16 space-y-2">
          {projects.map((project: Project) => (
            <p key={project._id} className="text-sm text-gray-700">
              {project.projectName}
            </p>
          ))}
        </div>
      )}

      {/* Optional: Show message when no projects */}
      {isTeamOpen && (!projects || projects.length === 0) && (
        <p className="ml-16 text-sm text-gray-500">No projects found</p>
      )}
    </div>
  );
};

export default TeamCard;