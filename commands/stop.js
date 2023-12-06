import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("[SUDO] Stops the bot.")
    .addBooleanOption((options) =>
        options
        .setName("halt")
        .setDescription("[OPTIONAL] Immediately halts the process. Use this as absolute last resort. Defaults to false.")
        .setRequired(false))
    .addStringOption((options) =>
        options
        .setName("reason")
        .setDescription("[OPTIONAL] The reason for the stop request.")
        .setRequired(false))
    .addStringOption((options) =>
        options
        .setName("heartbeat")
        .setDescription("[OPTIONAL] Whether to stop the heartbeat.")
        .setRequired(false)
        .addChoices([
            ["Stop", "true"],
            ["No action", "false"]
        ])),
    async execute(client, interaction) {
        if (!["611633988515266562"].includes(interaction.user.id)) {
            return;
        }

        // Declaring variables
        const reason = interaction.options.getString("reason") ?? "No reason provided.";
        const halt = interaction.options.getBoolean("halt") ?? false;

        if (halt) {
            console.log("Halting the process...");
            process.exit(1);
        }

        let buttonRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("stop_confirm_button")
            .setLabel("Stop")
            .setStyle("DANGER")
            .setDisabled(false),
            new MessageButton()
            .setCustomId("stop_cancel_button")
            .setLabel("Cancel")
            .setStyle("SECONDARY")
            .setDisabled(false)
        );

        let overrideText = "";

        // const now = Math.round(Date.now() / 1000);
        // const auto_cancel_timestamp = now + 10;

        const confirm_stop = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Confirm Stop")
        .setDescription("Are you sure you want to stop the bot? Please use this command as last resort.")
        // .addFields(
        //     {name: "Auto cancel", value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
        // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
        .setFooter({text: "🟥 Canceling in 10s"});

        await interaction.reply({embeds: [confirm_stop], components: [buttonRow]});

        const filter = (buttonInteraction) => {
            if (buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
                overrideText = ` (overriden by <@${buttonInteraction.user.id}>)`;
                return true;
            } else if (buttonInteraction.user.id === interaction.user.id) {
                return true;
            } else {
                buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});

            }
        };

        const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

        button_collector.on("collect", async buttonInteraction => {
            await buttonInteraction.deferUpdate();
            await button_collector.stop();
            // Disabling buttons
            buttonRow.components[0]
            .setDisabled(true);
            buttonRow.components[1]
            .setDisabled(true);

            if (buttonInteraction.customId === "stop_confirm_button") {
                const stopping_bot = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Stopping the bot")
                .setDescription(`<@${interaction.user.id}> requested a stop${overrideText}.`)
                .addFields(
                    {name: "Reason", value: `${reason}`, inline: false},
                    {name: "Requested at", value: `${interaction.createdAt}`, inline: false}
                );

                await interaction.editReply({embeds: [stopping_bot], components: [buttonRow]});
                await client.destroy();
                process.exit(0);
            } else {
                const cancel_stop = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<@${interaction.user.id}> aborted the stop request${overrideText}.`);

                interaction.editReply({embeds: [cancel_stop]});
            }
        });

        button_collector.on("end", (collected) => {
            // Disabling buttons
            buttonRow.components[0]
            .setDisabled(true);
            buttonRow.components[1]
            .setDisabled(true);

            if (collected.size === 0) {
                const auto_abort = new MessageEmbed()
                .setColor("DARK_GREY")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("Auto aborted.");

                interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
            }
        });
    }
};
