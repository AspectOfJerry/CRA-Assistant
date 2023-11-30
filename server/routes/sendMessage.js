import express from "express";
import {sendMessage} from "../../controllers/express.js";
import createError from "http-errors";

const router = express.Router();

router.post("/", (req, res, next) => {
    const {channel, message} = req.body;

    if (!channel || !message) {
        return next(createError(400, "Values for channel or message are missing in the request body"));
    }

    sendMessage(channel, message, res, next);
});

export default router;
