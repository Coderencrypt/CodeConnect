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

app.use(express.json());

// API Routes
app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
});

app.get("/books", (req, res) => {
    res.status(200).json({ msg: "this is a books endpoint" });
});

// Deployment Logic
if (process.env.NODE_ENV === "production" || ENV.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "frontend", "dist");
    
    // Serve static files
    app.use(express.static(frontendPath));

    // The "Express 5" compatible catch-all
    // :any* tells Express to match everything and call it 'any'
    app.get("/:any*", (req, res) => {
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
