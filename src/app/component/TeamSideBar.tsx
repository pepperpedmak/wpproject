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
    } catch (error) {
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
    <div className="bg-white p-4 w-64 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6  mt-1 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
        <span className="font-semibold text-xl">Work Space</span>
        </div>
        <button
          onClick={handleAddTeamClick}
          className="hover:bg-blue-400 hover:text-white hover:rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
