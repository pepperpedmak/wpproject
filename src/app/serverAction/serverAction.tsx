"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const saveUserCookie = async (userID: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "userID",
    value: userID,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const saveProjectCookie = async (teamID: string, projectID: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "teamID",
    value: teamID,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  cookieStore.set({
    name: "projectID",
    value: projectID,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;
  const teamID = cookieStore.get("teamID")?.value;
  const projectID = cookieStore.get("projectID")?.value;

  return {
    userID: userID || null,
    teamID: teamID || null,
    projectID: projectID || null,
  };
};

export const clearCookie = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("userID");
    cookieStore.delete("teamID");
    cookieStore.delete("projectID");
    console.log("All cookies cleared.");
  } catch (error) {
    console.error("Error clearing cookies:", error);
  }
};

export const login = async (formData: FormData): Promise<void> => {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Login failed: ${response.statusText}`);
    }

    await saveUserCookie(responseData.user._id);
    await saveProjectCookie(responseData.team._id, responseData.project?._id);

    redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (formData: FormData) => {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const userID = cookieStore.get("userID")?.value;

    if (userID) {
      const response = await fetch(`${process.env.BASE_URL}/api/user/${userID}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch user data:", response.statusText);
        return null;
      }
    } else {
      console.warn("No user cookie found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const updateUser = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const userID = cookieStore.get("userID")?.value;

    if (!userID) {
      throw new Error("User ID not found in cookies");
    }

    const response = await fetch(`${process.env.BASE_URL}/api/user/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Update user data failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update user data error:", error);
    throw error;
  }
};

export async function fetchTeamData() {
  try {
    const cookieStore = await cookies();
    const userID = cookieStore.get("userID")?.value;

    if (!userID) {
      throw new Error("Missing required cookies: userID");
    }

    const response = await fetch(`${process.env.BASE_URL}/api/userinteam/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "success" && Array.isArray(data.team)) {
      return data.team;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error fetching team data:", error);
    return [];
  }
}

export async function addTeam(teamName: string) {
  try {
    const cookieStore = await cookies();
    const userID = cookieStore.get("userID")?.value;
    const response = await fetch(`${process.env.BASE_URL}/api/team/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add team: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding team:", error);
    throw error;
  }
}

export async function editTeamName(teamID: string, teamName: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/team/${teamID}`, {
      method: "PUT", // Use PUT for updates
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to edit team name: ${response.statusText}`);
    }

    console.log("Team name updated successfully!");
  } catch (error) {
    console.error("Error editing team name:", error);
    throw error; // Rethrow for handling in calling code if needed
  }
}

export async function deleteTeam(teamID: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/team/${teamID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete team: ${response.statusText}`);
    }

    console.log("Team deleted successfully!");
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error; // Rethrow for handling in calling code if needed
  }
}