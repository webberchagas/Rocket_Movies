const { Router } = require('express')
const multer = require('multer');

const uploadsConfig = require('../config/upload');

const UsersController = require('../controllers/UsersController');
const UserAvatarController = require('../controllers/UserAvatarController');

const usersRoutes = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();


const upload = multer(uploadsConfig.MULTER);
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarController.update);
usersRoutes.post('/', usersController.create);
usersRoutes.put('/:id', ensureAuthenticated, usersController.update);

module.exports = usersRoutes;