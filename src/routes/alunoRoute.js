const router = require("express").Router()
const { loginAluno } = require("../controller/controllerAluno")
const novoErro = require("../utils/erros")
const { alunoLoginValidacao } = require("../utils/validacao")

//Rota de login
router.post("", async (req, res) => {

    try {
        const {email, senha } = req.body
      
        const aluno = {email,senha}
        console.log(aluno)
        
        const alunoValidado = alunoLoginValidacao.parse(aluno)
        console.log("sim: ",alunoValidado)

        const response = await loginAluno(aluno)
        !!response == true
        ?res.status(200).json(response)
        :res.status(400).json("Usuario ou senha inválidos")
    }
    catch(err){
        const status = err.status?? 500 
        const msg = err.issues ?? err.message 
        res.status(status).json(msg)
    }
})

module.exports = router