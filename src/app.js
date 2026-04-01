const express = require("express");
const connectDB = require("./config/detabase");
// 
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// const ALLOWED_UPDATES = [
// 	"userId",
// 	"photoUrl",
// 	"about",
// 	"skills",
// 	"gender",
// 	"age",
// ];

// get user by email
// app.get("user", async (req, res) => {
// 	const emailId = req.body.emailId;
// 	try {
// 		const user = await User.findOne({ emailId });
// 		if (!user) {
// 			res.status(404).send("User not found");
// 		} else {
// 			res.send(user);
// 		}
// 	} catch (error) {
// 		res.status(500).send("Something went wrong");
// 	}
// });

// Feed API - GET /feed - get all users from the database
// app.get("/feed", async (req, res) => {
// 	try {
// 		const users = await User.find({});
// 		if (!users) {
// 			res.status(404).send("No users found.");
// 		} else {
// 			res.send(users);
// 		}
// 	} catch (error) {
// 		res.status(500).send("Something went wrong");
// 	}
// });

// Update user by ID

// app.patch("/user", async (req, res) => {
// 	const userId = req.body.userId;
// 	const data = req.body;

// 	// Validate allowed updates
// 	const updates = Object.keys(data).every((update) =>
// 		ALLOWED_UPDATES.includes(update)
// 	);
// 	if (!updates) {
// 		return res.status(400).send("Invalid updates!");
// 	}

// 	// Validate skills
// 	const skillsError = validateSkills(req.body.skills);
// 	if (skillsError) {
// 		return res.status(400).send(skillsError);
// 	}

// 	// Validate age
// 	const ageError = validateAge(req.body.age);
// 	if (ageError) {
// 		return res.status(400).send(ageError);
// 	}

// 	// Validate photoUrl
// 	const photoUrlError = validatePhotoUrl(req.body.photoUrl);
// 	if (photoUrlError) {
// 		return res.status(400).send(photoUrlError);
// 	}

// 	try {
// 		const user = await User.findByIdAndUpdate(userId, req.body, {
// 			returnDocument: "after",
// 			runValidators: true,
// 		});
// 		if (!user) {
// 			return res.status(404).send("User not found");
// 		}
// 		res.send(user);
// 	} catch (error) {
// 		return handleMongooseError(error, res);
// 	}
// });

// Delete user by ID
// app.delete("/user", async (req, res) => {
// 	try {
// 		const userId = req.body.userId;
// 		const user = await User.findByIdAndDelete(userId);
// 		if (!user) {
// 			return res.status(404).send("User not found");
// 		}
// 		res.send("User deleted successfully");
// 	} catch (error) {
// 		return handleMongooseError(error, res);
// 	}
// });

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
