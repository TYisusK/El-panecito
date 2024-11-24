function verificarSesion(req, res, next) {
    if (req.session && req.session.usuario) {
        next();
    } else {
        res.redirect('/login');
    }
}

function verificarAdmin(req, res, next) {
    console.log(req.session); // Verificar qué contiene la sesión
    if (req.session (req.session.rol) == "1") {
        next();
    } else {
        res.render('templates/noAuto', { mensaje: 'Acceso no autorizado' });
    }
}

module.exports = {
    verificarSesion,
    verificarAdmin
};
