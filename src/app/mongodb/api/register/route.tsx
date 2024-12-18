import { NextResponse } from "next/server";
import { User, Team, Project } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        // Connect to the database
        await ConnectDB();

        // Parse request body
        const { firstName, lastName, phone, email, password } = await req.json();

        // Validate required fields
        if (!firstName || !lastName || !phone || !email || !password) {
            return NextResponse.json({
                status: "error",
                message: "Missing required fields.",
            });
        }

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            password,
        });

        await newUser.save();

        // Create a default project
        const newProject = new Project({
            projectName: "Project0",
        });

        await newProject.save();

        // Create a default team and assign the user as project manager
        const newTeam = new Team({
            teamName: "Team0",
            users: [
                {
                    user: newUser._id,
                    role: "projectmanager", // Moved role inside the user object
                    status: "join",         // Moved status inside the user object
                },
            ],
            projects: [
                {
                    project: newProject._id,
                },
            ],
        });

        await newTeam.save();

        // Return success response
        return NextResponse.json({
            status: "success",
            message: "User registered successfully!",
            data: {
                userId: newUser._id,
                teamId: newTeam._id,
                projectId: newProject._id,
            },
        });
    } catch (error) {
        console.error("Error registering:", error);

        // Handle and return readable error messages
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to register.",
        });
    }
}
