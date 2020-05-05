class tablaSimbolos {
    simbolos = [];

    insertar = function insertar(simbolo) {
        for (let i = 0; i < this.simbolos.length; i++) {
            if (this.simbolos[i].nombre == simbolo.nombre &&
                this.simbolos[i].idAmbito == simbolo.idAmbito) {
                return 'error'
            }
        }
        this.simbolos.push(simbolo);
        return ''
    }

    //-----------------------------------------------------------

    obtenerPosicionHeap = function obtenerPosicionHeap(nombre, idAmbito) {

        for (let i = 0; i < this.simbolos.length; i++) {
            if (this.simbolos[i].nombre == nombre &&
                this.simbolos[i].idAmbito == idAmbito) {
                return this.simbolos[i].posicionH
            }
        }
        let padres = []
        for (let i = 0; i < this.simbolos.length; i++) {
            if (this.simbolos[i].idAmbito == idAmbito) {
                padres = this.simbolos[i].padre
            }
        }

        while(padres.length != 0){
            idAmbito = padres.pop();
            for (let i = 0; i < this.simbolos.length; i++) {
                if (this.simbolos[i].nombre == nombre &&
                    this.simbolos[i].idAmbito == idAmbito) {
                    
                    return this.simbolos[i].posicionH
                }
            }
        }

        return 'error'
    }

    obtenerSimbolo = function obtenerSimbolo(nombre, idAmbito) {
        for (let i = 0; i < this.simbolos.length; i++) {
            if (this.simbolos[i].nombre == nombre &&
                this.simbolos[i].idAmbito == idAmbito) {
                return this.simbolos[i]
            }
        }
        let padres = []
        for (let i = 0; i < this.simbolos.length; i++) {
            if (this.simbolos[i].idAmbito == idAmbito) {
                
                for (let j = 0; j < this.simbolos[i].padre.length; j++) {
                padres.push(this.simbolos[i].padre[j])
                }
            }
        }

        while(padres.length != 0){
            idAmbito = padres.pop();
            for (let i = 0; i < this.simbolos.length; i++) {
                if (this.simbolos[i].nombre == nombre &&
                    this.simbolos[i].idAmbito == idAmbito) {
                    
                    return this.simbolos[i]
                }
            }
        }
        return 'error'
    }

} exports.tablaSimbolos = tablaSimbolos

class simbolo {
    constructor(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) {
        this.nombre = p1;
        this.tipo = p2;
        this.padre = p3;
        this.idAmbito = p4;
        this.posicionH = p5;
        this.posicionS = p6;
        this.tamano = p7;
        this.tipoSH = p8;
        this.funcionaldad = p9;
        this.constante = p10;
    }
} exports.simbolo = simbolo
