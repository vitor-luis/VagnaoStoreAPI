const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `SELECT cliente.*, login.email FROM cliente INNER JOIN login ON cliente.idLogin = login.id where login.isAdmin = 1`,
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Login recuperados com sucesso', data: resultado })
            }
        )
    })
})

router.get('/:email', (req, res) => {
    const email = req.params.email;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT cliente.*, login.email, login.senha FROM cliente INNER JOIN login ON cliente.idLogin = login.id WHERE email like ?;',
            [email],
            (error, resultado, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                res.status(200).json({ message: 'Login recuperado com sucesso', data: resultado })
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
            'INSERT INTO login (email, senha, isAdmin) values (?,?,?)',
            [req.body.email, req.body.senha , req.body.isAdmin],
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
                    data: resultado.insertId
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
            isAdmin = ?
            WHERE id = ?`,
            [req.body.email, req.body.senha, req.body.isAdmin, req.params.id],
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

router.post('/logar', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        const query = `select * from login where email = ?`
        conn.query(query, [req.body.email], (error, resultado, fields) =>{
            conn.release();
            if(error){
                return res.status(500).send({mensagem: 'Falha na autenticação'})
            }
            if(resultado.length < 1){
                return res.status(401).send({mensagem: 'Falha na autenticação'})
            }else{
                if(req.body.senha == resultado[0].senha){
                    let token = jwt.sign({
                        id: resultado[0].id,
                        email: resultado[0].email,
                        isAdmin: resultado[0].isAdmin
                    }, process.env.JWT_KEY,{
                        expiresIn: "24h"
                    })
                    return res.status(200).send({mensagem: 'Autenticado com sucesso', token: token})
                }else{
                    return res.status(401).send({mensagem: 'Falha na autenticação'})
                }
            }
        })
    })
})

module.exports = router;