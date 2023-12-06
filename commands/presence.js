import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";


export default {
    data: new SlashCommandBuilder()
    .setName("presence")
    .setDescription("[SUDO] Edit the bot's presence.")
    .addStringOption((option) =>
        option
        .setName("type")
        .setDescription("[REQUIRED] The type of presence.")
        .setRequired(true)
        .addChoices([
            ["Playing", "PLAYING"],
            ["Streaming", "STREAMING"],
            ["Listening to", "LISTENING"],
            ["Watching", "WATCHING"],
            ["Competing in", "COMPETING"]
            // Bots cannot use the "CUSTOM" type
        ])),
    async execute(client, interaction) {
        if (!["611633988515266562"].includes(interaction.user.id)) {
            return;
        }

        const type = interaction.options.getString("type");
        const text = interaction.options.getString("text");
        const status = interaction.options.getString("status");
        const url = interaction.options.getString("url");

        client.user.setPresence({activities: [{name: text, type: type, url: url}], status: status});

        const success = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("PresenceUpdate")
        .addFields(
            {name: "Status", value: `${status}`, inline: true},
            {name: "Activity type", value: `${type}`, inline: true},
            {name: "Activity name", value: `${text}`, inline: false},
            {name: "?Url", value: `${url ? `[${url}](${url})` : "None"}`, inline: false}
        ).setFooter({text: "Use '/sudo presence_clear' to remove the presence."});

        interaction.reply({embeds: [success]});
    }
};
