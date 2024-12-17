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
          <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
              Leaderboard
            </h1>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                margin: "auto",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#add8e6", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Name
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Rank
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Role
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Total Send
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Total Approve
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Total Reject
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    Late
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} style={{ textAlign: "left" }}>
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={user.user.pic_dir || "/icon/default-profile.png"}
                          alt={`${user.user.firstName} ${user.user.lastName}`}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        {user.user.firstName} {user.user.lastName}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.rank === "D" ? "D" : index + 1}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.role}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.totalSend}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.totalApprove}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.totalReject}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {user.late}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
