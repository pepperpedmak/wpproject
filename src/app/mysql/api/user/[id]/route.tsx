import { pool } from "@/app/lib/mysql"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

// Fetch user data (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userID = params.id;

    if (!userID) {
      return NextResponse.json({
        status: "error",
        message: "userID is required",
      }, { status: 400 });
    }

    // Query to fetch user details from the Users table
    const [user] = await pool.query(
      `SELECT firstName, lastName, email, phone, bio, picture_dir
       FROM Users WHERE id = ?`,
      [userID]
    );

    if (user.length > 0) {
      return NextResponse.json({
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        phone: user[0].phone,
        bio: user[0].bio,
        picture_dir: user[0].picture_dir,
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: "error",
        message: "User not found",
      }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({
      status: "error",
      message: "An error occurred while fetching user data",
    }, { status: 500 });
  }
}

// Update user data (PUT)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userID = params.id;

  try {
    const body = await req.json();
    const { firstName, lastName, phone, bio } = body;

    if (!firstName || !lastName || !phone || !bio) {
      return NextResponse.json(
        { status: "error", message: "All fields are required." },
        { status: 400 }
      );
    }

    // Query to update the user details in the Users table
    const [result] = await pool.query(
      `UPDATE Users 
       SET firstName = ?, lastName = ?, phone = ?, bio = ? 
       WHERE id = ?`,
      [firstName, lastName, phone, bio, userID]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "User not found." },
        { status: 404 }
      );
    }

    // Fetch the updated user details to return
    const [updatedUser] = await pool.query(
      `SELECT firstName, lastName, email, phone, bio, picture_dir 
       FROM Users WHERE id = ?`,
      [userID]
    );

    return NextResponse.json({
      status: "success",
      message: "User data updated!",
      data: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update user data.",
      },
      { status: 500 }
    );
  }
}
