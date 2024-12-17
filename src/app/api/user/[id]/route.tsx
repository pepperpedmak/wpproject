import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/models";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }) {
  try {
      await ConnectDB();

      const userID = params.id;

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
    const { firstName, lastName, phone, bio } = body;

    if (!firstName || !lastName || !phone || !bio) {
      return NextResponse.json(
        { status: "error", message: "All fields are required." },
        { status: 400 }
      );
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      {
        firstName,
        lastName,
        phone,
        bio,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json(
        { status: "error", message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "User data updated!",
      data: updatedUser,
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
