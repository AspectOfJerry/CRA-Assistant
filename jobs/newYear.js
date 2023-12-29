import {CronJob} from "cron";

let disabled = false;


async function execute(client) {
    /**
     * Triggers every year on January 1st
     */
    const new_year = new CronJob("0 0 1 1 *", async () => {

        const guild = await client.guilds.fetch("1014278986135781438");

        const channel = await guild.channels.fetch("1014293537363341332");

        const alt_channel = guild.channels.fetch("1014286502743773305");

        await channel.send({content: ":tada: Happy new year ${guild.roles.everyone}! :tada:"})
        .then((msg) => {
            msg.react("🥳");
        });

        await alt_channel.send({content: ":tada: Happy new year everyone! :partying_face: :fireworks:"})
        .then((msg) => {
            msg.react("🎉");
        });
    });

    new_year.start();
    console.log("[NewYear] The new year announcer daemon started!");
}


export {
    execute
};
