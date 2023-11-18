import OpenAI from "openai";
import {MessageEmbed} from "discord.js";
import {toNormalized} from "./utils.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
console.log("Created OpenAI!")

/**
 * @param {Object} message The prompt to prompt
 */
export async function chatCompletion(message, client) {
    try {
        const username = toNormalized(message.member?.nickname) ?? toNormalized(message.author.username);
        const prompt = message.content.slice(4);
        const requesting = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor({name: `${username}`, iconURL: `${message.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
        .setTitle(`${prompt.length > 256 ? prompt.slice(0, 256 - 3) + "..." : prompt}`)
        .setDescription("*Generating response... This may take a while depending on complexity.*");

        const msg = await message.reply({embeds: [requesting]});
        message.channel.sendTyping();

        // Removed the stream: true option
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "You are Discord bot named \"CRA Assistant\. \"CRA\" stands for \"College Regina Assumpta\" which is an \"ecole secondaire\" in Quebec." +
                        " You do not have access to a message history so expect the lack of context"
                },
                {role: "assistant", content: `${prompt}`, name: `${username.replaceAll(" ", "_")}`}
            ],
            temperature: 1,
            max_tokens: 1024,
            n: 1,
        });

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({
            name: `${username}`,
            iconURL: `${message.member.user.displayAvatarURL({dynamic: true, size: 32})}`,
        })
        .setTitle(`${prompt.length > 256 ? prompt.slice(0, 256 - 3) + "..." : prompt}`)
        .setFooter({text: `model: OpenAI ${completion.model}, usage: ${completion.usage.total_tokens}/1024 tokens`});

        // Split the message into chunks of maximum length 4096
        const messageChunks = completion.choices[0].message.content.match(/[\s\S]{1,4096}/g) || [];

        // Send each chunk as a new embed
        for (const chunk of messageChunks) {
            embed.setDescription(chunk);
            await message.channel.send({embeds: [embed]});
        }
    } catch (err) {
        if (err.response) {
            console.log(err.response.status);
            console.log(err.response.data);
            const request_failure_exception = new MessageEmbed()
            .setColor("RED")
            .setTitle(`RequestFailureException${err.response.status ? err.response.status + " " : ""}`)
            .setDescription(`An error occurred while requesting a completion: \`\`\`${err.response.data}\`\`\``);

            message.edit({embeds: [request_failure_exception]});
        } else {
            console.log(err.message);
        }
    }
}
