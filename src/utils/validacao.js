const { z, string } = require("zod");

const alunoLoginValidacao = z.object({
    email: z.string().email("Email inválido."),
    senha: z.string().min(1)
})

module.exports = {alunoLoginValidacao}