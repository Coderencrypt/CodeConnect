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
//     app.use((req, res) => {
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
import cors from "cors";

import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express';

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest , functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js"

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials :true meaning ?? ==> server allows a browser to include cookies on request 
app.use(cors({origin:ENV.CLIENT_URL, credentials : true}));
app.use(clerkMiddleware());  // this adds auth field to request object : res.auth()


app.use("/api/inngest", serve({client : inngest , functions}));
app.use("/api/chat", chatRoutes);

// API Routes
app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
});



// Deployment Logic
if (process.env.NODE_ENV === "production" || ENV.NODE_ENV === "production") {
    const frontendPath = path.join(process.cwd(), "..", "frontend", "dist");

    app.use(express.static(frontendPath));

    // Match all routes that are NOT handled by API routes above
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

const startIndex = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`☑️ Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("💥 Error starting the server", error);
        process.exit(1);
    }
};

startIndex();
