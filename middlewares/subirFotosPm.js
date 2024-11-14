const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Importamos la función v4 de uuid

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/promociones/"); // Directorio de destino para las fotos de promociones
  },
  filename: function (req, file, cb) {
    const productName = req.body.nombre || "promocion";  // Nombre de la promoción o un valor predeterminado
    const timestamp = Date.now();  // Fecha y hora actuales para garantizar unicidad
    const fileExtension = path.extname(file.originalname).toLowerCase(); // Obtenemos la extensión del archivo
    
    // Generar un UUID único para cada archivo
    const uniqueId = uuidv4();

    // Creamos el nombre de archivo con el UUID y la extensión
    const filename = `${productName}-${uniqueId}${fileExtension}`;
    
    cb(null, filename); // Asignamos el nombre de archivo generado
  },
});

const subirArchivoPromocion = multer({ storage: storage });

module.exports = subirArchivoPromocion;
