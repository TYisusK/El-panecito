var conexion = require("./conexion").conexionProductos;
var Producto = require("../models/product");

// Mostrar todos los productos
async function mostrarProductos() {
    var productos = [];
    try {
        var datosProductos = await conexion.get();
        datosProductos.forEach(productoDoc => {
            var producto = new Producto(productoDoc.id, productoDoc.data());
            if (producto.bandera == 0) {
                productos.push(producto.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al recuperar productos de la BD: " + err);
    }
    return productos;
}

// Buscar producto por ID
async function buscarProductoPorID(id) {
    if (typeof id !== 'string' || id.trim() === '') {
        console.log("ID inválida: ", id);
        return null;
    }

    console.log("Firestore Path: ", `Path: productos/${id}`);

    var producto;
    try {
        var productoDoc = await conexion.doc(id).get();
        if (!productoDoc.exists) {
            console.log("Producto no encontrado por ID:", id);
            return null;
        }

        var productoObjeto = new Producto(productoDoc.id, productoDoc.data());
        if (productoObjeto.bandera == 0) {
            producto = productoObjeto.obtenerDatos;
        }
    } catch (err) {
        console.log("Error al recuperar el producto (Buscar por ID): " + err);
    }
    return producto;
}

// Agregar nuevo producto
async function nuevoProducto(datos) {
    var producto = new Producto(null, datos);
    var error = 1;
    if (producto.bandera == 0) {
        try {
            await conexion.doc().set(producto.obtenerDatos);
            console.log("Producto insertado a la BD");
            error = 0;
        } catch (err) {
            console.log("Error al capturar el nuevo producto: " + err);
        }
    }
    return error;
}

// Modificar producto existente
async function modificarProducto(datos) {
    var error = 1;
    var productoExistente = await buscarProductoPorID(datos.id);

    if (productoExistente !== undefined) {
        var producto = new Producto(datos.id, datos);

        if (producto.bandera == 0) {
            try {
                await conexion.doc(producto.id).set(producto.obtenerDatos);
                console.log("Producto actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar el producto: " + err);
            }
        }
    }

    return error;
}

// Borrar producto por ID
async function borrarProducto(id) {
    var error = 1;
    var producto = await buscarProductoPorID(id);
    if (producto != undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Producto borrado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar el producto: " + err);
        }
    }
    return error;
}


// Mostrar productos en el carrito
async function mostrarCarrito(carrito) {
    var productosCarrito = [];
    try {
        for (let id of carrito) {
            let producto = await buscarProductoPorID(id);
            if (producto) {
                productosCarrito.push(producto);
            }
        }
    } catch (err) {
        console.log("Error al recuperar productos del carrito: " + err);
    }
    return productosCarrito;
}

// Agregar producto al carrito
async function agregarProductoAlCarrito(carrito, idProducto) {
    try {
        let producto = await buscarProductoPorID(idProducto);
        if (producto) {
            carrito.push(idProducto); // Agregar el ID del producto al carrito
        }
    } catch (err) {
        console.log("Error al agregar producto al carrito: " + err);
    }
    return carrito;
}

// Eliminar producto del carrito
async function eliminarProductoDelCarrito(carrito, idProducto) {
    try {
        const index = carrito.indexOf(idProducto);
        if (index > -1) {
            carrito.splice(index, 1); // Eliminar el ID del producto del carrito
        }
    } catch (err) {
        console.log("Error al eliminar producto del carrito: " + err);
    }
    return carrito;
}

module.exports = {
    mostrarProductos,
    buscarProductoPorID,
    nuevoProducto,
    modificarProducto,
    borrarProducto,
    agregarProductoAlCarrito,
    mostrarCarrito,
    eliminarProductoDelCarrito
};
