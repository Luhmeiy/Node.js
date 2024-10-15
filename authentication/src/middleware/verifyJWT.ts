import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
		if (error) return res.sendStatus(403);

		req.user = decoded.UserInfo.username;
		req.roles = decoded.UserInfo.roles;
		next();
	});
};
