import { NextRequest, NextResponse } from "next/server";
import { User, Team } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Connect to the database
    await ConnectDB();

    // Parse request body
    const { email, password } = await req.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Incorrect email or password",
        },
        { status: 401 }
      );
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          status: "error",
          message: "Incorrect email or password",
        },
        { status: 401 }
      );
    }

    // Find the team the user belongs to
    const team = await Team.findOne({
      users: { $elemMatch: { user: user._id } },
    });

    if (!team) {
      return NextResponse.json(
        {
          status: "error",
          message: "User is not associated with any team",
        },
        { status: 404 }
      );
    }

    // Safely retrieve the first project if available
    const project = team.projects && team.projects.length > 0 ? team.projects[0].project : null;

    return NextResponse.json(
      {
        status: "success",
        user: {
          email: user.email,
          _id: user._id.toString(),
        },
        team: {
          _id: team._id.toString(),
        },
        project: project
          ? {
              _id: project.toString(),
            }
          : null, // Handle cases where no project is assigned
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Please try again later",
      },
      { status: 500 }
    );
  }
}
