import { NextResponse } from "next/server";
import { Task, Project } from '@/app/models/models';
import { ConnectDB } from "@/app/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const projectID = params.id; // params.id is the project ID directly

    try {
        // Connect to the database
        await ConnectDB();

        // Fetch tasks for the project using the projectID
        const project = await Project.findById(projectID).populate("tasks.task");

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Return the tasks in the response
        return NextResponse.json({ tasks: project.tasks }, { status: 200 });
    } catch (error) {
        // Handle errors
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}
