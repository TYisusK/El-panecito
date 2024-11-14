var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var {verificarAdmin, verificarSesion}= require("../middlewares/credenciales")
var { nuevoUsuario, mostrarUsuarios, modificarUsuario, borrarUsario, buscarPorID, login}=require("../database/usuarios");
require('dotenv').config();
// Middleware para asignar variables de sesión a res.locals
ruta.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    res.locals.rol = req.session.rol;
    next();
});


ruta.get("/login",(req,res)=>{
    res.render("usuarios/login");
});


ruta.post("/login", async (req, res) => {
    var user = await login(req.body, req, res); // Pasa req y res a la función login

    if (user == undefined) {
        res.redirect("/login"); // Si el usuario no es válido, redirige a la página de inicio o login
    } else {
        // Guarda tanto el usuario como el rol en la sesión
        req.session.usuario = user.usuario;
        req.session.rol = user.rol;

        // Redirige a la página de usuarios o página principal
        res.redirect("/administracion");
    }
});

ruta.get("/administracion",verificarSesion,verificarAdmin, async (req, res) => {
    res.render("usuarios/administracion");
});

ruta.get("/registrarse", async (req, res) => {
    res.render("usuarios/registrarse");
});
ruta.get("/registrarUsuario",verificarSesion, verificarAdmin, async (req, res) => {
    res.render("usuarios/agregarUsuario");
});

ruta.post("/nuevousuario", verificarSesion,verificarAdmin, subirArchivo(), async (req, res) => {
    const { clave_secreta, nombre, usuario, password, password_verificar, rol } = req.body;

    // Verificar que la clave secreta ingresada coincida con la clave en el archivo .env
    if (clave_secreta !== process.env.CLAVE_SECRETA) {
        // Renderiza la vista con un mensaje de error si la clave es incorrecta
        return res.render('usuarios/agregarUsuario', { error: 'La clave secreta es incorrecta' });
    }


    // Si la clave es correcta, continuar con el registro del usuario
    req.body.foto = req.file.originalname;
    
    var error = await nuevoUsuario(req.body);
    
    res.redirect("/usuarios");
});

// Ruta para mostrar usuarios con validación de clave
ruta.get("/usuarios",verificarSesion, verificarAdmin, async (req, res) => {

    
        var usuarios = await mostrarUsuarios();
        res.render("usuarios/users", { usuarios });
    
});

ruta.get("/editar/:id",verificarSesion, verificarAdmin,async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("usuarios/editar",{user});
});

ruta.post("/editar", verificarSesion,verificarAdmin, subirArchivo(), async (req, res) => {
    // If a new file is uploaded, use it, otherwise, keep the old one
    if (req.file != undefined) {
        req.body.foto = req.file.originalname;
    } else {
        req.body.foto = req.body.fotoVieja;
    }

    // Attempt to modify the user with the new data
    var error = await modificarUsuario(req.body);

    if (error) {
        console.error('Error modifying user:', error);
        return res.redirect("/editar"); // Redirect back to edit page on error
    }

   
    // Redirect back to the users list after successful modification
    res.redirect("/usuarios");
});


ruta.get("/borrar/:id", verificarSesion, verificarAdmin, async(req,res)=>{
    await borrarUsario(req.params.id);
    res.redirect("/usuarios");
});

ruta.get('/logout', (req, res) => {
    req.session = null; // Destruye la sesión
    res.redirect('/login'); // Redirige al usuario a la página de login
});




module.exports=ruta;