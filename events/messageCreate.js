import {chatCompletion} from "../openai.js";
import {slackcord} from "../controllers/slackcord/slackcord.js";


export default {
    name: "messageCreate",
    once: false, // Whether this event should only be triggered once
    async execute(message) {
        if (message.author.bot) {
            return;
        }

        const gpt_prefixes = "gpt";

        const gpt_channels = ["1103466639292370964"];
        const slack_channels = ["1066475581899813007"];

        // gpt_prefixes.some(prefix => message.content.startsWith(prefix))
        if (message.content.startsWith(gpt_prefixes) && !message.author.bot && gpt_channels.includes(message.channel.id)) {
            chatCompletion(message, message.client);
        }

        /*
         * Slack
         */
        if (slack_channels.includes(message.channel.id)) {
            await slackcord.discordToSlack(message);
        }
    }
};
