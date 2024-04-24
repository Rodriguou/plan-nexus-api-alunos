const sequelize = require("sequelize")
const authMiddleware = require("../middleware/auth")
const router = require("express").Router()
const {tratarMensagensDeErro} = require("../utils/erros")
const {criarReserva} = require("../controller/reservaController")


router.use(authMiddleware)
router.post("/criar", async(req, res) => {
    
    const {fk_aluno, fk_produto, quantidade} = req.body
    const dataRetirada = new Date(req.body.retirada)
    const reserva = {fk_aluno, fk_produto, quantidade, dataRetirada}

    try {
        const response = await criarReserva(reserva, req.sequelize)
        res.status(201).json({ "msg": `reserva criada: ${response}`, "statusCode": 201, "response": response })
    } catch (err) {
        const erroTratado = await tratarMensagensDeErro(err)
        res.status(erroTratado.status).json({ errMsg: erroTratado.message, "statusCode": erroTratado.status })
    }

})

module.exports = router