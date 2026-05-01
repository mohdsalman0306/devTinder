const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/User");

requestRouter.post(
	"/request/send/:status/:receiverUserId",
	userAuth,
	async (req, res) => {
		try {
			const senderUserId = req.user._id;
			const receiverUserId = req.params.receiverUserId;
			const status = req.params.status;

			const allowedStatuses = ["ignored", "interested"];

			if (!allowedStatuses.includes(status)) {
				return res.status(400).json({
					message: "Invalid status type:" + status,
				});
			}

			// self connection request is not allowed
			if (senderUserId.toString() === receiverUserId) {
				return res.status(400).json({
					message: "You cannot send a connection request to yourself!",
				});
			}

			// check if the receiver user exists
			const receiverUser = await User.findById(receiverUserId);
			if (!receiverUser) {
				return res.status(404).json({
					message: "Receiver user not found!",
				});
			}

			// If there is an already existing request between the sender and receiver, update the status instead of creating a new one
			const existingRequest = await ConnectionRequestModel.findOne({
				senderUserId,
				receiverUserId,
				$or: [
					{ senderUserId, receiverUserId },
					{ senderUserId: receiverUserId, receiverUserId: senderUserId },
					{ status: "ignored" },
					{ status: "interested" },
				],
			});
			if (existingRequest) {
				if (existingRequest.status === status) {
					return res.status(400).json({
						message: `You have already ${status} this user!`,
					});
				}
			}

			const connectionRequest = new ConnectionRequestModel({
				senderUserId,
				receiverUserId,
				status,
			});
			const data = await connectionRequest.save();
			res.json({
				message: `connection request sent successfully!`,
				data,
			});
		} catch (error) {
			res.status(500).json({
				message: "Error: " + error.message,
			});
		}
	},
);

module.exports = requestRouter;
