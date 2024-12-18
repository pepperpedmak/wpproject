import { pool } from "@/app/lib/mongodb"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

// Accept Invitation (PUT)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const { userID } = await req.json();

    // Update the user's status to "join" in the UserTeam table
    const [result] = await pool.query(
      `UPDATE UserTeam SET status = ? WHERE team_id = ? AND user_id = ?`,
      ["join", teamID, userID]
    );

    // result is an array where the first element is a ResultSetHeader
    const affectedRows = result[0]?.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "Team or user not found" },
        { status: 404 }
      );
    }

    // Fetch the updated team along with its users and projects
    const [updatedTeam] = await pool.query(
      `SELECT t.id AS team_id, t.teamName, u.id AS user_id, u.firstName, u.lastName, ut.status, p.id AS project_id, p.projectName
       FROM Teams t
       JOIN UserTeam ut ON t.id = ut.team_id
       JOIN Users u ON ut.user_id = u.id
       LEFT JOIN TeamProjects tp ON t.id = tp.team_id
       LEFT JOIN Projects p ON tp.project_id = p.id
       WHERE t.id = ?`,
      [teamID]
    );

    return NextResponse.json({ status: "success", team: updatedTeam });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to accept invite", error },
      { status: 500 }
    );
  }
}

// Decline Invitation (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const { userID } = await req.json();

    // Remove the user from the team by deleting the corresponding row in the UserTeam table
    const [result] = await pool.query(
      `DELETE FROM UserTeam WHERE team_id = ? AND user_id = ?`,
      [teamID, userID]
    );

    // result is an array where the first element is a ResultSetHeader
    const affectedRows = result[0]?.affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { status: "error", message: "Team or user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Declined successfully",
    });
  } catch (error) {
    console.error("Error declining invite:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to decline invite", error },
      { status: 500 }
    );
  }
}
