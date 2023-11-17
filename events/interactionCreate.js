import {MessageEmbed} from "discord.js";


export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand()) {
            return;
        }

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            return;
        }

        try {
            await command.execute(interaction.client, interaction);
        } catch (err) {
            if (err) {
                console.error(err);
                const _err = ":\n```\n" + err + "\n```" || ". ```No further information is available.```";
                const command_exec_failure_exception = new MessageEmbed()
                .setColor("FUCHSIA")
                .setTitle("CommandExecFailureException")
                .setDescription(`An error occurred while executing the command${_err}`)
                .setFooter({text: `${interaction.createdAt}`});

                try {
                    interaction.reply({content: "<@611633988515266562>,", embeds: [command_exec_failure_exception]});
                } catch {
                    try {
                        interaction.followUp({embeds: [command_exec_failure_exception]});
                    } catch {
                        try {
                            interaction.channel.send({embeds: [command_exec_failure_exception]});
                        } catch {
                            console.log("Failed to raise the exception (3 attempts).");
                        }
                    }
                }
            }
        }
    }
};