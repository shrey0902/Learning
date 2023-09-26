const UserRoutes = require('express').Router();
const UserController = require('./../controllers/user_controller');

// public Routes
UserRoutes.post("/sign-up", UserController.signUp);
UserRoutes.post("/sign-in", UserController.signIn);

module.exports = UserRoutes;