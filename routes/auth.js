const router = require("express").Router();
const User = require("./../model/User");
const { registerValidation } = require("./../Validation");
const { loginValidation } = require("./../Validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Route
router.post("/register", async (req, res) => {
	//validating the user input to make sure it's a valid email or name with over 6 chars
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Validating if email exists in database so another user wouldn't use it
	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists)
		return res.status(400).send("Email already exists in database");

	// Hashing the password in the database
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	//If the validation fails, dont create a user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword, //replaced with the salted password
	});

	//Saving the user in our database
	try {
		const savedUser = await user.save();
		console.log(user);
		res.send(savedUser._id); //only display the user id
	} catch (error) {
		console.log(error);
		res.status(400).json("User not created");
	}

	res.send("Successfully registered a user");
});
router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("User doesnt exist. Please register ");
	//Comparing with the bcrypted password
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) {
		return res.status(400).send("Invalid password");
	}

	//Assigning a token to a user that successfully logs in
	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
	res.header("auth-token", token).send(token);
	//Display a message if everything goes well
	// res.send("Logged in successfully");
});

module.exports = router;
