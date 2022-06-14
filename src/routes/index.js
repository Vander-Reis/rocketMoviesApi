

const { Router } = require("express");

const userRouter = require("./users.routes");

const routes = Router();

routes.use("/", userRouter);

module.exports = routes;