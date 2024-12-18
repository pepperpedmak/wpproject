import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/models";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    
    // Ensure that `params.id` is awaited before using it
    const { id: userID } = params; // Destructure to extract the userID

    if (!userID) {
      return NextResponse.json({
        status: "error",
        message: "userID is required",
      }, { status: 400 });
    }
    
    const user = await User.findOne({ _id: userID });

    if (user) {
      return NextResponse.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        picture_dir: user.picture_dir,
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


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userID = params.id;

  try {
    await ConnectDB();
    const body = await req.json();

    console.log("Received body:", body); // Log the received body to check if `picture_dir` is passed

    const { firstName, lastName, phone, bio, picture_dir } = body;

    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { status: "error", message: "Required fields are missing." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      { 
        $set: { 
          firstName, 
          lastName, 
          phone, 
          bio, 
          picture_dir // Ensure `picture_dir` is part of the update query
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { status: "error", message: "User not found." },
        { status: 404 }
      );
    }

    console.log("Updated User:", updatedUser); // Log the updated user data for debugging

    return NextResponse.json({
      status: "success",
      message: "User data updated!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Full error details:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error
          ? error.message
          : "Failed to update user data.",
        errorDetails: error // Send full error details for debugging
      },
      { status: 500 }
    );
  }
}
