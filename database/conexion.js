var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});
var bd=admin.firestore();
var conexionUsuarios=bd.collection("usuarios");
var conexionProductos=bd.collection("productos");
var conexionPromociones=bd.collection("promociones")


module.exports={
    conexionUsuarios,
    conexionProductos,
    conexionPromociones
}