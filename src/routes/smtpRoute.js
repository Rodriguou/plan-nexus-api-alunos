const { definirMultiplasSenhas } = require("../controller/smtpController")
const {tratarMensagensDeErro} = require("../utils/erros")

const router = require("express").Router()

router.post("/primeiraSenha/multiplos", async(req, res) => {
    {
        try {
            const listaEmail = req.body.listaEmail
            const response = await definirMultiplasSenhas(listaEmail)
            res.status(200).json({ "msg": "Ação realizada com sucesso", "statusCode": 200, "response": response })

        }
        catch (err) {
            const erroTratado = await tratarMensagensDeErro(err)
            res.status(erroTratado.status).json({ errMsg: erroTratado.message, "statusCode": erroTratado.status })
        }

    }
})

module.exports = router