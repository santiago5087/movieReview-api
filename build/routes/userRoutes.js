"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../authenticate");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/signup', userController_1.userController.signUp);
        this.router.post('/login', userController_1.userController.login);
        this.router.get('/checkToken', userController_1.userController.checkJWT);
        this.router.put('/changePass', authenticate_1.verifyUser, userController_1.userController.changePassword);
        this.router.put('/updateProfile', authenticate_1.verifyUser, userController_1.userController.updateProfile);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
