const validator = require("validator");

/**
 * Validate Name
 */
const validateName = (firstName, lastName) => {
	if (!firstName || !lastName) {
		throw new Error("First name and last name are required");
	}
	// if (!validator.isAlpha(firstName, "en-US", { ignore: " " }) ||
	//     !validator.isAlpha(lastName, "en-US", { ignore: " " })) {
	// 	throw new Error("Name must contain only letters");
	// }
};

/**
 * Validate Password
 */
const validatePassword = (password) => {
	if (!password) {
		throw new Error("Password is required");
	}
	if (!validator.isStrongPassword(password)) {
		throw new Error(
			"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
		);
	}
};

/**
 * Signup Validation
 */
const validateSignUpData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	validateName(firstName, lastName);
	if (!emailId) {
		throw new Error("Email is required");
	}
	if (!validator.isEmail(emailId)) {
		throw new Error("Invalid email address");
	}
	validatePassword(password);
};

module.exports = {
	validateSignUpData,
	validatePassword,
};
