const express = require("express");
const connectDB = require("./config/detabase");
const User = require("./models/User");
const app = express();

app.post("/signup", async (req, res) => {
	const userObj = {
		firstName: "John",
		lastName: "Doe",
		emailId: "john.doe@example.com",
		password: "password",
		age: 25,
		gender: "male",
	};

	const user = new User(userObj);
	try {
		await user.save();
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
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
		console.error("DB connection failed", err);
	});
