import { NextRequest, NextResponse } from "next/server";
import { Team } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";
import { debug } from "console";

export async function GET(req: NextRequest,context: { params: Promise<{ id: string }> }) {
  await ConnectDB();

  try {
    const { id: teamId } = await context.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    console.log("route : " , team);

    return NextResponse.json(team || []);
  } catch (error) {
    console.error("Error fetching team with users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
