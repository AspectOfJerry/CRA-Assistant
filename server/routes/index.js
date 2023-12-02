import express from "express";
import sendMessage from "./sendMessage.js";
import emailParser from "./emailRewriter.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: res.locals.success,
        payload: {
            message: "hi!",
        }
    });
});

router.use("/sendMessage", sendMessage);
router.use("/emailParser", emailParser);

export default router;
