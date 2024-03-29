require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations")
const uploadConfig = require("./configs/upload");

const cors = require("cors");

const AppError = require("./utils/AppError");

const express = require("express");


const routes = require("./routes");

migrationsRun();

const app= express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.log(error);

    return response.status(500).json({
        status: "error",
        message: "internal server error"
    });
});

const port = 3333;


app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});