import React, { useState, useEffect } from "react";
import { fetchTeamData, addTeam } from "../serverAction/serverAction";
import TeamCard from "./TeamCard";

interface ProjectDetails {
  _id: string;
  projectName: string;
}

interface TeamData {
  _id: string;
  teamName: string;
  projects: { project: ProjectDetails | null; _id: string }[];
}

const TeamSideBar: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>("");

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const teams = await fetchTeamData();
      setTeamData(teams);
    } catch (err) {
      setError("Failed to load team data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeamClick = () => setIsAddingTeam((prev) => !prev);

  const handleSubmitTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      await addTeam(newTeamName);
      setNewTeamName("");
      setIsAddingTeam(false);
      loadTeamData(); // Refresh team data after adding
    } catch (error) {
      setError("Failed to add team");
    }
  };

  return (
    <div className="bg-white p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Work Space</span>
        <button
          onClick={handleAddTeamClick}
          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {isAddingTeam && (
        <form onSubmit={handleSubmitTeam} className="mb-4">
          <input
            type="text"
            placeholder="Enter team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Team
          </button>
          <button
            onClick={handleAddTeamClick}
            type="button"
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      )}

      {isLoading && <p>Loading teams...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && teamData.length === 0 && <p className="text-gray-500">No teams found</p>}

      {teamData.map((team) => (
        <TeamCard
          key={team._id}
          teamData={{
            _id: team._id,
            teamName: team.teamName,
            projects: team.projects
              ?.filter((p) => p.project) // Filter out null projects
              .map((p) => p.project as ProjectDetails) || [],
          }}
          refreshTeamData={loadTeamData} // Pass the refresh function
        />
      ))}
    </div>
  );
};

export default TeamSideBar;
