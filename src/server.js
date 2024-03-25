const express = require("express")
const app = express()
const { resolve } = require("path")
const dotnev = require("dotenv").config({ path: resolve(__dirname + "../") })
const cors = require("cors")
const bodyParser = require("body-parser")

// variaveis de ambiente

const port = process.env.PORT

//Config de middlewares

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(port, () => console.log("Server listen on : " + port))