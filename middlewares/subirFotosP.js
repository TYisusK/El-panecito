const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Importamos la función v4 de uuid

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/productos/"); // Cambia el directorio de destino según tu configuración
  },
  filename: function (req, file, cb) {
    const productName = req.body.nombre;  // Nombre del producto, lo toma del cuerpo de la solicitud
    const timestamp = Date.now();  // Fecha y hora actuales para garantizar unicidad
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Obtenemos la extensión de la imagen
    
    // Generar un UUID único para cada archivo
    const uniqueId = uuidv4();

    // Creamos el nombre de archivo con el UUID, el nombre del producto y la extensión
    const filename = `${productName}-${uniqueId}${fileExtension}`;
    
    cb(null, filename); // Asignamos el nombre de archivo generado
  },
});

const subirArchivoP = multer({ storage: storage });

module.exports = subirArchivoP; // Asegúrate de exportarlo correctamente para usarlo en la ruta correspondiente
