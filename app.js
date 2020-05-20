const express = require("express")
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')

//declarando rotas
const rotaProdutos = require('./routes/produtos')
const rotaCategorias = require('./routes/categoria')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//rotas
app.use('/produtos', rotaProdutos);
app.use('/categorias', rotaCategorias);


app.use((req, res, next)=>{
    const erro = new Error('Nao encontrado');
    erro.status = 404;
    next(erro)
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;