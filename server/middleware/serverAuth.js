import createError from "http-errors";

const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

const apiAuthMidware = (req, res, next) => {
    console.log(`${green}> Incoming${reset} request from`
        + ` ${red + (req.get("X-Real-IP") ? "x-real-ip: " + req.get("X-Real-IP")
            : req.ip ? "req.ip: " + req.ip
                : "req.connection.remoteAddress" + req.connection.remoteAddress) + reset}`);
    console.log(` User-Agent: ${blue + (req.get("User-Agent") || "unknown") + reset}`);
    console.log(` to: ${yellow + req.originalUrl + reset}`);

    const valid_keys = ["secret_key_jerrydev100", "AaGsVlMmMjAnMzVjRmNmSmJlDnJpJsJoKaZ"];

    const api_key = req.query["api_key"];

    if (!api_key) {
        return next(createError(401, "Missing API key"));
    }

    if (!valid_keys.includes(api_key)) {
        return next(createError(403, "Invalid API key"));
    }

    next();
};

export default apiAuthMidware;