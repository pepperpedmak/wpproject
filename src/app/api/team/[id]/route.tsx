import mongoose from "mongoose";
import { Team } from "@/app/models/models";

//fetch team
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const teamID = params.id;
    const team = await Team.findOne({_id : teamID})
      .populate("users.user")
      .populate("projects.project");

    return team;
  } catch (error) {
    console.error("Error fetching team by userId:", error);
    throw error;
  }
};

//update team name
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const teamID = await params.id;
    const { teamName } = await req.json(); 
    const team = await Team.findOneAndUpdate(
      { _id: teamID }, 
      { teamName }, 
      { new: true }
    );

    if (!team) {
      return new Response(JSON.stringify({ message: "Team not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(team), { status: 200 });
  } catch (error) {
    console.error("Error updating team:", error);
    return new Response(JSON.stringify({ message: "An error occurred", error }), {
      status: 500,
    });
  }
}
