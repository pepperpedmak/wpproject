import { NextResponse } from "next/server";
import { User } from "@/app/models/models";
import { ConnectDB } from "@/app/lib/mongodb";

export async function POST(req: Request) {
    try {
        await ConnectDB();

        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({
                status: "error",
                message: "Token is required",
            }, { status: 400 });
        }

        // Query the database
        const user = await User.findOne({ _id: token });

        if (user) {
            return NextResponse.json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                picture_dir: user.picture_dir,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                status: "error",
                message: "User not found",
            }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({
            status: "error",
            message: "An error occurred while fetching user data",
        }, { status: 500 });
    }
}