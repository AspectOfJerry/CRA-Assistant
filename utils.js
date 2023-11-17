import fs from "fs";

/**
 * Private internal function
 */
async function _getDirCommandFiles(dir, suffix, command_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for (const file of files) {
        if (file.name.endsWith(".subcmd.js")) {
            command_files.ignored.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if (file.name.endsWith(".hdlr.js") || file.name.endsWith(".hdlr.e.js")) {
            command_files.skipped.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored as they work the same way as command files.
        }

        if (file.isDirectory()) {
            await _getDirCommandFiles(`${dir}/${file.name}`, suffix, command_files);
        } else if (file.name.endsWith(suffix)) {
            command_files.commands.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of command files
 */
async function getCommandFiles(dir, suffix) {
    const command_files = {
        commands: [],
        ignored: [],
        skipped: []
    };

    await _getDirCommandFiles(dir, suffix, command_files);

    return command_files;
}

/**
 * @async `await` must be used when calling `sleep()`.
 * @param {number} delayMs The delay to wait for in milliseconds.
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`.
 */
async function sleep(delayMs) {
    if (isNaN(delayMs)) {
        throw TypeError("delayMs is not a number");
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * @param {Object} client The Discord client.
 */
async function startJobs(client) {
    console.log("Starting jobs...");

    const job_files = fs.readdirSync("./jobs").filter(file => file.endsWith(".js"));

    console.log(`Job files (${job_files.length}):`);
    console.log(job_files);

    for (const job_file of job_files) {
        const {execute} = await import(`./jobs/${job_file}`);
        execute(client);
    }
}

/**
 * @param {Object} client The active Discord client
 * @param {array} commands The application commands to register in the `ready` event
 */
async function startEvents(client, commands) {
    console.log("Starting event listeners...");

    const event_files = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

    console.log(`Event files (${event_files.length}):`);
    console.log(event_files);

    for (const event_file of event_files) {
        const module = await import(`./events/${event_file}`);
        const event = module.default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, commands));
        } else {
            client.on(event.name, (...args) => event.execute(...args, commands));
        }
    }
}


export {
    getCommandFiles,
    sleep,
    startJobs,
    startEvents
};
