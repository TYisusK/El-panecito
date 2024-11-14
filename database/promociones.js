const Promocion = require("../models/promocion");
const conexion = require("../database/conexion").conexionPromociones; // Asegúrate de tener la conexión a la base de datos de promociones

// Mostrar todas las promociones
async function mostrarPromociones() {
  let promociones = [];
  try {
    const datosPromociones = await conexion.get(); // Obtiene todas las promociones de la BD
    datosPromociones.forEach(promocionDoc => {
      let promocion = new Promocion(promocionDoc.id, promocionDoc.data());
      promociones.push(promocion.obtenerDatos);
    });
  } catch (err) {
    console.log("Error al recuperar promociones: " + err);
  }
  return promociones;
}

// Buscar una promoción por ID
async function buscarPromocionPorID(id) {
  if (typeof id !== "string" || id.trim() === "") {
    console.log("ID inválida: ", id);
    return null;
  }

  let promocion;
  try {
    const promocionDoc = await conexion.doc(id).get();
    if (!promocionDoc.exists) {
      console.log("Promoción no encontrada por ID:", id);
      return null;
    }

    const promocionObjeto = new Promocion(promocionDoc.id, promocionDoc.data());
    promocion = promocionObjeto.obtenerDatos;
  } catch (err) {
    console.log("Error al recuperar la promoción (Buscar por ID): " + err);
  }
  return promocion;
}

// Agregar nueva promoción
async function nuevaPromocion(datos) {
  let error = 1;
  let promocion = new Promocion(null, datos);

  try {
    await conexion.doc().set(promocion.obtenerDatos); // Agregar la promoción a la base de datos
    console.log("Promoción insertada a la BD");
    error = 0;
  } catch (err) {
    console.log("Error al agregar la nueva promoción: " + err);
  }

  return error;
}

// Modificar promoción existente
async function modificarPromocion(datos) {
  let error = 1;
  let promocionExistente = await buscarPromocionPorID(datos.id);

  if (promocionExistente !== null) {
    let promocion = new Promocion(datos.id, datos);
    try {
      await conexion.doc(promocion.id).set(promocion.obtenerDatos); // Actualiza los datos de la promoción
      console.log("Promoción actualizada");
      error = 0;
    } catch (err) {
      console.log("Error al modificar la promoción: " + err);
    }
  }

  return error;
}

// Eliminar promoción
async function borrarPromocion(id) {
  let error = 1;
  let promocion = await buscarPromocionPorID(id);

  if (promocion != null) {
    try {
      await conexion.doc(id).delete(); // Borra la promoción de la BD
      console.log("Promoción eliminada");
      error = 0;
    } catch (err) {
      console.log("Error al borrar la promoción: " + err);
    }
  }

  return error;
}

module.exports = {
  mostrarPromociones,
  buscarPromocionPorID,
  nuevaPromocion,
  modificarPromocion,
  borrarPromocion,
};
