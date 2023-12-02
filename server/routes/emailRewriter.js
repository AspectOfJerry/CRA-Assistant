import express from "express";
import createError from "http-errors";
import {rewriteEmail} from "../../controllers/controllers.js";

const router = express.Router();

router.post("/", (req, res, next) => {
    const {channel, message} = req.body;

    if (!channel || !message) {
        return next(createError(400, "Values for channel or message are missing in the request body"));
    }

    rewriteEmail(channel, message, res, next);
});

export default router;
