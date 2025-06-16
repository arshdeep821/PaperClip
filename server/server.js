require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./db/connect');


const testRouter = require("./routes/testRouter")
const UserRouter = require("./routes/users")
const CategoryRouter = require("./routes/categories")
const ItemRouter = require("./routes/items")

const app = express()

app.use(cors());
app.use(express.json());

app.use("/test", testRouter)
app.use("/users", UserRouter)
app.use("/categories", CategoryRouter)
app.use("/items", ItemRouter)

const port = process.env.PORT || 3001

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

start()