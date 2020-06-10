"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamesController = void 0;
const database_1 = __importDefault(require("../database"));
class GamesController {
    index(req, res) {
        database_1.default.query('DESCEIBE games;');
        res.json({ test: "test" });
    }
}
exports.gamesController = new GamesController();
