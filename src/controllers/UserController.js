const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConection = require("../database/sqlite");
class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConection();

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashPassword]);

    response.status(201).json();

  }
}

module.exports = UserController;
