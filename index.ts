import { Resend } from 'resend';
import express, { Request, Response } from 'express';


const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require("dotenv").config();
const port = process.env.PORT || 8080;


// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// // using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// enabling CORS for all requests
var corsOptions = {
    optionsSuccessStatus: 200,
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    headers: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    credentials: process.env.ACCESS_CONTROL_ALLOW_CREDENTIALS
}
app.use(cors(corsOptions));

// // adding morgan to log HTTP requests
app.use(morgan('combined'));


// ENDPOINTS
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