function verificarSesion(req, res, next) {
    if (req.session && req.session.usuario) {
        next();
    } else {
        res.redirect('/login');
    }
}

function verificarAdmin(req, res, next) {
    console.log(req.session); // Verificar qué contiene la sesión
    // Convertir el rol a cadena para comparar de forma consistente
    if (req.session && String(req.session.rol) === '1') {
        next();
    } else {
        res.render('templates/noAuto', { mensaje: 'Acceso no autorizado' });
    }
}

module.exports = {
    verificarSesion,
    verificarAdmin
};
