const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const tokenExtractor = (request, response, next) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "");
	} else {
		request.token = null;
	}

	next();
};

const userExtractor = async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
	request.user = await User.findById(decodedToken.id);

	next();
};

const getTokenForUser = async (user) => {
	const userForToken = {
		username: user.username,
		id: user._id,
	};

	return jwt.sign(userForToken, process.env.JWT_SECRET);
};

const unknownEndpoint = (request, response) => {
	return response.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).send({ error: error.message });
	} else if (
		error.name === "MongoServerError" &&
		error.message.includes("E11000 duplicate key error")
	) {
		return response
			.status(400)
			.send({ error: "expected `username` to be unique" });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({ error: "invalid token" });
	} else if (error.name === "TokenExpiredError") {
		return response.status(401).json({ error: "token expired" });
	}

	next(error);
};

module.exports = {
	tokenExtractor,
	userExtractor,
	getTokenForUser,
	unknownEndpoint,
	errorHandler,
};
