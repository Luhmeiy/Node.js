import { Router } from "express";
import { verifyJWT } from "@/middleware/verifyJWT";

import { router as rootRoutes } from "./root";
import { router as registerRoutes } from "./register";
import { router as authRoutes } from "./auth";
import { router as refreshRoutes } from "./refresh";
import { router as logoutRoutes } from "./logout";
import { router as employeesRoutes } from "./api/employees";
import { router as usersRoutes } from "./api/users";

export const router = Router();

router.use("/", rootRoutes);
router.use("/register", registerRoutes);
router.use("/auth", authRoutes);
router.use("/refresh", refreshRoutes);
router.use("/logout", logoutRoutes);

router.use(verifyJWT);
router.use("/employees", employeesRoutes);
router.use("/users", usersRoutes);
