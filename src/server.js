const express = require("express")
const app = express()
const { resolve } = require("path")
const dotnev = require("dotenv").config({ path: resolve(__dirname + "../") })
const cors = require("cors")
const bodyParser = require("body-parser")

//Import das rotas
const alunoRota = require("./routes/alunoRoute")
const reservaRota = require("./routes/reservaRoute")

// variaveis de ambiente

const port = process.env.PORT || 3334

//Config de middlewares

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rotas

app.use("/aluno",alunoRota)
app.use("/reserva", reservaRota)

// Rota para teste
app.get("/", (req, res) => {
    res.send("Backend is up and running!");
});

app.listen(port, () => console.log("Server listen on : " + port))