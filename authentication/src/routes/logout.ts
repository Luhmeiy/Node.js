import { Router } from "express";
import { logoutController } from "../controllers/logoutController";

export const router = Router();

router.get("/", logoutController.handleLogout);
