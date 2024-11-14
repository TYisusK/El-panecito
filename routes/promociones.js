const express = require("express");
const ruta = express.Router();
const subirArchivoPromocion = require("../middlewares/subirFotosPm");
const { mostrarPromociones, nuevaPromocion, modificarPromocion, borrarPromocion, buscarPromocionPorID } = require("../database/promociones");
var {verificarAdmin, verificarSesion}= require("../middlewares/credenciales")

ruta.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  res.locals.rol = req.session.rol;
  next();
});

// Mostrar todas las promociones
ruta.get("/promociones", verificarSesion, verificarAdmin, async (req, res) => {
  const promociones = await mostrarPromociones();
  res.render("promociones/adminPromociones", { promociones });
});

// Formulario para agregar una nueva promoción
ruta.get("/promociones/nueva", verificarSesion, verificarAdmin, (req, res) => {
  res.render("promociones/altaPromociones");
});

ruta.get("/promociones/:id", async (req, res) => {
  const promocion = await buscarPromocionPorID(req.params.id);
  if (promocion) {
    res.render("promociones/promocion", { promocion });
  } else {
    res.redirect("/promocionesD");  // Si no existe la promoción, redirigir a la lista de promociones
  }
});



// Mostrar todas las promociones al cliente
ruta.get("/promocionesD", async (req, res) => {
    const promociones = await mostrarPromociones();
    res.render("promociones/promocionesD", { promociones });
});
// Agregar nueva promoción con fotos
ruta.post("/promociones/nueva", subirArchivoPromocion.array("fotos", 5),verificarSesion, verificarAdmin, async (req, res) => {
  if (req.files) {
    req.body.fotos = req.files.map(file => file.filename); // Obtener los nombres de las fotos subidas
  }
  const resultado = await nuevaPromocion(req.body);
  res.redirect("/promociones");
});

// Ver detalles de una promoción para editar
ruta.get("/promociones/editar/:id", verificarSesion, verificarAdmin, async (req, res) => {
  const promocion = await buscarPromocionPorID(req.params.id);
  res.render("promociones/editarPromociones", { promocion });
});

// Editar promoción existente
ruta.post("/promociones/editar/:id", subirArchivoPromocion.array("fotos", 5), verificarSesion, verificarAdmin, async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.fotos = req.files.map(file => file.filename); // Reemplazar fotos viejas por las nuevas
  } else {
    req.body.fotos = req.body.fotosViejas; // Conservar las fotos viejas si no hay nuevas
  }
  const resultado = await modificarPromocion(req.body);
  res.redirect("/promociones");
});

// Eliminar promoción
ruta.get("/promociones/eliminar/:id", verificarSesion, verificarAdmin, async (req, res) => {
  await borrarPromocion(req.params.id);
  res.redirect("/promociones");
});

module.exports = ruta;
