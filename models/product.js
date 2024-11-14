class Producto {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.nombre = data.nombre;
        this.precio = data.precio;
        this.descripcion = data.descripcion;
        this.visible = data.visible;
        this.categoria = data.categoria;
        this.fotos = data.fotos || []; // Ahora es un array
    }

    set id(id) {
        if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }

    set nombre(nombre) {
        nombre.length > 0 ? (this._nombre = nombre) : (this.bandera = 1);
    }

    set precio(precio) {
        precio.length > 0 ? (this._precio = precio) : (this.bandera = 1);
    }

    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }

    set visible(visible) {
        this._visible = visible;
    }

    set fotos(fotos) {
        if (Array.isArray(fotos) && fotos.length <= 3) {
            this._fotos = fotos;
        } else {
            this.bandera = 1;
        }
    }

    set categoria(categoria) {
        this._categoria = categoria;
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get precio() {
        return this._precio;
    }

    get descripcion() {
        return this._descripcion;
    }

    get visible() {
        return this._visible;
    }

    get categoria() {
        return this._categoria;
    }

    get fotos() {
        return this._fotos;
    }

    get obtenerDatos() {
        const datos = {
            nombre: this.nombre,
            precio: this.precio,
            descripcion: this.descripcion,
            visible: this.visible,
            categoria: this.categoria,
            fotos: this.fotos, // Regresar el array de fotos
        };

        if (this._id != null) {
            datos.id = this.id;
        }

        return datos;
    }
}

module.exports = Producto;
