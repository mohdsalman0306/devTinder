const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
	{
		senderUserId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		receiverUserId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		status: {
			type: String,
			enum: {
				values: ["ignored", "interested", "accepted", "rejected"],
				message: `{VALUE} is not a valid status.`,
			},
		},
	},
	{
		timestamps: true,
	},
);

connectionRequestSchema.pre("save", async function (next) {
	const connectionRequest = this;
	// check if the sender and receiver are the same
	// if (
	// 	connectionRequest.senderUserId.toString() ===
	// 	connectionRequest.receiverUserId.toString()
	// ) {
	// 	throw new Error("You cannot send a connection request to yourself!");
	// }
	if (connectionRequest.senderUserId.equals(connectionRequest.receiverUserId)) {
		throw new Error("You cannot send a connection request to yourself!");
	}
	next();
});

const ConnectionRequestModel = new mongoose.model(
	"ConnectionRequest",
	connectionRequestSchema,
);
module.exports = ConnectionRequestModel;
