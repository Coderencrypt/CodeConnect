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
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

// --- 1. MIDDLEWARE ---
app.use(express.json());

// --- 2. API ROUTES ---
// (Your existing routes)
app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
});

app.get("/books", (req, res) => {
    res.status(200).json({ msg: "this is a books endpoint" });
});

// --- 3. DEPLOYMENT LOGIC (FRONTEND) ---
// This must stay AFTER your API routes
if (process.env.NODE_ENV === "production" || ENV.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");

    // Serve static files from the Vite build folder
    app.use(express.static(frontendPath));

    // Handle React routing (The "Catch-all" route)
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

// --- 4. SERVER STARTUP ---
const startIndex = async () => {
    try {
        await connectDB();
        // Use process.env.PORT as a fallback to ensure Render can bind to the port
        const PORT = process.env.PORT || ENV.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`☑️ Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("💥 Error starting the server", error);
        process.exit(1);
    }
};

startIndex();
