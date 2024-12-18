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
        className={`flex items-center mb-2 relative cursor-pointer ${
          isPending ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onMouseEnter={() => setIsTeamHovering(true)}
        onMouseLeave={() => setIsTeamHovering(false)}
      >
        {/* Toggle Team */}
        <button
          onClick={toggleTeam}
          className={`mr-2 ${isPending ? "filter grayscale" : ""}`}
          disabled={isPending}
        >
          {isTeamOpen ? "📂" : "📁"}
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
            className={`text-lg font-medium truncate ${
              isPending ? "pointer-events-none" : ""
            }`}
          >
            {teamName}
          </span>
        )}

        {/* Pending Team Invite Buttons */}
        {isTeamHovering && isPending && (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        )}
        {/* Hover Actions */}
        {isTeamHovering && !isPending && (
          <div className="absolute right-0 flex space-x-2">
            <button onClick={() => setIsTeamEditing(true)} title="Edit Team">
              ✏️
            </button>
            <button onClick={handleDeleteTeam} title="Delete Team">
              🗑️
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
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}

          {/* Add Project */}
          <div className="flex items-center mt-2">
            <input
              type="text"
              placeholder="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border p-1"
            />
          </div>
          <div>
            <button
              onClick={handleAddProject}
              type="submit"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Add Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
