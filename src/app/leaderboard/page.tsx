"use client";

import { useEffect, useState } from "react";
import { fetchUserInTeam } from "../serverAction/serverAction";
import SideNav from "../component/SideNav";
import Header from "../component/Header";
import Navbar from "../component/Navbar";


interface TeamUser {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    pic_dir?: string;
  };
  role: string;
  totalSend: number;
  totalApprove: number;
  totalReject: number;
  late: number;
  rank?: number | string; // Rank field added
}

// Rank Calculation Function
function calculateAndSortUsers(users: TeamUser[]): TeamUser[] {
  const rankedUsers = users.map((user) => {
    const score =
      user.totalApprove - user.totalReject - 1.5 * user.late; // Rank logic
    return {
      ...user,
      rank: user.totalSend > 0 ? score / user.totalSend : "D", // Handle 0 send case
    };
  });

  // Sort users by rank
  return rankedUsers.sort((a, b) => {
    if (a.rank === "D") return 1; // Move "D" ranks to the bottom
    if (b.rank === "D") return -1;
    return Number(b.rank) > Number(a.rank) ? -1 : 1;
  });
}

export default function Leaderboard() {
  const [users, setUsers] = useState<TeamUser[]>([]);

  useEffect(() => {
    const fetchTeamUsers = async () => {
      try {
        const result = await fetchUserInTeam();

        if (result?.team?.users) {
          const formattedUsers = result.team.users.map((entry: any) => ({
            _id: entry._id,
            role: entry.role || "N/A",
            totalSend: entry.totalSend || 0,
            totalApprove: entry.totalApprove || 0,
            totalReject: entry.totalReject || 0,
            late: entry.late || 0,
            user: {
              firstName: entry.user?.firstName || "Unknown",
              lastName: entry.user?.lastName || "",
              pic_dir: entry.user?.pic_dir || null,
            },
          }));

          // Calculate and set ranks
          const rankedUsers = calculateAndSortUsers(formattedUsers);
          setUsers(rankedUsers);
        } else {
          console.warn("No users found in team.");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTeamUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex">
        <SideNav />
        <div className="w-screen bg-white shadow-md">
          <Navbar />
          <div className="p-5">
            <h1 className="text-2xl font-bold text-center mb-5">
              Leader Board
            </h1>
            <table className="w-full border-collapse  shadow-lg ">
              <thead>
                <tr className="bg-blue-400 text-center">
                  <th className="p-2 font-semibold rounded-tl-lg">Name</th>
                  <th className="p-2 font-semibold">Rank</th>
                  <th className="p-2 font-semibold text-left">Role</th>
                  <th className="p-2 font-semibold">Total Send</th>
                  <th className="p-2 font-semibold">Total Approve</th>
                  <th className="p-2 font-semibold">Total Reject</th>
                  <th className="p-2 font-semibold rounded-tr-lg">Late</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="border-b border-gray-300 text-center">
                      <td className="p-2 flex items-center">
                        <img
                          src={user.user.pic_dir || "/icon/default-profile.png"}
                          alt={`${user.user.firstName} ${user.user.lastName}`}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        {user.user.firstName} {user.user.lastName}
                      </td>
                      <td className="p-2">
                        {user.rank === "D" ? "D" : index + 1}
                      </td>
                      <td className="p-2 text-left">{user.role}</td>
                      <td className="p-2">{user.totalSend}</td>
                      <td className="p-2">{user.totalApprove}</td>
                      <td className="p-2">{user.totalReject}</td>
                      <td className="p-2">{user.late}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-2 border border-gray-300">
                      No users found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
    </>
  );
}
