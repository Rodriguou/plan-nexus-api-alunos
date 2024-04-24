function criarReserva(reserva, sequelize) {

    return new Promise((resolve, reject) => {
        try {
            const { fk_aluno, fk_produto, quantidade, dataRetirada:retirada } = reserva

            sequelize.query("call criar_reserva(?,?,?,?)", {
                replacements: [fk_aluno, fk_produto, quantidade, retirada],
                type: sequelize.QueryTypes.INSERT
            })

                .then((r) => { resolve(r) })
                .catch((e) => { reject(e) })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = { criarReserva }