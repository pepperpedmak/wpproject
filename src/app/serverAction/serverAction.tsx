"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const saveCookie = async (userId: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user_id",
    value: userId,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  const userID = cookieStore.get("user_id");
  return userID?.value || false;
};

export const clearCookie = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user_id");
    console.log("User ID cookie cleared.");
  } catch (error) {
    console.error("Error clearing cookie:", error);
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

    saveCookie(responseData.user._id);

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
    password: formData.get("password")
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
}

export const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const userID = cookieStore.get("user_id")?.value;

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
      console.warn("No user token cookie found");
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
    const userID = cookieStore.get("user_id")?.value;

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

// export async function addTeam(){
//   const cookieStore = await cookies();
//   const userID = cookieStore.get("user_id")?.value;


//   try{

//   }catch(error){
//     console.error("add team error:",error);
//     throw error;
//   }
// }

// export async function addProject(){

// }