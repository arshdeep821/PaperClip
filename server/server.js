import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./db/connect.js";
import seedDatabase from "./db/seed.js";

import testRouter from "./routes/testRouter.js";
import UserRouter from "./routes/users.js";
import CategoryRouter from "./routes/categories.js";
import ItemRouter from "./routes/items.js";
import TradeRouter from "./routes/trades.js";
import MessageRouter from "./routes/messages.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

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

app.use("/static", express.static("public"));
app.use("/test", testRouter);
app.use("/users", UserRouter);
app.use("/categories", CategoryRouter);
app.use("/items", ItemRouter);
app.use("/trades", TradeRouter);
app.use("/messages", MessageRouter);

// Socket.IO logic
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("send_message", (data) => {
		// data: { to, from, message, timestamp }
		io.to(data.to).emit("receive_message", data);
	});

	socket.on("join", (userId) => {
		socket.join(userId); // Each user joins their own room
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});
});

const port = 3001;

const start = async () => {
	try {
		await connectDB("mongodb://mongo:27017/database");
		console.log("Connected to MongoDB");

		await seedDatabase();

		server.listen(port, () => {
			console.log(`Server is listening on port ${port}`);
		});
	} catch (err) {
		console.log(`Error: ${err}`);
	}
};

start();
