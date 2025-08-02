const express = require("express");
const app = express();
// app.use("/", (req, res) => {
// 	res.send("Hello from the server...");
// });
app.get("/user/:userId/:name/:password", (req, res) => {
	res.send({ firstname: "Salman", lastname: "Sheikh" });
});
app.listen(3030, () => {
	console.log("Server is running on port 3030");
});
