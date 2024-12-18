import { connect } from "mongoose";

export const ConnectDB = async () => {
    try {
        await connect(String(process.env.MONGO_URI));
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
};

// import mysql from "mysql2/promise";

// export const ConnectDB = async () => {
//     try {
//         const connection = await mysql.createConnection({
//             host: process.env.MYSQL_HOST ,
//             user: process.env.MYSQL_USER ,
//             password: process.env.MYSQL_PASSWORD ,
//             database: process.env.MYSQL_DATABASE ,
//         });

//         console.log("MySQL DB connected");
//         return connection; // Return the connection to use it elsewhere
//     } catch (error) {
//         console.error("Error connecting to the MySQL database:", error);
//         throw error;
//     }
// };