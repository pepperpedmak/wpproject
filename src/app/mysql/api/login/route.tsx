import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/mysql";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2"; // Import RowDataPacket

// Define interfaces for your database results
interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

interface Team extends RowDataPacket {
  team_id: number;
  project_id: number | null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const { email, password } = await req.json();

    // Query the database for the user
    const [users] = await pool.query<User[]>(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Incorrect email or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { status: "error", message: "Incorrect email or password" },
        { status: 401 }
      );
    }

    // Find the user's team
    const [teams] = await pool.query<Team[]>(
      `SELECT t.id AS team_id, p.id AS project_id 
       FROM Team t
       JOIN UserTeam ut ON t.id = ut.team_id
       LEFT JOIN Project p ON t.id = p.team_id
       WHERE ut.user_id = ? AND ut.status = 'join'`,
      [user.id]
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { status: "error", message: "User is not associated with any team" },
        { status: 404 }
      );
    }

    const team = teams[0];

    return NextResponse.json(
      {
        status: "success",
        user: {
          id: user.id,
          email: user.email,
        },
        team: {
          id: team.team_id,
        },
        project: team.project_id
          ? { id: team.project_id }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { status: "error", message: "Please try again later" },
      { status: 500 }
    );
  }
}
