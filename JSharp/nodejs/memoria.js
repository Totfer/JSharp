var memoria ={ memori:[],
    posicion:0,
    tamanoMaximo:64000000,
    tamano:0
}
monticulo = require("./monticulo/monticulo");

function insertar(tipo,dato,objeto){
    switch(tipo){
        case "string":
            let puntero = monticulo.monticulo.posicion;

            let caracter = {siguiente:'ultimo',caracter:0};
            monticulo.monticulo.lista.push(caracter);

            dato={tipo:'string',bytes:4,tamanoMaximo:2147483648+2147483647,puntero:puntero};           
        break;
        case "boolean":
            dato={tipo:'char',bytes:1,tamanoMaximo:255,tamanoMinimo:0,valor:0};
        break;
        case "char":
            dato={tipo:'char',bytes:1,tamanoMaximo:255,tamanoMinimo:0,valor:0};
        break;
        case "int":
            dato={tipo:'int',bytes:4,signo:'+',tamanoMaximo:2147483648,tamanoMinimo:2147483647,valor:0};
        break;   
        case "double":
            dato={tipo:'double',bytes:8,signo:'+',tamanoMaximo:9223372036854775800,tamanoMinimo:9223372036854775800,valor:0};
    break;   
    }

    objeto.tamano += dato.bytes;

    if(objeto.tamano>objeto.tamanoMaximo){
        //colocar error 
        return;
    }

   // objeto.memori.push(dato);
    objeto.posicion++;
    return objeto
}

function asignar(tipo,valor,objeto){
    var dato;
    switch(tipo){
        case "string":
            let puntero =  DIVIDIR_STRING(valor);
            monticulo.monticulo.lista.push(caracter);
            dato={tipo:'string',bytes:4,tamanoMaximo:2147483648+2147483647,puntero:puntero};           
        break;
        case "boolean":
            dato={tipo:'char',bytes:1,tamanoMaximo:255,tamanoMinimo:0,valor:0};
        break;
        case "char":
            dato={tipo:'char',bytes:1,tamanoMaximo:255,tamanoMinimo:0,valor:0};
        break;
        case "int":
            dato={tipo:'int',bytes:4,signo:'+',tamanoMaximo:2147483648,tamanoMinimo:2147483647,valor:0};
        break;   
        case "double":
            dato={tipo:'double',bytes:8,signo:'+',tamanoMaximo:9223372036854775800,tamanoMinimo:9223372036854775800,valor:0};
    break;   
    }

    objeto.tamano += dato.bytes;

    if(objeto.tamano>objeto.tamanoMaximo){
        //colocar error 
        return;
    }

    objeto.memori.push(dato);
    objeto.posicion++;
    return objeto
}



exports.insertar = insertar;
exports.memoria = memoria;



//0
// a b
//a
//1
//a.s=2
//b=2;