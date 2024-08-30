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

// CORS
const options: cors.CorsOptions = {
    optionsSuccessStatus: 200,
    origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
    methods: process.env.ACCESS_CONTROL_ALLOW_METHODS,
    allowedHeaders: process.env.ACCESS_CONTROL_ALLOW_HEADERS,
    credentials: true
}
app.use(cors(options));


// // adding morgan to log HTTP requests
app.use(morgan('combined'));


// ENDPOINTS
app.get('/', (request: Request, response: Response) => {
  return response.send('API server')
})

app.get('/ping', (request: Request, response: Response) => {
  return response.send('pong 🏓')
})

app.post('/api/email', (request: Request, response: Response) => {

  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = request.body;

  (async function() {
    try {
      const data = await resend.emails.send({
        from: `${body.firstname} ${body.lastname} <${process.env.SERVERADMIN_EMAIL}>`,
        to: [ `${process.env.CONTACT_RECIPIENT_EMAIL}` ],
        reply_to: `${body.from}`,
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