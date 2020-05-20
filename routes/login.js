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
            'SELECT * FROM login;',
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
            'SELECT * FROM login WHERE id = ?;',
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
            'INSERT INTO login (email, senha, idCliente) values (?,?,?)',
            [req.body.email, req.body.senha, req.body.idCliente],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Login inserido " + resultado.insertId,
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
            `UPDATE login
            SET  email = ?, 
            senha = ?, 
            idCliente = ?
            WHERE id = ?`,
            [req.body.email, req.body.senha, req.body.idCliente, req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(202).send({
                    mensagem: "Login alterado com sucesso ",
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
            `DELETE FROM login WHERE id = ?`,
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
                    mensagem: "Login removido com sucesso",
                })
            }
        )
    })
})

module.exports = router;