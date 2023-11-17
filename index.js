import {Client, Intents, Collection} from "discord.js";
import {getCommandFiles, startEvents} from "./utils.js";
import {config} from "dotenv";

config()

console.log(">>> The bot was started! <<<");

const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
    ]
});

(async () => {
    console.log("Getting command files...");

    const suffix = ".js";
    const command_files = await getCommandFiles("./commands", suffix);
    console.log(`Queued ${command_files.commands.length} files, ignored ${command_files.ignored.length} files, skipped ${command_files.skipped.length} files:`);
    console.log(command_files);

    const commands = [];

    client.commands = new Collection();

    for (const file of command_files.commands) {
        const module = await import(file);
        const command = module.default;

        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }

    // Getting events
    await startEvents(client, commands);

    await client.login(process.env.DISCORD_BOT_TOKEN);
})();
