class Usuario{
    constructor(id, data){
       //console.log("Datos de la contrasena"+data.usuario);
        //console.log(data.admin);
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre;
        this.usuario=data.usuario;
        this.password=data.password;
        this.rol=data.rol;
        this.salt=data.salt;
        this.foto=data.foto;
        
       
    }
    set id(id){
        if(id!=null)
            id.length>0?this._id=id:this.bandera=1;
    }
    set nombre(nombre){
        nombre.length>0?this._nombre=nombre:this.bandera=1;
        
    }
    set password(password){
        this._password=password;
        
    }
    set rol(rol){
        this._rol=rol;
    }
    set usuario(usuario){
        this._usuario=usuario;
        
    }
    set foto(foto){
        this._foto=foto;
    }
   set salt(salt){
        this._salt=salt;
    }
       
  
    
    get id(){
        return this._id;
    }
    get nombre(){
        return this._nombre;
    }
    get usuario(){
        return this._usuario;
    }
    get password(){
        return this._password;
    }
    get rol(){
        return this._rol;
    }
    get salt(){
        return this._salt;
    }
    get foto(){
        return this._foto;
    }

    get obtenerDatos(){
        if(this._id!=null)
            return {
                id:this.id,
                nombre:this.nombre,
                usuario:this.usuario,
                password:this.password,
                rol:this.rol,
                salt:this.salt,
                foto:this.foto,
                
            }
        else{
            return {
                nombre:this.nombre,
                usuario:this.usuario,
                password:this.password,
                rol:this.rol,
                salt:this.salt,
                foto:this.foto,
             
            }
        }
    }
}
module.exports=Usuario;