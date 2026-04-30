const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		res.status(400).send("Error:" + err.message);
	}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) {
			// return res.status(400).send("Invalid fields in request body");
			// or
			throw new Error("Invalid fields in request body");
		}
		const loggedInUser = req.user;
		console.log(loggedInUser);
		// Object.assign(loggedInUser, req.body);
		Object.keys(req.body).forEach((key) => {
			loggedInUser[key] = req.body[key];
		});
		await loggedInUser.save();
		// res.send(`${loggedInUser.firstName}, you have successfully updated your profile!`)
		res.json({
			message: `${loggedInUser.firstName}, you have successfully updated your profile!`,
			data: loggedInUser,
		});
	} catch (error) {
		res.status(400).send("Error:" + error.message);
	}
});

// Need to create a API to update password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
	const {newPassword} = req.body;
	try {
		validatePassword(newPassword);
		const loggedInUser = req.user;
		const passwordHash = await bcrypt.hash(newPassword, 10);
		loggedInUser.password = passwordHash;
		loggedInUser.save();
		res.json({
			message: `${loggedInUser.firstName}, you have successfully updated your password!`,
		});
	} catch (error) {
		res.status(400).send("Error:" + error.message)
	}
})

module.exports = profileRouter;
