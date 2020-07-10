"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const database_1 = __importDefault(require("../database"));
class ReviewController {
    getReviews(req, res) {
        database_1.default.query('SELECT r.movieTitle as movieTitle, r.movieYear as movieYear, r.movieGenre as movieGenre, r.moviePlot as moviePlot, r.moviePoster as moviePoster, r.movieRating as movieRating, r.created_at as created_at, r.type as type, r.review as review, u.username as username, u.profilePicture as profilePicture, r.userRating as userRating FROM reviews r JOIN users u ON r.username=u.username', (err, reviews, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ err });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, result: reviews });
            }
        });
    }
    getReview(req, res) {
        const { id } = req.params;
        database_1.default.query('SELECT * FROM reviews WHERE id = ?', [id], (err, review, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ err });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, result: review });
            }
        });
    }
    createReview(req, res) {
        let user = req.user;
        let review = {
            movieTitle: req.body.movieTitle,
            movieYear: req.body.movieYear,
            movieGenre: req.body.movieGenre,
            moviePlot: req.body.moviePlot,
            moviePoster: req.body.moviePoster,
            movieRating: req.body.movieRating,
            userRating: req.body.userRating,
            type: req.body.type,
            review: req.body.review,
            username: user.username
        };
        database_1.default.query('INSERT INTO reviews SET ?', [review], (err, results, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, err });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, result: results });
            }
        });
    }
    getUserReview(req, res) {
        let user = req.user;
        database_1.default.query('SELECT * FROM reviews WHERE username = ?', [user.username], (err, results, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, err });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, result: results });
            }
        });
    }
    updateReview(req, res) {
        const { id } = req.params;
        database_1.default.query('UPDATE reviews SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, err });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, result: results });
            }
        });
    }
    deleteReview(req, res) {
        const { id } = req.params;
        database_1.default.query('DELETE FROM reviews WHERE id = ?', [id], (err, results, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, err });
            }
            else {
                let user = req.user;
                database_1.default.query('SELECT * FROM reviews WHERE username = ?', [user.username], (err, results, fields) => {
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(401).json({ success: false, err });
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({ success: true, result: results });
                    }
                });
            }
        });
    }
}
exports.reviewController = new ReviewController();
