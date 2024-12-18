import { NextResponse } from "next/server";
import { Project } from '@/app/models/models';
import { ConnectDB } from "@/app/lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const projectID = params.id;
  
    try {
      await ConnectDB();
  
      // Find the project and populate tasks and their associated users
      const project = await Project.findById(projectID).populate({
        path: "tasks.task",
        populate: {
          path: "users.user",
          select: "firstName lastName email", // Only fetch specific user fields
        },
      });
  
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
  
      // Map the tasks to the required structure
      const tasks = project.tasks.map((taskObj : any) => {
        const task = taskObj.task;
        return {
          id: task._id,
          title: task.taskTitle,
          description: task.description || "No description provided",
          startDate: task.startDate,
          endDate: task.endDate,
          priority: task.priority,
          status: task.status,
          users: task.users.map((userObj : any) => ({
            userId: userObj.user._id,
            name: `${userObj.user.firstName} ${userObj.user.lastName}`,
            email: userObj.user.email,
            isAccept: userObj.isAccept,
          })),
        };
      });
  
      return NextResponse.json({ status: "success", tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
  }
  