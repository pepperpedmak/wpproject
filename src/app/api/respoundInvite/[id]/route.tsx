import { NextResponse } from "next/server"; 
import { Team } from "@/app/models/models"; 
import { ConnectDB } from "@/app/lib/mongodb";

//accept
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = params.id; 
    const { userID } = await req.json(); 

    // Update the specific user's status in the users array
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: teamID, "users.user": userID }, // Find the team and the specific user
      { 
        $set: { "users.$.status": "join" } // Update the status of the matched user
      },
      { new: true } // Return the updated document
    )
      .populate("users.user")
      .populate("projects.project");

    if (!updatedTeam) {
      return NextResponse.json(
        { status: "error", message: "Team or user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", team: updatedTeam });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to accept invite", error },
      { status: 500 }
    );
  }
}

  
  //declien
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await ConnectDB();
    try {
      const teamID = params.id;
  
      const { userID } = await req.json();
  
      const updatedTeam = await Team.findByIdAndUpdate(
        teamID,
        {
          $pull: { users: { user: userID } }, 
        },
        { new: true } 
      );
  
      if (!updatedTeam) {
        return NextResponse.json(
          { status: "error", message: "Team not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        status: "success",
        message: "declined successfully",
        team: updatedTeam,
      });
    } catch (error) {
      console.error("Error declined invite:", error);
      return NextResponse.json(
        { status: "error", message: "Failed to declined invite", error },
        { status: 500 }
      );
    }
  }
  