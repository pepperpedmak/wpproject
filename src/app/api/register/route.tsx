import { NextResponse } from "next/server";
import { User , Team , Project} from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        await ConnectDB();

        const { firstName, lastName, phone, email, password } = await req.json();

        const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            password,
        });

        const newProject = new Project({
            projectName : "Project0"
        });

        const newTeam = new Team({
        teamName : "Team0",
        users: [
        {
          user: newUser._id,
        }],
        projects: [
            {
              project: newProject._id,
            },
      ],
    });

        await newUser.save();
        await newProject.save();
        await newTeam.save();

        return NextResponse.json({
            status: "success",
            message: "User registered successfully!",
        });
    } catch (error) {
        console.error("Error registering:", error);
        return NextResponse.json({
            status: "error",
            message: error || "Failed to register.",
        });
    }
}