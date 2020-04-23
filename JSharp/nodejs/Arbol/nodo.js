function Nodo(){
    this.nombre   = '';
    this.linea   = '';
    this.columan = '';
    this.padre = Nodo;
    this.hijos   = [];

    this.generar3D = function generar3D(actual,cont){
        for(let i=0;actual.hijos.length;i++){
            generar3D(actual.hijos[i]);
        }
        return "";
    }
}

var max=0;
var cont=0;
var nuevaT = false;

var obj  = {valor:'', contT:0, contL:0};
var objS = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};

exports.exp = function exp(actual,cont,cont2){
    return EXP_3D(actual,cont,cont2);
}
var memo = require("../memoria");
var memoria = memo.memoria;
var monticulo = require("../monticulo/monticulo.js");

var errores = require("../Errores/errores");
var error2 = require("../Errores/error");

var funcion = require("../funciones").lista;

function obtenerC3DFunciones(contT,contL){
    var cadena = '';    
    for(var i=0;i<tabla.length;i++){
        var temp;
        if(tabla[i].rol=='metodo'){
            temp = CrearParametrosFuncion(tabla[i].nodo,contT,contL,tabla[i].ambito+1,tabla[i].ambito+1,tabla[i].nombre);
            contT = temp.contT;
            contL = temp.contL;
            cadena += temp.valor;

            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
        else if(tabla[i].rol=='constructor'){
            temp = CrearParametrosConstructor(tabla[i].nodo,contT,contL,tabla[i].ambito+1,tabla[i].ambito+1,tabla[i].nombre);
            contT = temp.contT;
            contL = temp.contL;
            cadena += temp.valor;
            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
    }

    for(var i=0;i<tabla.length;i++){
        var temp;
        if(tabla[i].rol=='variable clase'&&(tabla[i].tipo=='int'||tabla[i].tipo=='char'||tabla[i].tipo=='boolean'||tabla[i].tipo=='double'||tabla[i].tipo=='string')){
            temp = DECLARACION_VARIABLE_CLASE(tabla[i].nodo,contT,contL,tabla[i].ambitoPadre,tabla[i].ambito);
            contT = temp.contT;
            contL = temp.contL;
            tabla[i].compilado=1;
            cadena += temp.valor;
            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
    }

    for(var i=0;i<tabla.length;i++){
        var temp;
        if(tabla[i].rol=='objeto clase'){
            temp = Objeto(tabla[i].nodo,contT,contL,tabla[i].ambitoPadre,tabla[i].ambito);
            contT = temp.contT;
            contL = temp.contL;
            tabla[i].compilado=1;
            cadena += temp.valor;
            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
    }
    errores==errores;
    crearThis(tabla);

    for(var i=0;i<tabla.length;i++){
        var temp;
        if(tabla[i].rol=='metodo'){
            temp =  DECLARACION_METODO(tabla[i].nodo,contT,contL,tabla[i].ambitoPadre,tabla[i].ambito,tabla[i].clase);
            contT = temp.contT;
            contL = temp.contL;
            tabla[i].compilado=1;
            cadena += temp.valor;
            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
        else if(tabla[i].rol=='constructor'){
            temp = DECLARACION_CONSTRUCTOR(tabla[i].nodo,contT,contL,tabla[i].ambitoPadre,tabla[i].ambito,tabla[i].clase);
            contT = temp.contT;
            contL = temp.contL;
            tabla[i].compilado=1;
            cadena += temp.valor;
            if(errores.lista!=0){          
                var ret = {contT:contT,contL:contL,cadena:cadena};
                return ret;
            }
        }
    }

    var ret = {contT:contT,contL:contL,cadena:cadena};
    return ret;
}

function crearThis(){
    listaC = [];
    for(var i=0;i<(tabla.length-1);i++){
        if(tabla[i].rol=='clase'){
            listaC.push({ambito:tabla[i].ambito,nombre:tabla[i].nombre});
        }
    }
    for(var i=0;i<listaC.length;i++){
    var obj = {rol:'',nombre:'',ambito:0,ambitoPadre:0,estatico:0,tipo:'',variables:[],funciones:[]};

    var variables = [];
        var funciones = [];
        obj.rol = 'variable clase';
        obj.nombre = 'this';
        obj.ambito = listaC[i].ambito+1;
        obj.ambitoPadre = listaC[i].ambito;
        obj.estatico = "";
        obj.tipo = listaC[i].nombre;
        
        for(var j=0;j<tabla.length-1;j++){
            if(tabla[j].ambitoPadre==listaC[i].ambito){
                if(tabla[j].rol=='variable clase'){
                    variables.push({nombre:tabla[j].nombre,valor:tabla[j].valor,tipo:tabla[j].tipo});
                } 
                else if(tabla[j].rol=='metodo'){
                    funciones = [tabla[j].nombre2];
                } 
                else if(tabla[j].rol=='constructor'){
                    funciones = [tabla[j].nombre];
                } 
            }
        }
        obj.variables = variables;
        obj.funciones = funciones;
        tabla.push(obj);
    }
    return;
}

function CrearParametrosFuncion(actual,contT,contL,ambitoPadre,ambito,nombreF){
    var retorno={valor:'', contT:contT, contL:contL, _t:'',_l:'',tipo:'',ambito:0};

    var cadena = '';
    if(actual.hijos[0].hijos[1].nombre!='void'){
        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='char'||actual.hijos[1].nombre=='boolean'){
            AsignarValorId('return',ambitoPadre,ambito,'t'+contT);
            cadena+='t'+(contT++)+'=p;\n';
            cadena+='stack[p]=0;\n';
            cadena+='p=p+1;\n';
        }
        else{
            AsignarValorId('return',ambitoPadre,ambito,'t'+contT);
            cadena+='t'+(contT++)+'=p;\n';
            cadena+='stack[p]=null;\n';
            cadena+='p=p+1;\n';
        }
    }
    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){
            case 'cabesa metodo':
                if(actual.hijos[i].hijos[0].nombre=='modificadores'){
                    var temp = parametosFormales(actual.hijos[i].hijos[2].hijos[1],contT,contL,ambitoPadre,ambito,nombreF);
                    temp.valor += cadena;

                    return temp;
                }
            break;
        }
    }
    return retorno;
}

function CrearParametrosConstructor(actual,contT,contL,ambitoPadre,ambito,nombreF){
    return parametosFormales(actual.hijos[1].hijos[1],contT,contL,ambitoPadre,ambito,nombreF);
}

function CLASEF(actual){
 //   obtenerC3DFunciones()
    if(actual.hijos.length==4){        
        for(var i=0;i<actual.hijos.length;i++){
            switch(actual.hijos[i].nombre){
                case 'cuerpo':
                    funciones(actual.hijos[i]);
                break
            }
        }
    }
    else if(actual.hijos.length==5){
        for(var i=0;i<actual.hijos.length;i++){
            switch(actual.hijos[i].nombre){
                case 'cuerpo':
                    funciones(actual.hijos[i]);
                break
            }
        }
    }
}

function IniciarRecorrido(actual){
    return listaClasesF(actual.hijos[0]);
}

function listaClasesF(actual){
    for(var i=0;i<actual.hijos.length;i++){
       CLASEF(actual.hijos[i]);         
    }

}

function funciones(actual){
    for(var i=0;i<actual.hijos.length;i++){
        switch(actual.hijos[i].nombre){
            case 'declaracion metodo':
                let nombre = actual.hijos[i].hijos[0].hijos[2].hijos[0].nombre;
                    for(var l=0;l<actual.hijos[i].hijos[0].hijos[2].hijos[1].hijos.length;l++){
                        if(actual.hijos[i].hijos[0].hijos[2].hijos[1].hijos[l].hijos.length==3){
                            nombre+='_'+actual.hijos[i].hijos[0].hijos[2].hijos[1].hijos[l].hijos[1].nombre;
                        }
                        else{
                            nombre+='_'+actual.hijos[i].hijos[0].hijos[2].hijos[1].hijos[l].hijos[0].nombre;
                        }
                    }  
               let fun = {nombre:nombre,funcion:actual.hijos[i]};
               funcion.push(fun);
            break
        }
    }
}


exports.IniciarRecorrido=IniciarRecorrido;
//-----------------------------

function POW(actual,contT,contL,ambitoPadre,ambito) {
    var cadena='';

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    
    aux.tipo = TIPO_DATO_RESULTANTE(actual.hijos[0].nombre,actual.hijos[1].nombre,actual.nombre,actual);

    var temp1 = EXP_3D(actual.hijos[0],contT,contL,ambitoPadre,ambito);
    
    if(contT<temp1.contT){
        contT=temp1.contT;
    }
    if(contL<temp1.contL){
        contL=temp1.contL;
    }

    var temp2 = EXP_3D(actual.hijos[1],contT,contL,ambitoPadre,ambito);
    
    if(contT<temp2.contT){
        contT=temp2.contT;
    }
    if(contL<temp2.contL){
        contL=temp2.contL;
    }
    
    cadena += temp1.valor;
    cadena += temp2.valor;

    cadena+='t'+(contT++)+'=1;\n';
    cadena+='t'+(contT++)+'='+temp2._t+';\n';
    cadena+='t'+(contT++)+'='+temp1._t+';\n';
    cadena+='t'+(contT++)+'='+temp1._t+';\n';


    cadena+='l'+(contL++)+':\n';
    cadena+='if(t'+(contT-4)+'<t'+(contT-3)+') goto l'+(contL++)+';\n';
    cadena+='goto l'+(contL++)+';\n';
    cadena+='l'+(contL-2)+':\n';
    cadena+='t'+(contT-2)+'=t'+(contT-2)+'*t'+(contT-1)+';\n';
    cadena+='t'+(contT-4)+'=1+t'+(contT-4)+';\n';
    cadena+='goto l'+(contL-3)+';\n';
    cadena+='l'+(contL-1)+':\n';
    
    aux.valor = cadena; 

    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-2);
    aux._l = 'l'+contL;
    
    return aux;
}

function mmpre(variable,aumento,cont,cont2,ambitoPadre,ambito){
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    let temp = obtenerValorId(variable,ambitoPadre,ambito);
    
    if(aumento=='++'){
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'+1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont++)+';\n';
    }else{
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'-1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont++)+';\n';
    }
    aux.contT=cont;
    aux.contL=cont2;
    aux._t = 't'+(cont-1);
    aux._l = 'l'+(cont2);
    return aux;
}

function mmpos(variable,aumento,cont,cont2,ambitoPadre,ambito){
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    let temp = obtenerValorId(variable,ambitoPadre,ambito);
    
    if(aumento=='++'){
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'+1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont)+';\n';
        aux.valor += 't'+(cont)+'=t'+(cont++)+'-1;\n'; 
    }else{
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'-1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont)+';\n';
        aux.valor += 't'+(cont)+'=t'+(cont++)+'+1;\n';
    }
    aux.contT=cont;
    aux.contL=cont2;
    aux._t = 't'+(cont-1);
    aux._l = 'l'+(cont2);
    return aux;
}


function mmprepos(actual,cont,cont2,ambitoPadre,ambito){
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    let temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
    
    if(actual.nombre=='++pos'||actual.nombre=='++pre'){
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'+1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont++)+';\n';
    }else{
        aux.tipo = temp.tipo;
        aux._t = 't'+(cont);
        aux.valor += 't'+(cont)+'=stack['+temp._t+'];\n';
        aux.valor += 't'+(cont)+'=t'+(cont)+'-1;\n'; 
        aux.valor += 'stack['+temp._t+']=t'+(cont++)+';\n';
    }
    aux.contT=cont;
    aux.contL=cont2;
    aux._t = 't'+(cont-1);
    aux._l = 'l'+(cont2);
    return aux;
}

function EXP_3D(actual,cont,cont2,ambitoPadre,ambito){
    switch(actual.nombre){
        case 'incremento':
        if(actual.hijos[0].nombre=='++'){
            var nombre ='++';
            var pre =actual.hijos[1].hijos[0].nombre;
            return mmpre(pre,nombre,cont,cont2,ambitoPadre,ambito);
        }
        if(actual.hijos[1].nombre=='++'){
            var nombre ='++';
            var pre =actual.hijos[0].hijos[0].nombre;
            return mmpos(pre,nombre,cont,cont2,ambitoPadre,ambito);
        }
        case 'decremento':
        if(actual.hijos[0].nombre=='--'){
            var nombre ='--';
            var pre =actual.hijos[1].hijos[0].nombre;
            return mmpre(pre,nombre,cont,cont2,ambitoPadre,ambito);
        }
        if(actual.hijos[1].nombre=='--'){
            var nombre ='--';
            var pre =actual.hijos[0].hijos[0].nombre;
            return mmpos(pre,nombre,cont,cont2,ambitoPadre,ambito);
        }
        case '++pre':
        case '--pre':
        return mmpre(actual,cont,cont2,ambitoPadre,ambito);
        case '++pos':
        case '--pos':
        return mmpos(actual,cont,cont2,ambitoPadre,ambito);
        case '+':
            var temp = obtener('+',actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case '-':  
            var temp = obtener('-',actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case '*':
            var temp = obtener('*',actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case '/':
            var temp =  obtener('/',actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case '%':
            var temp =  obtener('%',actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        
        case 'pow':
            var temp =  POW(actual,cont,cont2,ambitoPadre,ambito);
            return temp;
                
        case '?':
            var temp =  tern('?',actual,cont,cont2,ambitoPadre,ambito);
            return temp;

        case '<':
            var temp = obtener('<',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '>':
            var temp = obtener('>',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '>=':     
            var temp = obtener('>=',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '<=':
            var temp = obtener('<=',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '==':
            var temp = obtener('==',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '!=':
            var temp = obtener('!=',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '&&':
            var temp = obtenerY(actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp; 
        case '||':
            var temp = obtenerO(actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '!':
            var temp = obtener('!',actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case '^':
            var temp = obtenerP(actual,cont,cont2,ambitoPadre,ambito);
            temp.tipo='booleano';
            return temp;
        case 'funcion':
            var temp = funcionEXP(actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case 'objeto id':
            var temp = ObjetoId(actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        case 'vector':
            var temp = vectorE(actual,cont,cont2,ambitoPadre,ambito);
            return temp;
        default:
            return obtenerDato(actual,cont,cont2,ambitoPadre,ambito);
    }     
}


function vectorE(actual,contT,contL,ambitoPadre,ambito){
    var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);

    var t = 't'+(contT++);
    var tS = 't'+(contT++);
    var cadena = '';

    if(actual.hijos[1].hijos.length==1){
        pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
        cadena += pos.valor;
       
        contT = pos.contT;

        cadena += t+'='+pos._t+';\n';
    }
    else if(actual.hijos[1].hijos.length==2){
        pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
        pos1 = EXP_3D(actual.hijos[1].hijos[1],contT,contL,ambitoPadre,ambito); 
        cadena += pos.valor;
        cadena += pos1.valor;
       
        contT = pos.contT;
        contL = pos1.contL;

        cadena += tS+'='+temp.lista[0]+'*'+pos._t+';\n';
        cadena += t+'='+tS+'+'+pos1._t+';\n';
    
    }
    else{
        for(var i=0;i<actual.hijos[1].hijos.length;i++){
            if(i==0){
                pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
                pos1 = EXP_3D(actual.hijos[1].hijos[1],contT,contL,ambitoPadre,ambito); 
                cadena += pos.valor;
                cadena += pos1.valor;

                contT = pos.contT;
                contL = pos1.contL;

                cadena += tS+'='+temp.lista[0]+'*'+pos._t+';\n';
                cadena += t+'='+tS+'+'+pos1._t+';\n';
                i++;      
            }else{
                pos = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre,ambito);
              
                contT = pos.contT;

                cadena += pos.valor;
                cadena += tS+'='+pos._t+'*'+temp.lista[i]+';\n';
                cadena += t+'='+t+'+'+tS+';\n';    
            }
        }
    }
    var tr = 't'+(contT++);

    cadena += tr+'=heap['+t+'];\n';
    
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = temp.tipo;
    aux.ambito = ambito;

    return aux;
}
function ObjetoId(actual,contT,contL,ambitoPadre,ambito){
    var obj = obtenerValorId2(actual.hijos[0],ambitoPadre,ambito);
    errores=errores;
    if(obj==undefined){
        var aux = {valor:'', contT:contT, contL:contL, _t:'',_l:'',tipo:'',ambito:ambito};

    
        return aux;
    }
    var cadena = '';
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
    var existe= true;

    if(obj.rol=='clase'){
        var existe = true;
        var ambito = obj.ambito;
        for(var i=0;i<tabla.length;i++){
            if(tabla[i].estatico==1&&ambito==tabla[i].ambito&&tabla[i].nombre==actual.hijos[1].hijos[0].nombre){
                cadena +='t'+contT+'=stack['+tabla[i].valor+'];\n';        
                aux.tipo = tabla[i].tipo;
                existe =false;
                break;
            }
        } 
        if(existe){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[1].hijos[0].linea; 
            error.columan = actual.hijos[1].hijos[0].columna;
            error.error = 'La variable estatica'+actual.hijos[1].hijos[0].nombre+' no existe en el objeto '+actual.hijos[0];
            
            errores.lista.push(error);
        }
    }
    else{
        for(var i=0;i<obj.variables.length;i++){
            var nom1=obj.variables[i].nombre;
            var nom2 =actual.hijos[1].hijos[0].nombre;
            if(nom2==undefined){
                nom2 =actual.hijos[1].hijos[0];
            }
            if(nom1==nom2){
                existe= false;
                if(actual.hijos[0]=='this'){
                    cadena +='t'+contT+'=stack['+obj.variables[i].valor+'];\n';        
                    aux.tipo = obj.variables[i].tipo;
                   
                }else{
                    cadena +='t'+contT+'=heap['+obj.variables[i].valor+'];\n';
                    var tem;
                    if(actual.hijos[1].nombre=='objeto id'){
                        cadena +='t'+(contT+1)+'=heap['+(contT)+'];\n';
                        contT++;

                        var ambito1;
                        var ambito2;
                        for(var x=0;x<tabla.length;x++){
                            var rol =tabla[x].rol;
                            var nom =tabla[x].nombre;
                            if(nom==obj.tipo&&rol=='clase'){
                                ambito1=tabla[x].ambito;
                                break;
                            }
                        }
                        tem = ObjetoId(actual.hijos[1],contT,contL,ambito1,ambito1+1);
                        var obj2 = obtenerValorId2(actual.hijos[1].hijos[0],ambito1,ambito1+1);
                        for(var x=0;x<obj2.variables.length;x++){
                            if(obj2.variables[x].nombre==tem.var){
                                cadena += obj2.variables[x].valor +'=t'+(contT)+';\n';
                                break;
                            }
                        }
                        
                        aux.tipo = tem.tipo
                        cadena += tem.valor;
                        contT = tem.contT;
                        contL = tem.contL;
                        contT--;
                    } 
                    else{
                        aux.tipo = obj.variables[i].tipo;
                    }
                }
                break;
            }
        }
        
        if(existe){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[1].hijos[0].linea; 
            error.columan = actual.hijos[1].hijos[0].columna;
            error.error = 'La variable '+actual.hijos[1].hijos[0].nombre+' no existe en el objeto '+actual.hijos[0];
            
            errores.lista.push(error);
        }
    }
    aux.var = actual.hijos[1].hijos[0].nombre;
    aux._t = 't'+(contT++);
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._l = 'l'+(contL-1);
    aux.ambito = ambito;

    return aux;
}

function obtenerObjeto(actual){

} 

function funcionEXP(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    
    var clas= obtenerValorC(ambitoPadre,ambito);
    let nombre = '';
    nombreClase = clas;
    var cadena = '';
    var listaT = [];
    var listaP = [];
    
    var cadena2 ='';

    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        if(actual.hijos[1].hijos[i].nombre=='EXP'){
            var temp = EXP_3D(actual.hijos[1].hijos[i].hijos[0],contT,contL,ambitoPadre+1,ambito+1);
            nombre += '_'+temp.tipo;
          //  cadena2 += temp.valor;
            listaT.push(temp._t);
            listaP.push(temp.tipo);
        }
        else{
            var temp = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
            nombre += '_'+temp.tipo;
           // cadena2 += temp.valor;
            listaT.push(temp._t);
            listaP.push(temp.tipo);
        }
    }

    var nombre2 = nombreClase+'_'+actual.hijos[0].nombre+nombre;
    var funcion = obtenerValorIdFuncion(nombre2);
    if(funcion==undefined){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[0].nombre+' no existe';
        errores.lista.push(error);
       
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;    
    }
    if(funcion.acceso=='private'||funcion.acceso=='protected'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[0].nombre+' no es publica';
        errores.lista.push(error);
        
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;    
    }

    nombre = nombreClase+'_'+funcion.tipo+'_'+actual.hijos[0].nombre+nombre;
    var parametros;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==nombre){
            parametros = tabla[i].listaParametros;
            tabla[i].compilado=1;
        }
    }
    cadena2 += 'var parametrosx=0;\n';
    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        if(actual.hijos[1].hijos[i].nombre=='EXP'){   
            var temp = EXP_3D(actual.hijos[1].hijos[i].hijos[0],contT,contL,ambitoPadre+1,ambito+1);
            cadena2 += temp.valor;
            cadena2 += parametros[i]+'=p;\n';
            cadena2 += 'stack[p]='+temp._t+';\n';
            cadena2 += 'p=p+1;\n';
        }
        else{
            var temp = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
            cadena2 += temp.valor;
            cadena2 += parametros[i]+'=p;\n';
            cadena2 += 'stack[p]='+temp._t+';\n';
            cadena2 += 'p=p+1;\n';    
        }
    }

    cadena2 +='call '+nombre+';\n';
    
    var tmp = obtenerValorF('return',nombre2)._t;

    cadena2 +='t'+(contT)+'=stack['+tmp+'];\n';
  
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
    aux._t = 't'+(contT++);
                   
    aux.valor = cadena2;
    aux.contL = contL;
    aux.contT = contT;



    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.ambito = ambito;
    aux.tipo = funcion.tipo;
    return aux;    
}

function obtenerDato(actual,cont,cont2,ambitoPadre,ambito){
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
        aux.tipo = actual.nombre;
        if(actual.nombre=='null'){
            aux.tipo = '';
            aux._t = 't'+cont;
            aux.valor = 't'+(cont++)+'=null;\n';
        }
        if(actual.nombre=='id'){   
            let temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
            aux.tipo = temp.tipo;
            aux._t = 't'+(cont);
            aux.valor = 't'+(cont++)+'=stack['+temp._t+'];\n'; 
        }
        else if(actual.nombre=='-'){
            if(actual.hijos[0].nombre=='int'||actual.hijos[0].nombre=='double'){
                aux.tipo = actual.nombre;
                aux._t = 't'+cont;
                aux.valor = 't'+(cont++)+'='+actual.hijos[0].nombre+';\n'; 
                console.log(aux.valor);
            } 
        }
        else if(actual.nombre=='int'||actual.nombre=='double'||actual.nombre=='char'||actual.nombre=='booleano'){
            aux.tipo = actual.nombre;
            aux._t = 't'+cont;
            aux.valor = 't'+(cont++)+'='+actual.hijos[0].nombre+';\n'; 
        }
        else if(actual.nombre=='string'){
            aux._t = 't'+cont;
            aux.tipo = 'string';
            aux.valor += monticulo.GENERAR_SRT_3D(actual.hijos[0].nombre,cont);
            cont++;
        }

        aux.contL = cont2;
        aux.contT = cont;
        aux._l = '';
        return aux;
}

function obtenerP(actual,cont,cont2,ambitoPadre,ambito){        
    var temp1 = EXP_3D(actual.hijos[0],cont++,cont2,ambitoPadre,ambito);
    var temp2 = EXP_3D(actual.hijos[1],(cont++),cont2,ambitoPadre,ambito);
   
    if(temp1.tipo!='booleano'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].hijos[0].linea; 
        error.columan = actual.hijos[0].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    }   
    else if(temp2.tipo!='booleano'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[1].hijos[0].linea; 
        error.columan = actual.hijos[1].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    } 
    else{      
        if(cont<temp1.contT){
            cont = temp1.contT;
        }
        if(cont2<temp1.contL){
            cont2 = temp1.contL;
        }

        if(cont<temp2.contT){
            cont = temp2.contT;
        }
        if(cont2<temp2.contL){
            cont2 = temp2.contL;
        }

        var cadena = 't'+(cont++)+'='+temp1._t+'==1;\n';
        cadena += 't'+(cont++)+'='+temp2._t+'==1;\n';
        
        cadena += 't'+(cont++)+'=t'+(cont-3)+'&&t'+(cont-2)+';\n';

        cadena += 't'+(cont++)+'='+temp1._t+'==0;\n';
        cadena += 't'+(cont++)+'='+temp2._t+'==0;\n';

        cadena += 't'+(cont++)+'=t'+(cont-3)+'&&t'+(cont-2)+';\n';

        cadena += 't'+(cont++)+'=t'+(cont-5)+'||t'+(cont-2)+';\n';


        
        cadena += "ifFalse(t"+(cont-1)+"==0) goto l"+(cont2++)+";\n";
        cadena += "goto l"+(cont2++)+";\n";            
        
        cadena += "l"+(cont2-2)+":\n";                        
        cadena += "t"+(cont)+"=1;\n";
        cadena += "goto l"+(cont2++)+";\n";

        cadena += "l"+(cont2-2)+":\n";            
        cadena += "t"+(cont++)+"=0;\n";       
                    
        cadena += 'l'+(cont2-1)+":\n";            

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    
        aux.valor = temp1.valor+temp2.valor+cadena;
        aux.contL = cont2;
        aux.contT = cont;
        aux._t = 't'+(cont-1);
        aux._l = 'l'+cont2;
        aux.tipo = 'booleano';
        
        return aux;
    }

}

function obtenerO(actual,cont,cont2,ambitoPadre,ambito){
    var temp2 = EXP_3D(actual.hijos[1],(cont++),cont2,ambitoPadre,ambito);
    if(cont<temp2.contT){
        cont = temp2.contT;
    }
    if(cont2<temp2.contL){
        cont2 = temp2.contL;
    }
    var temp1 = EXP_3D(actual.hijos[0],cont++,cont2,ambitoPadre,ambito);
    if(cont<temp1.contT){
        cont = temp1.contT;
    }
    if(cont2<temp1.contL){
        cont2 = temp1.contL;
    }

    if(temp1.tipo!="booleano"){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].hijos[0].linea; 
        error.columan = actual.hijos[0].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    }   
    else if(temp2.tipo!="booleano"){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[1].hijos[0].linea; 
        error.columan = actual.hijos[1].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    } 
    else{    

        var cadena =  temp1.valor+temp2.valor;
        cadena += "ifFalse("+temp1._t+"==0) goto l"+(cont2++)+";\n";
        cadena += "ifFalse(0=="+temp2._t+") goto l"+(cont2++)+";\n";

        cadena += "t"+(cont)+"=0;\n";
        cadena += "goto l"+(cont2++)+";\n";
       
        cadena += "l"+(cont2-2)+",l"+(cont2-3)+":\n";            
        cadena += "t"+(cont++)+"=1;\n"
        cadena += "goto l"+(cont2++)+";\n";
       
       
        cadena += "l"+(cont2-1)+",l"+(cont2-2)+":\n";            
        

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    
        aux.valor = cadena;
        aux.contL = cont2;
        aux.contT = cont;
        aux._t = 't'+(cont-1);
        aux._l = 'l'+cont2;
        aux.tipo = 'booleano';
        return aux;
    }

}

function obtenerY(actual,cont,cont2,ambitoPadre,ambito){ 
    var temp1 = EXP_3D(actual.hijos[0],cont++,cont2,ambitoPadre,ambito);
    var temp2 = EXP_3D(actual.hijos[1],(cont++),cont2,ambitoPadre,ambito);
  
    if(temp1.tipo!='booleano'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].hijos[0].linea; 
        error.columan = actual.hijos[0].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    }   
    else if(temp2.tipo!='booleano'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[1].hijos[0].linea; 
        error.columan = actual.hijos[1].hijos[0].columna;
        error.error = 'La expresion no es booleana';
        
        errores.lista.push(error);
        var aux = {valor:'t'+(cont++)+'=0;', contT:cont, contL:cont2, _t:'t'+(cont-1),_l:'',tipo:''};
    
        return aux;
    } 
    else{  
        
    if(cont<temp1.contT){
        cont = temp1.contT;
    }
    if(cont2<temp1.contL){
        cont2 = temp1.contL;
    }

    if(cont<temp2.contT){
        cont = temp2.contT;
    }
    if(cont2<temp2.contL){
        cont2 = temp2.contL;
    }

        var cadena = "ifFalse("+temp1._t+"==0) goto l"+(cont2++)+";\n";
        cadena += "goto l"+(cont2++)+";\n";            
        
        cadena += "l"+(cont2-2)+":\n";            
        cadena += "ifFalse(0=="+temp2._t+") goto l"+(cont2++)+";\n";
        cadena += "goto l"+(cont2++)+";\n";            
        
        cadena += "l"+(cont2-2)+":\n";            
        cadena += "t"+(cont)+"=1;\n";
        cadena += "goto l"+(cont2++)+";\n";

        cadena += "l"+(cont2-4)+",l"+(cont2-2)+":\n";            
        cadena += "t"+(cont++)+"=0;\n";
        cadena += "goto l"+(cont2++)+";\n";

        cadena += "l"+(cont2-1)+",l"+(cont2-2)+":\n";           

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
    
        aux.valor = temp1.valor+temp2.valor+cadena;
        aux.contL = cont2;
        aux.contT = cont;
        aux._t = 't'+(cont-1);
        aux._l = 'l'+cont2;
        aux.tipo = 'booleano';
        
        return aux;
    }

}

function tern(tipo,actual,cont,cont2,ambitoPadre,ambito){
    var cadena = '';
    var temp1 = EXP_3D(actual.hijos[0],(cont++),cont2,ambitoPadre,ambito);
    if(cont<temp1.contT){
        cont = temp1.contT;
    }
    if(cont2<temp1.contL){
        cont2 = temp1.contL;
    }

    cadena += temp1.valor;
    
    var nol1='l'+cont2;
    cadena +='if('+temp1._t+'==1) goto l'+(cont2++)+';\n';
    var nol2='l'+cont2;
    cadena += 'goto l'+(cont2++)+';\n';

    var t = cont++;

    var temp2 = EXP_3D(actual.hijos[1],(cont++),cont2,ambitoPadre,ambito);
    if(cont<temp2.contT){
        cont = temp2.contT;
    }
    if(cont2<temp2.contL){
        cont2 = temp2.contL;
    }

    cadena +=nol1+':\n';
    cadena += temp2.valor;

    nol1 = 'l'+cont2;
    cadena += 't'+t+'='+temp2._t+';\n';
    cadena += 'goto l'+(cont2++)+';\n';

    
    var temp3 = EXP_3D(actual.hijos[2],cont++,cont2,ambitoPadre,ambito);
    if(cont<temp3.contT){
        cont = temp3.contT;
    }
    if(cont2<temp3.contL){
        cont2 = temp3.contL;
    }
    cadena +=nol2+':\n';
    cadena +=temp3.valor;    

    cadena += 't'+t+'='+temp3._t+';\n';
 
    cadena +=nol1+':\n';

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',tipo2:''};
                
    aux.valor = cadena;
    aux.contL = cont2;
    aux.contT = cont;
    aux._t = 't'+t;
    aux._l = 'l'+cont2;
    aux.tipo = temp2.tipo;
    aux.tipo2 = temp3.tipo;
    
    return aux;
}

var contVar2=0;
function obtenerValorId(id,ambitoPadre,ambito){
    if(ambito==undefined){return;}
    contVar2++;
    if(contVar2==999){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = 0; 
        error.columan = 0;
        error.error = 'la variable ' + id +' no existe';  
        errores.lista.push(error);
        contVar2=0
        return;
    }
    for(var i=0;i<tabla.length;i++){
        var temp =tabla[i].nombre;
        if(id == temp){
            if(tabla[i].ambito == ambito){
                var retorno = {tipo:tabla[i].tipo,_t:tabla[i].valor,lista:tabla[i].listaV};
                contVar2=0;
                return retorno;
            }
        }
    } 
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                var retorno = {tipo:tabla[i].tipo,_t:tabla[i].valor,lista:tabla[i].listaV};
                contVar2=0;
                return retorno;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    return obtenerValorId(id,ambito,ambitoPadre);
}

function obtenerIdObjeto(id,clase){
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre&&clase == tabla[i].clase){
            var retorno = {tipo:tabla[i].tipo,_t:tabla[i].valor};
            return retorno;
        }
    } 
}

var contVar=0;
function obtenerValorId2(id,ambitoPadre,ambito){
    if(ambito==undefined){return;}
    contVar++;
    if(contVar==999){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = 0; 
        error.columan = 0;
        error.error = 'la variable' + id +' no existe';  
        errores.lista.push(error);
        contVar=0
        return;
    }
    for(var i=0;i<tabla.length;i++){
        var temp =tabla[i].nombre;
        if(id == temp){
            if(tabla[i].ambito == ambito){
                contVar=0;
                return tabla[i];
            }
        }
    } 
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                contVar=0;
                return tabla[i];
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    return obtenerValorId2(id,ambito,ambitoPadre);
}

function obtenerValorId3(id,ambitoPadre,ambito){
    if(ambito==undefined){return;}
    for(var i=0;i<tabla.length;i++){
        var temp =tabla[i].nombre;
        if(id == temp&&tabla[i].rol=='clase'){
            return tabla[i];
        }
        if(id == temp){
            if(tabla[i].ambito == ambito){
                return tabla[i];
            }
        }
    } 
    for(var i=0;i<tabla.length;i++){
        
        if(id == tabla[i].nombre&&tabla[i].rol=='clase'){
            return tabla[i];
        }
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                return tabla[i];
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    return obtenerValorId2(id,ambito,ambitoPadre);
}

function obtenerValorC(ambitoPadre,ambito){
    if(ambito==undefined){return;}
    for(var i=0;i<tabla.length;i++){
        var temp =tabla[i].rol;
        if('clase' == temp){
            if(tabla[i].ambito == ambito){
                return tabla[i].nombre;
            }
        }
    } 
    for(var i=0;i<tabla.length;i++){
        if('clase' == tabla[i].rol){
            if(tabla[i].ambitoPadre == ambitoPadre){
                return tabla[i].nombre;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    return obtenerValorC(ambito,ambitoPadre);
}

function obtenerValorF(id,nombreF){
    for(var i=0;i<tabla.length;i++){
        var temp =tabla[i].nombre;
        var temp2 =tabla[i].nombreF;
        if(id == temp&&nombreF==temp2){
            var retorno = {tipo:tabla[i].tipo,_t:tabla[i].valor}
            return retorno;
            
        }
    } 
}

function obtenerValorIdFuncion(id){
    var cont =0;
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre2){
            return tabla[i];
        }

    }
    var error = new error2.Error();
    error.tipo = 'semantico';
    error.linea = 0; 
    error.columan = 0;
    error.error = 'la funioin' + id +' no existe ';  
    errores.lista.push(error);
}

function obtenerListaVarables(clase){
    var lista = [];
    for(var i=0;i<tabla.length;i++){
        if(clase==tabla[i].clase&&tabla[i].rol=='variable metodo'&&tabla[i].acceso=='public'){
            lista.push(tabla[i]);
        }
    }
}

function AsignarValorId(id,ambitoPadre,ambito,valor){
    if(ambito==undefined){return;}
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambito == ambito){
                tabla[i].valor = valor;
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                tabla[i].valor = valor;
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    AsignarValorId(id,ambitoPadre,ambito,valor);
}

function AsignarValorIdV(id,ambitoPadre,ambito,lista,_t){
    if(ambito==undefined){return;}
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambito == ambito){
                tabla[i].listaV = lista;
                tabla[i].heapV = _t;
                
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                tabla[i].listaV = lista
                tabla[i].heapV = _t;
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    AsignarValorIdV(id,ambitoPadre,ambito,lista,_t);
}

function AsignarFunconesObj(id,ambitoPadre,ambito,valor){
    if(ambito==undefined){return;}
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].tipo == ambito){
                tabla[i].funciones = valor;
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(id == tabla[i].nombre){
            if(tabla[i].ambitoPadre == ambitoPadre){
                tabla[i].funciones = valor;
                return;
            }
        }
    }
    for(var i=0;i<tabla.length;i++){
        if(ambitoPadre == tabla[i].ambito&&tabla[i].nombre!=id){
            ambito = tabla[i].ambitoPadre;
            break;
        }
    }
    AsignarFunconesObj(id,ambitoPadre,ambito,valor);
}

function obtener(tipo,actual,cont,cont2,ambitoPadre,ambito){
    if(actual.hijos.length==1){
        if(actual.nombre=='-'){
            if(esOperador(actual.hijos[0].nombre)){
                temp = EXP_3D(actual.hijos[0],cont++,cont2,ambitoPadre,ambito);
                
                if(cont<temp.contT){
                    cont = temp.contT;
                }
                if(cont2<temp.contL){
                    cont2 = temp.contL;
                }

                var cadena = temp.valor;
                cadena += 't'+(cont++)+'=0-'+temp._t+';\n';

                var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
            
                aux.valor = cadena;
                aux.contL = cont2;
                aux.contT = cont;
                aux._t = 't'+(cont-1);
                aux._l = 'l'+cont2;
                aux.tipo = temp.tipo;

                return aux;
            }
            else{
                var cadena = '';
                cadena += 't'+(cont++)+'=0-'+actual.hijos[0].hijos[0].nombre+';\n';

                var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
            
                aux.valor = cadena;
                aux.contL = cont2;
                aux.contT = cont;
                aux._t = 't'+(cont-1);
                aux._l = 'l'+cont2;
                aux.tipo = actual.hijos[0].nombre;

                return aux;
            }
        }
        else if(actual.nombre=='!'){
            if(esOperador(actual.hijos[0].nombre)){
                temp = EXP_3D(actual.hijos[0],cont++,cont2);
                
                if(cont<temp.contT){
                    cont = temp.contT;
                }
                if(cont2<temp.contL){
                    cont2 = temp.contL;
                }

                var cadena = temp.valor;
                cadena += 't'+(cont++)+'=0-'+temp._t+';\n';

                var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
            
                aux.valor = cadena;
                aux.contL = cont2;
                aux.contT = cont;
                aux._t = 't'+cont;
                aux._l = 'l'+cont2;
                aux.tipo = temp.tipo;

                return aux;
            }
            else{
                var cadena = "if("+actual.hijos[0].hijos[0].nombre+"==1) goto l"+(cont2++)+":\n";
                cadena += "goto l"+(cont2++)+":\n";

                cadena += "l"+(cont2-2)+":\n"; 
                cadena += "t"+(cont)+"=0;\n";
                cadena += "goto l"+(cont2++)+":\n";

                cadena += "l"+(cont2-2)+":\n"; 
                cadena += "t"+(cont)+"=1;\n";
                cadena += "goto l"+(cont2-1)+":\n";
        
                cadena += "l"+(cont2-1)+":\n"; 
                
                var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
            
                aux.valor = cadena;
                aux.contL = cont2;
                aux.contT = cont;
                aux._t = 't'+cont;
                aux._l = 'l'+cont2;
                aux.tipo = actual.hijos[0];

                return aux;
            }
        }
    }
    else if(actual.hijos.length==2){
            let retorno = '';
            let temp1;
            let temp2;
            
            temp1 = EXP_3D(actual.hijos[0],(cont++),cont2,ambitoPadre,ambito);
            
            retorno = temp1.valor;
            
            if(cont<temp1.contT){
                cont = temp1.contT;
            }
            if(cont2<temp1.contL){
                cont2 = temp1.contL;
            }
            temp2 = EXP_3D(actual.hijos[1],(cont++),cont2,ambitoPadre,ambito);
            if(cont<temp2.contT){
                cont = temp2.contT;
            }
            if(cont2<temp2.contL){
                cont2 = temp2.contL;
            }

            retorno += temp2.valor;

            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
        
            
            aux.tipo = TIPO_DATO_RESULTANTE(temp2.tipo.toLowerCase(),temp1.tipo.toLowerCase(),tipo,actual);
            
            var temporal1='';
            var temporal2='';
        if(aux.tipo=='string'){
            if(temp1.tipo.toLowerCase()=='string'){
                temporal1 = temp1._t;
                //temporal1 = 't'+cont;
                //retorno +='t'+(cont++)+'=stack['+temp1._t+'];\n';
            }
            else if(temp1.tipo.toLowerCase()=='char'){
                temporal1 ='t'+(cont);
                retorno += 't'+(cont++)+'=k;\n';
                retorno += 'heap[k]='+temp1._t+';\n';
                retorno += 'k=k+1;\n';
                retorno += 'heap[k]=0;\n';
                retorno += 'k=k+1;\n';
            }
            else{
                if(temp1.tipo=='double'){

                }
                else{        
                    var aux3 = covertirAStr(cont,cont2,temp1._t);
                    retorno += aux3.valor;
                    cont = aux3.contT;
                    cont2 = aux3.contL;
                    temporal1 = aux3._t;
                }
            }

            if(temp2.tipo.toLowerCase()=='string'){
                temporal2 = temp2._t;
               // temporal2 = 't'+cont;
               // retorno +='t'+(cont++)+'=stack['+temp2._t+'];\n';
            }
            else if(temp2.tipo.toLowerCase()=='char'){
                temporal2 ='t'+(cont);
                retorno += 't'+(cont++)+'=k;\n';
                retorno += 'heap[k]='+temp2._t+';\n';
                retorno += 'k=k+1;\n';
                retorno += 'heap[k]=0;\n';
                retorno += 'k=k+1;\n';
            }
            else{
                if(temp2.tipo=='double'){

                }
                else{        
                    var aux3 = covertirAStr(cont,cont2,temp2._t);
                    retorno += aux3.valor;
                    cont = aux3.contT;
                    cont2 = aux3.contL;
                    temporal2= aux3._t;
                }
            }
            
            var aux2 = ConcatenarString(cont,cont2,temporal1,temporal2);
            cont = aux2.contT;
            cont2 = aux2.contL;
            retorno +=aux2.valor;
            aux._t = aux2._t;
            aux._l = 'l'+cont2;
            cont = cont-1;   
        }
        else{
            retorno += 't'+cont+'='+temp1._t+tipo+temp2._t+';\n';
            aux._t = 't'+cont;
            aux._l = 'l'+cont2;
        }
            aux.valor = retorno;
            aux.contL = cont2;
            aux.contT = cont+1;  
    
            return aux;       
    } 

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''}; 
    aux.valor = '';
    aux.contL = 0;
    aux.contT = cont;
    aux._t = '';
    aux._l = '';
    
    return aux;
}

function covertirAStr(contT,contL,tn){
    var cadena ='';

    var aux = 't'+contT;
    cadena += 't'+(contT++)+'='+tn+';\n';

    cadena += 'if('+tn+'>0) goto l'+(contL++)+';\n';
    
    cadena += 't'+(contT++)+'=1;\n';
    cadena += 't'+(contT++)+'=0;\n';
    
    cadena += 'l'+(contL++)+':\n';   

    cadena += 't'+(contT-2)+'=t'+(contT-2)+'*10;\n';
    cadena += 't'+(contT-1)+'='+(tn)+'%t'+(contT-2)+';\n';
    cadena += 'if('+tn+'==t'+(contT-1)+') goto l'+(contL++)+';\n';
    cadena += 'goto l'+(contL-2)+';\n';   
    cadena += 'l'+(contL-1)+':\n';   
    

    cadena += 't'+(contT-1)+'=t'+(contT-2)+'+t'+(contT-1)+';\n';

    cadena += 't'+(contT-1)+'=t'+(contT-2)+'-t'+(contT-1)+';\n';
    cadena += aux+'=t'+(contT-1)+';\n';
    cadena += 'l'+(contL-3)+':\n';   

    cadena += 't'+(contT++)+'=k;\n';
    cadena += 't'+(contT++)+'=0;\n';
    cadena += 't'+(contT++)+'=0;\n';

    cadena += 't'+(contT++)+'=0;\n';
    cadena += 't'+(contT++)+'=1;\n';

    cadena += 'l'+(contL++)+':\n';
    
    cadena += 't'+(contT-1)+'=t'+(contT-1)+'*10;\n';
    cadena += 't'+(contT-4)+'=t'+(contT-1)+'/10;\n'; 
    cadena += 't'+(contT-2)+'='+aux+'%t'+(contT-1)+';\n';

    cadena += 'if('+aux+'==t'+(contT-2)+') goto l'+(contL++)+';\n';

    cadena += 't'+(contT)+'=t'+(contT-2)+'-t'+(contT-3)+';\n';
    cadena += 't'+(contT-3)+'=t'+(contT-3)+'+t'+(contT)+';\n';
    cadena += 't'+(contT)+'=t'+(contT)+'/t'+(contT-4)+';\n';

    
    cadena += 't'+(contT)+'=t'+(contT)+'+48;\n';
    cadena += 'heap[k]=t'+(contT)+';\n';
    cadena += 'k=k+1;\n';
    
    cadena += 'goto l'+(contL-2)+';\n';
    cadena += 'l'+(contL-1)+':\n';   
    
    cadena += 't'+(contT)+'='+(aux)+'-t'+(contT-3)+';\n';
    cadena += 't'+(contT)+'=t'+(contT)+'/t'+(contT-4)+';\n';

    cadena += 't'+(contT)+'=t'+(contT)+'+48;\n';
 
    cadena += 'heap[k]=t'+(contT++)+';\n';
    cadena += 'k=k+1;\n';
    
    cadena += 'if('+tn+'>0) goto l'+(contL)+';\n';
    cadena += 'heap[k]=45;\n';
    cadena += 'k=k+1;\n';
    cadena += 'l'+(contL++)+':\n';

    cadena += 'heap[k]=0;\n';
    cadena += 'k=k+1;\n';

    cadena += 't'+(contT++)+'=k;\n'
    cadena += 't'+(contT++)+'=k-2;\n'
    cadena += 'l'+(contL++)+':\n';

    cadena += 't'+(contT++)+'=heap[t'+(contT-2)+'];\n'
    cadena += 'if(0==t'+(contT-1)+') goto l'+(contL++)+';\n';
    cadena += 'heap[k]=t'+(contT-1)+';\n';
    cadena += 'k=k+1;\n';
    cadena += 't'+(contT-2)+'=t'+(contT-2)+'-1;\n';

    cadena += 'goto l'+(contL-2)+';\n';
    cadena += 'l'+(contL-1)+':\n';
    cadena += 'heap[k]=0;\n';
    cadena += 'k=k+1;\n';


    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
       
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-3);
    aux._l = 'l'+(contL-1);
    
    return aux;
}

function ConcatenarString(cont, cont2,t1,t2){

    var cadena ='t'+(cont++)+'=k;\n';

    cadena += 't'+(cont++)+'='+t1+';\n';
   
    cadena +='l'+(cont2++)+':\n';
    cadena += 't'+(cont++)+'=heap[t'+(cont-2)+'];\n';
    
    cadena += 'if(0==t'+(cont-1)+') goto l'+(cont2++)+';\n';

    cadena += 'heap[k]=t'+(cont-1)+';\n';
    cadena += 'k=k+1;\n';
    cadena += 't'+(cont-2)+'=t'+(cont-2)+'+1;\n';
    
    cadena += 'goto l'+(cont2-2)+';\n';
    cadena +='l'+(cont2-1)+':\n';

    cadena += 't'+(cont++)+'='+t2+';\n';

    cadena +='l'+(cont2++)+':\n';


    cadena += 't'+(cont++)+'=heap[t'+(cont-2)+'];\n';
  
    cadena += 'if(0==t'+(cont-1)+') goto l'+(cont2++)+';\n';

    cadena += 'heap[k]=t'+(cont-1)+';\n';
    cadena += 'k=k+1;\n';
    cadena += 't'+(cont-2)+'=t'+(cont-2)+'+1;\n';
    
    cadena += 'goto l'+(cont2-2)+';\n';
    cadena +='l'+(cont2-1)+':\n';

    cadena += 't'+(cont++)+'=p;\n';
   
    cadena += 'heap[k]=0;\n';
    cadena += 'k=k+1;\n';
   

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
       
    aux.valor = cadena;
    aux.contL = cont2;
    aux.contT = cont;
    aux._t = 't'+(cont-6);
    aux._l = 'l'+cont2;
    return aux;
}

function TIPO_DATO_RESULTANTE(tipo1,tipo2,operador,actual){
    switch(operador){
        case '+':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'int';
            }

            else if(tipo1=='string'&&tipo2=='int'){
                return 'string';
            }else if(tipo1=='int'&&tipo2=='string'){
                return 'string';
            }else if(tipo1=='string'&&tipo2=='char'){
                return 'string';
            }else if(tipo1=='char'&&tipo2=='string'){
                return 'string';
            }else if(tipo1=='string'&&tipo2=='double'){
                return 'string';
            }else if(tipo1=='double'&&tipo2=='string'){
                return 'string';
            }else if(tipo1=='string'&&tipo2=='boolean'){
                return 'string';
            }else if(tipo1=='boolean'&&tipo2=='string'){
                return 'string';
            }else if(tipo1=='string'&&tipo2=='string'){
                return 'string';
            }

            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito al sumar un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                    
                return 'error';
            }
        }
        case '-':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'int';
            }
            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito al restar un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                return 'error';
            }
        }
        case '*':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'int';
            }
            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito al multiplicar un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                    
                return 'error';
            }
        }
        case '%':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'int';
            }
            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito obtener modulo de un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                    
                return 'error';
            }
        }
        case '/':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'int';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'int';
            }
            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito al dividir un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                    
                return 'error';
            }
        }
        case 'pow':{
            if(tipo1=='int'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='double'){
                return 'double';
            }else if(tipo1=='double'&&tipo2=='double'){
                return 'double';
            }

            else if(tipo1=='int'&&tipo2=='char'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='int'&&tipo2=='int'){
                return 'double';
            }else if(tipo1=='char'&&tipo2=='char'){
                return 'double';
            }
            else{
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.linea; 
                error.columan = actual.columna;
                error.error = 'No es posible realizar un casteo implicito al obtener potencia de un dato de tipo \"'+tipo1+'\" con otro de tipo \"'+tipo2+'\"';
                    
                errores.lista.push(error);
                    
                return 'error';
            }
        }
    }
}

function IF_3D(actual,cont1,cont2,ambitoPadre,ambito,nombreClase){
    var retorno = '';
    if(actual.hijos.length==1){
        if(actual.hijos[0].hijos.length>2){
            var temp = ELSE_IF_OP(actual,cont1,cont2,ambitoPadre,ambito,nombreClase);
            return temp;  
        }
        else{
            var temp = IF_OP(actual,cont1,cont2,ambitoPadre,ambito,nombreClase);
            return temp;                 
        }
    }
    else if(actual.hijos.length==2){
        if(actual.hijos[0].hijos.length>2){
            var temp = IFELSE_ELSE_OP(actual,cont1,cont2,ambitoPadre,ambito,nombreClase);
            return temp;
        }
        else{
            var temp = IFELSE_OP(actual,cont1,cont2,ambitoPadre,ambito,nombreClase);
            return temp;
        }
    }
    return retorno;
}

function IFELSE_ELSE_OP(actual,contT,contL,ambitoPadre,ambito,romper,nombreClase){
            var cadena = '';
            let temp=EXP_3D(actual.hijos[0].hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }
            if(contT<temp.contT){
                contT = temp.contT;
            }
            if(contL<temp.contL){
                contL = temp.contL;
            }

            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';

            cadena +='l'+(contL-2)+':\n';
            var aux2 = SENTENCIAS(actual.hijos[0].hijos[1],contT,contL,ambitoPadre,ambito,romper,nombreClase,nombreClase);
            ambito = aux2.ambito;
            cadena+=aux2.valor;
            
            cadena += 'goto l'+(contL++)+';\n';
            var nol = contL-1;

            var lista ='l'+(contL-2)+',l'+(nol);
        
            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }

           
            for(var i=2;i<(actual.hijos[0].hijos.length);i++){
                var temp3 = ELSE_IF_OP2(actual.hijos[0].hijos[i],contT,contL,ambitoPadre,ambito,nombreClase);
                ambito = temp3.ambito;
                lista += ','+temp3._l;
                if(contT<temp3.contT){
                    contT = temp3.contT;
                } 
                if(contL<temp3.contL){
                    contL = temp3.contL;
                }
                cadena += temp3.valor; 
            }
        
            var aux3 = SENTENCIAS(actual.hijos[1].hijos[0],contT,contL,ambitoPadre,ambito,romper,nombreClase);
            ambito = aux3.ambito;
            if(contT<aux3.contT){
                contT = aux3.contT;
            } 
            if(contL<aux3.contL){
                contL = aux3.contL;
            }
    
            cadena+=aux3.valor;
            cadena += lista+':\n';
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            for(var i=0;i<aux2.romper.break.length;i++){
                aux2.romper.break.push(aux3.romper.break[i]);
            }
            for(var i=0;i<aux2.romper.return.length;i++){
                aux2.romper.return.push(aux3.romper.return[i]);
            }

            aux.valor = temp.valor+cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            aux.romper = aux2.romper;
            return aux;
}

function IFELSE_OP(actual,contT,contL,ambitoPadre,ambito,nombreClase){
            var cadena = '';
            let temp=EXP_3D(actual.hijos[0].hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }

            cadena +=temp.valor;

            if(contT<temp.contT){
                contT = temp.contT;
            }
            if(contL<temp.contL){
                contL = temp.contL;
            }

            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';

            cadena +='l'+(contL-2)+':\n';

            var goto1 = contL-1;
            var goto2 = contL++;

            var aux2 = SENTENCIAS(actual.hijos[0].hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
            ambito = aux2.ambito;
            cadena+=aux2.valor;

            cadena +='goto l'+(goto2)+';\n';
            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }

            cadena +='l'+(goto1)+':\n';
            
            var aux = SENTENCIAS(actual.hijos[1].hijos[0],contT,contL,ambitoPadre,ambito,nombreClase);
            ambito = aux.ambito;
            cadena+=aux.valor;

            if(contT<aux.contT){
                contT=aux.contT;
            }
            if(contL<aux.contL){
                contL=aux.contL;
            }

            for(var i=0;i<aux2.romper.break.length;i++){
                aux2.romper.break.push(aux.romper.break[i]);
            }
            for(var i=0;i<aux2.romper.return.length;i++){
                aux2.romper.return.push(aux.romper.return[i]);
            }
            cadena +='l'+(goto2)+':\n';
        
            var aux3 = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux3.valor = cadena;
            aux3.contL = contL;
            aux3.contT = contT;
            aux3._t = 't'+(contT-1);
            aux3._l = 'l'+(contL-1);
            aux3.tipo = 'booleano';
            aux3.romper = aux2.romper;
            return aux3;  
}

function IF_OP(actual,contT,contL,ambitoPadre,ambito,nombreClase){
            var cadena = '';
            let temp = EXP_3D(actual.hijos[0].hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);

            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }

            if(contT<temp.contT){
                contT = temp.contT;
            }
            if(contL<temp.contL){
                contL = temp.contL;
            }

            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';

            cadena +='l'+(contL-2)+':\n';
            var aux2 = SENTENCIAS(actual.hijos[0].hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
            ambito = aux2.ambito;

            cadena+=aux2.valor;
            cadena +='l'+(contL-1)+':\n';
        
            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }
        
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux.valor = temp.valor+cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            aux.romper=aux2.romper;
            aux.ambito  = ambito;
            return aux;         
}

function ELSE_IF_OP(actual,contT,contL,ambitoPadre,ambito,nombreClase){
            var cadena = '';
            let temp=EXP_3D(actual.hijos[0].hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }
            if(contT<temp.contT){
                contT = temp.contT;
            }
            if(contL<temp.contL){
                contL = temp.contL;
            }

            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';

            cadena +='l'+(contL-2)+':\n';
            var aux2 = SENTENCIAS(actual.hijos[0].hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
            ambito = aux2.ambito;
            cadena+=aux2.valor;
            
            cadena += 'goto l'+(contL++)+';\n';
            cadena +='l'+(contL-2)+':\n';
            var nol = contL-1;

            var lista ='l'+(contL-1);
        
            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }

           
            for(var i=2;i<(actual.hijos[0].hijos.length);i++){
                var temp3 = ELSE_IF_OP2(actual.hijos[0].hijos[i],contT,contL,nombreClase);
                ambito = temp3.ambito;
                lista += ','+temp3._l;
                if(contT<temp3.contT){
                    contT = temp3.contT;
                } 
                if(contL<temp3.contL){
                    contL = temp3.contL;
                }
                cadena += temp3.valor; 
                
            }
        
            cadena += lista+':\n';
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux.valor = temp.valor+cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-2);
            aux.tipo = 'booleano';
            aux.romper= aux2.romper;
            return aux;       
}

function ELSE_IF_OP2(actual,contT,contL,ambitoPadre,ambito,nombreClase){
            var cadena = '';
            let temp =EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }
            if(contT<temp.contT){
                contT = temp.contT;
            }
            if(contL<temp.contL){
                contL = temp.contL;
            }

            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';

            cadena +='l'+(contL-2)+':\n';
            var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
            ambito = aux2.ambito;

            cadena+=aux2.valor;
            
            cadena += 'goto l'+(contL++)+';\n';
            cadena +='l'+(contL-2)+':\n';
        
            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }
        
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux.valor = temp.valor+cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            aux.romper = aux2.romper;
            return aux;  
}

function PRINT(actual,contT,contL,ambitoPadre,ambito){
    var temp = EXP_3D(actual.hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);
    
    if(contT<temp.contT){
        contT=temp.contT;
    }
    if(contL<temp.contL){
        contL=temp.contL;
    }

    var cadena ='';
    cadena += temp.valor;

    var tipo ='';

    switch(temp.tipo.toLowerCase()){
        case 'char':
            tipo = 'c'; 
        break;
        case 'int':
            tipo = 'e'; 
        break;
        case 'double':
            tipo = 'd'; 
        break;
        case 'booleano':
            tipo = 'e'; 
        break;
        case 'string':
            tipo = 'c'; 
        break;
    }

    if(temp.tipo.toLowerCase()=='string'){
        cadena += 't'+(contT++)+'='+(temp._t)+';\n';

        cadena += 'l'+(contL++)+':\n';
        cadena += 't'+(contT++)+'=heap[t'+(contT-2)+'];\n'; 

        cadena += 'if(0==t'+(contT-1)+') goto l'+(contL++)+';\n';

        
        cadena += 'print(\"%'+tipo+'\",t'+(contT-1)+');\n';            

        cadena += 't'+(contT-2)+'=t'+(contT-2)+'+1;\n';
        cadena += 'goto l'+(contL-2)+';\n'; 

        cadena += 'l'+(contL-1)+':\n';
    }
    else{
        cadena+='print(\"%'+tipo+'\",'+temp._t+');\n';
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux.valor = cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
    return aux;
}

function PRINTLN(actual,contT,contL,ambitoPadre,ambito){
    var temp = EXP_3D(actual.hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);
    errores=errores;
    if(contT<temp.contT){
        contT=temp.contT;
    }
    if(contL<temp.contL){
        contL=temp.contL;
    }

    var cadena ='';
    cadena += temp.valor;

    var tipo ='';

    switch(temp.tipo.toLowerCase()){
        case 'char':
            tipo = 'c'; 
        break;
        case 'int':
            tipo = 'e'; 
        break;
        case 'double':
            tipo = 'd'; 
        break;
        case 'booleano':
            tipo = 'e'; 
        break;
        case 'string':
            tipo = 'c'; 
        break;
    }

    if(temp.tipo.toLowerCase()=='string'){
        cadena += 't'+(contT++)+'='+(temp._t)+';\n';

        cadena += 'l'+(contL++)+':\n';
        cadena += 't'+(contT++)+'=heap[t'+(contT-2)+'];\n'; 

        cadena += 'if(0==t'+(contT-1)+') goto l'+(contL++)+';\n';

        
        cadena += 'print(\"%'+tipo+'\",t'+(contT-1)+');\n';            

        cadena += 't'+(contT-2)+'=t'+(contT-2)+'+1;\n';
        cadena += 'goto l'+(contL-2)+';\n'; 

        cadena += 'l'+(contL-1)+':\n';
    }
    else{
        cadena+='print(\"%'+tipo+'\",'+temp._t+');\n';
    }
    cadena+='t'+(contT)+'=10;\n'
    cadena+='print(\"%c\",t'+(contT)+');\n';
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
            aux.valor = cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
    return aux;
}


function DECLARACION_VARIABLE_CLASE(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando variable'||actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando vector'||actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='asignacion vector'){
        var vec = 0;
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre!=0){
            ERRORES_ASGNACION_VARIABLE_VECTOR(actual,contT,contL);
            vec = actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre;
       
            for(var i=0;i<actual.hijos[2].hijos[0].hijos.length;i++){
                if(actual.hijos[2].hijos[0].hijos[1].nombre=='EXP'){
                    var error = new error2.Error();
                    error.tipo = 'semantico';
                    error.linea = actual.hijos[1].linea; 
                    error.columan = actual.hijos[1].columna;
                    error.error = 'No es posible asignar la expresion a la variable \"'+actual.hijos[2].hijos[0].hijos[i].nombre;+'\" ya que es un vector';            
                    errores.lista.push(error);
                }
            }

            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[2].hijos[i].nombre=='inicializando vector'){
                    AsignarValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito,'t'+contT);
                    cadena+='t'+(contT++)+'=p;\n';                    
                    cadena+='';
                    cadena+='stack[p]=null;\n';
                    cadena+='p=p+1;\n'; 
                }
                else{
                    AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                    cadena+='t'+(contT++)+'=p;\n';
                    cadena+='stack[p]=null;\n';
                    cadena+='p=p+1;\n'; 
                }                                   
            }
            
            if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializador vector'){    
                var listaV = [];
                for(var i=0;i<actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos.length;i++){
                    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[i].nombre=='EXP'){
                        var temp = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[i].hijos[0],contT,contL,ambitoPadre,ambito); 
                        listaV.push(temp._t);
                        contT = temp.contT;
                        contL = temp.contL;
                        cadena+=temp.valor;    
                    }else{
                        var temp = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[i],contT,contL,ambitoPadre,ambito); 
                        listaV.push(temp._t);
                        contT = temp.contT;
                        contL = temp.contL;
                        cadena+=temp.valor;    
                    }
                }  

                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(actual.hijos[2].hijos[i].nombre=='inicializando vector'){
                        var lis = llenarVector(contT,contL,listaV);
                        contL = lis.contT;
                        contT = lis.contT;
                        AsignarValorIdV(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito,listaV,lis._t);
                    }
                    else{
                        var lis = llenarVector(ContT,contL,listaV);
                        contL = lis.contT;
                        contT = lis.contT;
                        AsignarValorIdV(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,listaV,lis._t);
                    }                                   
                }
                
            }
            else{

            }

        }
        else{
            ERRORES_ASGNACION_VARIABLE(actual,contT,contL);
            var temp2; 
            var cadena = '';
        
            //se nicializan las veriables
            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                    if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                        AsignarValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito,'t'+contT);
                        cadena+='t'+(contT++)+'=p;\n';
                        cadena+='stack[p]=0;\n';
                        cadena+='p=p+1;\n';
                    }
                    else{
                        AsignarValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito,'t'+contT);
                        cadena+='t'+(contT++)+'=p;\n';
                        cadena+='stack[p]=null;\n';
                        cadena+='p=p+1;\n';                    
                    }
                }
                else{
                    if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                        AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                        cadena+='t'+(contT++)+'=p;\n';
                        cadena+='stack[p]=0;\n';
                        cadena+='p=p+1;\n';
                    }
                    else{
                        AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                        cadena+='t'+(contT++)+'=p;\n';
                        cadena+='stack[p]=null;\n';
                        cadena+='p=p+1;\n';                    
                    }
                }   
            }            

            if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='EXP'){
                var temp2 = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
                cadena+=temp2.valor;
                if(contT<temp2.contT){
                    contT=temp2.contT;
                }
        
                if(contL<temp2.contL){
                    contL=temp2.contL;
                }
                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(temp2.tipo != actual.hijos[1].nombre){
                        if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                            var error = new error2.Error();
                            error.tipo = 'semantico';
                            error.linea = actual.hijos[1].linea; 
                            error.columan = actual.hijos[1].columna;
                            error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                            errores.lista.push(error);
                        }
                        else{     
                            var error = new error2.Error();
                            error.tipo = 'semantico';
                            error.linea = actual.hijos[1].linea; 
                            error.columan = actual.hijos[1].columna;
                            error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                            errores.lista.push(error);
                        }
                    }

                }  

                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                            cadena+='stack['+aux._t+']='+temp2._t+';\n';
                        
                        }
                        else{
                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                            cadena+='stack['+aux._t+']='+temp2._t+';\n';
                        }
                    }
                    else{
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='stack['+aux._t+']='+temp2._t+';\n';
                        }
                        else{

                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='stack['+aux._t+']='+temp2._t+';\n';     
                        }
                    }   
                }   

            }
            else if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializador variable'){
                if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[0].nombre==''){
                    
                    var tip =  actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0].nombre;

                    for(var i=0;i<actual.hijos[2].hijos.length;i++){
                        if(tip != actual.hijos[1].nombre){
                                if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                                    var error = new error2.Error();
                                    error.tipo = 'semantico';
                                    error.linea = actual.hijos[1].linea; 
                                    error.columan = actual.hijos[1].columna;
                                    error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                    errores.lista.push(error);
                                }
                                else{     
                                    var error = new error2.Error();
                                    error.tipo = 'semantico';
                                    error.linea = actual.hijos[1].linea; 
                                    error.columan = actual.hijos[1].columna;
                                    error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                    errores.lista.push(error);
                                }
                        }
                    }
                    var val ='';
                            switch(tip){
                                case 'int':
                                val = 0;
                                case 'double':
                                val = 0;
                                case 'boolean':
                                val = 0;
                                break;
                                case 'string':
                                val = '';
                                case 'char':
                                val = '';
                    }
                    for(var i=0;i<actual.hijos[2].hijos.length;i++){
                        if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                            if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                                cadena+='stack['+aux._t+']=0;\n';
                            
                            }
                            else{
                                //verificar luego
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']=0;\n';
                            }
                        }
                        else{
                            if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']=0;\n';
                            }
                            else{
    
                                //verificar luego
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']=0;\n';     
                            }
                        }   
                    }
                }
                else{
                    var temp2 = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
                    cadena+=temp2.valor;
                    if(contT<temp2.contT){
                        contT=temp2.contT;
                    }
            
                    if(contL<temp2.contL){
                        contL=temp2.contL;
                    }    
                    for(var i=0;i<actual.hijos[2].hijos.length;i++){
                        if(temp2.tipo != actual.hijos[1].nombre){
                            if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                                var error = new error2.Error();
                                error.tipo = 'semantico';
                                error.linea = actual.hijos[1].linea; 
                                error.columan = actual.hijos[1].columna;
                                error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                errores.lista.push(error);
                            }
                            else{     
                                var error = new error2.Error();
                                error.tipo = 'semantico';
                                error.linea = actual.hijos[1].linea; 
                                error.columan = actual.hijos[1].columna;
                                error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                errores.lista.push(error);
                            }
                        }
                    }
    
                    for(var i=0;i<actual.hijos[2].hijos.length;i++){
                        if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                            if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                                cadena+='stack['+aux._t+']='+temp2._t+';\n';
                            
                            }
                            else{
                                //verificar luego
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']='+temp2._t+';\n';
                            }
                        }
                        else{
                            if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']='+temp2._t+';\n';
                            }
                            else{
    
                                //verificar luego
                                let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                                cadena+='stack['+aux._t+']='+temp2._t+';\n';     
                            }
                        }   
                    }
                }
            }
                
                var codigo_var = '';

                var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
                aux.valor = cadena;
                aux.contL = contL;
                aux.contT = contT;
                aux._t = 't'+(contT-1);
                aux._l = 'l'+(contL-1);
                aux.tipo = 'booleano';
                return aux;   
            }     

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        return aux;  
    }
    else if(actual.hijos[2].nombre=='variables'){
        var vec = 0;
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].nombre!=0){
            vec = actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos.nombre;
            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                cadena+='t'+(contT++)+'=p;\n';
                cadena+='stack[p]=1;\n';
                cadena+='p=p+1;\n';

                for(var j=0;j<vec;j++){
                    cadena+='stack[p]=null;\n';
                    cadena+='p=p+1;\n';
                };                                    
            }
        }
        else{    
            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                    AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                    cadena+='t'+(contT++)+'=p;\n';
                    cadena+='stack[p]=0;\n';
                    cadena+='p=p+1;\n';
                }
                else{
                    AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                    cadena+='t'+(contT++)+'=p;\n';
                    cadena+='stack[p]=null;\n';
                    cadena+='p=p+1;\n';                    
                }
            }            
        }   
    }

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;  
}


function llenarVector(contT,contL,lista){
    var cadena = '';
    cadena += 't'+(contT++)+'=k;\n';

    var tam = 't'+(contT++);
    
    if(lista.length==1){
        cadena += tam+'='+lista[0]+';\n';
    }
    else if(lista.length==2){
        cadena += tam+'='+lista[0]+'*'+lista[1]+';\n';
    }
    else{
        for(var i=0;i<lista.length;i++){
            if(i==0){
                cadena += tam+'='+lista[0]+'*'+lista[1]+';\n';
                i++;
            }
            else{
                cadena += tam+'='+tam+'*'+lista[i]+';\n';
            }
        }
    }
    cadena += tam+'=k+'+tam+';\n';
    cadena += 't'+(contT)+'=k;\n';

    cadena += 'l'+contL+':\n';
    cadena += 'heap[t'+contT+']=null;\n';
    cadena += 't'+contT+'=t'+contT+'+1;\n';
    cadena += 'K=K+1;\n';
    cadena += 'if('+tam+'>t'+(contT++)+') goto l'+(contL++)+';\n';
    
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-3);
    return aux; 
}



function obtenerParametros(actual,contT,contL,ambitoPadre,nombreClase){
    var clase;
    var ambitoC;
    var ambitoPadreC;
    var existe = true;
    for(var i=0;i<tabla.length;i++){
        var nombreObjeto = actual.hijos[0].nombre;
        if(tabla[i].nombre==nombreObjeto&&tabla[i].rol=='clase'){
            clase = tabla[i].compilar;         
            ambitoC = tabla[i].ambito;
            ambitoPadreC = tabla[i].ambitoPadre;
            existe = false;
            break;
        }
    }


    if(existe){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La clase '+actual.hijos[1].nombre+' no existe';
        errores.lista.push(error);

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
        aux.valor = cadena;
        aux.contL = contL;
        aux.contT = contT;
        return aux;
    }

    if(clase.length==4){

    }
    else{

    }

    var nombreClase = clase.hijos[2].nombre;
    var aux;
    var nombreObj = actual.hijos[1].nombre;
    var contador =0
    var temp;
    var cadena='';
    for(var i=0;i<clase.hijos.length;i++){
        if(clase.hijos[i].nombre=='cuerpo'){
            aux = contarVariables(clase.hijos[i]);
            break;
        }
    }
    let t = 't'+(contT);
    cadena += 't'+(contT++)+'=k;\n';
    for(var i=0;i<aux.nombres.length;i++){
        cadena += 'heap[k]=0;\n';
        cadena += 'k=k+1;\n';
    }

    for(var i=0;i<clase.hijos.length;i++){
        if(clase.hijos[i].nombre=='cuerpo'){
            temp = variableObjeto(clase.hijos[i],contT,contL,ambitoPadreC,ambitoC,aux,t,nombreClase,nombreObj,nombreClase);
            break;
        }
    }

    temp.valor=cadena+temp.valor;

    return temp;
}

function operarConstructor(actual,contT,contL,ambitoPadre,ambito){
    var clase;
    for(var i=0;i<tabla.length;i++){
        if(actual.hijos[0].nombre==tabla[i].nombre&&tabla[i].rol=='clase'){
            clase = tabla[i];
        }
    }

    var cadena='';
    var listaPar=[];
    var nombre = actual.hijos[0].nombre+'_'+actual.hijos[0].nombre;
    if(actual.hijos[2].hijos.length != 0){
        var temp;
        for(var i=0;i<actual.hijos[2].hijos[0].hijos.length;i++){
            if(actual.hijos[2].hijos[0].hijos[i].nombre=='EXP'){
                temp = EXP_3D(actual.hijos[2].hijos[0].hijos[i].hijos[0],contT,contL,ambitoPadre,ambito); 
            }
            else{
                temp = EXP_3D(actual.hijos[2].hijos[0].hijos[i],contT,contL,ambitoPadre,ambito); 
            }
            cadena += temp.valor;
            contL = temp.contL;
            contT = temp.contT;
            listaPar.push(temp._t);
            nombre += '_'+temp.tipo;

        }
    }
    

    var funcion;
    var ambitof = 0;
    var ambitoPadref = 0;
    var encontrado = true;
    var lista2=[];
    for(var i=0;i<tabla.length;i++){
        if(nombre==tabla[i].nombre){
            encontrado = false;
            lista2=tabla[i].listaParametros;
            break;
        }
    }

    if(encontrado){
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;
    }
    else{
        for(var i=0;i<lista2.length;i++){
            cadena += 'stack['+lista2[i]+']='+listaPar[i]+';\n';
        }

        cadena += 'call ' +nombre+';\n';
    }



    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;
}


function obtenerParametros2(ambito){
    var lista =[];

    for(var i=0;i<tabla.length;i++){
        var ambit =tabla[i].ambito+1;
        var rol = tabla[i].rol;
        if(ambit==ambito&&rol=='variable clase'&&tabla[i].estatico!=1){
            lista.push(tabla[i].valor);
        }
    }

    return lista;
}

function asignarFunciones(actual,ambito,nombreClase){
    var ambitoc=0;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==actual.hijos[0].nombre&&tabla[i].rol=='clase'){
            ambitoc = tabla[i].ambito;
            break;
        }
    }
    var lista =[];
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].ambitoPadre==ambitoc){
            if(tabla[i].nombre2!=undefined){
                lista.push(tabla[i].nombre2);
            }
        }
    }
    AsignarFunconesObj(actual.hijos[1].nombre,ambito,nombreClase,lista);
}

function variableObjetoConAsignacion(actual,contT,contL,ambito,ambitoHijo){
    var temp;
    
    temp = obtenerParametros(actual,contT,contL,ambito,actual.hijos[0].nombre);
    asignarFunciones(actual,ambito,actual.hijos[0].nombre);
    contL = temp.contL;
    contT = temp.contT;

    if(actual.hijos[2].hijos.length==0){
        if(actual.hijos[0].nombre!=actual.hijos[2].nombre){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La asignacion debe ser de tipo '+actual.hijos[0].nombre;        
            errores.lista.push(error);
        }
    }
    else{
        if(actual.hijos[0].nombre!=actual.hijos[2].nombre){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La asignacion debe ser de tipo '+actual.hijos[0].nombre;        
            errores.lista.push(error);
        }
    }

    var listaV;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==actual.hijos[0].nombre&&tabla[i].rol=='clase'){
            listaV = obtenerParametros2(tabla[i].ambito);
            break;
        }
    }
    if(listaV==undefined){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La clase '+actual.hijos[1].nombre+' no existe';
        errores.lista.push(error);

        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
        aux.valor = cadena;
        aux.contL = contL;
        aux.contT = contT;
        return aux;
    }

    var ambit1 = 0;
    var ambit2 = 0;



    var listaV2 = obtenerValorId2(actual.hijos[1].nombre,ambito,ambitoHijo).variables;
    var cadena ='';
    for(var i=0;i<listaV.length;i++){
        cadena +='t'+(contT)+'=stack['+listaV[i]+'];\n';
        cadena +='heap['+listaV2[i].valor+']=t'+(contT++)+';\n';
    }

    var temp1 = operarConstructor(actual,contT,contL,ambito);
    
    
    contL = temp1.contL;
    contT = temp1.contT;

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
    aux.valor = temp.valor+temp1.valor+cadena;
    aux.contL = temp.contL;
    aux.contT = temp.contT;
    aux._t = 't'+(temp.contT-1);
    aux._l = 'l'+(temp.contL-1);
    aux.tipo = 'booleano';

    return aux;
}


function obtenerVariablesObjeto(actual,contT,contL,ambito,nombreClase){
    var clase
}

function variableObjetoSinAsignacion(actual,contT,contL,ambitoPadre,ambito){
    var cadena ='t'+contT+'=p;\n';
    cadena += 'stack[t'+(contT++)+']=null;\n';
    AsignarValorId(actual.hijos[1].nombre,ambitoPadre,ambito,'t'+(contT-1));

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';

    return aux;
}


function variabeClase(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando variable'||actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando vector'||actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='asignacion vector'){
        return variableAsignacionObjeto(actual,contT,contL,ambitoPadre,ambito,nombreClase);
    }
    else if(actual.hijos[2].nombre=='variables'){
        return variableSinAsignacionObjeto(actual,contT,contL,ambitoPadre,ambito);
    }    
                    
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
   return aux;
}

function variableObjeto(actual,contT,contL,ambitoPadre,ambito,contador,t,clase,nombreObj,nombreClase){
    var cadena='';
    var listaT=[];
    var temp;
    for(var i=0;i<actual.hijos.length;i++){
        if(actual.hijos[i].nombre=='variable clase'){
            var estatico = true;
            for(var x=0;x<actual.hijos[i].hijos[0].hijos.length;x++){
                if(actual.hijos[i].hijos[0].hijos[x].nombre=='static'){
                    estatico = false;
                    break;
                }
            }
            if(estatico){
                errores =errores;
                temp = variabeClase(actual.hijos[i],contT,contL,ambito,ambito+1,nombreClase);
                contT = temp.contT;
                contL = temp.contL;
                cadena += temp.valor;
                listaT.push(temp._t);
            }

        }
        else if(actual.hijos[i].nombre=='declaracion objeto'){
            var estatico = true;
            for(var x=0;x<actual.hijos[i].hijos[0].hijos.length;x++){
                if(actual.hijos[i].hijos[0].hijos[x].nombre=='static'){
                    estatico = false;
                    break;
                }
            }
            if(estatico){           
                temp = ObjetoO(actual.hijos[i],contT,contL,ambitoPadre,ambito+1,nombreClase);
                contT = temp.contT;
                contL = temp.contL;
                cadena += temp.valor;
                listaT.push(temp._t);
            }

        }
        else if(actual.hijos[i].nombre=='asignacion variable'){
            var _t;
            for(var j=0;j<contador.nombres.length;j++){
                if(contador.nombres[j].nombre==actual.hijos[i].hijos[0].nombre){
                    _t = listaT[j];
                    break;
                }
            }
            AsignacionObj(actual.hijos[i],contT,contL,ambitoPadre,ambito,_t);
        }

    }
    let vars='';
    for(var i=0;i<contador.nombres.length;i++){
        vars += 'heap['+t+']='+listaT[i]+';\n';
        vars += t+'='+t+'+1;\n';
    }

    for(var i=0;i<tabla.length-1;i++){
        let nombre = tabla[i].nombre; 
        if(nombreObj==nombre&&tabla[i].tipo==clase){   
            for(var j=0;j<contador.nombres.length;j++){
                tabla[i].variables.push({nombre:contador.nombres[j].nombre,valor:listaT[j],tipo:contador.nombres[j].tipo});
            }
            break;
        }
    }

    cadena += vars;

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    if(temp!=undefined){
        aux._t = temp._t;
    }
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;
}


function contarVariables(actual){
    var cantidad=0;
    var lista=[]; 
    for(var i=0;i<actual.hijos.length;i++){
        if(actual.hijos[i].nombre=='variable clase'){
            for(var j=0;j<actual.hijos[i].hijos[2].hijos.length;j++){
                if(actual.hijos[i].hijos[2].hijos[j].nombre=='inicializando vector'||actual.hijos[i].hijos[2].hijos[j].nombre=='inicializando variable'){
                    var estatico = true;
                    for(var x=0;x<actual.hijos[i].hijos[0].hijos.length;x++){
                        if(actual.hijos[i].hijos[0].hijos[x].nombre=='static'){
                            estatico = false;
                        }
                    }
                    if(estatico){
                        var aux ={nombre:actual.hijos[i].hijos[2].hijos[j].hijos[0].nombre,tipo:actual.hijos[i].hijos[1].nombre};
                        lista.push(aux);
                    }
                }
                else{
                    var estatico = true;
                    for(var x=0;x<actual.hijos[i].hijos[0].hijos.length;x++){
                        if(actual.hijos[i].hijos[0].hijos[x].nombre=='static'){
                            estatico = false;
                        }
                    }
                    if(estatico){       
                        var aux ={nombre:actual.hijos[i].hijos[2].hijos[j].nombre,tipo:actual.hijos[i].hijos[1].nombre};
                        lista.push(aux);
                    }    
                }                               
            }
        }
        else if(actual.hijos[i].nombre=='declaracion objeto'){
            cantidad++;
            var aux ={nombre:actual.hijos[i].hijos[1].nombre,tipo:actual.hijos[i].hijos[0].nombre};
            lista.push(aux);
        }
        else if(actual.hijos[i].nombre=='declaracion objeto vector'){
            cantidad++;
            var aux ={nombre:actual.hijos[i].hijos[1].nombre,valor:''};
            lista.push(aux);
        }
    }

    obj = {nombres:lista,cantidad:cantidad};
    return obj;
}

function variableAsignacionObjeto(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    var vec = 0;
    var _t='';
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre!=0){
        ERRORES_ASGNACION_VARIABLE_VECTOR(actual,contT,contL);
        vec = actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre;
        for(var i=0;i<actual.hijos[2].hijos[0].hijos.length;i++){
            if(actual.hijos[2].hijos[0].hijos[1].nombre=='EXP'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[1].linea; 
                error.columan = actual.hijos[1].columna;
                error.error = 'No es posible asignar la expresion a la variable \"'+actual.hijos[2].hijos[0].hijos[i].nombre;+'\" ya que es un vector';            
                errores.lista.push(error);
            }
        }
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            if(actual.hijos[2].hijos[i].nombre=='inicializando vector'){
                AsignarValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito,'t'+contT);
                //obtenerIdObjeto();


                cadena+='t'+(contT++)+'=p;\n';
                
                for(var j=0;j<vec;j++){

                }
                
                cadena+='';
                cadena+='stack[p]=null;\n';
                cadena+='p=p+1;\n'; 
            }
            else{
                AsignarValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito,'t'+contT);
                cadena+='t'+(contT++)+'=p;\n';
                cadena+='stack[p]=null;\n';
                cadena+='p=p+1;\n'; 
            }                                   
        }
        
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializador vector'){     
   
        }
        else{

        }

    }
    else{
        ERRORES_ASGNACION_VARIABLE(actual,contT,contL);
        var temp2; 
        var cadena = '';
    
        //se nicializan las veriables
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                    _t+='t'+(contT);
                    cadena+='t'+(contT++)+'=k;\n';
                    cadena+='heap[k]=0;\n';
                    cadena+='k=k+1;\n';
                }
                else{
                    _t+='t'+(contT);
                    cadena+='t'+(contT++)+'=k;\n';
                    cadena+='heap[k]=null;\n';
                    cadena+='k=k+1;\n';                    
                }
            }
            else{
                if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                    _t+='t'+(contT);
                    cadena+='t'+(contT++)+'=k;\n';
                    cadena+='heap[k]=0;\n';
                    cadena+='k=k+1;\n';
                }
                else{
                    _t+='t'+(contT);
                    cadena+='t'+(contT++)+'=k;\n';
                    cadena+='heap[k]=null;\n';
                    cadena+='k=k+1;\n';                    
                }
            }   
        }            

        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='EXP'){
            var temp2 = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
            cadena+=temp2.valor;
            
            if(contT<temp2.contT){
                contT=temp2.contT;
            }
    
            if(contL<temp2.contL){
                contL=temp2.contL;
            }

            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(temp2.tipo != actual.hijos[1].nombre){
                    if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                        errores.lista.push(error);
                    }
                    else{     
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                        errores.lista.push(error);
                    }
                }

            }  

            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                    if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                        let aux;
                        aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                        if(aux==undefined){
                            aux = obtenerIdObjeto(actual.hijos[2].hijos[i].hijos[0].nombre,nombreClase);
                        }
                        cadena+='heap['+_t+']='+temp2._t+';\n';
                    
                    }
                    else{
                        //verificar luego
                        let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                        cadena+='heap['+_t+']='+temp2._t+';\n';
                    }
                }
                else{
                    if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                        let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                        cadena+='heap['+_t+']='+temp2._t+';\n';
                    }
                    else{

                        //verificar luego
                        let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                        cadena+='heap['+_t+']='+temp2._t+';\n';     
                    }
                }   
            }   

        }
        else if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializador variable'){
            if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[0].nombre==''){
                
                var tip =  actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0].nombre;

                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(tip != actual.hijos[1].nombre){
                            if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                                var error = new error2.Error();
                                error.tipo = 'semantico';
                                error.linea = actual.hijos[1].linea; 
                                error.columan = actual.hijos[1].columna;
                                error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                errores.lista.push(error);
                            }
                            else{     
                                var error = new error2.Error();
                                error.tipo = 'semantico';
                                error.linea = actual.hijos[1].linea; 
                                error.columan = actual.hijos[1].columna;
                                error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                                errores.lista.push(error);
                            }
                    }
                }
                var val ='';
                        switch(tip){
                            case 'int':
                            val = 0;
                            case 'double':
                            val = 0;
                            case 'boolean':
                            val = 0;
                            break;
                            case 'string':
                            val = '';
                            case 'char':
                            val = '';
                }
                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                            cadena+='heap['+_t+']=0;\n';
                        
                        }
                        else{
                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']=0;\n';
                        }
                    }
                    else{
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']=0;\n';
                        }
                        else{

                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']=0;\n';     
                        }
                    }   
                }
            }
            else{
                var temp2 = EXP_3D(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
                cadena+=temp2.valor;
                if(contT<temp2.contT){
                    contT=temp2.contT;
                }
        
                if(contL<temp2.contL){
                    contL=temp2.contL;
                }    
                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(temp2.tipo != actual.hijos[1].nombre){
                        if(actual.hijos[2].hijos[i].nombre == 'inicializando variable'){    
                            var error = new error2.Error();
                            error.tipo = 'semantico';
                            error.linea = actual.hijos[1].linea; 
                            error.columan = actual.hijos[1].columna;
                            error.error = 'A la variable \"'+ actual.hijos[2].hijos[i].hijos[0].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                            errores.lista.push(error);
                        }
                        else{     
                            var error = new error2.Error();
                            error.tipo = 'semantico';
                            error.linea = actual.hijos[1].linea; 
                            error.columan = actual.hijos[1].columna;
                            error.error = 'A la variable \"'+ actual.hijos[2].hijos[1].nombre+ '\" no es posible asignarle la expresion ya que no es de tipo \"'+actual.hijos[1].nombre+'\"';            
                            errores.lista.push(error);
                        }
                    }
                }

                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);   
                            cadena+='heap['+_t+']='+temp2._t+';\n';
                        
                        }
                        else{
                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].hijos[0].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']='+temp2._t+';\n';
                        }
                    }
                    else{
                        if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']='+temp2._t+';\n';
                        }
                        else{

                            //verificar luego
                            let aux = obtenerValorId(actual.hijos[2].hijos[i].nombre,ambitoPadre,ambito);
                            cadena+='heap['+_t+']='+temp2._t+';\n';     
                        }
                    }   
                }
            }
        }
            
            var codigo_var = '';

            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
            aux.valor = cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = _t;
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            return aux;  
    
        }     
}

function generarObjeto(actual,contT,contL,ambitoPadre,ambito){
    let cadena = 't'+contT+'=k;\n';
    cadena += 'k=k+1;\n';
    cadena += 'heap[t'+(contT++)+']=1;\n';
    let t = 't'+(contT-1);


    let temp;
    temp = variableObjetoSinAsignacion(actual,contT,contL,ambitoPadre,ambito);
    contT = temp.contT;
    contL = temp.contL;
    cadena+=temp.valor;

    if(actual.hijos.length==3){
        temp = variableObjetoConAsignacion(actual,contT,contL,ambitoPadre,ambito);
    }
   

    contT = temp.contT;
    contL = temp.contL;


    temp.valor += 't'+(contT++)+'=p;\n'
    temp.valor += 'stack[p]='+t+';\n'
    temp.valor += 'p=p+1;\n';

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux.valor = cadena + temp.valor;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = t;
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;
}

function Objeto(actual,contT,contL,ambitoPadre,ambito){
    var temp; 
    temp = generarObjeto(actual,contT,contL,ambitoPadre,ambito);

    contT = temp.contT;
    contL = temp.contL;

    var aux1 = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux1.valor = temp.valor;
    aux1.contL = contL;
    aux1.contT = contT;
    aux1._t = temp._t;
    aux1._l = 'l'+(contL-1);
    aux1.tipo = 'booleano';
    return aux1;  
}


function ObjetoO(actual,contT,contL,ambitoPadre,ambito){
    var temp; 
    temp = generarObjeto(actual,contT,contL,ambitoPadre,ambito);

    contT = temp.contT;
    contL = temp.contL;

    var aux1 = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};              
    aux1.valor = temp.valor;
    aux1.contL = contL;
    aux1.contT = contT;
    aux1._t = temp._t;
    aux1._l = 'l'+(contL-1);
    aux1.tipo = 'booleano';
    return aux1;  
}


function variableSinAsignacionObjeto(actual,contT,contL,ambitoPadre,ambito){
    var vec = 0;
    var cadena = '';
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].nombre!=0){
        vec = actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos.nombre;
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            cadena+='t'+(contT++)+'=k;\n';
            cadena+='heap[k]=null;\n';
            cadena+='k=k+1;\n';                                    
        }
    }
    else{    
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            if(actual.hijos[1].nombre=='int'||actual.hijos[1].nombre=='double'||actual.hijos[1].nombre=='boolean'){
                cadena+='t'+(contT++)+'=k;\n';
                cadena+='heap[k]=0;\n';
                cadena+='k=k+1;\n';
            }
            else{
                cadena+='t'+(contT++)+'=k;\n';
                cadena+='heap[k]=null;\n';
                cadena+='k=k+1;\n';                    
            }
        }            
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.ambito = ambito;
    return aux;                

}

function CUERPO(actual,contT,contL,ambito,nombreClase){ 
    var ambitoPadre=0;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].rol=='clase'&&tabla[i].nombre==nombreClase){
            ambito = tabla[i].ambito;
            ambitoPadre = tabla[i].ambitoPadre;
            break;
        }
    }

    var temp;

    var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};     
    for(var i=0;i<actual.hijos.length;i++){
        var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        switch(actual.hijos[i].nombre){
            case 'variable clase':
                ERRORES_MODIFICADORES(actual.hijos[i].hijos[0],contT,contL,'la variable \"'+actual.hijos[i].hijos[2].hijos[0].nombre+'\"');
            break; 
            case 'asignacion objeto':
                temp = asignarObjeto(actual.hijos[i],contT,contL,ambitoPadre,ambito+1);
            break;
        }

        if(contT<temp.contT){
            contT=temp.contT;
        }
        if(contL<temp.contL){
            contL=temp.contL;
        }
        retorno.valor += temp.valor;
        retorno.contL = contL;
        retorno.contT = contT;
        retorno._l = temp._l;
        retorno._t = temp._t;  
    }
    return retorno;
}

function asignarObjeto(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    if(actual.hijos[2].nombre=='++pre'||actual.hijos[2].nombre=='++pre'||actual.hijos[2].nombre=='++pos'||actual.hijos[2].nombre=='++pos'){
        var aux = mmprepos(actual.hijos[2],contT,contL,ambitoPadre,ambito);
        var temp = obtenerValorId2(actual.hijos[0],ambitoPadre,ambito);
        var tipo ='';
        var t ='';


        for(var i=0;i<temp.variables.length;i++){
            if(temp.variables[i].nombre==actual.hijos[1].nombre){
                tipo = temp.variables[i].tipo;
                t = temp.variables[i].valor;
                break;
            }
        }

        cadena += aux.valor;
        cadena += 'heap['+t+']='+aux._t+';\n';
    }
    if(actual.hijos[2].nombre=='EXP'){
        var aux = EXP_3D(actual.hijos[2].hijos[0],contT,contL,ambitoPadre,ambito);
        var temp = obtenerValorId2(actual.hijos[0].nombre,ambitoPadre,ambito);
        var tipo ='';
        var t ='';

        if(temp.rol=='clase'){
            var existe = true;
            for(var i=0;i<tabla.length;i++){
                if(tabla[i].estatico==1&&temp.ambito==tabla[i].ambito&&tabla[i].nombre==actual.hijos[1].nombre){
                    tipo = tabla[i].tipo;
                    t = tabla[i].valor;
                    existe = false;
                    break;
                }
            }
            if(existe){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].linea; 
                error.columan = actual.hijos[0].columna;
                error.error = 'La variable estatica'+actual.hijos[1].nombre+' no existe';
                
                errores.lista.push(error);
            }
            else{
                if(aux.tipo.toLocaleLowerCase()!=tipo.toLocaleLowerCase()){
                    var error = new error2.Error();
                    error.tipo = 'semantico';
                    error.linea = actual.hijos[0].linea; 
                    error.columan = actual.hijos[0].columna;
                    error.error = 'La expresion no es de tipo '+aux.tipo+' y deberia ser de tipo '+tipo;
                    
                    errores.lista.push(error);
                }
            }
            cadena += aux.valor;
            cadena += 'stack['+t+']='+aux._t+';\n';
        }
        else{
            var existe = true;
            for(var i=0;i<temp.variables.length;i++){
                if(temp.variables[i].nombre==actual.hijos[1].nombre){
                    tipo = temp.variables[i].tipo;
                    t = temp.variables[i].valor;
                    existe = false;
                    break;
                }
            }
            if(existe){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].linea; 
                error.columan = actual.hijos[0].columna;
                error.error = 'La variable '+actual.hijos[1].nombre+' no existe';
                
                errores.lista.push(error);
            }else{
                if(aux.tipo.toLocaleLowerCase()!=tipo.toLocaleLowerCase()){
                    var error = new error2.Error();
                    error.tipo = 'semantico';
                    error.linea = actual.hijos[0].linea; 
                    error.columan = actual.hijos[0].columna;
                    error.error = 'La expresion no es de tipo '+aux.tipo+' y deberia ser de tipo '+tipo;
                    
                    errores.lista.push(error);
                }
            }
            cadena += aux.valor;
            if(actual.hijos[0].nombre=='this'){
                cadena += 'stack['+t+']='+aux._t+';\n';
            }
            else{
                cadena += 'heap['+t+']='+aux._t+';\n';
            }
        }

        
    }
    if(actual.hijos[1].nombre=='inicializador variable'){
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
         
        if(actual.hijos[1].hijos[0].nombre!=temp.tipo){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La expresion es de tipo '+actual.hijos[1].hijos[0].nombre+' y deberia ser de tipo '+temp.tipo;
            
            errores.lista.push(error);
        }

        if(actual.hijos[1].hijos[1].hijos.length==0){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'stack['+temp._t+']=0;\n'; 
            }
            else{
                cadena += 'stack['+temp._t+']=null;\n'; 
            }
        }
        else if(actual.hijos[1].hijos[1].hijos[0].nombre==''){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'stack['+temp._t+']=0;\n'; 
            }
            else{
                cadena += 'stack['+temp._t+']=null;\n'; 
            }
        }
        else {
            var aux = EXP_3D(actual.hijos[1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
            cadena += aux.valor;
            cadena += 'stack['+temp._t+']='+aux._t+';\n'; 
        }    
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = '';
    aux.ambito = ambito;

    return aux;
}

function WHILE(actual,contT,contL,ambitoPadre,ambito,nombreClase){
           var cadena = '';

           var temp = EXP_3D(actual.hijos[0].hijos[0],contT,contL,ambitoPadre,ambito); 

            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[0].linea; 
                error.columan = actual.hijos[0].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }

            if(contT<temp.contT){
                contT=temp.contT;
            }
            if(contL<temp.contL){
                contL=temp.contL;
            }
        
            cadena +='l'+(contL++)+':\n';
            cadena += temp.valor;
            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';
            cadena +='l'+(contL-2)+':\n';

            var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);

            cadena+=aux2.valor;

            cadena += 'goto l'+(contL-3)+';\n';
            cadena +='l'+(contL-1)+':\n';

            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }
        
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
            aux.valor = cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            aux.ambito = aux2.ambito;
            aux.romper = aux2.romper;
            return aux;                
}

function DO_WHILE(actual,contT,contL,ambitoPadre,ambito,nombreClase){
            var cadena = '';

            cadena +='l'+(contL++)+':\n';
            var nol = contL-1;

            var aux2 = SENTENCIAS(actual.hijos[0],contT,contL,ambitoPadre,ambito,nombreClase);

            cadena+=aux2.valor;

            if(contT<aux2.contT){
                contT=aux2.contT;
            }
            if(contL<aux2.contL){
                contL=aux2.contL;
            }

            var temp = EXP_3D(actual.hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
            if(temp.tipo != 'booleano'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[1].hijos[0].linea; 
                error.columan = actual.hijos[1].hijos[0].columna;
                error.error = 'La expresion no es booleana';
                
                errores.lista.push(error);
                temp = {valor:'t'+(contT++)+'=0;', contT:contT, contL:contL, _t:'t'+(contT-1),_l:'',tipo:'booleano'};
            }

            
            if(contT<temp.contT){
                contT=temp.contT;
            }
            if(contL<temp.contL){
                contL=temp.contL;
            }

            cadena += temp.valor;
            cadena +='if('+temp._t+'==1) goto l'+(contL++)+';\n';
            cadena +='goto l'+(contL++)+';\n';
            cadena +='l'+(contL-2)+':\n';

            

            cadena += 'goto l'+(nol)+';\n';
            cadena += 'l'+(contL-1)+':\n';
         
        
            var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
            aux.valor = cadena;
            aux.contL = contL;
            aux.contT = contT;
            aux._t = 't'+(contT-1);
            aux._l = 'l'+(contL-1);
            aux.tipo = 'booleano';
            aux.ambito = aux2.ambito;
            aux.romper = aux2.romper;
            return aux;                
}

function SENTENCIAS(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    let ambitoHijo = ambito+1;
    let ambitoRetorno = ambitoHijo;
    var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0,romper:{break:[],return:[]}};
    for(var i=0;i<actual.hijos.length;i++){
        var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        switch(actual.hijos[i].nombre){
            case 'ifs':
                temp = IF_3D(actual.hijos[i],contT,contL,ambito,ambitoRetorno,nombreClase);
                ambitoRetorno = temp.ambito;
                var list =[];
                for(var j=0;j<temp.romper.break.length;j++){
                    list.push(temp.romper.break[j]);
                }
                for(var j=0;j<retorno.romper.break.length;j++){
                    list.push(temp.romper.break[j]);
                }
                temp.romper.break = list;
            break;
            case 'while':
                temp = WHILE(actual.hijos[i],contT,contL,ambito,ambitoRetorno,nombreClase);
                ambitoRetorno = temp.ambito;
                for(var j=0;j<temp.romper.break.length;j++){
                    temp.valor+=temp.romper.break[j];    
                }
                temp.romper = retorno.romper;
            
                break;
            case 'do while':
                temp = DO_WHILE(actual.hijos[i],contT,contL,ambito,ambitoRetorno,nombreClase);
                ambitoRetorno = temp.ambito;
                for(var j=0;j<temp.romper.break.length;j++){
                    temp.valor+=temp.romper.break[j];    
                }
                
                temp.romper = retorno.romper;
            break; 
            case 'for':
                //error
                temp = FOR(actual.hijos[i],contT,contL,ambito,ambitoRetorno,nombreClase);
                ambitoRetorno = temp.ambito;
                for(var j=0;j<temp.romper.break.length;j++){
                    temp.valor+=temp.romper.break[j];    
                }
                temp.romper = retorno.romper;
            break; 
            case 'switch':
                temp = SWITCH(actual.hijos[i],contT,contL,ambito,ambitoRetorno,nombreClase);
                ambitoRetorno = temp.ambito;
                for(var j=0;j<temp.romper.break.length;j++){
                    temp.valor+=temp.romper.break[j];    
                }
                temp.romper = retorno.romper;
            break; 
            case 'variable clase':
               temp = DECLARACION_VARIABLE_CLASE(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break; 
            case 'print':
                temp = PRINT(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
                
            break; 
            case 'println':
                temp = PRINTLN(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break;     
            case 'invocacion metodo':
                temp = INVOCACION_METODO(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break;     
            case 'return':
                cd = 'goto l'+contL+';\n';
                var obj = {break:[],return:[]};
                obj.return.push('l'+(contL++)+':\n');

                temp = Retorno(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);      
                temp.romper = obj;
            break;     
            case 'asignacion variable':
              temp = Asignacion(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break; 
            case 'break':
                cd = 'goto l'+contL+';\n';
                var obj = {break:[],return:[]};
                obj.break.push('l'+(contL++)+':\n'); 
                temp={valor:cd, contT:contT, contL:contL, _t:'t'+contT,_l:'l'+(contL-1),tipo:'',ambito:ambito,romper:obj};
            break;
            case 'read':
                temp = read(actual.hijos[i],contT,contL,ambito,ambitoHijo);
            break;
            case 'declaracion objeto':
                temp = Objeto(actual.hijos[i],contT,contL,ambito,ambitoHijo);
            break;
            case 'asignacion objeto':
                temp = asignarObjeto(actual.hijos[i],contT,contL,ambito,ambitoHijo);
            break;
            case 'invocacion metodo variable':
                temp = invocandoMetodoVariable(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break;
            case 'asignacion vector':
                temp = AsignacionVector(actual.hijos[i],contT,contL,ambito,ambitoHijo,nombreClase);
            break;
        }
        
        
        if(contT<temp.contT){
            contT = temp.contT;
        }
        if(contL,temp.contL){
            contL = temp.contL;
        }    
        retorno.valor += temp.valor;
        retorno.contL = contL;
        retorno.contT = contT;
        retorno._l = temp._l;
        retorno._t = temp._t;
        if(temp.romper!=undefined){
            for(var x;x<temp.romper.break.length;x++){
                retorno.romper.break.push(temp.romper.break[i]); 
            }
            for(var x;x<temp.romper.return.length;x++){
                retorno.romper.return.push(temp.romper.return[i]); 
            }
        }
    } 
    if(contT>retorno.contT){
        retorno.contT = contT;
    }
    if(contL>retorno.contL){
        retorno.contL = contL;
    }
        retorno.ambito = ambitoRetorno;
    return retorno;
}

function invocandoMetodoVariable(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    let nombre = '';
    var cadena = '';
    var listaT = [];
    var listaP = [];
    for(var i=0;i<actual.hijos[2].hijos.length;i++){
        var temp = EXP_3D(actual.hijos[2].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
        nombre += '_'+temp.tipo;
        cadena += temp.valor;
        listaT.push(temp._t);
        listaP.push(temp.tipo);
    }
    
    var objVar = obtenerValorId3(actual.hijos[0].nombre,ambitoPadre,ambito);

    if(objVar.rol=='clase'){
        objVar.tipo = objVar.nombre  
    }

    var nombre2 = objVar.tipo+'_'+actual.hijos[1].nombre+nombre;


    var existe =true;
    if(objVar.rol!='clase'){
        for(var i=0;i<objVar.funciones.length;i++){
            if(objVar.funciones[i]==nombre2){
                existe = false;
                break;
            }
        }
        
    if(existe){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[0].nombre+' no pertenece al objeto '+objVar.tipo;
        errores.lista.push(error);
       
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;   
    }
    }
    
    var funcion = obtenerValorIdFuncion(nombre2);

    if(objVar.rol=='clase'&&funcion.estaticos==""){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[1].nombre+' debe ser estatica';
        errores.lista.push(error);
        
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;   
    } 
    else if(objVar.rol!='clase'&&funcion.estaticos==1){

        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[1].nombre+' no puede ser estatica';
        errores.lista.push(error);
        
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;   
    }
    
    if((funcion.acceso=='private'||funcion.acceso=='protected')){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[1].nombre+' no es publica';
        errores.lista.push(error);
        
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;    
    }    
    nombre = objVar.tipo+'_'+funcion.tipo+'_'+actual.hijos[1].nombre+nombre;

    var parametros;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==nombre){
            parametros = tabla[i].listaParametros;
            tabla[i].compilado=1;
        }
    }

    var cadena2 = 'var parametrosx=0;\n';
    if(objVar.rol=='clase'){
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            var temp = EXP_3D(actual.hijos[2].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
            cadena2 += temp.valor;
            cadena2 += parametros[i]+'=p;\n';
            cadena2 += 'stack[p]='+temp._t+';\n';
            cadena2 += 'p=p+1;\n';
        }
    } 
    else{
        for(var i=0;i<actual.hijos[1].hijos.length;i++){
            var temp = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
            cadena2 += temp.valor;
            cadena2 += parametros[i]+'=p;\n';
            cadena2 += 'stack[p]='+temp._t+';\n';
            cadena2 += 'p=p+1;\n';
        }
    }

    cadena2 +='call '+nombre+';\n';

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
    aux.valor = cadena2;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.ambito = ambito;
    return aux;    
}

function read(actual,contT,contL,ambitoPadre,ambito) {

    
}

function Asignacion(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    if(actual.hijos[1].nombre=='++pre'||actual.hijos[1].nombre=='++pre'||actual.hijos[1].nombre=='++pos'||actual.hijos[1].nombre=='++pos'){
        var aux = mmprepos(actual.hijos[1],contT,contL,ambitoPadre,ambito);
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
    
        cadena += aux.valor;
        cadena += 'stack['+temp._t+']='+aux._t+';\n';
    }
    if(actual.hijos[1].nombre=='EXP'){
        var aux = EXP_3D(actual.hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
        if(aux.tipo.toLocaleLowerCase()!=temp.tipo.toLocaleLowerCase()){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La expresion no es de tipo '+aux.tipo+' y deberia ser de tipo '+temp.tipo;
            
            errores.lista.push(error);
        }
        cadena += aux.valor;
        cadena += 'stack['+temp._t+']='+aux._t+';\n';
    }
    if(actual.hijos[1].nombre=='inicializador variable'){
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
         
        if(actual.hijos[1].hijos[0].nombre!=temp.tipo){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La expresion es de tipo '+actual.hijos[1].hijos[0].nombre+' y deberia ser de tipo '+temp.tipo;
            
            errores.lista.push(error);
        }

        if(actual.hijos[1].hijos[1].hijos.length==0){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'stack['+temp._t+']=0;\n'; 
            }
            else{
                cadena += 'stack['+temp._t+']=null;\n'; 
            }
        }
        else if(actual.hijos[1].hijos[1].hijos[0].nombre==''){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'stack['+temp._t+']=0;\n'; 
            }
            else{
                cadena += 'stack['+temp._t+']=null;\n'; 
            }
        }
        else {
            var aux = EXP_3D(actual.hijos[1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
            cadena += aux.valor;
            cadena += 'stack['+temp._t+']='+aux._t+';\n'; 
        }    
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = '';
    aux.ambito = ambito;

    return aux;
}

function AsignacionVector(actual,contT,contL,ambitoPadre,ambito){
    var aux = EXP_3D(actual.hijos[2],contT,contL,ambitoPadre,ambito);

    contT = aux.contT;
    contL = aux.contL;

    var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
    var cadena = '';
    cadena += aux.valor;
    if(aux.tipo.toLocaleLowerCase()!=temp.tipo.toLocaleLowerCase()){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La expresion no es de tipo '+aux.tipo+' y deberia ser de tipo '+temp.tipo;
            
        errores.lista.push(error);
    }
    var pos;
    var pos1;

    var t = 't'+(contT++);
    var tS = 't'+(contT++);

    if(actual.hijos[1].hijos.length==1){
        pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
        cadena += pos.valor;
       
        contT = pos.contT;

        cadena += t+'='+pos._t+';\n';
    }
    else if(actual.hijos[1].hijos.length==2){
        pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
        pos1 = EXP_3D(actual.hijos[1].hijos[1],contT,contL,ambitoPadre,ambito); 
        cadena += pos.valor;
        cadena += pos1.valor;
       
        contT = pos.contT;
        contL = pos1.contL;

        cadena += tS+'='+temp.lista[0]+'*'+pos._t+';\n';
        cadena += t+'='+tS+'+'+pos1._t+';\n';
    
    }
    else{
        for(var i=0;i<actual.hijos[1].hijos.length;i++){
            if(i==0){
                pos = EXP_3D(actual.hijos[1].hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);    
                pos1 = EXP_3D(actual.hijos[1].hijos[1],contT,contL,ambitoPadre,ambito); 
                cadena += pos.valor;
                cadena += pos1.valor;

                contT = pos.contT;
                contL = pos1.contL;

                cadena += tS+'='+temp.lista[0]+'*'+pos._t+';\n';
                cadena += t+'='+tS+'+'+pos1._t+';\n';
                i++;      
            }else{
                pos = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre,ambito);
              
                contT = pos.contT;

                cadena += pos.valor;
                cadena += tS+'='+pos._t+'*'+temp.lista[i]+';\n';
                cadena += t+'='+t+'+'+tS+';\n';    
            }
        }
    }
    cadena += 'heap['+t+']='+aux._t+';\n';
    
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = '';
    aux.ambito = ambito;

    return aux;
}

function AsignacionObj(actual,contT,contL,ambitoPadre,ambito,_t){
    var cadena = '';
    if(actual.hijos[1].nombre=='++pre'||actual.hijos[1].nombre=='++pre'||actual.hijos[1].nombre=='++pos'||actual.hijos[1].nombre=='++pos'){
        var aux = mmprepos(actual.hijos[1],contT,contL,ambitoPadre,ambito);

        cadena += aux.valor;
        cadena += 'heap['+_t+']='+aux._t+';\n';
    }
    if(actual.hijos[1].nombre=='EXP'){
        var aux = EXP_3D(actual.hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
        if(aux.tipo.toLocaleLowerCase()!=temp.tipo.toLocaleLowerCase()){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La expresion no es de tipo '+aux.tipo+' y deberia ser de tipo '+temp.tipo;
            
            errores.lista.push(error);
        }
        cadena += aux.valor;
        cadena += 'heap['+_t+']='+aux._t+';\n';
    }
    if(actual.hijos[1].nombre=='inicializador variable'){
        var temp = obtenerValorId(actual.hijos[0].nombre,ambitoPadre,ambito);
         
        if(actual.hijos[1].hijos[0].nombre!=temp.tipo){
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].linea; 
            error.columan = actual.hijos[0].columna;
            error.error = 'La expresion es de tipo '+actual.hijos[1].hijos[0].nombre+' y deberia ser de tipo '+temp.tipo;
            
            errores.lista.push(error);
        }

        if(actual.hijos[1].hijos[1].hijos.length==0){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'heap['+_t+']=0;\n'; 
            }
            else{
                cadena += 'heap['+_t+']=null;\n'; 
            }
        }
        else if(actual.hijos[1].hijos[1].hijos[0].nombre==''){
            if(actual.hijos[1].hijos[0].nombre=='int'||actual.hijos[1].hijos[0].nombre=='double'||actual.hijos[1].hijos[0].nombre=='boolean'){
                cadena += 'heap['+_t+']=0;\n'; 
            }
            else{
                cadena += 'heap['+_t+']=null;\n'; 
            }
        }
        else {
            var aux = EXP_3D(actual.hijos[1].hijos[1].hijos[0],contT,contL,ambitoPadre,ambito);
            cadena += aux.valor;
            cadena += 'heap['+_t+']='+aux._t+';\n'; 
        }    
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = '';
    aux.ambito = ambito;

    return aux;
}

function Retorno(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    var temp = obtenerValorId('return',ambitoPadre,ambito);

    if(actual.hijos[0].nombre=='EXP'){
        var temp2 = EXP_3D(actual.hijos[0].hijos[0],contT,contL,ambitoPadre,ambito);
        cadena+=temp2.valor; 
        cadena+='stack['+temp._t+']='+temp2._t+';\n';  
        contT = temp2.contT;           
        contL = temp2.contL;           
    }
    else{

    }

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                    
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    return aux;    
}

function SWITCH(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    let temp;

    temp = EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
    
    cadena += temp.valor;

    if(contT<temp.contT){
        contT=temp.contT;
    }
    if(contL<temp.contL){
        contL=temp.contL;
    }

    var _l = '';
    var def = '0';
    var def2 = '0';
    var romper = {break:[],return:[]};
    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        if(actual.hijos[1].hijos.length!=1){
            var temp2;
            if(i != actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre=='default'){
                if(i==0){
                    temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,3,1,1,ambitoPadre,ambito);
                    ambito =temp2.ambito;
                    def = '1';    
                    def2 = '1';    
                    for(var j=0;j<temp2.romper.break.length;j++){
                        romper.break.push(temp2.romper.break[j]);
                    }
                }else{
                    temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,3,def,def2,ambitoPadre,ambito);
                    ambito =temp2.ambito;
                    def = '1';      
                    for(var j=0;j<temp2.romper.break.length;j++){
                        romper.break.push(temp2.romper.break[j]);
                    }
                }    
                //error
            }
            else if(i==0&&actual.hijos[1].hijos[i].nombre!='default'){
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,0,def,1,ambitoPadre,ambito);
                ambito =temp2.ambito;  
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
            else if(i!=0&&i!=actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre!='default'){
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,1,def,def2,ambitoPadre,ambito); 
                ambito =temp2.ambito;
                def2 = '0';      
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
            else if(i==actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre!='default'){
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,2,def,def2,ambitoPadre,ambito);
                ambito =temp2.ambito;
                def = '0';  
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
            else if(i==actual.hijos[1].hijos.length-1&&actual.hijos[1].hijos[i].nombre=='default'){
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,3,def,def2,ambitoPadre,ambito);
                ambito =temp2.ambito;  
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
            else if(actual.hijos[1].hijos[i].nombre=='default'){
    
            }
            else {
                temp2 = {valor:'', contT:contT, contL:contL, _t:'',_l:'',tipo:''};
                //error 
            }
        }
        else{
            if(actual.hijos[1].hijos[i].nombre=='default'){
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,5,0,0,ambitoPadre,ambito);
                ambito =temp2.ambito;  
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
            else{
                temp2 = CASO(actual.hijos[1].hijos[i],contT,contL,temp._t,_l,4,0,0,ambitoPadre,ambito);
                ambito =temp2.ambito;  
                for(var j=0;j<temp2.romper.break.length;j++){
                    romper.break.push(temp2.romper.break[j]);
                }
            }
        }

        cadena += temp2.valor;

        if(contT<temp2.contT){
            contT=temp2.contT;
        }
        if(contL<temp2.contL){
            contL=temp2.contL;
        }

        _l = temp2._l;
    }

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.ambito = ambito;
    aux.romper = romper;
    return aux;
}

function CASO(actual,contT,contL,_t,_l,tipo,def,def2,ambitoPadre,ambito,nombreClase){
    if(tipo == 0){
        var cadena = '';

        let temp = '';
    
        if(esOperador(actual.hijos[0].hijos[0].nombre)){
            temp = EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
        }
        else{
            temp = {valor:"t"+(contT++)+"="+actual.hijos[0].hijos[0].hijos[0].nombre+";\n", contT:contT, contL:contL, _t:'t'+(contT-1),_l:'l'+(contL-1)};
        }

        if(contT<temp.contT){
            contT = temp.contT;
        }
        if(contL<temp.contL){
            contL = temp.contL;
        }

        cadena += 'if('+temp._t+"=="+_t+') goto l'+(contL++)+';\n';
        cadena += 'goto l'+(contL++)+';\n';

        cadena += 'l'+(contL-2)+':\n';

        let l = 'l'+(contL-1)+':\n';
        var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        cadena+=aux2.valor;
    

        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
    
        cadena += 'goto l'+(contL++)+';\n';
        _l = 'l'+(contL-1);

        cadena += l;
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = temp.valor+cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = _l;
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.romper = aux2.romper;
        return aux;  
    }    
    if(tipo == 1){
        var cadena = '';

        let temp = '';
    
        if(esOperador(actual.hijos[0].hijos[0].nombre)){
            temp = EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
        }
        else{
            temp = {valor:"t"+(contT++)+"="+actual.hijos[0].hijos[0].hijos[0].nombre+";\n", contT:contT, contL:contL, _t:'t'+(contT-1),_l:'l'+(contL-1)};
        }

        if(contT<temp.contT){
            contT = temp.contT;
        }
        if(contL<temp.contL){
            contL = temp.contL;
        }

        cadena += 'if('+temp._t+"=="+_t+') goto l'+(contL++)+';\n';
        cadena += 'goto l'+(contL++)+';\n';

        
        if(def2 == '1'){
            cadena += 'l'+(contL-2)+':\n';
        }
        else{
            cadena += _l+','+'l'+(contL-2)+':\n';
        }
        
        let l = 'l'+(contL-1)+':\n';
        var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        cadena+=aux2.valor;
        

        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
        cadena += 'goto l'+(contL++)+';\n';
        
        var _l = 'l'+(contL-1);
        cadena += l
    
    
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = temp.valor+cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = _l;
        aux.tipo = 'booleano';
        aux.ambito = ambito; 
        aux.romper = aux2.romper;
       
        return aux;  
    }
    if(tipo == 2){
        var cadena = '';

        let temp = '';
    
        if(esOperador(actual.hijos[0].hijos[0].nombre)){
            temp = EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
        }
        else{
            temp = {valor:"t"+(contT++)+"="+actual.hijos[0].hijos[0].hijos[0].nombre+";\n", contT:contT, contL:contL, _t:'t'+(contT-1),_l:'l'+(contL-1)};
        }

        if(contT<temp.contT){
            contT = temp.contT;
        }
        if(contL<temp.contL){
            contL = temp.contL;
        }

        cadena += 'if('+temp._t+"=="+_t+') goto l'+(contL++)+';\n';
        cadena += 'goto l'+(contL++)+';\n';

        if(def == '1'){
            cadena += 'l'+(contL-2)+':\n';
        }
        else{
            cadena += _l+',l'+(contL-2)+':\n';
        }
        
        var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        cadena+=aux2.valor;
        cadena +='l'+(contL-1)+':\n';
    
        _l = 'l'+contL-1;

        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
    
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = temp.valor+cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = _l;
        aux.tipo = 'booleano';
        aux.romper = aux2.romper;
       
        aux.ambito = ambito;
        return aux;  
    } 
    if(tipo == 3){
        var cadena = '';

        var aux2 = SENTENCIAS(actual.hijos[0],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        if(def=='0'){
            cadena+=_l+':\n';
        }
        cadena+=aux2.valor;

        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
    
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = _l;
        aux.tipo = 'booleano';
        aux.romper = aux2.romper;
        aux.ambito = ambito;
        return aux;  
    } 
    if(tipo == 4){
        var cadena = '';

        let temp = '';
    
        if(esOperador(actual.hijos[0].hijos[0].nombre)){
            temp = EXP_3D(actual.hijos[0].hijos[0],contT++,contL,ambitoPadre,ambito);
        }
        else{
            temp = {valor:"t"+(contT++)+"="+actual.hijos[0].hijos[0].hijos[0].nombre+";\n", contT:contT, contL:contL, _t:'t'+(contT-1),_l:'l'+(contL-1)};
        }

        if(contT<temp.contT){
            contT = temp.contT;
        }
        if(contL<temp.contL){
            contL = temp.contL;
        }

        cadena += 'if('+temp._t+"=="+_t+') goto l'+(contL++)+';\n';
        cadena += 'goto l'+(contL++)+';\n';

        cadena += 'l'+(contL-2)+':\n';
        var aux2 = SENTENCIAS(actual.hijos[1],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        cadena+=aux2.valor;
        cadena +='l'+(contL-1)+':\n';
    
        _l = 'l'+(contL-1);

        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
    
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = temp.valor+cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = _l;
        aux.tipo = 'booleano';
        aux.romper = aux2.romper;
        aux.ambito = ambito;
        return aux;  
    }  
    if(tipo == 5){
        var cadena = '';

        var aux2 = SENTENCIAS(actual.hijos[0],contT,contL,ambitoPadre,ambito,nombreClase);
        ambito = aux2.ambito;

        cadena+=aux2.valor;
    
        if(contT<aux2.contT){
            contT=aux2.contT;
        }
        if(contL<aux2.contL){
            contL=aux2.contL;
        }
    
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
                
        aux.valor = cadena;
        aux.contL = contL;
        aux.contT = contT;
        aux._t = 't'+(contT-1);
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.romper = aux2.romper;
        aux.ambito = ambito;
        return aux;  
    }   
}

function FOR(actual,contT,contL,ambitoPadre,ambito){
    var cadena = '';
    var temp;
    if(actual.hijos[0].nombre=='variable clase'){
        temp = DECLARACION_VARIABLE_CLASE(actual.hijos[0],contT,contL,ambitoPadre+1,ambito+1);
       
    }
    else if(actual.hijos[0].nombre=='asignacion variable'){
        temp = Asignacion(actual.hijos[0],contT,contL,ambitoPadre+1,ambito+1);
          
    }

    var id = obtenerValorId(actual.hijos[2],ambitoPadre+1,ambito+1); 

    cadena += temp.valor;
    if(contT<temp.contT){
        contT = temp.contT;
    }
    if(contL,temp.contL){
        contL = temp.contL;
    }  

    exp1 = EXP_3D(actual.hijos[1].hijos[0],contT,contL,ambitoPadre+1,ambito+1);
    if(contT<exp1.contT){
        contT = exp1.contT;
    }
    if(contL,exp1.contL){
        contL = exp1.contL;
    }  

    exp2 = EXP_3D(actual.hijos[3].hijos[0],contT,contL,ambitoPadre+1,ambito+1);
    if(contT<exp2.contT){
        contT = exp2.contT;
    }
    if(contL,exp2.contL){
        contL = exp2.contL;
    }  



    cadena +='l'+(contL++)+':\n';
    cadena += exp1.valor;
    let t = '';
    cadena +='if(1=='+exp1._t+') goto l'+(contL++)+';\n';
    cadena +='goto l'+(contL++)+';\n';
    cadena +='l'+(contL-2)+':\n';
   

    var aux2 = SENTENCIAS(actual.hijos[4].hijos[0],contT,contL,ambitoPadre,ambito,nombreClase);

    cadena += aux2.valor;
    cadena += exp2.valor;
    cadena += 'stack['+id._t+']='+exp2._t+';\n';

    cadena += 'goto l'+(contL-3)+';\n';
    cadena +='l'+(contL-1)+':\n';

    if(contT<aux2.contT){
        contT=aux2.contT;
    }
    if(contL<aux2.contL){
        contL=aux2.contL;
    }
        
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.romper = aux2.romper;
    aux.ambito = aux2.ambito;
    return aux;                   
}

function DECLARACION_METODO(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    //public static void main
    var cadena = '';
    var nombre = nombreClase+'_'+actual.hijos[0].hijos[1].nombre+'_'+actual.hijos[0].hijos[2].hijos[0].nombre;
    for(var i=0;i<actual.hijos[0].hijos[2].hijos[1].hijos.length;i++){
        nombre += '_'+actual.hijos[0].hijos[2].hijos[1].hijos[i].hijos[0].nombre;
    }
    if(actual.hijos[0].hijos[2].hijos[0].nombre.toLowerCase()=='main'){
        var main = true;
        for(var i=0;i<actual.hijos[0].hijos[0].length;i++){
            switch(actual.hijos[0].hijos[0].hijos[i].nombre){
                case 'public':
                break;
                case 'static':
                break;
                default:
                    main = false;
                break;
            }
        }
        if(main){
        }
        else{
            if(actual.hijos[0].hijos[1].nombre=='void'){    
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[0].hijos[1].linea; 
                error.columan = actual.hijos[0].hijos[1].columna;
                error.error = 'main debe de ser publico y estatico';
                errores.lista.push(error);
            }
            var error = new error2.Error();
            error.tipo = 'semantico';
            error.linea = actual.hijos[0].hijos[1].linea; 
            error.columan = actual.hijos[0].hijos[1].columna;
            error.error = 'main debe de ser publico y estatico';
            errores.lista.push(error);
        }
    }

    var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
    for(var i=0;i<actual.hijos.length;i++){
        var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        switch(actual.hijos[i].nombre){
            case 'cabesa metodo':
                if(actual.hijos[i].hijos[0].nombre=='modificadores'){
                    ERRORES_MODIFICADORES(actual.hijos[i].hijos[0],contT,contL,'El metodo \"'+actual.hijos[i].hijos[2].hijos[0].nombre+'\"');
                }
            break;
            case 'sentencias':
                temp = SENTENCIAS(actual.hijos[i],contT,contL,ambitoPadre,ambito,nombreClase);
                for(var j=0;j<temp.romper.return.length;j++){
                    temp.valor+=temp.romper.return[j];    
                }
                ambito = temp.ambito;
                contL = temp.contL;
                contT = temp.contT;
                retorno._l = temp._l;
                retorno._t = temp._t;         
                retorno.valor += temp.valor;
                retorno.ambito = ambito;   
            break;
        }
    }
    retorno.contL = contL;
    retorno.contT = contT;
    retorno.valor ='proc '+nombre+' begin\n'+retorno.valor+'heap[k]=0;\n';
    retorno.valor +='end\n';
    retorno.valor +=cadena;
    return retorno;
}

function DECLARACION_CONSTRUCTOR(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    
    //public static void main
    var cadena = '';
    var nombre = nombreClase+'_'+actual.hijos[1].hijos[0].nombre;
    for(var i=0;i<actual.hijos[1].hijos[1].hijos.length;i++){
        nombre += '_'+actual.hijos[1].hijos[1].hijos[i].hijos[0].nombre;
    }

    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==nombre){
            if(tabla[i].compilado==1){
                var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                retorno.valor = '';
                retorno.contL = contL;
                retorno.contT = contT;
                retorno._l = '';
                retorno._t = '';   
                retorno.ambito = ambito;
                return retorno;
            }
            else{
                tabla[i].compilado = 1;
            }
        }
    }

    var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
    for(var i=0;i<actual.hijos.length;i++){
        var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        switch(actual.hijos[i].nombre){
            case 'sentencias':
                temp = SENTENCIAS(actual.hijos[i],contT,contL,ambitoPadre,ambito,nombreClase);
                ambito = temp.ambito;
                for(var j=0;j<temp.romper.return.length;j++){
                    temp.valor+=temp.romper.return[j];    
                }
            break;
        }
        retorno.valor += temp.valor;
        retorno.contL = temp.contL;
        retorno.contT = temp.contT;
        retorno._l = temp._l;
        retorno._t = temp._t;   
        retorno.ambito = ambito;
    }

    retorno.valor ='proc '+nombre+' begin\n'+retorno.valor+'heap[k]=0;\n';

    retorno.valor +='end\n';
    retorno.valor +=cadena;
    return retorno;
}

function parametosFormales(actual,contT,contL,ambitoPadre,ambito,nombreF){
    var cadena = '';
    var lista = [];
    var aux = '';
    
    for(var i=0;i<actual.hijos.length;i++){
        if(actual.hijos[i].hijos[0].nombre!=0){
            vec = actual.hijos[0].hijos[0].nombre;
            AsignarValorId(actual.hijos[i].hijos[1].nombre,ambitoPadre,ambito,'t'+contT);
            cadena+='t'+(contT++)+'=p;\n';
            cadena+='stack[p]=null;\n';
            cadena+='p=p+1;\n';
            aux = 't'+(contT-1);
            lista.push(aux);                                    
        }
        else{    
            if(actual.hijos[0].nombre=='int'||actual.hijos[0].nombre=='double'||actual.hijos[0].nombre=='boolean'||actual.hijos[0].nombre=='char'){
                AsignarValorId(actual.hijos[i].hijos[1].nombre,ambitoPadre,ambito,'t'+contT);
                cadena+='t'+(contT++)+'=p;\n';
                cadena+='stack[p]=0;\n';
                cadena+='p=p+1;\n';
                aux = 't'+(contT-1);
                lista.push(aux);                                  
            }
            else{
                AsignarValorId(actual.hijos[i].hijos[1].nombre,ambitoPadre,ambito,'t'+contT);
                cadena+='t'+(contT++)+'=p;\n';
                cadena+='stack[p]=null;\n';
                cadena+='p=p+1;\n';      
                aux = 't'+(contT-1);
                lista.push(aux);                                                 
            }                       
        }         
    }

    for(var i=0;i<tabla.length;i++){
        if(nombreF==tabla[i].nombre){
            tabla[i].listaParametros = lista;
            break;
        }
    }

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                
    aux.valor = cadena;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = '';
    aux.ambito = ambito;

    return aux;
}


function INVOCACION_METODO(actual,contT,contL,ambitoPadre,ambito,nombreClase){
    let nombre = '';

    var cadena = '';
    var listaT = [];
    var listaP = [];
    
    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        var temp = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
        nombre += '_'+temp.tipo;
        cadena += temp.valor;
        listaT.push(temp._t);
        listaP.push(temp.tipo);
    }

    var nombre2 = nombreClase+'_'+actual.hijos[0].nombre+nombre;
    var funcion = obtenerValorIdFuncion(nombre2);
    if(funcion==undefined){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[0].nombre+' no existe';
        errores.lista.push(error);
       
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;    
    }
    if(funcion.acceso=='private'||funcion.acceso=='protected'){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'La funcion '+actual.hijos[0].nombre+' no es publica';
        errores.lista.push(error);
        
        var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
        aux._t = '';
        aux.valor = '';
        aux.contL = contL;
        aux.contT = contT;
        aux._l = 'l'+(contL-1);
        aux.tipo = 'booleano';
        aux.ambito = ambito;
        aux.tipo = 'error';
        return aux;    
    }
    nombre = nombreClase+'_'+funcion.tipo+'_'+actual.hijos[0].nombre+nombre;


    var parametros;
    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==nombre){
            parametros = tabla[i].listaParametros;
            tabla[i].compilado=1;
        }
    }

    var cadena2 = 'var parametrosx=0;\n';
    for(var i=0;i<actual.hijos[1].hijos.length;i++){
        var temp = EXP_3D(actual.hijos[1].hijos[i],contT,contL,ambitoPadre+1,ambito+1);
        cadena2 += temp.valor;
        cadena2 += parametros[i]+'=p;\n';
        cadena2 += 'stack[p]='+temp._t+';\n';
        cadena2 += 'p=p+1;\n';
    }

    cadena2 +='call '+nombre+';\n';

    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
                    
    aux.valor = cadena2;
    aux.contL = contL;
    aux.contT = contT;
    aux._t = 't'+(contT-1);
    aux._l = 'l'+(contL-1);
    aux.tipo = 'booleano';
    aux.ambito = ambito;
    return aux;    
}

function CLASE(actual,contT,contL,ambito){
    var retorno={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
    if(actual.hijos.length==4){
        for(var i=0;i<actual.hijos.length;i++){
            var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
            switch(actual.hijos[i].nombre){
                case 'modificadores':
                    ERRORES_MODIFICADORES(actual.hijos[i],contT,contL,'la clase \"'+actual.hijos[2].nombre+'\"');
                break
                case 'cuerpo':
                    temp = CUERPO(actual.hijos[i],contT,contL,ambito,actual.hijos[2].nombre);
                break
            }
            retorno.valor += temp.valor;
            retorno.contL = temp.contL;
            retorno.contT = temp.contT;
            retorno._l = temp._l;
            retorno._t = temp._t; 

        }
        return retorno;
    }
    else if(actual.hijos.length==5){
        for(var i=0;i<actual.hijos.length;i++){
            var temp={valor:'', contT:0, contL:0, _t:'',_l:'',tipo:'',ambito:0};
            switch(actual.hijos[i].nombre){
                case 'modificadores':
                    ERRORES_MODIFICADORES(actual.hijos[i],contT,contL,'la clase \"'+actual.hijos[1].nombre+'\"');
                break
                case 'cuerpo':
                    temp = CUERPO(actual.hijos[i],contT,contL,actual.hijos[1].nombre,ambito);
                break
            }
            retorno.valor += temp.valor;
            retorno.contL = temp.contL;
            retorno.contT = temp.contT;
            retorno._l = temp._l;
            retorno._t = temp._t; 
        }
        return retorno;
    }
}

var tablaSim = require("../tablaSimbolos/llenarTabla");
var tabla = tablaSim.tablaSimbolos;
function OBTENER_CODIGO_3D(actual,contT,contL){
    tablaSim.iniciarRecorrido(actual);
    return listaClases(actual.hijos[0],contT,contL);
}

function listaClases(actual,contT,contL){
    var cadena ='';
    var ambito = 0;
    
    var temp = obtenerC3DFunciones(contT,contL);
    contT = temp.contT;
    contL = temp.contL;

    cadena = temp.cadena;

    for(var i=0;i<actual.hijos.length;i++){
        var temp = CLASE(actual.hijos[i],contT,contL,ambito);  
        ambito = temp.ambito;
        if(contT<temp.contT){
            contT=temp.contT;
        }
        if(contL<temp.contL){
            contL=temp.contL;
        }
        cadena += temp.valor;
    }
    var aux = {valor:'', contT:0, contL:0, _t:'',_l:'',tipo:''};
       
    cadena +='call _hola_void_main;\n';
    
    aux.valor = cadena;
    aux.contL = contT;
    aux.contT = contL;
    aux._t = '';
    aux._l = '';
    
    return aux;
}

exports.CODIGO_3D = function CODIGO_3D(actual){
    var temp =  OBTENER_CODIGO_3D(actual,0,0);
    temp.valor = 'var p=0;\nvar k=2;\n'+temp.valor;
    return temp;
}

function esOperador(actual){
    switch(actual){
        case '+':
        return true;
        case 'pow':
        return true;
        case '-':
        return true;
        case '*':
        return true;
        case '/':
        return true;
        case '^':
        return true;
        case '%':
        return true;
        case '<':
        return true;
        case '>':
        return true;
        case '>=':
        return true;
        case '<=':
        return true;
        case '==':
        return true;
        case '!=':
        return true;
        case '&&':
        return true;
        case '||':
        return true;
        default:
        return false;
    }
}
exports.Nodo = Nodo;



//errores
function ERRORES_MODIFICADORES(actual,contT,contL,nombre){
    var aux =[];
    var p=0;
    var p1=0;
    var p2=0;
    var p3=0;
    var p4=0;
    var p5=0;
    var p6=0;

    for(var i=0;i<actual.hijos.length;i++){
        if(actual.hijos[i].nombre=='public'){
            p+=1;
            p1+=1;
        }
        if(actual.hijos[i].nombre=='protected'){
            p+=1;
            p2+=1;
        }
        if(actual.hijos[i].nombre=='private'){
            p+=1;
            p3+=1;
        }
        if(actual.hijos[i].nombre=='abstract'){
            p4+=1;
        }
        if(actual.hijos[i].nombre=='final'){
            p5+=1;
        }
        if(actual.hijos[i].nombre=='static'){
            p6+=1;
        }
    }

    if(p>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de seguridad en'+nombre;
                
        errores.lista.push(error);
    }
    if(p1>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo publico en'+nombre;
                
        errores.lista.push(error);
    }
    if(p2>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo protected en '+nombre;
                
        errores.lista.push(error);
    }
    if(p3>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo private '+nombre;
                
        errores.lista.push(error);
    }
    if(p4>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo abstract '+nombre;
                
        errores.lista.push(error);
    }
    if(p5>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo final '+nombre;
                
        errores.lista.push(error);
    }
    if(p6>1){
        var error = new error2.Error();
        error.tipo = 'semantico';
        error.linea = actual.hijos[0].linea; 
        error.columan = actual.hijos[0].columna;
        error.error = 'Existe mas de un modificador de tipo static '+nombre;
                
        errores.lista.push(error);
    }

}

function ERRORES_ASGNACION_VARIABLE(actual,contT,contL,nombre){
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando vector'){
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            if(actual.hijos[2].hijos[i].nombre=='inicializando vector'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[2].hijos[i].hijos[0].linea; 
                error.columan = actual.hijos[2].hijos[i].hijos[0].columna;
                error.error = 'No es posible asignar un vector a la variable '+actual.hijos[2].hijos[i].hijos[0].nombre;
                        
                errores.lista.push(error);
            }
            var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[2].hijos[i].linea; 
                error.columan = actual.hijos[2].hijos[i].columna;
                error.error = 'No es posible asignar un vector a la variable '+actual.hijos[2].hijos[i].nombre;
                        
                errores.lista.push(error);
        }
    }
    else if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando variable'){
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializador variable'){
            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0].nombre!=actual.hijos[1].nombre){ 
                    if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'No es posible inicializar la varible '+actual.hijos[2].hijos[i].hijos[0].nombre+' ya que el inicializador no es de tipo '+actual.hijos[1].nombre;     
                        errores.lista.push(error);
                    }
                    else{
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'No es posible inicializar la varible '+actual.hijos[2].hijos[i].nombre+' ya que el inicializador no es de tipo '+actual.hijos[1].nombre;     
                        errores.lista.push(error);
                    }
                }    
            }
        }
    }
}

function ERRORES_ASGNACION_VARIABLE_VECTOR(actual,contT,contL,nombre){
    if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando variable'){
        for(var i=0;i<actual.hijos[2].hijos.length;i++){
            if(actual.hijos[2].hijos[i].nombre=='inicializando variable'){
                var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[2].hijos[i].hijos[0].linea; 
                error.columan = actual.hijos[2].hijos[i].hijos[0].columna;
                error.error = 'No es posible asignar una expresion al vector '+actual.hijos[2].hijos[i].hijos[0].nombre;
                errores.lista.push(error);
            }
            var error = new error2.Error();
                error.tipo = 'semantico';
                error.linea = actual.hijos[2].hijos[i].linea; 
                error.columan = actual.hijos[2].hijos[i].columna;
                error.error = 'No es posible asignar una expresion al vector '+actual.hijos[2].hijos[i].nombre;                    
                errores.lista.push(error);
        }
    }    
    else if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].nombre=='inicializando vector'){
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='inicializandor vector'){
            for(var i=0;i<actual.hijos[2].hijos.length;i++){
                if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[0].nombre!=actual.hijos[1].nombre){ 
                    if(actual.hijos[2].hijos[i].nombre=='inicializando vector'){
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'No es posible inicializar el vector '+actual.hijos[2].hijos[i].hijos[0].nombre+' ya que el inicializador no es de tipo '+actual.hijos[1].nombre;     
                        errores.lista.push(error);
                    }
                    else{
                        var error = new error2.Error();
                        error.tipo = 'semantico';
                        error.linea = actual.hijos[1].linea; 
                        error.columan = actual.hijos[1].columna;
                        error.error = 'No es posible inicializar el vector '+actual.hijos[2].hijos[i].nombre+' ya que el inicializador no es de tipo '+actual.hijos[1].nombre;     
                        errores.lista.push(error);
                    }
                }    
            }
        }
        else 
        if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].nombre=='asignacion vector'){
            if(actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[0].hijos[0].nombre==actual.hijos[2].hijos[actual.hijos[2].hijos.length-1].hijos[1].contador){
                for(var i=0;i<actual.hijos[2].hijos.length;i++){
                    var error = new error2.Error();
                    error.tipo = 'semantico';
                    error.linea = actual.hijos[1].linea; 
                    error.columan = actual.hijos[1].columna;
                    error.error = 'No es posible asignar al vector '+actual.hijos[2].hijos[i].nombre+' ya que la asignacion no cuenta con las dmenciones necesarias ';     
                    errores.lista.push(error);
                }
            }
            else{
                for(var i=0;i<actual.hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos.length;i++){
                    for(var j=0;j<actual.hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[i].hijos.length;j++){
                        var temp = EXP_3D(actual.hijos[actual.hijos[2].hijos.length-1].hijos[1].hijos[i].hijos[j].hijos[0],contT,contL);
                        if(temp.tipo==actual.hijos[1].nombre){   
                            var error = new error2.Error();       
                            error.tipo = 'semantico';
                            error.linea = actual.hijos[1].linea; 
                            error.columan = actual.hijos[1].columna;
                            error.error = 'No es posible asignar al vector '+actual.hijos[2].hijos[i].nombre+' ya que no todos los valores son de tipo '+temp.tipo;     
                            errores.lista.push(error);
                        }
                    }

                }
            }
        }
    }
}
