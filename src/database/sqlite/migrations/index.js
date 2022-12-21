  const sqliteConnection = require('../../sqlite')
  const createUsers = require('./CreateUsers')

  async function migrationRun(){
    const schema = [
      createUsers
    ].join('')

    return sqliteConnection().then( db => db.exec(schema)).catch(error => console.error(error))
  }

  module.exports = migrationRun