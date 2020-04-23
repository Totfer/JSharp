
var monticulo = { lista : [0,0],
    posicion:0
}

exports.monticulo = monticulo;



function UNIR_STRING(ptr1,ptr2){

}



function DIVIDIR_STRING(cadena){
    var puntero=0;
    for(var i=0;i<cadena.length;i++){
        let caracter;
        if(i==cadena.length-1){
            caracter = {siguiente:'ultimo',caracter:cadena[i].charCodeAt(0)};
        }
        else{
            caracter = {siguiente:monticulo.posicion+1,caracter:cadena[i].charCodeAt(0)};
        }
        if(i==0){
            puntero = monticulo.posicion;
        }
    
        monticulo.lista.push(caracter);
        monticulo.posicion+=1;
    }
    return puntero;
}

function GENERAR_SRT_3D(cadena,contT){
    var retorno='t'+contT+'=k;\n';
    var temp = cadena.split('\"');
   
    for(var i=0;i<temp.length;i++){
        cadena = cadena.replace('\"','');
    }

    for(var i=0;i<cadena.length;i++){
        retorno += 'heap[k]='+cadena.charCodeAt(i)+';\n';
        retorno += 'k=k+1;\n';        
    }
    retorno += 'heap[k]=0;\n';
    retorno += 'k=k+1;\n';        
    
    return retorno;
}exports.GENERAR_SRT_3D =GENERAR_SRT_3D;


exports.DIVIDIR_STRING = DIVIDIR_STRING;

function PREPARAR_STRING(cadena){


    return [];
}