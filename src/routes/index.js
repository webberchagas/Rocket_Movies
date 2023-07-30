const { Router } = require('express');

const routes = Router();

const usersRoutes = require('./users.routes');
const notesRoutes = require('./notes.routes');
const tagsRoutes = require('./tags.routes');
const sessionsRoutes = require('./sessions.routes');

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/movies', notesRoutes);
routes.use('/tags', tagsRoutes);

module.exports = routes;