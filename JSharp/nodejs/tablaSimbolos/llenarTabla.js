const fs = require('fs');
var tablaSimbolos = [];

exports.tablaSimbolos=tablaSimbolos;


let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};

function iniciarRecorrido(actual){
    listaClases(actual.hijos[0]);
}
exports.iniciarRecorrido = iniciarRecorrido;

function listaClases(actual){
    let ambito = 0;
    for(var i=0;i<actual.hijos.length;i++){
        ambito = CLASE(actual.hijos[i],ambito);
        ambito++;
    }
    tablaSimbolos.push(0);
    console.log(ambito);
}

function CLASE(actual,ambito){
    if(actual.hijos.length==4){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0,compilar:actual};

        contenido.nombre = actual.hijos[2].nombre;
        contenido.tipo = 'sin tipo';
        contenido.rol = 'clase';
        contenido.ambito = ambito;
        contenido.ambitoPadre = 0;

        for(var i=0;i<actual.hijos.length;i++){
            switch(actual.hijos[i].nombre){
                case 'modificadores':
                    for(var j=0;j<actual.hijos[i].hijos.length;j++){
                        switch(actual.hijos[i].hijos[j].nombre){
                            case 'public':
                            contenido.acceso = 'public';
                            break;
                            case 'private':
                            contenido.acceso = 'private';
                            break;
                            case 'protected':
                            contenido.acceso = 'protected';
                            break
                            case 'static':
                            contenido.estatico = '1';
                            break
                        }
                    }
                    tablaSimbolos.push(contenido);    
                break
                case 'cuerpo':
                    ambito = CUERPO(actual.hijos[i],ambito,actual.hijos[2].nombre);
                break
            } 
        }
        return ambito;
    }
    else if(actual.hijos.length==5){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};

        contenido.nombre = actual.hijos[2].nombre;
        contenido.tipo = 'sin tipo';
        contenido.rol = 'clase';
        contenido.ambito = ambito;
        contenido.ambitoPadre = 0;

        for(var i=0;i<actual.hijos.length;i++){
            switch(actual.hijos[i].nombre){
                case 'modificadores':
                for(var j=0;j<actual.hijos[i].hijos.length;j++){
                    switch(actual.hijos[i].hijos[j].nombre){
                        case 'public':
                        contenido.acceso = 'public';
                        break;
                        case 'private':
                        contenido.acceso = 'private';
                        break;
                        case 'protected':
                        contenido.acceso = 'protected';
                        break
                        case 'static':
                        contenido.estatico = '1';
                        break
                    }
                } 
                break
                case 'cuerpo':
                    temp = CUERPO(actual.hijos[i],);
                break
            }
        }
    }
}

function importar(actual){
    var texto ='';
    var ruta =actual.hijos[0];
    ruta = ruta.replace("\"","");
    ruta = ruta.replace("\"","");
    fs.readFile(ruta,'utf-8',(error,datos)=>{
        if(error){
            throw error;
        }else{
            texto = datos;
        }
    });
    console.log(texto);
}

function CUERPO(actual,ambito,nombreClase){  
    let ambitoHijo = ambito+1;   
    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){
            case 'import':
            importar(actual.hijos[i]);
        }
    }
       
    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){
            case 'modificadores':
            break
            case 'variable clase':
                DECLARACION_VARIABLE_CLASE(actual.hijos[i],ambito,ambitoHijo,nombreClase);
            break;
            case 'declaracion metodo':
                ambitoHijo = DECLARACION_METODO(actual.hijos[i],ambito,ambitoHijo,nombreClase);
            break
            case 'declarador constructor':
                ambitoHijo = DECLARACION_Constructor(actual.hijos[i],ambito,ambitoHijo,nombreClase);
            break
            case 'declaracion objeto':
                DECLARACION_OBJETO2(actual.hijos[i],ambito,ambitoHijo,actual);
            break
        }
    }
    return ambitoHijo;
}


function DECLARACION_Constructor(actual,ambitoPadre,ambito,nombreClase){  
    let contenido = {nombre:actual.hijos[1].hijos[0].nombre,nombref:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0,clase:nombreClase,nParametros:0,constructor:'',constructorv:1,nodo:actual};
    
    var nombre = nombreClase+'_'+actual.hijos[1].hijos[0].nombre;
    var cont =0;
    for(var i=0;i<actual.hijos[1].hijos[1].hijos.length;i++){
        nombre += '_'+actual.hijos[1].hijos[1].hijos[i].hijos[0].nombre;
        contenido.parametros.push(actual.hijos[1].hijos[1].hijos[i].hijos[0].nombre);
        cont++;
    }

    contenido.nParametros = cont;
  
    contenido.nombre = nombre;
    contenido.tipo = 'constructor';
    contenido.rol = 'constructor';
    contenido.ambito = ambito; 
    contenido.ambitoPadre = ambitoPadre; 
    contenido.clase=nombreClase; 
  
    for(var i=0;i<actual.hijos[0].hijos[0].hijos.length;i++){
        switch(actual.hijos[0].hijos[0].hijos[i].nombre){
            case 'public':
            contenido.acceso = 'public';
            break;
            case 'private':
            contenido.acceso = 'private';
            break;
            case 'protected':
            contenido.acceso = 'protected';
            break
            case 'static':
            contenido.estaticos = '1';
            break
        }
    } 
    tablaSimbolos.push(contenido);

    let contenido2 = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    
    contenido2.nombre = '';
    contenido2.tipo = 'contenedor';
    contenido2.rol = '';
    contenido2.ambito = ambito+1;
    contenido2.ambitoPadre = ambito;
    tablaSimbolos.push(contenido2); 

    parametrosFormales(actual.hijos[1].hijos[1],ambito,ambito+1);


    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){  
            case 'sentencias':
                ambito = SENTENCIAS(actual.hijos[i],ambitoPadre,ambito);
            break;
        } 
    }
    return ambito;
}

function DECLARACION_METODO(actual,ambitoPadre,ambito,nombreClase){  
    let contenido = {nombre:actual.hijos[0].hijos[2].hijos[0].nombre,nombref:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0,clase:nombreClase,nParametros:0,constructor:'',constructorv:0,nodo:actual};
    
    var nombre = nombreClase+'_'+actual.hijos[0].hijos[1].nombre+'_'+actual.hijos[0].hijos[2].hijos[0].nombre;
    var nombre2 = nombreClase+'_'+actual.hijos[0].hijos[2].hijos[0].nombre;
    var cont =0;
    for(var i=0;i<actual.hijos[0].hijos[2].hijos[1].hijos.length;i++){
        nombre += '_'+actual.hijos[0].hijos[2].hijos[1].hijos[i].hijos[0].nombre;
        nombre2 += '_'+actual.hijos[0].hijos[2].hijos[1].hijos[i].hijos[0].nombre;
        contenido.parametros.push(actual.hijos[0].hijos[2].hijos[1].hijos[i].hijos[1].nombre);
        cont++;
    }
    
    for(var i=0;i<tablaSimbolos.length;i++){
        if(tablaSimbolos[i].rol=='clase'&&tablaSimbolos[i].nombre==actual.hijos[0].hijos[2].hijos[0].nombre){
            contenido.constructor = actual;
            contenido.constructorv = 1;
        }
    }

    contenido.nParametros = cont;
  
    contenido.nombre = nombre;
    contenido.nombre2 = nombre2;
    contenido.tipo = actual.hijos[0].hijos[1].nombre;
    contenido.rol = 'metodo';
    contenido.ambito = ambito; 
    contenido.ambitoPadre = ambitoPadre; 
    contenido.clase=nombreClase; 
  
    for(var i=0;i<actual.hijos[0].hijos[0].hijos.length;i++){
        switch(actual.hijos[0].hijos[0].hijos[i].nombre){
            case 'public':
            contenido.acceso = 'public';
            break;
            case 'private':
            contenido.acceso = 'private';
            break;
            case 'protected':
            contenido.acceso = 'protected';
            break
            case 'static':
            contenido.estaticos = '1';
            break
        }
    } 
    tablaSimbolos.push(contenido);

    let contenido2 = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    
    contenido2.nombre = '';
    contenido2.tipo = 'contenedor';
    contenido2.rol = '';
    contenido2.ambito = ambito+1;
    contenido2.ambitoPadre = ambito;
    tablaSimbolos.push(contenido2); 

    if(actual.hijos[0].hijos[1].nombre!='void'){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
        contenido.nombre = 'return';
        contenido.tipo = actual.hijos[1].nombre;
        contenido.rol = 'variable metodo';
        contenido.ambito = ambito+1;
        contenido.ambitoPadre = ambito;
        contenido.acceso = 'public'; 
        contenido.nombreF = nombre2;
        tablaSimbolos.push(contenido);   
    }  
    parametrosFormales(actual.hijos[0].hijos[2].hijos[1],ambito,ambito+1);

    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){  
            case 'sentencias':
                ambito = SENTENCIAS(actual.hijos[i],ambitoPadre,ambito);
            break;
        } 
    }
    return ambito;
}


function parametrosFormales(actual,ambitoPadre,ambito){
    for(var i=0;i<actual.hijos.length;i++){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
        contenido.nombre = actual.hijos[i].hijos[1].nombre;
        contenido.tipo = actual.hijos[i].hijos[0].nombre;
        contenido.rol = 'variable metodo';
        contenido.ambito = ambito;
        contenido.ambitoPadre = ambitoPadre;
        contenido.acceso = 'public'; 
        tablaSimbolos.push(contenido);         
    }
}

function SENTENCIAS(actual,ambitoPadre,ambito){
    let ambitoHijo = ambito+1;
    let ambitoRetorno = ambitoHijo;
    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){
            case 'ifs':
            ambitoRetorno = IF(actual.hijos[i],ambito,ambitoRetorno);
                
            break;
            case 'while':
            ambitoRetorno = WHILE(actual.hijos[i],ambito,ambitoRetorno);

                break;
            case 'do while':
            ambitoRetorno = DO_WHILE(actual.hijos[i],ambito,ambitoRetorno);
                
            break; 
            case 'for':
            ambitoRetorno = FOR(actual.hijos[i],ambito,ambitoRetorno);
                
            break; 
            case 'switch':
            ambitoRetorno = SWITCH(actual.hijos[i],ambito,ambitoRetorno);
                
            break; 
            case 'variable clase':
               DECLARACION_VARIABLE(actual.hijos[i],ambito,ambitoHijo);
            break; 
            case 'declaracion objeto':
               DECLARACION_OBJETO(actual.hijos[i],ambito,ambitoHijo);
            break; 
            case 'return':
               //Retorno(actual.hijos[i].hijos[0].nombre,ambito,ambitoHijo,tipo);
            break;
            
        }
    }
    return ambitoRetorno; 
}

function Retorno(tipo,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    
    contenido.nombre = 'return';
    contenido.tipo = tipo;
    contenido.rol = 'variable clase';
    contenido.ambito = ambito;
    contenido.ambitoPadre = ambitoPadre;

    tablaSimbolos.push(contenido);     
}

function IF(actual,ambitoPadre,ambito){
    if(actual.hijos.length==1){
        if(actual.hijos[0].hijos.length>2){
            return ELSE_IF_OP(actual,ambitoPadre,ambito); 
        }
        else{
            return IF_OP(actual,ambitoPadre,ambito);                 
        }
    }
    else if(actual.hijos.length==2){
        if(actual.hijos[0].hijos.length>2){
            return IFELSE_ELSE_OP(actual,ambitoPadre,ambito);
        }
        else{
            return IFELSE_OP(actual,ambitoPadre,ambito);
        }
    }
}

function IFELSE_OP(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);     
    ambito = SENTENCIAS(actual.hijos[0].hijos[1],ambitoPadre,ambito);

    let contenido2 = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};   
    contenido2.nombre = '';
    contenido2.tipo = 'contenedor';
    contenido2.rol = '';
    contenido2.ambito = ambito+1;
    contenido2.ambitoPadre = ambito;
    tablaSimbolos.push(contenido2);     

    ambito = SENTENCIAS(actual.hijos[1].hijos[0],ambitoPadre,ambito);
    return ambito;
}

function IF_OP(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);     
    return SENTENCIAS(actual.hijos[0].hijos[1],ambitoPadre,ambito);      
}

function ELSE_IF_OP(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);   
    ambito = SENTENCIAS(actual.hijos[0].hijos[1],ambitoPadre,ambito);

    for(var i=2;i<(actual.hijos[0].hijos.length);i++){
        ambito = ELSE_IF_OP2(actual.hijos[0].hijos[i],ambitoPadre,ambito);   
    } 
    return ambito;
}

function ELSE_IF_OP2(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);   
    return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
}

function WHILE(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);   
    return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);               
}

function DO_WHILE(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);   
    return SENTENCIAS(actual.hijos[0],ambitoPadre,ambito);             
}

function FOR(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);  
    
    if(actual.hijos[0].nombre=='variable clase'){
        DECLARACION_VARIABLE(actual.hijos[0],ambito,ambito+1)
    }

    return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
}

function SWITCH(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
 
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);   
    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        if(actual.hijos[1].hijos.length!=1){
            if(i != actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre=='default'){
                if(i==0){
                    ambito = CASO(3,actual.hijos[1].hijos[i],ambitoPadre,ambito);
                }else{
                    ambito = CASO(3,actual.hijos[1].hijos[i],ambitoPadre,ambito);   
                }    
            }
            else if(i==0&&actual.hijos[1].hijos[i].nombre!='default'){
                ambito = CASO(0,actual.hijos[1].hijos[i],ambitoPadre,ambito);
            }
            else if(i!=0&&i!=actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre!='default'){
                ambito = CASO(1,actual.hijos[1].hijos[i],ambitoPadre,ambito);   
            }
            else if(i==actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre!='default'){
                ambito = CASO(2,actual.hijos[1].hijos[i],ambitoPadre,ambito);
            }
            else if(i==actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre=='default'){
                ambito = CASO(3,actual.hijos[1].hijos[i],ambitoPadre,ambito);
            }
            else if(actual.hijos[1].hijos[i].nombre=='default'){
    
            }
        }
        else{
            if(actual.hijos[1].hijos[i].nombre=='default'){
                ambito = CASO(5,actual.hijos[1].hijos[i],ambitoPadre,ambito);
            }
            else{
                ambito = CASO(4,actual.hijos[1].hijos[i],ambitoPadre,ambito);
            }
        }
    }
    return ambito;
}

function CASO(tipo,actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    contenido.nombre = '';
    contenido.tipo = 'contenedor';
    contenido.rol = '';
    contenido.ambito = ambito+1;
    contenido.ambitoPadre = ambito;
    tablaSimbolos.push(contenido);     
    if(tipo == 0){
        return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
    }    
    if(tipo == 1){ 
        return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
    }
    if(tipo == 2){
        return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
    } 
    if(tipo == 3){
        return SENTENCIAS(actual.hijos[0],ambitoPadre,ambito);
    } 
    if(tipo == 4){
        return SENTENCIAS(actual.hijos[1],ambitoPadre,ambito);
    }  
    if(tipo == 5){
        return SENTENCIAS(actual.hijos[0],ambitoPadre,ambito);
    }   
}

function DECLARACION_OBJETO(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    contenido.nombre = actual.hijos[1].nombre;
    contenido.tipo = actual.hijos[0].nombre;
    contenido.rol = 'variable metodo';
    contenido.ambito = ambito;
    contenido.ambitoPadre = ambitoPadre;
    contenido.acceso = 'public';
    contenido.nodo = actual;
    contenido.variables =[];
    tablaSimbolos.push(contenido);
}

function DECLARACION_OBJETO2(actual,ambitoPadre,ambito,clase){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    contenido.nombre = actual.hijos[1].nombre;
    contenido.tipo = actual.hijos[0].nombre;
    contenido.rol = 'objeto clase';
    contenido.ambito = ambito;
    contenido.ambitoPadre = ambitoPadre;
    contenido.acceso = 'public';
    contenido.nodo = actual;
    contenido.compilar = clase;
    contenido.variables =[];
    tablaSimbolos.push(contenido);
}

function DECLARACION_VARIABLE(actual,ambitoPadre,ambito){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
    for(var i=0;i<actual.hijos[2].hijos.length;i++){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0};
        if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
            contenido.nombre = actual.hijos[2].hijos[i].hijos[0].nombre;
            contenido.tipo = actual.hijos[1].nombre;
            contenido.rol = 'variable metodo';
            contenido.ambito = ambito;
            contenido.ambitoPadre = ambitoPadre;
            
            for(var j=0;j<actual.hijos[i].hijos.length;j++){
                switch(actual.hijos[i].hijos[j].nombre){
                    case 'public':
                    contenido.acceso = 'public';
                    break;
                    case 'private':
                    contenido.acceso = 'private';
                    break;
                    case 'protected':
                    contenido.acceso = 'protected';
                    break
                    case 'static':
                    contenido.estatico = '1';
                    break
                }
            }
            tablaSimbolos.push(contenido);
        }
        else{
            contenido.nombre = actual.hijos[2].hijos[i].nombre;
            contenido.tipo = actual.hijos[1].nombre;
            contenido.rol = 'variable clase';
            contenido.ambito = ambito;
            contenido.ambitoPadre = ambitoPadre;

            for(var j=0;j<actual.hijos[i].hijos.length;j++){
                switch(actual.hijos[i].hijos[j].nombre){
                    case 'public':
                    contenido.acceso = 'public';
                    break;
                    case 'private':
                    contenido.acceso = 'private';
                    break;
                    case 'protected':
                    contenido.acceso = 'protected';
                    break
                    case 'static':
                    contenido.estatico = '1';
                    break
                }
            }
            tablaSimbolos.push(contenido);
        }
    }
}

function DECLARACION_VARIABLE_CLASE(actual,ambitoPadre,ambito,nombreClase){
    let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0,compilar:actual,nodo:actual};
    var dimenciones = 0;

    for(var i=0;i<actual.hijos[2].hijos.length;i++){
        let contenido = {nombre:'',tipo:'',rol:'',parametros:[],acceso:'',estatico:'',ambito:0,ambitoPadre:0,compilar:actual,nodo:actual,vector:0,listaV:[]};
        if(actual.hijos[2].hijos[i].nombre=='inicializando variable'||actual.hijos[2].hijos[i].nombre=='inicializando vector'){
            dimenciones = actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre;
            contenido.nombre = actual.hijos[2].hijos[i].hijos[0].nombre;
            contenido.tipo = actual.hijos[1].nombre;
            contenido.rol = 'variable clase';
            contenido.ambito = ambito;
            contenido.ambitoPadre = ambitoPadre;
            contenido.clase =nombreClase;
            contenido.vector=dimenciones;
            for(var j=0;j<actual.hijos[i].hijos.length;j++){
                switch(actual.hijos[i].hijos[j].nombre){
                    case 'public':
                    contenido.acceso = 'public';
                    break;
                    case 'private':
                    contenido.acceso = 'private';
                    break;
                    case 'protected':
                    contenido.acceso = 'protected';
                    break
                    case 'static':
                    contenido.estatico = '1';
                    break
                }
            }
            tablaSimbolos.push(contenido);
        }
        else{
            dimenciones = actual.hijos[2].hijos[actual.hijos[2].hijos.length].hijos[0].nombre;
            contenido.nombre = actual.hijos[2].hijos[i].nombre;
            contenido.tipo = actual.hijos[1].nombre;
            contenido.rol = 'variable clase';
            contenido.ambito = ambito;
            contenido.ambitoPadre = ambitoPadre;
            contenido.clase ='nombreClase';
            contenido.vector=dimenciones;
            for(var j=0;j<actual.hijos[i].hijos.length;j++){
                switch(actual.hijos[i].hijos[j].nombre){
                    case 'public':
                    contenido.acceso = 'public';
                    break;
                    case 'private':
                    contenido.acceso = 'private';
                    break;
                    case 'protected':
                    contenido.acceso = 'protected';
                    break
                    case 'static':
                    contenido.estatico = '1';
                    break
                }
            }
            tablaSimbolos.push(contenido);
        }
    }
}
