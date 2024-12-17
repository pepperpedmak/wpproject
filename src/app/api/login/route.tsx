import { NextRequest, NextResponse } from "next/server";
import { User , Team } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await ConnectDB();

    const { email, password } = await req.json();

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

    // Find the team that includes this user
    const team = await Team.findOne({ users: { $elemMatch: { user: user._id } } });

    if (!team) {
      return NextResponse.json(
        {
          status: "error",
          message: "User is not associated with any team",
        },
        { status: 404 }
      );
    }

    const project = team.projects[0].project;

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
        project: {
          _id: project.toString() 
        }, 
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
