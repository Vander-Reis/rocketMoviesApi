const { Router } = require("express");

const userRouter = require("./users.routes");
const moviesRouter = require("./movies.routes");
const tagsRouter = require("./tags.routes");
const sessionRouter = require("./session.routes");

const routes = Router();

routes.use("/users", userRouter);
routes.use("/session", sessionRouter);
routes.use("/movies", moviesRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;