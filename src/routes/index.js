const { Router } = require("express");

const userRouter = require("./users.routes");
const moviesRouter = require("./movies.routes");

const routes = Router();

routes.use("/users", userRouter);
routes.use("/movies", moviesRouter);

module.exports = routes;