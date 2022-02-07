const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const io = require('socket.io')(server);
const mercadopago = require('mercadopago');

/*
* MERCADO PAGO CONFIGUARCION
*/
mercadopago.configure({
    access_token: 'TEST-6028900970379574-062302-e3e5d11b7871ee742832e6351694608f-191014229'
});

/*
* SOCKETS
*/
const orderDeliverySocket = require('./sockets/orders_delivery_socket');

/*
* INICIALIZAR FIREBASE ADMIN
*/
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer({
    storage: multer.memoryStorage()
})


/*
* RUTAS
*/
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');

const port = process.env.port || 3030;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

orderDeliverySocket(io);

users(app, upload);
categories(app);
address(app);
orders(app);
products(app, upload);
mercadoPagoRoutes(app);
var ip = require("ip");



server.listen(port, '0.0.0.0', () => {
    console.log(ip.address());
    console.log('Application on PORT ' + port + ' successfull...');
});

// ERROR 
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}
