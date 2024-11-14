var conexion=require("./conexion").conexionUsuarios;
var {encriptarPassword, validarPassword}=require("../middlewares/password");
var Usuario=require("../models/user");


async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexion.get();
        usuarios.forEach(usuario => {    
            var user=new Usuario(usuario.id, usuario.data());
            if (user.bandera==0){
                users.push(user.obtenerDatos);
            }
        });
     }
    catch(err){
        console.log("Error al recuperar usuarios de la BD "+err);
    }
    return users;
}



async function buscarPorID(id) {
    if (typeof id !== 'string' || id.trim() === '') {
        console.log("ID invalida: ", id);
        return null;
    }

    console.log("Firestore Path: ", `Path: usuarios/${id}`); 

    var user;
    try {
        var usuario = await conexion.doc(id).get();
        
        if (!usuario.exists) {
            console.log("Usuario no encontrado por ID:", id);
            return null;
        }
        
        var usuarioObjeto = new Usuario(usuario.id, usuario.data());
        if (usuarioObjeto.bandera == 0) {
            user = usuarioObjeto.obtenerDatos;
        }
    } catch (err) {
        console.log("Error al recuperar al usuario Funcion Buscar por id: " + err);
    }
    return user;
}



async function nuevoUsuario(datos){
    console.log(datos.password[0]);
    var {hash, salt}=encriptarPassword(datos.password[0]);
    datos.password=hash;
    datos.salt=salt;
    console.log(datos);
    var user=new Usuario(null,datos);
    var error=1;
    if (user.bandera==0){
        try{
            await conexion.doc().set(user.obtenerDatos);
            console.log("Usuario insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar el nuevo usuario "+err);
        }
    }
    return error;
}

async function modificarUsuario(datos) {
    var error = 1;
    var respuestaBuscar = await buscarPorID(datos.id);

    if (respuestaBuscar !== undefined) {
        // Check if the password field is empty (corrected comparison)
        if (datos.password === "") {
            // Keep the old password and salt if no new password is provided
            datos.password = datos.passwordViejo;
            datos.salt = datos.saltViejo;
        } else {
            // Encrypt the new password
            var { salt, hash } = encriptarPassword(datos.password);
            datos.password = hash;
            datos.salt = salt;
        }

        // Create a new user object with the updated data
        var user = new Usuario(datos.id, datos);

        if (user.bandera === 0) {
            try {
                // Update the user in the Firestore database
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Usuario actualizado");
                error = 0; // Indicate success
            } catch (err) {
                console.log("Error al modificar al usuario: " + err);
            }
        }
    }

    return error;
}


async function borrarUsario(id){
    var error=1;
    var user=await buscarPorID(id);
    if (user!=undefined){
        try{
            await conexion.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        }
        catch(err){
            console.log("Error al borrar al usuario "+err);
        }
    }
    return error;
}
async function login(datos, req, res) {
    let usuarioObjeto;
    try {
        const usuarios = await conexion.where('usuario', '==', datos.usuario).get();
        if (usuarios.docs.length === 0) {
            console.log("Usuario no encontrado.");
            return undefined;
        }

        for (let doc of usuarios.docs) {
            console.log("Datos del documento:", doc.data());
            const hashAlmacenado = doc.data().password;
            const saltAlmacenado = doc.data().salt;

            console.log("Contraseña proporcionada:", datos.password);
            const validar = validarPassword(datos.password, hashAlmacenado, saltAlmacenado);
            if (validar) {
                usuarioObjeto = new Usuario(doc.id, doc.data());
                if (usuarioObjeto.bandera === 0) {
                    const user = usuarioObjeto.obtenerDatos;

                    // Almacena los datos en la sesión
                    req.session.usuario = user.usuario;
                    req.session.rol = user.rol;

                    console.log("Login exitoso. Datos del usuario:", user);
                    return user;
                }
            } else {
                console.log("Contraseña incorrecta para el usuario:", datos.usuario);
            }
        }
    } catch (err) {
        console.log("Error al recuperar al usuario:", err);
    }
    return undefined;
}






module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsario,
    login,
    
}

mostrarUsuarios();