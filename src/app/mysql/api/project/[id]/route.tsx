// import { pool } from "@/app/lib/mongodb"; // Assuming you have a MySQL connection pool set up
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const projectID = params.id;
//     const { projectName } = await req.json();

//     // Update the project in MySQL
//     const [result] = await pool.query(
//       "UPDATE Project SET projectName = ? WHERE id = ?",
//       [projectName, projectID]
//     );

//     if (result.affectedRows === 0) {
//       return NextResponse.json({ message: "Project not found" }, { status: 404 });
//     }

//     // Fetch the updated project
//     const [updatedProject] = await pool.query(
//       "SELECT * FROM Project WHERE id = ?",
//       [projectID]
//     );

//     return NextResponse.json(updatedProject[0], { status: 200 });
//   } catch (error) {
//     console.error("Error updating Project:", error);
//     return NextResponse.json(
//       { status: "error", message: "Failed to update Project", error },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const teamID = params.id;
//     const { projectName } = await req.json();

//     // Create a new project in MySQL
//     const [projectResult] = await pool.query(
//       "INSERT INTO Project (projectName) VALUES (?)",
//       [projectName]
//     );

//     const projectID = projectResult.insertId;

//     // Link the project to the team
//     await pool.query(
//       "INSERT INTO TeamProject (team_id, project_id) VALUES (?, ?)",
//       [teamID, projectID]
//     );

//     // Fetch the updated team with its projects
//     const [updatedTeam] = await pool.query(
//       `SELECT t.*, 
//               JSON_ARRAYAGG(JSON_OBJECT('project_id', p.id, 'projectName', p.projectName)) AS projects
//        FROM Team t
//        LEFT JOIN TeamProject tp ON t.id = tp.team_id
//        LEFT JOIN Project p ON tp.project_id = p.id
//        WHERE t.id = ?
//        GROUP BY t.id`,
//       [teamID]
//     );

//     if (updatedTeam.length === 0) {
//       return NextResponse.json(
//         { status: "error", message: "Team not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       status: "success",
//       message: "Project created and added to team successfully!",
//       team: updatedTeam[0],
//     });
//   } catch (error) {
//     console.error("Error creating Project:", error);
//     return NextResponse.json(
//       { status: "error", message: "Failed to create and add Project", error },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const projectID = params.id;

//     // Delete the project in MySQL
//     const [result] = await pool.query(
//       "DELETE FROM Project WHERE id = ?",
//       [projectID]
//     );

//     if (result.affectedRows === 0) {
//       return NextResponse.json({ message: "Project not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       status: "success",
//       message: "Project was deleted successfully!",
//     });
//   } catch (error) {
//     console.error("Error deleting Project:", error);
//     return NextResponse.json(
//       { status: "error", message: "Failed to delete Project", error },
//       { status: 500 }
//     );
//   }
// }
