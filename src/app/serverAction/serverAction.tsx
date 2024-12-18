"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    redirect("/");
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
    firstName: formData.get("firstName")?.toString().trim(),
    lastName: formData.get("lastName")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString().trim(),
  };

  // Validate all required fields
  if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.password) {
    throw new Error("All fields (First Name, Last Name, Phone, Email, Password) are required.");
  }

  // Ensure BASE_URL is defined
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error("Server configuration error: BASE_URL is not defined.");
  }

  try {
    // Make API call to register endpoint
    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Extract error message from server response
      const errorData = await response.json();
      throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
    }

    // Return the successful response as JSON
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("An unexpected error occurred during registration.");
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

    // Handle image upload
    const file = formData.get('picture') as File | null;
    let pictureDir = null;

    if (file && file instanceof File && file.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile');
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const uniqueFilename = `${uuidv4()}-${file.name}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      // Set picture directory path relative to public folder
      pictureDir = `/uploads/profile/${uniqueFilename}`;
    }

    // Prepare update data with optional fields
    const updateData: any = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      ...(formData.get('bio') && { bio: formData.get('bio') }),
      ...(pictureDir && { picture_dir: pictureDir }),
    };

    console.log("Sending update data:", updateData); // Add logging

    const response = await fetch(`${process.env.BASE_URL}/api/user/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    // Log the full response for debugging
    const responseData = await response.json();
    console.log("Server response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `Update user data failed: ${response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error("Full update user data error:", error);
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
    throw error;
  }
}

export async function addProject(teamID: string, projectName: string) {
  try {
    if (!teamID) throw new Error("Team ID is required to add a project.");

    const response = await fetch(`${process.env.BASE_URL}/api/project/${teamID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add project: ${response.statusText}`);
    }

    return await response.json(); // Return the new project
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

// Function to edit a project's name
export async function editProjectName(projectID: string, projectName: string) {
  try {
    if (!projectID) throw new Error("Project ID is required to edit a project.");

    const response = await fetch(`${process.env.BASE_URL}/api/project/${projectID}`, {
      method: "PUT", // Use PUT for updates
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to edit project name: ${response.statusText}`);
    }

    console.log("Project name updated successfully!");
  } catch (error) {
    console.error("Error editing project name:", error);
    throw error;
  }
}

// Function to delete a project under a team
export async function deleteProject(projectID: string) {
  try {
    if (!projectID) throw new Error("Project ID is required to delete a project.");

    const response = await fetch(`${process.env.BASE_URL}/api/project/${projectID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project: ${response.statusText}`);
    }

    console.log("Project deleted successfully!");
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function fetchUserInTeam() {
  try {
    const cookieStore = await cookies();
    const teamID = cookieStore.get("teamID")?.value;

    if (!teamID) {
      throw new Error("Missing required cookies: teamID");
    }

    const response = await fetch(`${process.env.BASE_URL}/api/team/${teamID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Detailed Error fetching team data:", error);
    return null;
  }
}

export async function inviteMember(email: string) {
  const cookieStore = await cookies();
  const teamID = cookieStore.get("teamID")?.value;

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/userinteam/${teamID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send email instead of userID
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to invite member");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error inviting member:", error);
    throw error;
  }
}

export async function kickMember(userID: string) {
  const cookieStore = await cookies();
  const teamID = cookieStore.get("teamID")?.value;

  if (!teamID) throw new Error("Team ID is missing from cookies.");

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/userinteam/${teamID}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kickMember: userID }), // Correct payload
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove member");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing member:", error);
    throw error;
  }
}

// Accept Team Invite
export async function acceptTeamInvite(teamID: string) {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/respoundInvite/${teamID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to accept team invite.");
    }

    const data = await response.json();
    console.log("Team invite accepted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error accepting team invite:", error);
    throw error;
  }
}

// Decline Team Invite
export async function declineTeamInvite(teamID: string) {
  const cookieStore = await cookies();
  const userID = cookieStore.get("userID")?.value;

  try {
    const response = await fetch(`${process.env.BASE_URL}/api/respoundInvite/${teamID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to decline team invite.");
    }

    const data = await response.json();
    console.log("Team invite declined successfully:", data);
    return data;
  } catch (error) {
    console.error("Error declining team invite:", error);
    throw error;
  }
}
export async function addTask(newTask : FormData){
  const cookieStore = await cookies();
  const projectID = cookieStore.get("projectID")?.value;
  const userID = cookieStore.get("userID")?.value;
  const teamID = cookieStore.get("teamID")?.value;

  const newTaskdata = {
    newTask,
    userID,
    teamID
  }
  const response = await fetch(`${process.env.BASE_URL}/api/task`, { 
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTaskdata), });
  const data = await response.json();
  return data.tasks; // Assuming the tasks data is in `tasks` field in the response
}


export async function getTask() {
  const cookieStore = await cookies();
  const projectID = cookieStore.get("projectID")?.value;

  const response = await fetch(`${process.env.BASE_URL}/api/taskofteam/${projectID}`, { method: 'GET' });
  const data = await response.json();
  return data.tasks; // Assuming the tasks data is in `tasks` field in the response
}

export async function getTaskDetail(taskID : String) {

  const response = await fetch(`${process.env.BASE_URL}/api/task/${taskID}`, { method: 'GET' });
  const data = await response.json();
  return data.tasks; // Assuming the tasks data is in `tasks` field in the response
}
export async function editTask(taskID: string, updatedTask: { title: string, description: string }) {
  // Send a PUT request with updated task data
  const response = await fetch(`${process.env.BASE_URL}/api/task/${taskID}`, { 
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask), // Pass the updated task object in the body
  });

  // Check if the response was successful
  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const data = await response.json();

  // Assuming the updated task data is in the `task` field in the response
  return data.task; // Return the updated task
}

export async function deleteTask(taskID : String) {

  const response = await fetch(`${process.env.BASE_URL}/api/task/${taskID}`, { method: 'DELETE' });
  const data = await response.json();
  return data.tasks; // Assuming the tasks data is in `tasks` field in the response
}
