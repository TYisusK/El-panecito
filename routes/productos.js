const express = require("express");
const ruta = express.Router();
const subirArchivoP = require("../middlewares/subirFotosP"); // Middleware para la carga de archivos
const {agregarProductoAlCarrito, eliminarProductoDelCarrito ,mostrarCarrito ,mostrarProductos, nuevoProducto, modificarProducto, borrarProducto, buscarProductoPorID  } = require("../database/productos");
var {verificarAdmin, verificarSesion}= require("../middlewares/credenciales")

ruta.use((req, res, next) => {
    res.locals.usuario = req.session.usuario;
    res.locals.rol = req.session.rol;
    next();
});

// Mostrar lista de productos
ruta.get("/productos", verificarSesion, verificarAdmin, async (req, res) => {
    const productos = await mostrarProductos();
    res.render("productos/adminProductos", { productos });
});

// Ruta para mostrar los detalles individuales de un producto
ruta.get("/producto/:id", async (req, res) => {
    const producto = await buscarProductoPorID(req.params.id); // Buscar producto por ID
    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }
    res.render("productos/producto", { producto }); // Renderizar vista de detalle del producto
});

// Mostrar a clientes

ruta.get("/", async (req, res) => {
    const productos = await mostrarProductos();
    res.render("productos/productos", { productos });
});


ruta.get("/nosotros", async (req, res) => {
    res.render("productos/acercade");
});
// Formulario para agregar nuevo producto
ruta.get("/altaProducto", verificarSesion, verificarAdmin,(req, res) => {
    res.render("productos/altaProducto");
});

// Modificar la ruta POST para agregar un producto con múltiples fotos
ruta.post("/producto/nuevo", subirArchivoP.array('fotos', 3),verificarSesion, verificarAdmin, async (req, res) => {
    if (req.files) {
        // Asegúrate de que el nombre del producto esté presente en el cuerpo de la solicitud
        const productName = req.body.productName; // El nombre del producto debe venir en el cuerpo de la solicitud

        // Asignar los nuevos nombres de las fotos basadas en la lógica del middleware
        req.body.fotos = req.files.map(file => file.filename); // Usamos 'filename' en lugar de 'originalname' para los nuevos nombres

        // Aquí va la lógica para guardar el nuevo producto en la base de datos
        await nuevoProducto(req.body); // Asegúrate de que 'nuevoProducto' sea una función que maneje correctamente el producto y las fotos
    }
    res.redirect("/productos"); // Redirigir después de agregar el producto
});

ruta.get("/producto/editar/:id", verificarSesion, verificarAdmin, async (req, res) => {
    const producto = await buscarProductoPorID(req.params.id);
    if (!producto) {
        return res.status(404).send("Producto no encontrado");
    }
    res.render("productos/modificarProductos", { producto });
});

ruta.post("/producto/editar/:id", subirArchivoP.array('fotos', 3),verificarSesion, verificarAdmin, async (req, res) => {
    // Verificamos que el 'id' esté presente en req.body
    if (!req.body.id) {
        return res.status(400).send("ID del producto no proporcionado.");
    }

    // Si se subieron nuevas fotos, usa las nuevas; si no, mantén las fotos viejas
    if (req.files && req.files.length > 0) {
        req.body.fotos = req.files.map(file => file.filename);
    } else {
        req.body.fotos = req.body.fotosViejas.split(','); // Usar las fotos viejas
    }

    // Llamar a la función para modificar el producto
    await modificarProducto(req.body);
    res.redirect("/productos");
});

// Eliminar producto
ruta.get("/producto/eliminar/:id",verificarSesion, verificarAdmin, async (req, res) => {
    await borrarProducto(req.params.id);
    res.redirect("/productos");
});

ruta.get("/carrito", async (req, res) => {
    const carrito = req.session.carrito || []; // Asumiendo que el carrito se almacena en la sesión
    const productosCarrito = await mostrarCarrito(carrito); // Obtenemos los productos
    res.render("productos/carrito", { productosCarrito });
});


// Ruta para agregar un producto al carrito
ruta.post("/carrito/agregar/:id", async (req, res) => {
    const idProducto = req.params.id;
    let carrito = req.session.carrito || []; // Recuperar carrito de la sesión
    carrito = await agregarProductoAlCarrito(carrito, idProducto);
    req.session.carrito = carrito; // Guardar el carrito en la sesión
    res.redirect("/carrito");
});

// Ruta para eliminar un producto del carrito
ruta.get("/carrito/eliminar/:id", async (req, res) => {
    const idProducto = req.params.id;
    let carrito = req.session.carrito || []; // Recuperar carrito de la sesión
    carrito = await eliminarProductoDelCarrito(carrito, idProducto);
    req.session.carrito = carrito; // Guardar el carrito actualizado en la sesión
    res.redirect("/carrito");
});

ruta.post("/carrito/actualizar", async (req, res) => {
    let carrito = req.session.carrito || [];

    // Recorrer los productos del carrito y actualizar las cantidades
    carrito = carrito.map(producto => {
        const nuevaCantidad = req.body[`cantidad_${producto.id}`]; // Obtener la nueva cantidad enviada desde el formulario
        if (nuevaCantidad) {
            producto.cantidad = parseInt(nuevaCantidad);
        }
        return producto;
    });

    req.session.carrito = carrito; // Guardar el carrito actualizado en la sesión
    res.redirect("/carrito"); // Redirigir de nuevo a la vista del carrito
});

module.exports = ruta;
