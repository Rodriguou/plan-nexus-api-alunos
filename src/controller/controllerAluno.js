const alunoModel = require("../models/alunoModel")
const { compararHash, gerarHash } = require("../utils/bcrypt")
const { gerarToken } = require("../utils/jwt")
const {Sequelize} = require("sequelize")

function loginAluno(aluno) {

    return new Promise(async (resolve, reject) => {

        try {

            const { email, senha } = aluno

            const sequelize_login = new Sequelize({
                database: process.env.database_name,
                username: process.env.database_user_root, // dps atualizar para o login aluno
                password: process.env.database_password_root, // dps atualizar para o senha aluno
                host: process.env.database_host,
                dialect: 'mysql'
            })

            // verifica se o usuario existe
            let usuario = await alunoModel(sequelize_login).findOne({
                where: {
                    email
                }
            })

            // Caso o usuario não exista
            !!usuario == true
                ? usuario = usuario.dataValues
                : (() => { resolve(null) })()

            //Confirma se o hash da senha está certo.
            const confirmarSenha = await compararHash(aluno.senha, usuario.senha)

            if (!confirmarSenha) {
                resolve(null)
            }

            // Deolve os dados do usuario sem a senha
            let { senha: _, CPF: __, ...resposta } = usuario

            //Gera o token para verificar se está logado
            resposta.token = gerarToken(resposta.email, resposta.nome, "12h")

            await alunoModel(sequelize_login).update({
                token: resposta.token
            },
                {
                    where: {
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

function definirSenha(aluno, sequelize) {

    return new Promise(async (resolve, reject) => {

        try {
            const senha = await gerarHash(aluno.senha)
            const token = aluno.token
            const email = aluno.email

            alunoModel(sequelize).update(
                {
                    senha
                },
                {
                    where: {
                        email,
                        token
                    }
                }
            )
            .then((r) => resolve(r))
            .catch((e) => reject(e))
        }

        catch (err) {
            reject(err)

        }
    })
}

module.exports = { loginAluno, definirSenha }