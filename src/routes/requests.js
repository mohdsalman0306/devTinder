const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
	try {
		const user = req.user;
		console.log("Sending the connection request...");
		res.send(`${user.firstName} has sent the Connection request!!!`);
	} catch (error) {
		res.status(500).send("Error: " + error.message);
	}
});

module.exports = requestRouter;