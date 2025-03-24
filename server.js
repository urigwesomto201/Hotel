const express = require('express');
require('dotenv').config();  // Make sure environment variables are loaded
require('./config/database');
const userRouter = require('./routes/userRouter');
const categoryRouter = require('./routes/categoryRouter');
const roomRouter = require("./routes/roomRoutes");
const PORT = process.env.PORT || 2030; // Use a fallback value for PORT
const secret = process.env.EXPRESS_SECRET; // Ensure this is defined in .env
const app = express();
const session = require('express-session');
const passport = require('passport');
require('./middlewares/passport');
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUIEXPRESS = require('swagger-ui-express');

app.use(express.json());

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Swagger Definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My First Swagger Documentation',
    version: '1.0.0',
    description: 'This is the first Swagger documentation I have ever done.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Strange',
      url: 'https://www.linkedin.com/in/urigwe-somto/',
    },
  },
  "components": {
 "securitySchemes": {
    "BearerAuth": {
      "type": 'http',
      "scheme": 'bearer',
      "bearerFormat": 'JWT',
    },
  },
},
security: [
  {
    bearerAuth: [],
  },
],
  servers: [
    {
      url: 'http://localhost:2030',
      description: 'Development server',
    },
    {
      url: 'http://localhost:8000',
      description: 'Production server',
    },
  ],


};


// Swagger Options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Adjust this path based on your actual route files
};

const swaggerSpec = swaggerJSDOC(options);

// Swagger UI setup
app.use('/docs', swaggerUIEXPRESS.serve, swaggerUIEXPRESS.setup(swaggerSpec));

// Routes
app.use(userRouter);
app.use(categoryRouter);
app.use(roomRouter);

// Error handling (optional but useful for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server setup
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
