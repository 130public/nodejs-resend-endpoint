"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet = require('helmet');
const morgan = require('morgan');
const env = require("dotenv").config();
const port = process.env.PORT || 8080;
// defining the Express app
const app = (0, express_1.default)();
// adding Helmet to enhance your Rest API's security
app.use(helmet());
// parse JSON bodies into JS objects
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS
const options = {
    optionsSuccessStatus: 200,
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN.split(','),
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    allowedHeaders: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    credentials: true
};
app.use((0, cors_1.default)(options));
// // adding morgan to log HTTP requests
app.use(morgan('combined'));
// ENDPOINTS
app.get('/', (request, response) => {
    return response.send('API server');
});
app.get('/ping', (request, response) => {
    return response.send('pong 🏓');
});
app.post('/api/email', (request, response) => {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    const body = request.body;
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield resend.emails.send({
                    from: `${body.firstname} ${body.lastname} <${process.env.SERVERADMIN_EMAIL}>`,
                    to: [`${process.env.CONTACT_RECIPIENT_EMAIL}`],
                    subject: `Website contact from  ${body.firstname} ${body.lastname}`,
                    html: `<strong>${body.subject}</strong><br/>${body.message}<br/><br/>${body.firstname} ${body.lastname}<br/>${body.from}`
                });
                response.send({ status: response.status, statusCode: response.statusCode, statusMessage: response.statusMessage, body: request.body, data: data });
            }
            catch (error) {
                response.send({ status: response.status, statusCode: response.statusCode, statusMessage: response.statusMessage, body: request.body, error: error });
            }
        });
    })();
});
app.listen(port, () => {
    console.log(`Application is running on port ${port}.`);
});
module.exports = app;
//# sourceMappingURL=index.js.map