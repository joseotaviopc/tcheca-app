import { Router } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "../middlewares/auth";

const userRouter = Router();

// Register
userRouter.post("/register", async (req, res, next) => {
	try {
		const { username, password } = req.body;

		// verify if user exists
		const userExists = await User.findOne({ username });
		if (userExists)
			return res.status(400).send({
				error: "Username already in use.",
			});

		// cripto password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		// create new user
		const createUser = await User.create({
			username,
			password: hash,
		});
		res.status(201).send({
			id: createUser.id,
			username: createUser.username,
		});
	} catch (error) {
		res.status(400);
		next(error);
	}
});
// Login
userRouter.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		// check valid username
		const user = await User.findOne({ username });
		if (!user) return res.status(400).send({ error: "Username not found." });

		// verify valid password
		const validpassword = await bcrypt.compare(password, user.password);
		if (!validpassword)
			return res.status(400).send({ error: "Invalid username or password." });

		// create validation token
		const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET!);
		res.header("auth-token", token).send(token);
	} catch (error) {
		res.status(400);
		next(error);
	}
});
// Get Users
userRouter.get("/users", authenticate, async (req, res, next) => {
	try {
		const users = await User.find({});

		if (!users.length)
			return res.status(400).send({ error: "Unable to get users." });

		res.status(200).send(
			users.map((user) => ({
				_id: user.id,
				username: user.username,
			}))
		);
	} catch (error) {
		res.status(400);
		next(error);
	}
});

export { userRouter };
