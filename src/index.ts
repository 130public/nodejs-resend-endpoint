import { Resend } from 'resend';
import express, { Request, Response } from 'express';
import cors from 'cors';

const helmet = require('helmet');
const morgan = require('morgan');

const env = require("dotenv").config();
const port = process.env.PORT || 8080;


// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// parse JSON bodies into JS objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enabling CORS for all requests
const whitelist = ['http://developer1.com', 'http://developer2.com'];

const options: cors.CorsOptions = {
    optionsSuccessStatus: 200,
    origin: ['http:example.com'],
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    allowedHeaders: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    credentials: true
}
app.use(cors(options));


// // adding morgan to log HTTP requests
app.use(morgan('combined'));


// ENDPOINTS
app.get("/", (_req: Request, res: Response) => {
  console.info("GET /no-cors");
  res.json({
    text: "You should not see this via a CORS request."
  });
});

app.head("/ping", cors(), (_req: Request, res: Response) => {
  console.info("HEAD /simple-cors");
  res.sendStatus(204);
});
app.get('/ping', cors(), (_req: Request, res: Response) => {
  res.json('pong 🏓')
})

app.get('/api/test/get', (request: Request, response: Response) => {
  response.send({
      body: 'test',
      key: process.env.RESEND_API_KEY
  })

});

app.post('/api/test/post', (request: Request, response: Response) => {
  response.send({
    query: request.query,
    body: request.body,
    key: process.env.RESEND_API_KEY
  })
});

app.post('/api/email', (request: Request, response: Response) => {

  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = request.body;

  (async function() {
    try {
      const data = await resend.emails.send({
        from: `${body.firstname} ${body.lastname} <${process.env.SERVERADMIN_EMAIL}>`,
        to: [ `${process.env.CONTACT_RECIPIENT_EMAIL}` ],
        subject: `Website contact from  ${body.firstname} ${body.lastname}`,
        html: `<strong>${body.subject}</strong><br/>${body.message}<br/><br/>${body.firstname} ${body.lastname}<br/>${body.from}`
      });

      response.send({ status: response.status, statusCode: response.statusCode, statusMessage: response.statusMessage,  body:request.body, data: data })
    } catch (error) {
      response.send({ status: response.status, statusCode: response.statusCode, statusMessage: response.statusMessage, body:request.body, error: error})
    }
  })();

});

app.listen(port, () => {
  console.log(`Application is running on port ${port}.`);
});

module.exports = app