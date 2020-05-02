class tablaSimbolos {
    simbolos = [];
}exports.tablaSimbolos = tablaSimbolos

class simbolo {
    constructor(p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        nombre = p1;
        tipo = p2;
        padre = p3;
        idAmbito = p4;
        posicion = p5;
        tamano = p6;
        tipoSH = p7;
        funcionaldad = p8;
        constante = p9;
    }
}exports.simbolo = simbolo
