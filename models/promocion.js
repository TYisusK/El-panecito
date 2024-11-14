class Promocion {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.titulo = data.titulo,
        this.descripcion = data.descripcion;
        this.fechaInicio = data.fechaInicio;
        this.fechaFinal = data.fechaFinal;
        this.descuento = data.descuento;
        this.visible = data.visible;
        this.fotos = data.fotos || []; // Array para las fotos de la promoción
    }

    set titulo(titulo) {
        titulo.length > 0 ? (this._titulo = titulo) : (this.bandera = 1);
    }

    set id(id) {
        if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }

    set descripcion(descripcion) {
        descripcion.length > 0 ? (this._descripcion = descripcion) : (this.bandera = 1);
    }

    set fechaInicio(fechaInicio) {
        this._fechaInicio = fechaInicio;
    }

    set fechaFinal(fechaFinal) {
        this._fechaFinal = fechaFinal;
    }

    set descuento(descuento) {
        descuento.length > 0 ? (this._descuento = descuento) : (this.bandera = 1);
    }

    set visible(visible) {
        this._visible = visible;
    }

    set fotos(fotos) {
        if (Array.isArray(fotos) && fotos.length <= 5) { // Hasta 5 fotos
            this._fotos = fotos;
        } else {
            this.bandera = 1;
        }
    }

    get id() {
        return this._id;
    }

    get titulo() {
        return this._titulo;
    }

    get descripcion() {
        return this._descripcion;
    }

    get fechaInicio() {
        return this._fechaInicio;
    }

    get fechaFinal() {
        return this._fechaFinal;
    }

    get descuento() {
        return this._descuento;
    }

    get visible() {
        return this._visible;
    }

    get fotos() {
        return this._fotos;
    }

    get obtenerDatos() {
        const datos = {
            titulo: this.titulo,
            descripcion: this.descripcion,
            fechaInicio: this.fechaInicio,
            fechaFinal: this.fechaFinal,
            descuento: this.descuento, // Manejado como texto
            visible: this.visible,
            fotos: this.fotos, // Array de fotos
        };

        if (this._id != null) {
            datos.id = this.id;
        }

        return datos;
    }
}

module.exports = Promocion;
