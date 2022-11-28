import mongoose from "mongoose";

const Tcheca = new mongoose.Schema(
	{
		owner: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			required: true,
			min: 1,
		},
		likes: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Tcheca", Tcheca);
