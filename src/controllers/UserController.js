const { hash, compare } = require("bcryptjs");
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

  async update(request, response) {

    const { name, email, password, oldPassword } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !oldPassword) {
      throw new AppError("Você precisa fornecer a senha antiga para poder trocar a senha.");
    }

    if(password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if(!checkOldPassword) {
        throw new AppError("Senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]);

      return response.status(200).json();
    
  }
}

module.exports = UserController;
