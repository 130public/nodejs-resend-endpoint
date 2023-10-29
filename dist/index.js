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
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require("dotenv").config();
const port = process.env.PORT || 8080;
// defining the Express app
const app = (0, express_1.default)();
// adding Helmet to enhance your Rest API's security
app.use(helmet());
// // using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(express_1.default.urlencoded({ extended: true }));
// enabling CORS for all requests
var corsOptions = {
    optionsSuccessStatus: 200,
    origin: 'http://example.com',
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    headers: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    credentials: process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS
};
// // adding morgan to log HTTP requests
app.use(morgan('combined'));
// ENDPOINTS
app.get("/", (_req, res) => {
    console.info("GET /no-cors");
    res.json({
        text: "You should not see this via a CORS request."
    });
});
app.head("/ping", cors(), (_req, res) => {
    console.info("HEAD /simple-cors");
    res.sendStatus(204);
});
app.get('/ping', cors(), (_req, res) => {
    res.json('pong 🏓');
});
app.get('/api/test/get', (request, response) => {
    response.send({
        body: 'test',
        key: process.env.RESEND_API_KEY
    });
});
app.post('/api/test/post', (request, response) => {
    response.send({
        query: request.query,
        body: request.body,
        key: process.env.RESEND_API_KEY
    });
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