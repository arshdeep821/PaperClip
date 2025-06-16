require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./db/connect');


const testRouter = require("./routes/testRouter")

const app = express()

app.use(cors());
app.use(express.json());

app.use("/test", testRouter)

const port = process.env.PORT || 3000

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