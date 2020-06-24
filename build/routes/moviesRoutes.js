"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moviesController_1 = require("../controllers/moviesController");
class MoviesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', moviesController_1.moviesController.list);
        this.router.get('/:id', moviesController_1.moviesController.getOne);
        this.router.post('/', moviesController_1.moviesController.create);
        this.router.put('/:id', moviesController_1.moviesController.update);
        this.router.delete('/:id', moviesController_1.moviesController.delete);
    }
}
const moviesRoutes = new MoviesRoutes();
exports.default = moviesRoutes.router;
