const express = require("express");
const pool = require("./queries");
const router = require("./src/routes/index");
const errorHandler = require("./src/utils/error.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.use(morgan("tiny"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});

pool.connect((err, res) => {
	if (err) console.log(err);
	console.log("Connected to database");
});
