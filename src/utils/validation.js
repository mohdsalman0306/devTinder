const validator = require("validator");

/**
 * Validate Name
 */
const validateName = (firstName, lastName) => {
	if (!firstName || !lastName) {
		throw new Error("First name and last name are required");
	}
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

const validateAge = (age) => {
	if (age === undefined || age === null) {
		return null;
	}
	if (typeof age !== "number" || isNaN(age)) {
		return "Age must be a number";
	}
	if (!validator.isInt(String(age), { min: 18, max: 100 })) {
		return "Age must be an integer between 18 and 100";
	}
	return null;
};

const validatePhotoUrl = (photoUrl) => {
	if (photoUrl === undefined || photoUrl === null || photoUrl.trim() === "") {
		return null; // PhotoUrl is optional
	}
	if (typeof photoUrl !== "string") {
		return "Photo URL must be a string";
	}
	if (
		!validator.isURL(photoUrl, {
			protocols: ["http", "https"],
			require_protocol: true,
		})
	) {
		return "Photo URL must be a valid URL with http or https protocol";
	}
	return null;
};

const validateSingleSkill = (skill) => {
	if (typeof skill !== "string") {
		return "Each skill must be a string, not a number";
	}
	if (validator.isNumeric(skill)) {
		return "Skills cannot be numbers. Please provide skill names as strings";
	}
	const trimmed = skill.trim();
	if (trimmed !== skill) {
		return "Skills cannot have leading or trailing whitespace";
	}
	if (!validator.isLength(trimmed, { min: 2, max: 50 })) {
		return "Each skill must be between 2 and 50 characters long";
	}
	return null;
};

const validateSkills = (skills) => {
	if (skills === undefined || skills === null) {
		return null;
	}
	if (!Array.isArray(skills)) {
		return "Skills must be an array";
	}
	if (skills.length > 10) {
		return "Skills array cannot have more than 10 items";
	}

	for (const skill of skills) {
		const error = validateSingleSkill(skill);
		if (error) return error;
	}

	return null;
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

const handleMongooseError = (err, res) => {
	if (err.name === "ValidationError") {
		return res.status(400).send(err.message);
	}
	if (err.code === 11000) {
		return res.status(400).send("Email already exists");
	}
	return res.status(500).send(err.message);
};

module.exports = {
	validateSignUpData,
	validatePassword,
	validateAge,
	validatePhotoUrl,
	validateSingleSkill,
	validateSkills,
	handleMongooseError
};
