import { Response, Router } from "express";
import path from "path";
import { __dirname } from "../server";

export const router = Router();

router.get("^/$|/index(.html)?", ({ res }: { res: Response }) => {
	res.sendFile(path.join(__dirname, "views", "index.html"));
});
