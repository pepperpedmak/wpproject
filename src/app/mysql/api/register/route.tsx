import { ConnectDB } from "@/app/lib/mongodb"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const db = await ConnectDB();

    const { firstName, lastName, phone, email, password } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !password) {
      return NextResponse.json({
        status: "error",
        message: "Missing required fields.",
      });
    }

    try {

      // Insert the new user into the "Users" table
      const sql = `INSERT INTO Users (firstName, lastName, phone, email, password) VALUES (${firstName}, ${lastName},${phone}, ${email}, ${password})`
      const [userResult] = await db.query(sql);

      const userId = (userResult as { insertId: number }).insertId;

      // Insert a default project into the "Projects" table
      const [projectResult] = await db.query(
        `INSERT INTO Projects (projectName) VALUES (?)`,
        ["Project0"]
      );

      const projectId = (projectResult as { insertId: number }).insertId;

      // Insert a default team into the "Teams" table
      const [teamResult] = await db.query(
        `INSERT INTO Teams (teamName) VALUES (?)`,
        ["Team0"]
      );

      const teamId = (teamResult as { insertId: number }).insertId;

      // Associate the user with the team as a "projectmanager"
      await db.query(
        `INSERT INTO UserTeam (user_id, team_id, role, status) VALUES (?, ?, ?, ?)`,
        [userId, teamId, "projectmanager", "join"]
      );

      // Associate the project with the team
      await db.query(
        `INSERT INTO TeamProjects (team_id, project_id) VALUES (?, ?)`,
        [teamId, projectId]
      );

      // Commit the transaction
      await db.commit();

      // Return a success response
      return NextResponse.json({
        status: "success",
        message: "User registered successfully!",
        data: {
          userId,
          teamId,
          projectId,
        },
      });
    } catch (transactionError) {
      // Rollback in case of an error
      await db.rollback();
      console.error("Transaction failed:", transactionError);
      throw transactionError;
    }
  } catch (error) {
    console.error("Error registering:", error);

    // Handle general errors
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to register.",
    });
  }
}
