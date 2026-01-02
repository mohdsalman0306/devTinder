const express = require("express");
const connectDB = require("./config/detabase");
const User = require("./models/User");
const validator = require("validator");
const { validateSignUpData, validatePassword } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Validation helper functions
const validateAge = (age) => {
	if (age === undefined || age === null) {
		return null; // Age is optional
	}
	if (typeof age !== "number" || isNaN(age)) {
		return "Age must be a number";
	}
	// Convert to string for validator.isInt() which works with strings
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

const handleMongooseError = (err, res) => {
	if (err.name === "ValidationError") {
		return res.status(400).send(err.message);
	}
	if (err.code === 11000) {
		return res.status(400).send("Email already exists");
	}
	return res.status(500).send(err.message);
};

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
	try {
		const { emailId, password } = req.body;
		validator.isEmail(emailId) || res.status(400).send("Invalid email or password");
		const user = await User.findOne({ emailId });
		if (!user) {
			return res.status(400).send("Invalid email or password");
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).send("Invalid email or password");
		}
		const token = "cwe09ewchnc9webu32c89b9n2e3b2";
		res.cookie("token", token);
		res.send(user);
	} catch (err) {
		return handleMongooseError(err, res);
	}
})

app.get('/profile', async (req, res) => {
	const cookie = req.cookies;
	console.log(cookie);
	res.send("Checking Cookie Parser");
})


const ALLOWED_UPDATES = [
	"userId",
	"photoUrl",
	"about",
	"skills",
	"gender",
	"age",
];
// get user by email
app.get("user", async (req, res) => {
	const emailId = req.body.emailId;
	try {
		const user = await User.findOne({ emailId });
		if (!user) {
			res.status(404).send("User not found");
		} else {
			res.send(user);
		}
	} catch (error) {
		res.status(500).send("Something went wrong");
	}
});

// Feed API - GET /feed - get all users from the database
app.get("/feed", async (req, res) => {
	try {
		const users = await User.find({});
		if (!users) {
			res.status(404).send("No users found.");
		} else {
			res.send(users);
		}
	} catch (error) {
		res.status(500).send("Something went wrong");
	}
});

// Update user by ID

app.patch("/user", async (req, res) => {
	const userId = req.body.userId;
	const data = req.body;

	// Validate allowed updates
	const updates = Object.keys(data).every((update) =>
		ALLOWED_UPDATES.includes(update)
	);
	if (!updates) {
		return res.status(400).send("Invalid updates!");
	}

	// Validate skills
	const skillsError = validateSkills(req.body.skills);
	if (skillsError) {
		return res.status(400).send(skillsError);
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

	try {
		const user = await User.findByIdAndUpdate(userId, req.body, {
			returnDocument: "after",
			runValidators: true,
		});
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.send(user);
	} catch (error) {
		return handleMongooseError(error, res);
	}
});

// Delete user by ID
app.delete("/user", async (req, res) => {
	try {
		const userId = req.body.userId;
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.send("User deleted successfully");
	} catch (error) {
		return handleMongooseError(error, res);
	}
});

connectDB()
	.then(() => {
		console.log("DB connected");
		app.listen(3030, () => {
			console.log("Server is running on port 3030");
		});
	})
	.catch((err) => {
		console.error("DB connection failed: ", err);
	});
