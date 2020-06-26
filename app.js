const express = require("express")
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

//declarando rotas
const rotaProdutos = require('./routes/produtos')
const rotaCategorias = require('./routes/categoria')
const rotaClientes = require('./routes/cliente')
const rotaEnderecoEntrega = require('./routes/enderecoEntrega')
const rotaItemVenda = require('./routes/itemVenda')
const rotaLogin = require('./routes/login')
const rotaVenda = require('./routes/venda')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    res.header("Cache-Control", "no-cache, no-store, must-revalidate");

    res.header("Pragma", "no-cache");

    res.header("Expires", 0);

    next()
})


//rotas
app.use('/produtos', rotaProdutos);
app.use('/categorias', rotaCategorias);
app.use('/clientes', rotaClientes)
app.use('/enderecoEntregas', rotaEnderecoEntrega)
app.use('/itemVendas', rotaItemVenda)
app.use('/login', rotaLogin)
app.use('/venda', rotaVenda)


app.use((req, res, next) => {
    const erro = new Error('Nao encontrado');
    erro.status = 404;
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})
module.exports = app;