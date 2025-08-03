const express = require("express");
const app = express();
// app.use("/", (req, res) => {
// 	res.send("Hello from the server...");
// });
app.use(
	"/user", // Route path

	(req, res, next) => {
		// Route handler 1
		console.log("Response 1");
		next(); // middleware
		// res.send("Response 1 ...");
	},
	(req, res, next) => {
		// Route handler 2
		console.log("Response 2");
		res.send("Response 2 ...");
		// next();
	}
);
app.listen(3030, () => {
	console.log("Server is running on port 3030");
});

// this is for route handeler and its cases to put next function in the middle of the route handeler
