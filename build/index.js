"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const moviesRoutes_1 = __importDefault(require("./routes/moviesRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json()); // parsea application/json request bodies (reemplaza bodyparser)
        this.app.use(express_1.default.urlencoded({ extended: false }));
        // parsea x-ww-form-urlencoded request bodies (reemplaza bodyparser) 
        // extended: true -> soporta nested objects, con extended: false no. 
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/movies', moviesRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
