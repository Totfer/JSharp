var arbol = require('../Arbol/arbol');
var Nodo = require('../Arbol/nodo');

var parser3d = require("../Analizador_3d/calc");
var arbol3d = require('../Arbol/arbol');
var Nodo3d = require('../compilar3D/nodo');
const n = require('../Arbol/nodo');

var fs = require('fs');
var parser = require("../Analizador/calc.js");

const Viz = require('../Analizador/node_modules/viz.js');
const { Module, render } = require('../Analizador/node_modules/viz.js/full.render.js');

var ast = require("../Analizador/ast");

function llenarNuevoArbol(actual, padre) {

    let tmp

    let hijo = new n.Nodo();
    if (actual.nombre == 'raiz') {
        hijo.nombre = actual.nombre;
        hijo.fila = actual.fila;
        hijo.columna = actual.columna;

        arbol.insertar(null, hijo);
    }
    else {
        let hijo2;

        hijo.nombre = actual.nombre;
        hijo.fila = actual.fila;
        hijo.columna = actual.columna;

        if (actual.cantidad != undefined) {
            hijo.cantidad = actual.cantidad - 1;
        }

        arbol.insertar(padre, hijo);
    }
    if (actual.hijos != undefined || actual.hijos != null) {
        for (var i = 0; i < actual.hijos.length; i++) {
            llenarNuevoArbol(actual.hijos[i], hijo);
        }
    }
    if (hijo.nombre == 'raiz') {
        return hijo;
    }
}

function llenarNuevoArbol3d(actual, padre) {
    let hijo = new Nodo3d.Nodo();
    if (actual.nombre == 'raiz') {
        hijo.nombre = actual.nombre;
        hijo.fila = actual.fila;
        hijo.columna = actual.columna;

        arbol3d.insertar(null, hijo);
    }
    else {

        hijo.nombre = actual.nombre;
        hijo.fila = actual.fila;
        hijo.columna = actual.columna;


        arbol3d.insertar(padre, hijo);
    }
    if (actual.hijos != undefined || actual.hijos != null) {
        for (var i = 0; i < actual.hijos.length; i++) {
            llenarNuevoArbol3d(actual.hijos[i], hijo);
        }
    }
    if (hijo.nombre == 'raiz') {
        return hijo;
    }
}

var allError = [];
function Compilar(codigo) {
    codigo = codigo.toLowerCase();;
    parser.parser.yy.crearHoja = function crearHoja(identificador, linea, columna) {
        let astRet = new ast.AST(identificador, linea, columna, []);
        return astRet
    }

    parser.parser.yy.crearNodo = function crearNodo(identificador, linea, columna, hijos) {
        let astRet = new ast.AST(identificador, linea, columna, hijos);
        return astRet
    }

    parser.parser.yy.imprimirToquen = function imprimirToquen(token) {
        console.log(token)
    }

    parser.parser.yy.parseError = function parseError (str, hash) {
        if (hash.recoverable) {
            if(hash.token != 'error'){
                allError.push({error:'Error cerca de '+hash.text,linea:hash.line,columna:0,tipo:'semantico'});
            }else{
                allError.push({error:'Error cerca de '+hash.text,linea:hash.line,columna:0,tipo:'lexico'});    
            }
            this.trace(str);
        } else {
            var error = new Error(str);
            error.hash = hash;
            throw error;
        }
    }

    parser.parser.yy.ast = new ast.AST();

    parser.parser.yy.listaIds = [];

    try{
        var arbol = parser.parse(codigo);
    }
    catch(err){
        console.log(err);
        return {codigo:err.message};
    }

    ambito = {}
    arbol.contadorT = 0;
    arbol.contadorL = 0;
    arbol.llenarTablaSimbolos();

    try{
        codigo = arbol.compilar();
    }
    catch(exp){
        console.log(exp);
    }

    console.log("--------------------Todo bien-------------------");
    // Nodo.Nodo = llenarNuevoArbol(arbol, Nodo.Nodo);
    //return Interprete(arbol);
    
    let err2 =  parser.parser.yy.ast.getError();
    for(let i =0;i<err2.length;i++){
        err2[i].tipo = 'semantico'
        allError.push(err2[i]);
    }

    return {codigo:codigo, tablaSimbolos:tablaS(),errores:tablaE(allError)};
}

var auxe = '';
var auxt = '';
var auxo = '';

function tablaS() {
    let tab = parser.parser.yy.ast.getTabla().simbolos

    var tablaHtml = '<html>\n';
    tablaHtml += ' \t<body>\n';
    tablaHtml += ' \t\t<table  class=\"table\">\n';
    tablaHtml += ' \t\t\t<tbody>\n';
    tablaHtml += ' \t\t\t<tr class = \"success\">\n';
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tNombre\n';
    tablaHtml += ' \t\t\t\t</th>\n';

    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tTipo\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tRol\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tAmbito\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tAmbito Padre\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tStack O Heap\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tPosicion Stack\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tPosicion Heap\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    
    tablaHtml += ' \t\t\t\t<th>\n';
    tablaHtml += ' \t\t\t\t\tTamaño\n';
    tablaHtml += ' \t\t\t\t</th>\n';
    tablaHtml += ' \t\t\t</tr>\n';


    for (var i = 0; i < tab.length; i++) {
        tablaHtml += '\t\t\t<tr class=\"info\">\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].nombre + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].tipo + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].funcionaldad + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].idAmbito + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        let padres = '';

        for(let j=0;j<tab[i].padre.length;j++){
            padres += tab[i].padre[j]+' ';
        }

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + padres + '\n';
        tablaHtml += '\t\t\t\t</td>\n';


        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].tipoSH + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].posicionH + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].posicionS + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t\t<td>\n';
        tablaHtml += '\t\t\t\t\t' + tab[i].tamano + '\n';
        tablaHtml += '\t\t\t\t</td>\n';

        tablaHtml += '\t\t\t</tr>\n';

    }

    tablaHtml += ' \t\t\t</tbody>\n';
    tablaHtml += '\t\t</table>\n';

    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function tablaE(error){
    console.log(error)
    var tablaHtml ='<html>\n';
    tablaHtml += '\t<body>\n';
    tablaHtml += '\t\t<table class=\"table\">\n';
   
    tablaHtml+=' \t\t\t<tbody>\n';
    tablaHtml+=' \t\t\t<tr class = \"success\">\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tTipo\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tError\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\Linea\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tColumna\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t</tr>\n';
    
    for(var i=0;i<error.length;i++){ 
        tablaHtml +=  '\t\t\t<tr class=\"warning\">\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+error[i].tipo+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+error[i].error+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+error[i].linea+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+error[i].columan+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
    }
    tablaHtml+=' \t\t\t</tbody>\n';
    tablaHtml += '\t\t</table>\n';
 
    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function Interprete() {
    Nodo.IniciarRecorrido(actual);
    var temp = Nodo.CODIGO_3D(actual);

    var errores = require("../Errores/errores");
    var memoria = require('../memoria.js');
    var tablaSmbolos = require('../tablaSimbolos/lista');
    var funcion = require("../funciones").lista;

    var html = require('../Analizador/index');

    auxe = html.obtenerTablaErrores();
    auxt = html.obtenerTablaSimbolos();

    var errores = require("../Errores/errores");
    var error = '';

    for (var i = 0; i < errores.lista.length; i++) {
        error += errores.lista[i].error;
        error += ' -> en linea y columna ';
        error += '(' + errores.lista[i].linea + ',' + errores.lista[i].columan + ')';
        error += '\n';
    }

    var retorno = { erros: auxe, simbolos: auxt, retorno: error, codigo: temp.valor };
    return retorno;
}


function compilar3D(codigo) {
    var errores = require("../Errores/errores");
    retorno = '';
    if (errores.lista.length == 0) {
        codigo = codigo.toLowerCase();
        var arbol = parser3d.parse(codigo);

        var aux = llenarNuevoArbol3d(arbol, Nodo3d.Nodo);

        var grafo = ''
       // grafo = Nodo3d.crearGrafo(aux);

        var codigoOptimisado = Nodo3d.optimizarCodigo(aux);
        var html = require('../Analizador/index');

        auxo = html.obtenerTablaOptimisacion();

        var opt = require("../tablaOptimisacion").lista;
        //  arbol = parser3d.parse(codigoOptimisado);
        //aux = llenarNuevoArbol3d(arbol, Nodo3d.Nodo);

        //retorno = Nodo3d.compilar(aux);
    }
    ret = { optimizacion: auxo, retorno: codigoOptimisado, dotc3d:grafo };
    return ret;
}

function compilar3D2(codigo) {
    var errores = require("../Errores/errores");
    retorno = '';
    if (errores.lista.length == 0) {
        codigo = codigo.toLowerCase();
        var arbol = parser3d.parse(codigo);

        var aux = llenarNuevoArbol3d(arbol, Nodo3d.Nodo);

        var grafo = ''
       // grafo = Nodo3d.crearGrafo(aux);

        var codigoOptimisado = Nodo3d.optimizarCodigo2(aux);
        var html = require('../Analizador/index');

        auxo = html.obtenerTablaOptimisacion();

        var opt = require("../tablaOptimisacion").lista;
        //  arbol = parser3d.parse(codigoOptimisado);
        //aux = llenarNuevoArbol3d(arbol, Nodo3d.Nodo);

        //retorno = Nodo3d.compilar(aux);
    }
    ret = { optimizacion: auxo, retorno: codigoOptimisado, dotc3d:grafo };
    return ret;
}


function graficarArbol(child, actual, anterior) {
    actual += Math.random();

    if (child == undefined) {
        return;
    }
    if (child.identificador != undefined) {
        if (child.hijos.length != 0) {
            dot += "\"" + actual + "\" [color=brown shape=Msquare label =\"" + child.identificador.toString().replace("\"", "").replace("\"", "").replace("\n", "") + "\"];\n";
        }
        else {
            dot += "\"" + actual + "\" [color=green shape=Mcircle label =\"" + child.identificador.toString().replace("\"", "").replace("\"", "").replace("\n", "") + "\"];\n";
        }
    }

    if (child.hijos != undefined && child.hijos != null) {
        for (var i = 0; i < child.hijos.length; i++) {
            if (child.hijos[i] != undefined && child.hijos[i] != null) {
                if (anterior != actual) {
                    if (child.hijos[i] != undefined && child.hijos[i] != null && anterior != undefined) {
                        dot += "\"" + anterior + "\" -> \"" + actual + "\"\n";
                    }
                    else {
                        var temp = child.hijos[i];
                        if (temp != undefined && anterior != undefined) {
                            dot += "\"" + anterior + "\" -> \"" + actual + "\"\n";
                        }
                    }
                }
            }
            anterior = actual;
            let chil = child.hijos[i]
            if (chil.identificador != undefined) {
                graficarArbol(chil, actual, anterior);
            }
            else {
                if (chil[0] != undefined) {
                    graficarArbol(chil[0][0], actual, anterior);
                }
            }
        }
        if (child.hijos.length == 0) {
            dot += "\"" + anterior + "\" -> \"" + actual + "\"\n";
        }
    }
    else {
        if (child != undefined && child != null) {
            dot += "\"" + anterior + "\" -> \"" + actual + "\"\n";
        }
    }
}

function graficar(child, tabs) {
    var grafo = "digraph G {\n";
    dot = "";
    contador = 0;
    graficarArbol(child, tabs);

    grafo += dot;
    grafo += "}";

    fs.writeFile("./grafo", grafo, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("El archivo fue creado correctamente");
    });

    return grafo;
}

exports.grafoHtml = function (cb, codigo) {

    let viz = new Viz({ Module, render });

    var arbol = parser.parse(codigo);
    var contador = 0;

    viz.renderString(graficar(arbol, contador))
        .then(result => {
            cb(result);
        })
        .catch(error => {
            // Create a new Viz instance (@see Caveats page for more info)
            viz = new Viz({ Module, render });

            // Possibly display the error
            console.error(error);
            cb(error);
        });
}

exports.grafoHtmlC3D = function (cb, codigo) {

    let viz = new Viz({ Module, render });

    viz.renderString(codigo)
        .then(result => {
            cb(result);
        })
        .catch(error => {
            // Create a new Viz instance (@see Caveats page for more info)
            viz = new Viz({ Module, render });

            // Possibly display the error
            console.error(error);
            cb(error);
        });
}

exports.compilar3D = compilar3D;
exports.compilar3D2 = compilar3D2;
exports.errores = auxe;
exports.auxo = auxo;
exports.tablaSimbolos = auxt;

exports.Compilar = Compilar;