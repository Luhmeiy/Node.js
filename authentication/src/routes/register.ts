import { Router } from "express";
import { registerController } from "@/controllers/registerController";

export const router = Router();

router.post("/", registerController.handleNewUser);
