import mongoose from "mongoose";

const User = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			max: 1024,
		},
		tchecas: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Tcheca",
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", User);
