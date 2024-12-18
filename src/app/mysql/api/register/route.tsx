import { pool } from "@/app/lib/mysql"; // MySQL connection pool
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { firstName, lastName, phone, email, password } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !password) {
      return NextResponse.json({
        status: "error",
        message: "Missing required fields.",
      });
    }

    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert a new user
      const [userResult] = await connection.query(
        `INSERT INTO Users (firstName, lastName, phone, email, password) VALUES (?, ?, ?, ?, ?)`,
        [firstName, lastName, phone, email, password]
      );

      const userId = (userResult as { insertId: number }).insertId;

      // Insert a default project
      const [projectResult] = await connection.query(
        `INSERT INTO Projects (projectName) VALUES (?)`,
        ["Project0"]
      );

      const projectId = (projectResult as { insertId: number }).insertId;

      // Insert a default team and associate the user and project
      const [teamResult] = await connection.query(
        `INSERT INTO Teams (teamName) VALUES (?)`,
        ["Team0"]
      );

      const teamId = (teamResult as { insertId: number }).insertId;

      // Link the user to the team as a project manager
      await connection.query(
        `INSERT INTO UserTeam (user_id, team_id, role, status) VALUES (?, ?, ?, ?)`,
        [userId, teamId, "projectmanager", "join"]
      );

      // Link the project to the team
      await connection.query(
        `INSERT INTO TeamProjects (team_id, project_id) VALUES (?, ?)`,
        [teamId, projectId]
      );

      // Commit the transaction
      await connection.commit();

      // Return success response
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
      // Rollback transaction in case of an error
      await connection.rollback();
      throw transactionError;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error("Error registering:", error);

    // Handle and return readable error messages
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Failed to register.",
    });
  }
}
