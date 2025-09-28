const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(
		"mongodb+srv://mohdsalman0306_db_user:VdE8luyQukeCoDZe@devtinder.fqlu9gd.mongodb.net/?retryWrites=true&w=majority&appName=devTinder"
	);
};

module.exports = connectDB;
