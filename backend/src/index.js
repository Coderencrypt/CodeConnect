// // const express = require("express")
// import express from "express";
// import path from "path";

// import { ENV } from "./lib/env.js";
// import { connectDB } from "./lib/db.js";

// const app = express();



// const __dirname = path.resolve();

// app.get("/health", (req, res) => {
//     res.status(200).json({ msg: "api is up and running" });
// });

// app.get("/books", (req, res) => {
//     res.status(200).json({ msg: "this is a books endpoint" });
// });

// // Corrected deployment logic
// if (ENV.NODE_ENV === "production") {
//     // 1. Point to frontend/dist directly from the root
//     app.use(express.static(path.join(__dirname, "frontend", "dist")));

//     // 2. Serve index.html for any non-API routes
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     });
// }




// const startIndex = async () => {
//     try {
//      await connectDB();
//         app.listen(ENV.PORT, ()=> console.log("Server is running on port:",ENV.PORT));
//     } catch (error) {
//         console.error("💥 Error starting the server", error)
//     }
// };

// startIndex();


import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();

// Use process.cwd() to consistently get the root directory of the project
const rootDir = process.cwd(); 

app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
});

app.get("/books", (req, res) => {
    res.status(200).json({ msg: "this is a books endpoint" });
});

// Use process.env directly to ensure Render's dashboard variables are caught
if (process.env.NODE_ENV === "production" || ENV.NODE_ENV === "production") {
    const frontendDistPath = path.join(rootDir, "frontend", "dist");
    
    // 1. Serve static files
    app.use(express.static(frontendDistPath));

    // 2. Serve index.html for all other routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

const startIndex = async () => {
    try {
        await connectDB();
        // Fallback to port 10000 if ENV.PORT is undefined
        const port = ENV.PORT || 10000;
        app.listen(port, () => console.log("Server is running on port:", port));
    } catch (error) {
        console.error("💥 Error starting the server", error);
    }
};

startIndex();