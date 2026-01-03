const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = (req, res, next) => {
	const token = "xyz";
	const isAdminAuthorized = token === "xyz";
	if (!isAdminAuthorized) {
		res.status(401).send("Unauthorized Access");
	} else {
		next();
	}
};

const userAuth = async (req, res, next) => {
	try {
		// Read the token from the req cookies
		const cookies = req.cookies;
		const { token } = cookies;
		if(!token) {
			throw new Error("Token not found");
		}
		const decodedObj = await jwt.verify(token, "Sallu@02947#128");
		const { _id } = decodedObj;
		const user = await User.findById(_id);
		if (!user) {
			throw new Error("User not found");
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(400).send("Error: " + error.message);
	}
};

module.exports = { adminAuth, userAuth };
