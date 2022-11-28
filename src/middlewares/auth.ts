import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface MyRespBody {}
interface MyRespLocal {
	user: any;
}

async function authenticate(
	req: Request,
	res: Response<MyRespBody, MyRespLocal>,
	next: NextFunction
) {
	const token = req.header("auth-token");
	if (!token) return res.status(400).send({ error: "Access denied." });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET!);
		res.locals.user = verified;

		next();
	} catch (error) {
		res.status(400).send({ error: "Invalid token." });
	}
}

export { authenticate };
