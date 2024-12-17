"use client";

import { useEffect, useState } from "react";
import { fetchTeamData } from "../serverAction/serverAction";
import SideNav from '../component/SideNav';
import Header from '../component/Header';
import Navbar from "../component/Navbar";

interface TeamUser {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    pic_dir?: string; // Optional profile picture
  };
  role: string;
  totalSend: number;
  totalApprove: number;
  totalReject: number;
  late: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<TeamUser[]>([]);

  useEffect(() => {
    const fetchTeamUser = async () => {
      try {
        const result = await fetchTeamData();

        if (result?.data?.team?.users) {
          // Map the users array and extract nested user data
          const formattedUsers = result.data.team.users.map((entry: any) => ({
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

          setUsers(formattedUsers);
        } else {
          console.warn("No users data found in the response.");
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTeamUser();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex">
        <SideNav />
        <div className="w-screen bg-white shadow-md">
          <Navbar />
          <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>LeaderBoard</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "auto" }}>
              <thead>
                <tr style={{ backgroundColor: "#add8e6", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rank</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Send</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Approve</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Reject</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Late</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} style={{ textAlign: "left" }}>
                      <td style={{ padding: "10px", border: "1px solid #ddd", display: "flex", alignItems: "center" }}>
                        <img
                          src={user.user.pic_dir || "/icon/default-profile.png"}
                          alt={`${user.user.firstName} ${user.user.lastName}`}
                          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                        />
                        {user.user.firstName} {user.user.lastName}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>S</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.role}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalSend}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalApprove}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalReject}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.late}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "10px" }}>
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
