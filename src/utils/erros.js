function novoErro(message,status){
    let erro = new Error(message)
    erro.status = status
    throw erro
}

module.exports = novoErro