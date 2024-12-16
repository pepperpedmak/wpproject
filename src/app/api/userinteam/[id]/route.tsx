import { NextResponse } from "next/server"; 
import { Team } from "@/app/models/models"; 
import { ConnectDB } from "@/app/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const userID = params.id;

    const team = await Team.find({
      users: { $elemMatch: { user: userID } }}).populate("users.user").populate("projects.project");

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
//invite
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = params.id; 
    const { inviteMember } = await req.json(); 

    if (!inviteMember) {
      return NextResponse.json(
        { status: "error", message: "Invite member ID is required" },
        { status: 400 }
      );
    }

    const invite = await Team.findByIdAndUpdate(
      teamID, 
      {
        $push: { 
          users: { 
            user: inviteMember, 
            role: "member", 
            status: "pending",
            totalSend: 0, 
            totalApprove: 0, 
            totalReject: 0, 
            late: 0 
          } 
        }
      },
      { new: true }
    )
      .populate("users.user") 
      .populate("projects.project"); 

    if (!invite) {
      return NextResponse.json(
        { status: "error", message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", team: invite });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to invite user", error },
      { status: 500 }
    );
  }
}


//kick
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = params.id;

    const { kickMember } = await req.json();

    const updatedTeam = await Team.findByIdAndUpdate(
      teamID,
      {
        $pull: { users: { user: kickMember } }, 
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
      message: "Member removed successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error kicking member:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to remove member", error },
      { status: 500 }
    );
  }
}
