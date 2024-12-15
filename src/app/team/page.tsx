"use client";

import { useEffect, useState } from "react";
import { fetchTeam} from "../serverAction/serverAction";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTeamUser = async () => {
      try {
        const fetchedUsers = await fetchTeam();
        console.log(fetchedUsers._id);

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchTeamUser();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>LeaderBoard</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "auto" }}>
        <thead>
          <tr style={{ backgroundColor: "#add8e6", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rank</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total send</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total approve</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total reject</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Late</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user: any) => (
              <tr key={user._id} style={{ textAlign: "left" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd", display: "flex", alignItems: "center" }}>
                  <img
                    src={user.pic_dir || "public/icon/default-profile.png"} // Replace with a default image if not provided
                    alt={`${user.firstName} ${user.lastName}`}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                  />
                  {user.firstName} {user.lastName}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.role || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.rank || "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalSend || 0}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalApprove || 0}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.totalReject || 0}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.late ? "Yes" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "10px" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
