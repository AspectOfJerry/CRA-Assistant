import {client} from "../index.js";
import createError from "http-errors";
import {emailRewriter} from "../openai.js";

export async function sendMessage(channelId, message, res, next) {
    const channel = await client.channels.resolve(channelId);
    if (!channel) return next(createError(400, `Channel with id ${channelId} does not exist`));

    await channel.sendTyping();
    channel.send(message);

    res.json({
        success: res.locals.success,
    });
}


export async function rewriteEmail(channelId, message, res, next) {
    const content = await emailRewriter(message);

    const channel = await client.channels.resolve(channelId);
    if (!channel) return next(createError(400, `Channel with id ${channelId} does not exist`));

    await channel.sendTyping();

    channel.send(`>>> ${content}`).then((msg) => {
        msg.react("✅");
    });

    res.json({
        success: res.locals.success,
    });
}
