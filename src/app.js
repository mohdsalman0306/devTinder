const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("/middlewares/auth");
// app.use("/", (req, res) => {
// 	res.send("Hello from the server...");
// });

app.get("/getUserData", (req, res) => {
	try {
		//Logic of DB call and get user data
		throw new Error("DB connection failed");
		res.send("User data sent");
	} catch (error) {
		res.status(500).send("Some error occurred, contact support team");
	}
});

app.use("/", (err, req, res, next) => {
	if (err) {
		// log your error
		// res.status(500).send(err.message);
		res.status(500).send("Something went wrong, please try again later");
	}
});

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
	res.send("Hello User, You are loggedIn...");
});

app.post("/user/data", userAuth, (req, res) => {
	res.send("Hello User, You are Authorized...");
});

app.get("/admin/getAllData", (req, res) => {
	res.send("All data sent");
});

app.get("/admin/deleteAllData", (req, res) => {
	res.send("All data deleted");
});

app.listen(3030, () => {
	console.log("Server is running on port 3030");
});

// we can add the array of the route handeler and  it will run the all the route handleler in the array
