import { NextResponse } from "next/server";
import { Team, User } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const userID = params.id;

    const team = await Team.find({
      users: { $elemMatch: { user: userID } }
    }).populate("users.user").populate("projects.project");

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
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const teamID = params.id;
    const { email } = await req.json(); // Receive email from the request

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already in the team
    const team = await Team.findById(teamID).populate("users.user");
    const isUserInTeam = team?.users.some(
      (teamUser: any) => teamUser.user._id.toString() === user._id.toString()
    );

    if (isUserInTeam) {
      return NextResponse.json(
        { status: "warning", message: "User is already in the team" },
        { status: 200 }
      );
    }

    // Add the user to the team
    const invite = await Team.findByIdAndUpdate(
      teamID,
      {
        $push: {
          users: {
            user: user._id, // Reference the user ID
            role: "member",
            status: "pending",
            totalSend: 0,
            totalApprove: 0,
            totalReject: 0,
            late: 0,
          },
        },
      },
      { new: true }
    ).populate("users.user");

    if (!invite) {
      return NextResponse.json(
        { status: "error", message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "User invited successfully",
      team: invite,
    });
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

    if (!kickMember) {
      return NextResponse.json(
        { status: "error", message: "Member ID is required" },
        { status: 400 }
      );
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamID,
      { $pull: { users: { user: kickMember } } }, // Removes user object matching ID
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