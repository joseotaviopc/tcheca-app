import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { tchecaRouter, userRouter } from "./routes";
import { notFound, errorHandling } from "./middlewares";

dotenv.config();

const app = express();
const PORT = 3333;

try {
	mongoose.connect(process.env.DB_URL!, () =>
		console.log("🚀 Connected to the database!")
	);
} catch (error) {
	console.error(error);
}

app.use(express.json());
app.use(morgan("common"));
app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

// Routes
app.use(userRouter);
app.use(tchecaRouter);

// Not Found Middleware
app.use(notFound);
// Error Middleware
app.use(errorHandling);

app.listen(PORT, () => {
	console.log(`🔥 Tcheca server is running on port ${PORT}`);
});
