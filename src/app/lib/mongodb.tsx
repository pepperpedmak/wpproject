import { connect } from "mongoose";

export const ConnectDB = async () => {
    try {
        await connect(String(process.env.MONGO_URI));
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
};