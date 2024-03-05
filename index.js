const express = require("express");
const pool = require("./queries");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.route");
const movieRouter = require("./src/routes/movies.route");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});

pool.connect((err, res) => {
	if (err) console.log(err);
	console.log("Connected to database");
});

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
