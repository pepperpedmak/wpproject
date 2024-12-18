import { NextResponse } from "next/server";
import { Task, Team, Project } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
  await ConnectDB();

  try {
    const { taskTitle, startDate, endDate, status, priority, description, userID, projectID } = await req.json();

    // Validate required fields
    if (!taskTitle || !startDate || !endDate || !priority || !projectID) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Find the project
    const project = await Project.findById(projectID);
    if (!project) {
      return NextResponse.json(
        { status: "error", message: "Project not found." },
        { status: 404 }
      );
    }

    // Create the new task
    const newTask = await Task.create({
      taskTitle,
      startDate,
      endDate,
      status: status || "todo",
      priority,
      describtion: description,
      users: ({
        user: userID,
      }),
    });

    // Add the task to the project
    project.tasks.push({ task: newTask._id });
    await project.save();

    return NextResponse.json(
      {
        status: "success",
        message: "Task created and added to project successfully.",
        data: newTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create task.", error },
      { status: 500 }
    );
  }
}
