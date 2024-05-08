const nodemailer = require("nodemailer");
const { resolve } = require("path")
const dotenv = require("dotenv").config({ path: resolve(__dirname, "../", "../", ".env") })
const { Sequelize } = require("sequelize");
// const { pesquisaTodosAlunos } = require("./alunoController");
// const { pesquisarTodosFuncionarios } = require("./funcionarioController");
const { gerarToken } = require("../utils/jwt");

// Configura a rota do emaill

console.log(process.env.PASS_AUTH_SMTP)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_AUTH_SMTP,
        pass: process.env.PASS_AUTH_SMTP,
    },
});

// Função para enviar email
async function enviarEmail(emailPara, emailCopia, titulo, corpoHtml) {
    console.log(new Date().toLocaleTimeString())

    const info = await transporter.sendMail({
        from: process.env.USER_AUTH_SMTP,
        to: emailPara,
        cc: emailCopia,
        subject: titulo,
        html: corpoHtml // Conteudo do email,
    })
    console.log(new Date().toLocaleTimeString())

    return info

}

function recuperarSenha(email) {

    return new Promise(async (resolve, reject) => {

        try {
            const emailRedefinicao = email

            // Cria conexão com o banco
            const sequelize = new Sequelize({
                database: process.env.database_name,
                username: process.env.database_user_root, // dps atualizar para o login funcionario
                password: process.env.database_password_root, // dps atualizar para o senha funcionario
                host: process.env.database_host,
                dialect: 'mysql'
            });

            const usuario = await procurarUsuarioPeloEmail(emailRedefinicao, sequelize)

            const token = gerarToken(emailRedefinicao, usuario.nome, "15m")

            await atualizarTokenUsuario(usuario[0], token, sequelize)

            await enviarEmail(email, "", "Recuperação de Senha AAPM", `<h1>Clique para atualizar sua senha: <a href="http://teste/${token}" >Aqui</a> </h1> `)
                .then((r) => {
                    if (!!r.accepted[0] == true) {
                        resolve(r.accepted[0])
                    }
                    else {
                        reject("Email não encontrado ou inválido.")
                    }
                })
        } catch (error) {
            reject(error)
        }
    })

}

function procurarUsuarioPeloEmail(email, sequelize) {

    return new Promise(async (resolve, rejetc) => {

        const resultadoEmaiAluno = await sequelize.query("select * from todos_alunos where email = ?", {
            replacements: [email],
            type: sequelize.QueryTypes.SELECT
        })

        let resultadoEmailFuncionario = ""

        if (!!resultadoEmaiAluno[0] == false) {
            resultadoEmailFuncionario = await sequelize.query("select * from todos_funcionarios where email = ?", {
                replacements: [email],
                type: sequelize.QueryTypes.SELECT
            })
        }

        if (!!resultadoEmaiAluno[0] == false && !!resultadoEmailFuncionario[0] == false) {
            rejetc({errMsg:"Email não encontrado", "email": email})
        }

        !!resultadoEmaiAluno[0] == true ? resolve(resultadoEmaiAluno) : resolve(resultadoEmailFuncionario)

    })
}

function atualizarTokenUsuario(usuario, token, sequelize) {

    return new Promise(async (resolve, rejetc) => {

        try {

            await sequelize.query("call logar_aluno (?,?)", {
                replacements: [usuario.id_aluno, token],
                type: sequelize.QueryTypes.UPDATE
            })
        }
        catch {
            await sequelize.query("call logar_funcionario (?,?)", {
                replacements: [usuario.NIF, token],
                type: sequelize.QueryTypes.UPDATE
            })
        }

        resolve("Logado com sucesso")

    })
}

async function recuperarMultiplasSenhas(listaEmail){

    const listaEmailEnviado = []
    const listaEmailErro = []
    const listaEmailMockada = ["mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com","mvfs8001@gmail.com","marcossantos8002@gmail.com","markito8003@gmail.com"]

    const listaPromise = listaEmailMockada.map((email) => recuperarSenha(email) )

    await Promise.all(listaPromise)
    .then((r)=>{
        console.log("Resposta: ", r)
        listaEmailEnviado.push(r)
    })
    .catch((e) =>{
        listaEmailErro.push(e)
    })

    const response = {listaEmailEnviado,listaEmailErro}
    console.log(response)
}

// enviarEmail("mvfs8001@gmail.com", "", "salve", "Terminar o back hj né dog.")


recuperarMultiplasSenhas()
// recuperarSenha("marcossantos8002@gmail.com")
//     .then((r) => console.log(r))
//     .catch((e) => console.log(e))
// enviarEmail("laiza0700@gmail.com","","KKKKKKKKKKKKKKKKKKKKKKKKKKK","NE")