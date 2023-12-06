import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";


export default {
    data: new SlashCommandBuilder()
    .setName("presence_clear")
    .setDescription("[SUDO] Clears the bot's presence."),
    async execute(client, interaction) {
        if (!["611633988515266562"].includes(interaction.user.id)) {
            return;
        }

        client.user.setPresence({activities: null});

        const success = new MessageEmbed()
        .setColor("GREEN")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
        .setDescription("Successfully reset the bot's presence.");

        interaction.reply({embeds: [success]});
    }
};
