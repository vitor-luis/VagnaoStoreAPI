const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM enderecoentrega;',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                return res.status(200).send({
                    response: resultado
                })
            }
        )
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM enderecoentrega WHERE id = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                return res.status(200).send({
                    response: resultado
                })
            }
        )
    })
})

router.post('/', (req, res) => {

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'INSERT INTO enderecoentrega (rua, numero, bairro, cidade, estado, cep, complemento, idCliente ) values (?,?,?,?,?,?,?,?)',
            [req.body.rua, req.body.numero, req.body.bairro, req.body.cidade, req.body.estado, req.body.cep, req.body.complemento, req.body.idCliente],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Endereço de entrega inserido " + resultado.insertId,
                })
            }
        )
    })


})

router.put('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `UPDATE enderecoentrega
            SET  rua = ?, 
            numero = ?, 
            bairro = ?, 
            cidade = ?, 
            estado = ?, 
            cep = ?, 
            complemento = ?, 
            idCliente = ?
            WHERE id = ?`,
            [req.body.rua, req.body.numero, req.body.bairro, req.body.cidade, req.body.estado, req.body.cep, req.body.complemento, req.body.idCliente, req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: "Endereço de entrega alterado com sucesso ",
                })
            }
        )
    })
})

router.delete('/:id', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `DELETE FROM enderecoentrega WHERE id = ?`,
            [req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                res.status(202).send({
                    mensagem: "Endereço de entrega removido com sucesso",
                })
            }
        )
    })
})

module.exports = router;