const router = require("express").Router()
const { loginAluno, definirSenha } = require("../controller/controllerAluno")
const {tratarMensagensDeErro} = require("../utils/erros")
const { alunoLoginValidacao } = require("../utils/validacao")
const authMiddleware = require("../middleware/auth")


//Rota de login
router.post("/login", async (req, res) => {

    try {
        const {email, senha} = req.body
      
        const aluno = {email,senha}
        
        const alunoValidado = alunoLoginValidacao.parse(aluno)
        console.log("sim: ",alunoValidado)

        const response = await loginAluno(aluno)
        !!response == true
        ?res.status(200).json(response)
        :res.status(400).json("Usuario ou senha inválidos")
    }
    catch(err){
        const erroTratado = await tratarMensagensDeErro(err)
        res.status(erroTratado.status).json({ errMsg: erroTratado.message, "statusCode": erroTratado.status })
    }
})

router.use(authMiddleware)
router.patch("/definirSenha", async(req,res) =>{

    try{
        const token = req.headers.authorization.split(" ")[1]

        const {email, senha,} = req.body
        
        const aluno = {
            email,
            senha,
            token
        }

        const response = await definirSenha(aluno, req.sequelize)

        response[0] == 1
        ? res.status(200).json({ "msg": "Atualizado com sucesso", "statusCode": 200 })
        : res.status(400).json({ "msg": "Erro ao atualizar senha, verifique os campos.", "statusCode": 400 })


    }
    catch(err){
        const erroTratado = await tratarMensagensDeErro(err)
        res.status(erroTratado.status).json({ errMsg: erroTratado.message, "statusCode": erroTratado.status })
    }

})

module.exports = router