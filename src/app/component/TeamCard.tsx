import React, { useState } from "react";
import {
  saveProjectCookie,
  editTeamName,
  deleteTeam,
  addProject,
  editProjectName,
  deleteProject,
  acceptTeamInvite,
  declineTeamInvite,
} from "../serverAction/serverAction";

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
  isPending: boolean; // Indicates if the team is pending
  refreshTeamData: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamData, isPending, refreshTeamData }) => {
  const [isTeamOpen, setIsTeamOpen] = useState(false); // Toggle team
  const [isTeamHovering, setIsTeamHovering] = useState(false);
  const [isTeamEditing, setIsTeamEditing] = useState(false);
  const [teamName, setTeamName] = useState(teamData.teamName);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const projects = teamData.projects || [];

  const toggleTeam = () => {
    if (!isPending) {
      setIsTeamOpen((prev) => !prev);
    }
  };

  // Team Handlers
  const handleEditTeam = async () => {
    try {
      await editTeamName(teamData._id, teamName);
      console.log("Team name updated successfully!");
      setIsTeamEditing(false);
      refreshTeamData();
    } catch (error) {
      console.error("Failed to edit team name:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(teamData._id);
      console.log("Team deleted successfully!");
      refreshTeamData();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  // Project Handlers
  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await addProject(teamData._id, newProjectName);
      setNewProjectName("");
      refreshTeamData();
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const handleEditProject = async (projectId: string) => {
    if (!projectName.trim()) return;

    try {
      await editProjectName(projectId, projectName);
      console.log("Project name updated!");
      setEditingProjectId(null);
      refreshTeamData();
    } catch (error) {
      console.error("Failed to edit project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      console.log("Project deleted successfully!");
      refreshTeamData();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptTeamInvite(teamData._id);
      refreshTeamData();
    } catch (error) {
      console.error("Failed to accept team invite:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await declineTeamInvite(teamData._id);
      refreshTeamData();
    } catch (error) {
      console.error("Failed to decline team invite:", error);
    }
  };

  return (
    <div className={`flex flex-col ${isPending ? "opacity-50" : "opacity-100"}`}>
      {/* Team Header */}
      <div
        className={`flex items-center mb-2 relative cursor-pointer ${isPending ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        onMouseEnter={() => setIsTeamHovering(true)}
        onMouseLeave={() => setIsTeamHovering(false)}
      >
        {/* Toggle Team */}
        <button
          onClick={toggleTeam}
          className={`mr-2 ml-7 ${isPending ? "filter grayscale" : ""}`}
          disabled={isPending}
        >
          {isTeamOpen ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>}
        </button>
        {/* Team Name */}
        {isTeamEditing ? (
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onBlur={handleEditTeam}
            autoFocus
            className="border-b outline-none w-28"
          />
        ) : (
          <span
            onClick={toggleTeam}
            className={`text-lg font-medium truncate ${isPending ? "pointer-events-none" : ""
              }`}
          >
            {teamName}
          </span>
        )}

        {/* Pending Team Invite Buttons */}
        {isTeamHovering && isPending && (
          <div className="flex gap-1 ">
            <button
              onClick={handleAccept}
              className="bg-green-400 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        )}
        {/* Hover Actions */}
        {isTeamHovering && !isPending && (
          <div className="absolute right-0 flex space-x-2">
            <button onClick={() => setIsTeamEditing(true)} title="Edit Team">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
            <button onClick={handleDeleteTeam} title="Delete Team">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      {isTeamOpen && !isPending && (
        <div className="ml-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                className="flex items-center relative group"
              >
                {/* Project Name */}
                {editingProjectId === project._id ? (
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onBlur={() => handleEditProject(project._id)}
                    autoFocus
                    className="border-b outline-none w-28"
                  />
                ) : (
                  <span
                    onClick={() =>
                      saveProjectCookie(teamData._id, project._id)
                    }
                    className="cursor-pointer hover:underline"
                  >
                    {project.projectName}
                  </span>
                )}

                {/* Hover Actions */}
                <div className="absolute right-0 hidden group-hover:flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProjectId(project._id);
                      setProjectName(project.projectName);
                    }}
                    title="Edit Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    title="Delete Project"
                  ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}

          {/* Add Project */}
          <div className="flex items-center mt-2 mb-2">
          <div className="flex items-center mr-1">
            <input 
              type="text"
              placeholder="Add New Project"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border p-1 rounded-lg w-32 text-sm"
            />
          </div>
          <div>
            <button
              onClick={handleAddProject}
              type="submit"
              className="bg-green-400 text-sm text-white p-1 rounded-lg w-12 hover:bg-green-600"
            >
              Add
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
