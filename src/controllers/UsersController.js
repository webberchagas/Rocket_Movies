const AppErro = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async create(request, response){
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = ?', [email])

    if(checkUserExists){
      throw new AppErro('Este e-mail já esta em uso')
    }

    const hashedPassword = await hash(password, 8)

    await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword])

    return response.status(201).json()
  }
    
  async update(request, response){
    const { name, email, password, old_password } = request.body
    const id = request.user.id

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = ?', [id])
    
    if(!user){  
      throw new AppErro('Usuário não existe!')
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = ?', [email])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppErro('Este e-mail já esta em uso!')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
      throw new AppErro('Por favor, informe a senha antiga!')
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword){
        throw new AppErro('A senha antiga esta errada, digite a corretamente!')
      }

      user.password = await hash(password, 8)
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now') 
    WHERE id = ?
    `, [user.name, user.email, user.password, id])

    return response.json()  
  }
}

module.exports = UsersController