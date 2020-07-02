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
            'SELECT * FROM itemvenda;',
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Itens da venda recuperado com sucesso', data: resultado })
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
            'SELECT * FROM itemvenda WHERE id = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Item da venda recuperado com sucesso', data: resultado })
            }
        )
    })
})

router.get('/produtos/:id', (req, res) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM itemvenda WHERE idProduto = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Item da venda recuperado com sucesso', data: resultado })
            }
        )
    })
})

router.get('/venda/:id', (req, res) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM itemvenda WHERE idVenda = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Itens da venda recuperado com sucesso', data: resultado })
            }
        )
    })
})

router.get('/produto/:id', (req, res) => {
    const id = req.params.id;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT produto.nome, produto.preco, itemvenda.* FROM itemvenda INNER JOIN produto on produto.id = itemvenda.idProduto WHERE itemvenda.idVenda = ?;',
            [id],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Itens da venda recuperado com sucesso', data: resultado })
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
            'INSERT INTO itemvenda (idProduto, idVenda, quantidade, total) values (?,?,?,?)',
            [req.body.idProduto, req.body.idVenda, req.body.quantidade, req.body.total],
            (error, resultado, field) => {
                conn.release();

                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Item da venda inserido " + resultado.insertId,
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
            `UPDATE itemvenda
            SET  idProduto = ?, 
            idVenda = ?, 
            quantidade = ?, 
            total = ?
            WHERE id = ?`,
            [req.body.idProduto, req.body.idVenda, req.body.quantidade, req.body.total, req.params.id],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                res.status(202).send({
                    mensagem: "Item da venda alterado com sucesso ",
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
            `DELETE FROM itemvenda WHERE id = ?`,
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
                    mensagem: "Item da venda removido com sucesso",
                })
            }
        )
    })
})

module.exports = router;