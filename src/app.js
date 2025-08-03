const express = require("express");
const app = express();
// app.use("/", (req, res) => {
// 	res.send("Hello from the server...");
// });
app.use(
	"/user", // Route path

	[
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
		},
	]
);
app.listen(3030, () => {
	console.log("Server is running on port 3030");
});

// we can add the array of the route handeler and  it will run the all the route handleler in the array
