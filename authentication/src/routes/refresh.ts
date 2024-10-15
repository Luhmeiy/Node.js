import { Router } from "express";
import { refreshTokenController } from "@/controllers/refreshTokenController";

export const router = Router();

router.get("/", refreshTokenController.handleRefreshToken);
