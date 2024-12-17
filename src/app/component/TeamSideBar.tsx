import React, { useState, useEffect } from "react";
import { fetchTeamData } from "../serverAction/serverAction";
import TeamCard from "./TeamCard";

interface ProjectDetails {
  _id: string;
  projectName: string;
}

interface NestedProject {
  project: ProjectDetails | null;
  _id: string;
}

interface TeamData {
  _id: string;
  teamName: string;
  projects: NestedProject[];
}


const TeamSideBar: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchTeamData();

        console.log("Raw Result:", result);

        // Extract team from result.data.team
        if (result?.data?.team && typeof result.data.team === 'object') {
          const team: TeamData = {
            _id: result.data.team._id,
            teamName: result.data.team.teamName,
            projects: result.data.team.projects || []
          };

          setTeamData([team]);
          setError(null);
        } else {
          console.error("Invalid data format:", result);
          setTeamData([]);
          setError("Unable to load team data");
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
        setTeamData([]);
        setError("Failed to fetch team data");
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, []);

  return (
    <div className="bg-white p-4 w-64">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Work Space</span>
      </div>

      {/* Loading and Error States */}
      {isLoading && <p>Loading teams...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Map teamData to TeamCard */}
      {!isLoading && teamData.length === 0 && (
        <p className="text-gray-500">No teams found</p>
      )}

      {teamData.map((team) => (
        <TeamCard
          key={team._id}
          teamData={{
            ...team,
            projects: team.projects
              ?.filter((p) => p.project) // Filter out null projects
              .map((p) => p.project as ProjectDetails) || [] // Extract `project` and cast
          }}
        />
      ))}

    </div>
  );
};

export default TeamSideBar;