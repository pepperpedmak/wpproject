import mongoose from "mongoose";
import { Team } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

//fetch team
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = await params.id;

    // Fetch the team document using `_id` field
    const team = await Team.findById(teamID)
      .populate("users.user") // Populate user details in the users array
      .populate("projects.project"); // Populate project details in the projects array

    // Handle case where team is not found
    if (!team) {
      return NextResponse.json(
        { status: "error", message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      team,
    });
  } catch (error) {
    console.error("Error fetching team by teamID:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
};


//update team name
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = await params.id;
    const { teamName } = await req.json(); 
    const team = await Team.findOneAndUpdate(
      { _id: teamID }, 
      { teamName }, 
      { new: true }
    );

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json((team), { status: 200 });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json( { status: "error", message: "Failed to update team", error },
      { status: 500 });
  }
}
//createTeam
export async function POST(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const userID = params.id;

    // Validate userID
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "error", message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const { teamName } = await req.json();

    // Validate teamName
    if (!teamName || teamName.trim() === "") {
      return NextResponse.json(
        { status: "error", message: "Team name is required" },
        { status: 400 }
      );
    }

    // Create the new team
    const newTeam = new Team({
      teamName,
      users: [
        {
          user: userID,
          role: "projectmanager", // Matches enum
          status: "join",
        },
      ],
    });

    await newTeam.save();

    return NextResponse.json({
      status: "success",
      message: "Team created successfully!",
      team: newTeam,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create team", error },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = params.id;

    await Team.findByIdAndDelete(teamID);

    return NextResponse.json({
      status: "success",
      message: "Team was deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to deleting team", error },
      { status: 500 }
    );
  }
}

