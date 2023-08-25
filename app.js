import express from "express"
import bodyParser from "body-parser"

import configureRoutes from "./routes"
import ErrorMiddleware from "./middlewares/ErrorMiddleware"
import { PORT } from "./config"

const cors = require("cors")
const app = express()
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})

configureRoutes(app)

app.use(cors());
app.use(ErrorMiddleware)
app.listen(PORT,() => {
  console.log(`app is listening to port 5000`);
})
