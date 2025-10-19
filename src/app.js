const express = require("express");
const connectDB = require("./config/detabase");
const User = require("./models/User");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

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
	try {
		const userId = req.body.userId;
		const user = await User.findByIdAndUpdate(userId, req.body);
		res.send(user).send("User updated successfully");
	} catch (error) {
		res.status(500).send("Something went wrong");
	}
});

// Delete user by ID
app.delete("/user", async (req, res) => {
	try {
		const userId = req.body.userId;
		const user = await User.findByIdAndDelete(userId);
		res.send("User deleted siccessfully");
	} catch (error) {}
});

connectDB()
	.then(() => {
		console.log("DB connected");
		app.listen(3030, () => {
			console.log("Server is running on port 3030");
		});
	})
	.catch((err) => {
		console.error("DB connection failed", err);
	});
