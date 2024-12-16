import { NextResponse } from "next/server"; 
import { Team } from "@/app/models/models"; 
import { ConnectDB } from "@/app/lib/mongodb";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const userID = params.id; 
    const { teamName } = await req.json(); 

    const newTeam = new Team({
      teamName,
      users: [
        {
          user: userID,
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


export async function GET(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const userID = params.id;

    const team = await Team.find({
      users: { $elemMatch: { user: userID } }})

    if (!team) {
      return NextResponse.json(
        { status: "not_found", message: "Team not found for the given user ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", team });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
}
