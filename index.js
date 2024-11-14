var express = require('express');
var path = require('path');
var usuarioRoutes = require('./routes/usuarios');
var productoRoutes = require('./routes/productos');
var promocionesRoutes = require('./routes/promociones');


var session = require('cookie-session');

require('dotenv').config();


var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  name:'session',
  keys:['kajdshf786ADS'],
  maxAge: 24 * 60 * 60 * 1000
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/web', express.static(path.join(__dirname, 'web')));
app.use(express.urlencoded({ extended: true }));


app.use('/', usuarioRoutes);
app.use('/', productoRoutes);
app.use('/', promocionesRoutes);





var port = process.env.PORT || 3043;

app.listen(port, () => {
  console.log('Servidor en http://localhost:' + port);
});
