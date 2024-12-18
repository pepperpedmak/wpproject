import { pool } from "@/app/lib/mysql"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

// Fetch Team (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;

    // Fetch the team with users and projects using SQL JOINs
    const [team] = await pool.query(
      `SELECT t.id AS team_id, t.teamName, u.id AS user_id, u.firstName, u.lastName, ut.status, 
              p.id AS project_id, p.projectName
       FROM Teams t
       JOIN UserTeam ut ON t.id = ut.team_id
       JOIN Users u ON ut.user_id = u.id
       LEFT JOIN TeamProjects tp ON t.id = tp.team_id
       LEFT JOIN Projects p ON tp.project_id = p.id
       WHERE t.id = ?`,
      [teamID]
    );

    if (!team || team.length === 0) {
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
}

// Update Team Name (PUT)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const { teamName } = await req.json();

    // Update team name in the Teams table
    const [result] = await pool.query(
      `UPDATE Teams SET teamName = ? WHERE id = ?`,
      [teamName, teamID]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "Team updated", teamName });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json({ status: "error", message: "Failed to update team", error }, { status: 500 });
  }
}

// Create Team (POST)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userID = params.id;
    const { teamName } = await req.json();

    // Validate userID (assumes user ID exists in the Users table)
    const [userResult] = await pool.query(`SELECT id FROM Users WHERE id = ?`, [userID]);
    if (userResult.length === 0) {
      return NextResponse.json({ status: "error", message: "Invalid user ID" }, { status: 400 });
    }

    // Validate teamName
    if (!teamName || teamName.trim() === "") {
      return NextResponse.json({ status: "error", message: "Team name is required" }, { status: 400 });
    }

    // Create the new team
    const [teamResult] = await pool.query(
      `INSERT INTO Teams (teamName) VALUES (?)`,
      [teamName]
    );
    const teamId = (teamResult as { insertId: number }).insertId;

    // Add the user as a project manager to the new team
    await pool.query(
      `INSERT INTO UserTeam (user_id, team_id, role, status) VALUES (?, ?, ?, ?)`,
      [userID, teamId, "projectmanager", "join"]
    );

    return NextResponse.json({
      status: "success",
      message: "Team created successfully!",
      teamId,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ status: "error", message: "Failed to create team", error }, { status: 500 });
  }
}

// Delete Team (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;

    // Delete the team from the Teams table
    const [result] = await pool.query(`DELETE FROM Teams WHERE id = ?`, [teamID]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ status: "error", message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      message: "Team deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ status: "error", message: "Failed to delete team", error }, { status: 500 });
  }
}
