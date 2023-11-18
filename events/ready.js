import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

import {startJobs} from "../utils.js";


export default {
    name: "ready",
    once: true,
    async execute(client, commands) {
        console.log("CRA Assistant is now online.");

        const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN); // REST

        const client_id = client.user.id;

        if (process.env.npm_lifecycle_event === "clean") {
            return;
        }

        if (process.env.npm_lifecycle_event === "clearcommands") {
            console.log("Clearing global commands...");
            await client.user.setStatus("dnd");

            await rest.put(Routes.applicationCommands(client_id), {body: []});

            console.log("Clearing local commands...");
            await rest.put(Routes.applicationGuildCommands(client_id, 1014278986135781438), {body: []});
            console.log("Successfully cleared local commands in \"1014278986135781438\".");

            console.log("Successfully cleared all registered application (/) commands!");
            await client.destroy();
            process.exit(0);
        }

        // Initialize OpenAI
        console.log("Initializing OpenAI...");
        import("../openai.js");

        // Jobs
        console.log("Starting jobs...");
        await startJobs(client);

        // Registering commands
        try {
            console.log("Registering the application (/) commands in \"1014278986135781438\"...");
            await rest.put(Routes.applicationGuildCommands(client_id, "1014278986135781438"), {body: commands}); // cra

            console.log("Successfully refreshed the application (/) commands locally!");
        } catch (err) {
            if (err) {
                console.error(err);
            }
        }
    }
};
