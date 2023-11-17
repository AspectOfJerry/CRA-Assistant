import {CronJob} from "cron";
import fetch from "node-fetch";
import {sleep} from "../utils.js";


const url = "https://uptime.betterstack.com/api/v1/heartbeat/iqmqzsNHQJGHgqAifDTwLe5G";

async function execute(client) {
    /**
     * Runs every 2 minutes.
     * Sends a heartbeat to the status page
     */
    const heartbeat = new CronJob("*/2 * * * *", async () => {
        try {
            await sleep(jitter());
            await fetch(url, {method: "POST"});
        } catch (err) {
            if (err) {
                console.error(err);
            }

            await sleep(5000 + jitter());
            await fetch(url, {method: "POST"});
        }
    });

    heartbeat.start();
    console.log("[Heartbeat] Heartbeat daemon started!");

    await fetch(url, {method: "POST"});
}


function jitter() {
    return Math.floor(Math.random() * 1450) + 50;
}


export {
    execute
};
