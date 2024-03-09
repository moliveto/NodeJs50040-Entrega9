const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

module.exports = { mongoURI, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET };
