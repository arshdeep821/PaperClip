import { StatusCodes } from "http-status-codes";
import Test from "../models/TestSchema.js";

const testController = async (req, res) => {
	const test = await Test.create({ name: "Arshdeep" });
	res.status(StatusCodes.OK).json(test);
};

export { testController };
