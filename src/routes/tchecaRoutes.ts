import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import Tcheca from "../models/tcheca";

const tchecaRouter = Router();

// create tcheca
tchecaRouter.post("/tcheca", authenticate, async (req, res, next) => {
	const { content } = req.body;

	try {
		const tcheca = await Tcheca.create({
			owner: res.locals.user,
			content,
		});

		if (!tcheca) res.status(400).send({ error: "Unable to create tcheca." });

		res.status(201).send(tcheca);
	} catch (error) {
		res.status(400);
		next(error);
	}
});

// Delete tcheca
tchecaRouter.delete("/tcheca/:id", authenticate, async (req, res, next) => {
	const { _id } = req.params;

	try {
		await Tcheca.findByIdAndDelete(_id);
		res.status(200).send({ message: "Tcheca deleted." });
	} catch (error) {
		res.status(400);
		next(error);
	}
});

// Update tcheca (like/unlike)
tchecaRouter.put("/tcheca/:id", authenticate, async (req, res, next) => {
	const { id } = req.params;

	try {
		const tcheca = await Tcheca.findById(id);

		if (!tcheca) return res.status(400).send({ error: "Tcheca not found." });

		console.log(tcheca.owner, res.locals.user._id);
		if (tcheca.owner == res.locals.user._id)
			return res.status(400).send({ error: "Unable to update tcheca." });

		const tchecaAlreadyLiked = tcheca.likes.some(
			(like) => like == res.locals.user._id
		);

		if (tchecaAlreadyLiked) {
			tcheca.likes = tcheca.likes.filter(
				(like) => like !== res.locals.user._id
			);
		} else {
			tcheca.likes.push(res.locals.user._id);
			tcheca.save();
		}

		res.status(200).send(tcheca);
	} catch (error) {
		res.status(400);
		next(error);
	}
});

// List tchecas
tchecaRouter.get("/tchecas", authenticate, async (req, res, next) => {
	try {
		const tchecas = await Tcheca.find({});

		res.status(200).send(tchecas);
	} catch (err) {
		res.status(400);
		next(err);
	}
});

// FindOne tcheca
tchecaRouter.get("/tcheca/:id", authenticate, async (req, res, next) => {
	const { id } = req.params;

	try {
		const tcheca = await Tcheca.findById(id);

		if (!tcheca) return res.status(400).send({ error: "Tcheca not found." });

		res.status(200).send(tcheca);
	} catch (err) {
		res.status(400);
		next(err);
	}
});

export { tchecaRouter };
