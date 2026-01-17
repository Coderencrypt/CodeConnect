import express from "express";
import { getStreamToken } from "../controller/chatController.js";
import { protecRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/token",protecRoute, getStreamToken)

export default router;

