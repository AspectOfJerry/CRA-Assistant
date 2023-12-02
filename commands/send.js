import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";


export default {
    data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Sends a message in a text channel")
    .addStringOption((options) =>
        options
        .setName("message")
        .setDescription("[REQUIRED] The message to send.")
        .setRequired(true))
    .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("[OPTIONAL] The channel to send the message to. Defaults to the current channel.")
        .setRequired(false)),
    async execute(client, interaction) {
        const channel = interaction.options.getChannel("channel") ?? interaction.channel;
        const message = interaction.options.getString("message");

        if (!channel.isText()) {
            const invalid_input_channel_type_exception = new MessageEmbed()
            .setColor("RED")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("IllegalChannelTypeException")
            .setDescription("You need to mention a text-based channel.");

            interaction.reply({embeds: [invalid_input_channel_type_exception]});
            return;
        }

        await channel.sendTyping();

        channel.send({content: `>>> ${message}`});
    }
};
