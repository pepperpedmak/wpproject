import React, { useState, useEffect } from "react";
import { fetchUserInTeam, inviteMember , kickMember, getCookie } from "../serverAction/serverAction";

interface TeamUser {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    pic_dir?: string;
  };
  role: string;
  status?: string; // User status: "active" | "pending"
  totalSend: number;
  totalApprove: number;
  totalReject: number;
  late: number;
  rank?: number | string;
}

function calculateAndSortUsers(users: TeamUser[]): TeamUser[] {
  const rankedUsers = users.map((user) => {
    const score = user.totalApprove - user.totalReject - 1.5 * user.late;
    return {
      ...user,
      rank: user.totalSend > 0 ? score / user.totalSend : "D",
    };
  });

  return rankedUsers.sort((a, b) => {
    if (a.rank === "D") return 1;
    if (b.rank === "D") return -1;
    return Number(b.rank) > Number(a.rank) ? -1 : 1;
  });
}

export default function MemberSideBar() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInviteField, setShowInviteField] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>(""); // For role check
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamUsers();
    fetchCurrentUserRole();
  }, []);

  const fetchTeamUsers = async () => {
    try {
      const result = await fetchUserInTeam();
      if (result?.team?.users) {
        setUsers(calculateAndSortUsers(result.team.users));
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load team members.");
    }
  };

  const fetchCurrentUserRole = async () => {
    try {
      const currentUser = await getCookie();
      const userId = currentUser?.userID; // Extract user ID from cookie
  
      if (userId) {
        setCurrentUserId(userId);
      }
  
      const result = await fetchUserInTeam();
      const matchedUser = result?.team?.users?.find(
        (teamUser: any) => teamUser?.user?._id === userId
      );
  
      setCurrentUserRole(matchedUser?.role || "");
    } catch (error) {
      console.error("Error fetching current user role:", error);
    }
  };
  

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await inviteMember(inviteEmail.trim());
      alert("User invited successfully!");
      fetchTeamUsers();
      setInviteEmail("");
      setShowInviteField(false);
    } catch (error: any) {
      setError(error.message || "Failed to invite user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = confirm("Are you sure you want to remove this member?");
    if (!confirmDelete) return;
  
    try {
      console.log(userId);
      const response = await kickMember(userId);
      alert("User successfully removed.");
      fetchTeamUsers(); // Refresh the team list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleAddUserClick = () => {
    setShowInviteField(!showInviteField);
    setError(null);
  };

  const filteredUsers = users.filter((user) =>
    `${user.user.firstName} ${user.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 w-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xl">Member</span>
        <button
          onClick={handleAddUserClick}
          className="hover:bg-blue-400 hover:text-white hover:rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Invite Input */}
      {showInviteField && (
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter Email to Invite"
            className="w-full px-3 py-1 border border-gray-300 rounded-lg mb-2"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            onClick={handleInvite}
            className={`p-1 text-white rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Inviting..." : "Invite Member"}
          </button>
          <button
            onClick={handleAddUserClick}
            className="p-1 ml-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
          >
            Cancel
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Member"
          className="w-full px-3 py-1 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`relative flex items-center justify-between bg-gray-100 shadow rounded-md p-2 ${
                user.status === "pending" ? "filter brightness-75" : ""
              }`}
            >
              {/* User Image and Details */}
              <div className="flex items-center">
                <img
                  src={user.user.pic_dir || "/icon/default-profile.png"}
                  alt={`${user.user.firstName} ${user.user.lastName}`}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <div className="font-medium">
                    {user.user.firstName} {user.user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
              </div>

              {/* Delete Button (Visible for Project Manager) */}
              {currentUserRole === "projectmanager" && currentUserId !== user.user._id && (
                <button
                onClick={() => handleDeleteUser(user.user._id)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                >
                    🗑️
                </button>
                )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No members found</p>
        )}
      </div>
    </div>
  );
}
