const mongoose = require("mongoose");

const connectDB = async () => {
	// await mongoose.connect(
	// 	"mongodb+srv://mohdsalman0306_db_user:VdE8luyQukeCoDZe@devtinder.fqlu9gd.mongodb.net/?retryWrites=true&w=majority&appName=devTinder"
	// );

	await mongoose.connect(
		"mongodb+srv://mohdsalman0306_db_user:WDBcOxyP6slAUcSB@devtindernew.j7xsdrw.mongodb.net/?appName=DevTinderNew",
	);
};

module.exports = connectDB;
