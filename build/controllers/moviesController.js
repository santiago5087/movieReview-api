"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moviesController = void 0;
const database_1 = __importDefault(require("../database"));
class MoviesController {
    list(req, res) {
        database_1.default.query('SELECT * FROM movies', (err, movies, fields) => {
            if (err)
                throw err;
            res.json(movies);
        });
    }
    getOne(req, res) {
        const { id } = req.params;
        database_1.default.query('SELECT * FROM movies WHERE id = ?', [id], (err, movie, fields) => {
            if (err)
                throw err;
            if (movie.length > 0) {
                return res.json(movie[0]);
            }
            res.status(404).json({ text: "The movie doesn't exist" });
        });
    }
    create(req, res) {
        database_1.default.query('INSERT INTO movies SET ?', [req.body], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
    update(req, res) {
        const { id } = req.params;
        database_1.default.query('UPDATE movies SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
    delete(req, res) {
        const { id } = req.params;
        database_1.default.query('DELETE FROM movies WHERE id = ?', [id], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
}
exports.moviesController = new MoviesController();
