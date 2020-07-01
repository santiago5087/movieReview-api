"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authenticate_1 = require("../authenticate");
class ReviewRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', reviewController_1.reviewController.getReviews);
        this.router.get('/:id', authenticate_1.verifyUser, reviewController_1.reviewController.getReview);
        this.router.post('/', authenticate_1.verifyUser, reviewController_1.reviewController.createReview);
        this.router.put('/:id', authenticate_1.verifyUser, reviewController_1.reviewController.updateReview);
        this.router.delete('/:id', authenticate_1.verifyUser, reviewController_1.reviewController.deleteReview);
    }
}
let reviewRoutes = new ReviewRoutes();
exports.default = reviewRoutes.router;
