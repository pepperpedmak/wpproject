import mongoose from "mongoose";
import { Team , Project } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const projectID = await params.id;
    const { projectName } = await req.json(); 
    const project = await Project.findOneAndUpdate(
      { _id: projectID }, 
      { projectName }, 
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json((project), { status: 200 });
  } catch (error) {
    console.error("Error updating Project:", error);
    return NextResponse.json( { status: "error", message: "Failed to update Project", error },
      { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await ConnectDB();
    try {
      const teamID = params.id; 
      const { projectName } = await req.json(); 
  
      const newProject = new Project({ projectName });
      await newProject.save();
  
      const updatedTeam = await Team.findByIdAndUpdate(
        teamID,
        {
          $push: { projects: { project: newProject._id } }, 
        },
        { new: true } 
      ).populate("projects.project");
  
      if (!updatedTeam) {
        return NextResponse.json(
          { status: "error", message: "Team not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        status: "success",
        message: "Project created and added to team successfully!",
        team: updatedTeam,
      });
    } catch (error) {
      console.error("Error creating Project:", error);
      return NextResponse.json(
        { status: "error", message: "Failed to create and add Project", error },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await ConnectDB();
  try {
    const projectID = params.id;

    await Project.findByIdAndDelete(projectID);

    return NextResponse.json({
      status: "success",
      message: "Project was deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting Project:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to deleting Project", error },
      { status: 500 }
    );
  }
}

