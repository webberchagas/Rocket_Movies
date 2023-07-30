const { Router } = require('express')

const NotesController = require('../controllers/NotesController')

const notesRoutes = Router()

const notesController = new NotesController()

const ensureAuthenticated = require('../middleware/ensureAuthenticated');

notesRoutes.use(ensureAuthenticated)

notesRoutes.get('/', notesController.index)
notesRoutes.post('/:user_id', notesController.create)
notesRoutes.delete('/:id', notesController.delete)
notesRoutes.get('/:id', notesController.show)

module.exports = notesRoutes