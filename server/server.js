require("dotenv").config();
import express, { json } from "express";
import cors from "cors";

import connectDB from "./db/connect";

import testRouter from "./routes/testRouter";
import UserRouter from "./routes/users";
import CategoryRouter from "./routes/categories";
import ItemRouter from "./routes/items";

const app = express();

app.use(cors());
app.use(json());

app.use("/test", testRouter);
app.use("/users", UserRouter);
app.use("/categories", CategoryRouter);
app.use("/items", ItemRouter);

const port = 3001;

const start = async () => {
	try {
		await connectDB("mongodb://mongo:27017/database");
		console.log("Connected to MongoDB");

		app.listen(port, () => {
			console.log(`Server is listening on port ${port}`);
		});
	} catch (err) {
		console.log(`Error: ${err}`);
	}
};

start();
