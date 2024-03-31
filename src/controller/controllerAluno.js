const alunoModel = require("../models/alunoModel")
const { gerarToken } = require("../utils/jwt")

function loginAluno(aluno) {


    return new Promise(async (resolve, reject) => {

        try {

            const { email, senha} = aluno

            // verifica se o usuario existe
            let usuario = await alunoModel.findOne({
                where: {
                    email,
                    senha
                }
            })

            // Caso o usuario não exista
            !!usuario == true
                ? usuario = usuario.dataValues
                : (() => { resolve(null) })()


                // Deolve os dados do usuario sem a senha
                let { senha: _ ,CPF:__ ,...resposta } = usuario

                //Gera o token para verificar se está logado
                resposta.token = gerarToken(resposta.email,resposta.nome,"12h")

                await alunoModel.update({
                    token: resposta.token
                },
                {
                    where:{
                        email
                    }
                })

                resolve(resposta)
        }
        catch (err) {
            // Se der algum erro inesperado no processo
            reject(err)
        }
    })


}

module.exports = { loginAluno }