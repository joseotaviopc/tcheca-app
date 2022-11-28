import { Request, Response, NextFunction } from "express";

// Not Found Middleware
const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`😢 Requested path ${req.originalUrl} not found!`);
	res.status(404);
	next(error);
};

// Error Middleware
const errorHandling = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.statusCode = statusCode;
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? "🤓" : error.stack,
	});
};

export { notFound, errorHandling };
