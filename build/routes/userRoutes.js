"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/signup', userController_1.userController.signUp);
        this.router.post('/login', userController_1.userController.login);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
