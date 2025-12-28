const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true, minlength: 4 },
		lastName: { type: String, required: false },
		emailId: {
			type: String,
			lowercase: true,
			required: true,
			trim: true,
			unique: true,
			validate: {
				validator: function (v) {
					return validator.isEmail(v);
				},
				message: "Please provide a valid email address",
			},
		},
		password: {
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					return validator.isStrongPassword(v, {
						minLength: 6,
						minLowercase: 1,
						minUppercase: 1,
						minNumbers: 1,
						minSymbols: 0,
					});
				},
				message: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
			},
		},
		age: {
			type: Number,
			min: 18,
			max: 100,
			validate: {
				validator: function (v) {
					if (v === null || v === undefined) {
						return true; // Allow null/undefined (optional field)
					}
					if (typeof v !== "number" || isNaN(v)) {
						throw new Error("Age must be a number");
					}
					// Convert to string for validator.isInt() which works with strings
					return validator.isInt(String(v), { min: 18, max: 100 });
				},
				message: "Age must be an integer between 18 and 100",
			},
		},
		gender: {
			type: String,
			validate: {
				validator: function (v) {
					if (!["male", "female", "other"].includes(v)) {
						throw new Error("Gender must be male, female or other");
					}
				},
			},
		},
		photoUrl: {
			type: String,
			default:
				"https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png",
			validate: {
				validator: function (v) {
					if (!v || v.trim() === "") {
						return true; // Allow empty string, will use default
					}
					return validator.isURL(v, {
						protocols: ["http", "https"],
						require_protocol: true,
					});
				},
				message: "Photo URL must be a valid URL with http or https protocol",
			},
		},
		about: { type: String, default: "This is a default about of the user" },
		skills: {
			type: [String],
			validate: {
				validator: function (v) {
					if (!Array.isArray(v)) {
						throw new Error("Skills must be an array");
					}
					if (v.length > 10) {
						throw new Error("Skills array cannot have more than 10 items");
					}
					// Check each skill is a string and not a number
					for (let skill of v) {
						if (typeof skill !== 'string') {
							throw new Error("Each skill must be a string, not a number");
						}
						// Check if it's a string that represents a number (e.g., "123")
						if (validator.isNumeric(skill)) {
							throw new Error("Skills cannot be numbers. Please provide skill names as strings");
						}
						// Validate skill string length (min 2, max 50 characters)
						if (!validator.isLength(skill, { min: 2, max: 50 })) {
							throw new Error("Each skill must be between 2 and 50 characters long");
						}
						// Trim whitespace
						if (skill.trim() !== skill) {
							throw new Error("Skills cannot have leading or trailing whitespace");
						}
					}
					return true;
				},
			},
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
