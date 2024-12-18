import { pool } from "@/app/lib/mysql"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

// Fetch user teams (GET)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userID = params.id;

    // Fetch teams that the user is part of (join with UserTeam and Teams)
    const [teams] = await pool.query(
      `SELECT t.team_id, t.teamName, ut.role, ut.status
       FROM Teams t
       JOIN UserTeam ut ON t.team_id = ut.team_id
       WHERE ut.user_id = ?`,
      [userID]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { status: "not_found", message: "Team not found for the given user ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", teams });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch team", error },
      { status: 500 }
    );
  }
}

// Invite a user to a team (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const { email } = await req.json(); // Receive email from the request

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const [user] = await pool.query(
      `SELECT id FROM Users WHERE email = ?`,
      [email]
    );

    if (user.length === 0) {
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    const userID = user[0].id;

    // Check if the user is already in the team
    const [existingMember] = await pool.query(
      `SELECT * FROM UserTeam WHERE user_id = ? AND team_id = ?`,
      [userID, teamID]
    );

    if (existingMember.length > 0) {
      return NextResponse.json(
        { status: "warning", message: "User is already in the team" },
        { status: 200 }
      );
    }

    // Add the user to the team
    const [result] = await pool.query(
      `INSERT INTO UserTeam (user_id, team_id, role, status)
       VALUES (?, ?, 'member', 'pending')`,
      [userID, teamID]
    );

    return NextResponse.json({
      status: "success",
      message: "User invited successfully",
      teamID,
    });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to invite user", error },
      { status: 500 }
    );
  }
}

// Kick a user from the team (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const { kickMember } = await req.json();

    if (!kickMember) {
      return NextResponse.json(
        { status: "error", message: "Member ID is required" },
        { status: 400 }
      );
    }

    // Remove the user from the team (delete the row in UserTeam)
    const [result] = await pool.query(
      `DELETE FROM UserTeam WHERE user_id = ? AND team_id = ?`,
      [kickMember, teamID]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "Member not found in the team" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Member removed successfully",
      teamID,
    });
  } catch (error) {
    console.error("Error kicking member:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to remove member", error },
      { status: 500 }
    );
  }
}
