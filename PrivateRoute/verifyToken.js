const jwt = require("jsonwebtoken");

//middleware function
module.exports = function (req, res, next) {
	const token = req.header("auth-token");
	if (!token) return res.status(401).send("Access denied. No token");
	//Verifying the token to make sure it matches the token for individual user
	try {
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		res.status(400).send("Invalid Token");
	}
};
