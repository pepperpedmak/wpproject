import { NextResponse } from "next/server";
import { User , Team} from "@/app/models/models";
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

        // const newTeam = new Team({
        //     users[{
        //         newUser._id
        //     }]
        // })

        await newUser.save();

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