import express from "express";
import createError from "http-errors";
import routes from "./server/routes/index.js";
import serverAuth from "./server/middleware/serverAuth.js";

const app = express();

// Middleware stack
app.use(express.json());
// Add success and self to res.locals
app.use(function (req, res, next) {
    res.locals.success = true;
    next();
});
app.use(serverAuth);
app.use("/", routes);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler. do not delete the `next` parameter because express uses it to determine if this is an error handler?
app.use((err, req, res, next) => {
    res.locals.success = false;
    res.status(err.status || 500).send({
        success: res.locals.success,
        error: {
            status: err.status || 500,
            message: err.message || "No message provided | Internal Server Error"
        },
    });
});

const PORT = 3003;
const HOST = "0.0.0.0";  // Listen on all available network interfaces

app.listen(process.env.PORT || PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
});
