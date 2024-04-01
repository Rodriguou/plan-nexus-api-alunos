const bcrypt = require('bcrypt');
const saltRounds = 10;

async function gerarHash(palavra){

    const hash = bcrypt.hashSync(palavra,saltRounds)
    return hash

}
 
async function compararHash(palavra,hash){

    const response =  bcrypt.compareSync(palavra,hash)
    return response
}

module.exports = {gerarHash, compararHash}