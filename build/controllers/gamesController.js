"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesController = void 0;
const database_1 = __importDefault(require("../database"));
class GamesController {
    list(req, res) {
        database_1.default.query('SELECT * FROM games', (err, games, fields) => {
            if (err)
                throw err;
            res.json({ games: games });
        });
    }
    getOne(req, res) {
        const { id } = req.params;
        database_1.default.query('SELECT * FROM games WHERE id = ?', [id], (err, game, fields) => {
            if (err)
                throw err;
            if (game.length > 0) {
                return res.json({ game: game[0] });
            }
            res.status(404).json({ text: "The game doesn't exist" });
        });
    }
    create(req, res) {
        database_1.default.query('INSERT INTO games SET ?', [req.body], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
    update(req, res) {
        const { id } = req.params;
        database_1.default.query('UPDATE games SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
    delete(req, res) {
        const { id } = req.params;
        database_1.default.query('DELETE FROM games WHERE id = ?', [id], (err, results, fields) => {
            if (err)
                throw err;
            res.json({ result: results });
        });
    }
}
exports.gamesController = new GamesController();
