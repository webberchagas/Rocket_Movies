require('express-async-errors')
const AppErro = require('./utils/AppError')
const migrationRun = require('./database/sqlite/migrations')

const express = require('express')
const routes = require('./routes')

migrationRun()

const app = express()
app.use(express.json())

app.use(routes)

app.use((error, request, response, next) => {
    if(error instanceof AppErro){
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message 
      })
    }

    console.log(error)

    return response.statusCode(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
)

const PORT = 3000
app.listen(PORT, () => {console.log(`Server is running PORT ${PORT}`)})