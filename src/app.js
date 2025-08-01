const express = require("express");
const app = express();
// app.use("/", (req, res) => {
// 	res.send("Hello from the server...");
// });
app.use("/test", (req, res) => {
	res.send("Hello from the test server...");
});
app.use("/hello", (req, res) => {
	res.send("Hello Hello Hello ...");
});
app.listen(3030, () => {
	console.log("Server is running on port 3030");
});
