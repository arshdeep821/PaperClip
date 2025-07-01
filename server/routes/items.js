import { Router } from "express";
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url";

const router = Router();

import { createItem, deleteItem, updateItem, getProducts, searchProducts, getAllproducts } from "../controllers/items.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Change this line to put files into the 'client/public/' folder
        // This path is relative to where your Node.js server process is started
        cb(null, "./public");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.route("/").post(upload.single("image"), createItem).get(getAllproducts);
router.route("/search/:id").get(searchProducts);
router.route("/:id").delete(deleteItem).patch(upload.single('image'), updateItem).get(getProducts);

export default router;
