const router = require("express").Router();
const User = require("./../model/User");

//Route
router.post("/register", async (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	});

	//Saving the user in our database
	try {
		const savedUser = await user.save();
		res.send(savedUser);
	} catch (error) {
		console.log(error);
		res.status(400).json("User not created");
	}

	res.send("Successfully registered a user");
});

module.exports = router;
