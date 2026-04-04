const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const {
	validateSignUpData,
	validateAge,
	validatePhotoUrl,
	validateSkills,
    handleMongooseError
} = require("../utils/validation");
const User = require("../models/User");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
	const signUpData = validateSignUpData(req);
	if (signUpData instanceof Error) {
		return res.status(400).send(signUpData.message);
	}
	// Validate age
	const ageError = validateAge(req.body.age);
	if (ageError) {
		return res.status(400).send(ageError);
	}

	// Validate photoUrl
	const photoUrlError = validatePhotoUrl(req.body.photoUrl);
	if (photoUrlError) {
		return res.status(400).send(photoUrlError);
	}

	// Validate skills
	const skillsError = validateSkills(req.body.skills);
	if (skillsError) {
		return res.status(400).send(skillsError);
	}
	const { firstName, lastName, emailId, password } = req.body;
	const passwordHash = await bcrypt.hash(password, 10);
	const user = new User({
		firstName,
		lastName,
		emailId,
		password: passwordHash,
	});
	try {
		await user.save();
		res.send(user);
	} catch (err) {
		return handleMongooseError(err, res);
	}
});
//login API
authRouter.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		validator.isEmail(emailId) || 
			res.status(400).send("Invalid email or password");
		const user = await User.findOne({ emailId });
		if (!user) {
			return res.status(400).send("Invalid email or password");
		}
		const isPasswordValid = await user.validatePassword(password);
		if (!isPasswordValid) {
			return res.status(400).send("Invalid email or password");
		}
		const token = await user.getJWT();
		res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
		res.send(user);
	} catch (err) {
		return handleMongooseError(err, res);
	}
});

authRouter.post("/logout", async (req, res) => {
	try {
		res.clearCookie("token");
		res.send("Logged out successfully");
	} catch (err) {
		return handleMongooseError(err, res);
	}
})

module.exports = authRouter;
