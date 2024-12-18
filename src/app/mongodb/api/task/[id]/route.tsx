import { NextResponse } from "next/server";
import { Task, Project } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
// GET: Fetch a specific task by its ID and populate user data
export async function GET(req: Request, { params }: { params: { id: string } }) {
    await ConnectDB();

    try {
        const taskID = params.id;

        // Fetch the task by ID and populate the 'users.user' field to get user details
        const task = await Task.findById(taskID)
            .populate({
                path: "users.user", // Populate the 'user' field inside 'users'
                select: "firstName lastName email phone bio pic_dir", // Select the user fields to return
            });

        if (!task) {
            console.log("Task not found");
            return NextResponse.json(
                { status: "error", message: "Task not found" },
                { status: 404 }
            );
        }

        // Debug: log populated task
        console.log("Populated task:", task);

        // Return the task details along with populated user data
        return NextResponse.json({
            status: "success",
            message: "Task fetched successfully",
            data: task,
        });
    } catch (error) {
        console.error("Failed to fetch task", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to fetch task",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};



// PUT: Update task by its ID (You can update task details like title, status, priority, etc.)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await ConnectDB();

    try {
        const taskID = params.id;

        // Validate the request body for required fields
        const { taskTitle, endDate ,status, priority, description } = await req.json();

        if (!taskTitle || !status || !priority) {
            return NextResponse.json(
                { status: "error", message: "Missing required fields (taskTitle, status, priority)" },
                { status: 400 }
            );
        }

        // Find the task by ID
        const task = await Task.findById(taskID);

        if (!task) {
            return NextResponse.json(
                { status: "error", message: "Task not found" },
                { status: 404 }
            );
        }

        // Update task fields with the new values
        task.taskTitle = taskTitle || task.taskTitle;
        task.endDate = endDate || task.endDate;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.description = description || task.description;

        // Save the updated task
        await task.save();

        return NextResponse.json({
            status: "success",
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        console.error("Failed to update task", error);
        return NextResponse.json(
            { status: "error", message: "Failed to update task", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
};

// DELETE: Delete a specific task by its ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();

  try {
    const taskID = params.id;

    // Step 1: Find the task to ensure it exists
    const task = await Task.findById(taskID);

    if (!task) {
      console.log("Task not found");
      return NextResponse.json(
        { status: "error", message: "Task not found" },
        { status: 404 }
      );
    }

    // Step 2: Remove the task from the Project's tasks array
    const project = await Project.findOneAndUpdate(
      { "tasks.task": taskID }, // Find project that contains this task
      { $pull: { tasks: { task: taskID } } }, // Remove task from project tasks array
      { new: true } // Return the updated project
    );

    if (!project) {
      console.log("Project not found or task not associated with any project");
      return NextResponse.json(
        { status: "error", message: "Project not found or task not associated with any project" },
        { status: 404 }
      );
    }

    // Step 3: Delete the task from the Task collection
    await Task.deleteOne({ _id: taskID });

    return NextResponse.json(
      { status: "success", message: "Task deleted successfully from project and collection" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to delete task", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete task", error },
      { status: 500 }
    );
  }
}

