import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";

import connectDB from "./db/connect.js";
import seedDatabase from "./db/seed.js";

import testRouter from "./routes/testRouter.js";
import UserRouter from "./routes/users.js";
import CategoryRouter from "./routes/categories.js";
import ItemRouter from "./routes/items.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: "temp_secret_for_dev",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
			secure: false,
		},
	})
);
app.use("/test", testRouter);
app.use("/users", UserRouter);
app.use("/categories", CategoryRouter);
app.use("/items", ItemRouter);

const port = 3001;

const start = async () => {
	try {
		await connectDB("mongodb://mongo:27017/database");
		console.log("Connected to MongoDB");

		await seedDatabase();

		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`);
		});
	} catch (err) {
		console.log(`Error: ${err}`);
	}
};

start();
