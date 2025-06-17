import { StatusCodes } from "http-status-codes";
import { create } from "../models/TestSchema";

const testController = async (req, res) => {
	const test = await create({ name: "Arshdeep" });
	res.status(StatusCodes.OK).json(test);
};

export { testController };
