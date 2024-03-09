const mongoose = require("mongoose");

const collection = "Users";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        // Ensure unique email addresses
        unique: true,
        // Validate email format
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", required: true },
});

const userModel = mongoose.model(collection, userSchema);

module.exports = userModel;