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
export async function chatCompletion(message) {
    try {
        const username = toNormalized(message.member?.nickname) ?? toNormalized(message.author.username);
        const prompt = message.content.slice(4);
        const requesting = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor({name: `${username}`, iconURL: `${message.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
        .setTitle(`${prompt.length > 256 ? prompt.slice(0, 256 - 3) + "..." : prompt}`)
        .setDescription("*Generating response... This may take a while depending on complexity.*");

        await message.reply({embeds: [requesting], ephemeral: true});
        message.channel.sendTyping();

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "You are Discord bot named \"CRA Assistant\. \"CRA\" stands for \"College Regina Assumpta\" which is an \"ecole secondaire\" in Quebec." +
                        " You do not have access to a message history so expect the lack of context"
                },
                {role: "user", content: `${prompt}`, name: `${username.replaceAll(" ", "_")}`}
            ],
            temperature: 0.95,
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

export async function emailRewriter(input) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "Vous êtes un announcement bot pour le serveur Discord d'un groupe d'école secondaire (Collège Régina Assumpta) au Québec." +
                        " Vous devrez rédiger un message basé sur un e-mail et vous assurer que tout est clair et concis, dans une ambiance enthousiaste, dynamique, positive et plutôt drôle, ou sérieux si il est nécessaire." +
                        " Adressez-le au groupe 401 (le meilleur des 13 autres), et ajoutez-y votre touche personnelle (emojis)!" +
                        " Utilisez le markdown pour les éléments importants (ne modifiez pas les urls) et les headers (#-###) pour des titres." +
                        " Donnez l'impression que les professeurs veulent s'adresser aux élèves d'une manière similaire à celle-ci: \"Le professeur veut vous faire savoir que...\"." +
                        " Ajoutez une note pour dire que le e-mail original a été modifié par vous même, CRA-Assistant."
                },
                {role: "user", content: `${input}`}
            ],
            temperature: 0.8,
            max_tokens: 512,
            n: 1,
        });

        return completion.choices[0].message.content;
    } catch (err) {
        console.log(err.message);
        throw err;
    }
}
