import { NextResponse } from "next/server";
import { Project } from '@/app/models/models';
import { ConnectDB } from "@/app/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const projectID = params.id;

    try {
        // Connect to the database
        await ConnectDB();

        // Fetch the project with its tasks
        const project = await Project.findById(projectID).populate("tasks.task");

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            status: "success",
            project,
          });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}
