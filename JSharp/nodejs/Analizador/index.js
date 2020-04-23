var fs = require('fs');
var hash = require('object-hash');
var parser = require("./calc");
var  cmd = require ( 'node-cmd' ) ;
const Viz = require('./node_modules/viz.js');
const { Module, render } = require('./node_modules/viz.js/full.render.js');

cmd.run(' dot -Tpng -o '+'./grafo.png '+'./grafo.dot');


   
var print = function(child, tabs){
    if (child == null){
        return;
    }

    if (child.nombre != undefined && child.nombre != null){
        var str = "";

        for (var i = 0; i < tabs; i++){
            str += "->";
        }

        str += child.nombre;

        console.log(str);
    }
    else{
        var token = child;
        if(token != "[object Object]"){
            var str = "";
            for (var i = 0; i < tabs; i++){
                str += "->";
            }
            str += token;
            console.log(str);
        }
    }
    if (child.hijos != undefined && child.hijos != null){
        for (var i = 0; i < child.hijos.length; i++){
            print(child.hijos[i], tabs + 1);
        }
    }
};

var dot = "";
var contador = 0;
var cn = 100;

function graficarArbol(child,actual,anterior){
    actual += Math.random();
    if (child != null){
        if (child.nombre != undefined && child.nombre != null){
            dot +=  "\""+actual+"\" [style=filled label =\""+child.nombre.toString().replace("\"", "").replace("\"", "").replace("\n", "")+"\"];\n";   
        }
        else{
            var temp = child; 
            if(temp != "[object Object]"){
                var nombre = child.toString();
                dot +=  "\""+actual+"\" [style=filled label =\""+nombre.toString().replace("\"", "").replace("\"", "")+"\"];\n";  
                 
            }
        }
    }
    if(child.hijos != undefined && child.hijos != null){
        for (var i = 0; i < child.hijos.length; i++){
            if(child.hijos[i] != undefined&&child.hijos[i] != null){
                if(anterior!=actual){
                    if(child.hijos[i].nombre != undefined&&child.hijos[i].nombre != null){
                        dot += "\""+anterior+"\" -> \""+actual+"\"\n";   
                    }
                    else{
                        var temp = child.hijos[i]; 
                        if(temp != "[object Object]"){
                            dot += "\""+anterior +"\" -> \""+actual+"\"\n";               
                        }
                    }
                }
            }   
            anterior = actual;
            graficarArbol(child.hijos[i], actual, anterior);    
        }
        if(child.hijos.length==undefined){
            dot += "\""+anterior+"\" -> \""+actual+"\"\n";       
        }
    }
    else{
        if(child != undefined && child != null){
            dot += "\""+anterior+"\" -> \""+actual+"\"\n";   
        }
    }
}

function graficar(child, tabs){
    var grafo = "digraph G {\n";
    dot ="";
    contador = 0;
    graficarArbol(child,tabs);

    grafo += dot;    
    grafo += "}";

    fs.writeFile("./grafo", grafo, function(err) {
        if (err) {
          return console.log(err);
        }
        console.log("El archivo fue creado correctamente");
    });

    return grafo;
}

//var grafo = graficar(arbol, contador);

exports.grafoHtml = function (cb){
    
    let viz = new Viz({ Module, render });

  var arbol = parser.parse(codigo);

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


function generarTabla(tabla){
    var tablaHtml ='<html>\n';
    tablaHtml+=' \t<body>\n';
    tablaHtml+=' \t\t<table  class=\"table\">\n';
    tablaHtml+=' \t\t\t<tbody>\n';
    tablaHtml+=' \t\t\t<tr class = \"success\">\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tId\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\ttipo\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tRol\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t</tr>\n';


    for(var i=0;i<tabla.length;i++){
        if(tabla[i].nombre==''||tabla[i].nombre==undefined) continue;

        tablaHtml +=  '\t\t\t<tr class=\"info\">\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla[i].nombre+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla[i].tipo+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla[i].rol+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
        
    }
    
    tablaHtml+=' \t\t\t</tbody>\n';
    tablaHtml += '\t\t</table>\n';
 
    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function generarTablaOptimisacion(tabla){
    var tablaHtml ='<html>\n';
    tablaHtml+=' \t<body>\n';
    tablaHtml+=' \t\t<table  class=\"table\">\n';
    tablaHtml+=' \t\t\t<tbody>\n';
    tablaHtml+=' \t\t\t<tr class = \"success\">\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tExpresion\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tResultado\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tRegla aplicada\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t</tr>\n';


    for(var i=0;i<tabla.lista.length;i++){
        tablaHtml +=  '\t\t\t<tr class=\"info\">\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].exp+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].result+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].regla+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
        
    }
    
    tablaHtml+=' \t\t\t</tbody>\n';
    tablaHtml += '\t\t</table>\n';
 
    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function generarTablaErrores(tabla){
    var tablaHtml ='<html>\n';
    tablaHtml += '\t<body>\n';
    tablaHtml += '\t\t<table class=\"table\">\n';
   
    tablaHtml+=' \t\t\t<tbody>\n';
    tablaHtml+=' \t\t\t<tr class = \"success\">\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tTipo\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tFila\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t\t<th>\n';
    tablaHtml+=' \t\t\t\t\tColumna\n';
    tablaHtml+=' \t\t\t\t</th>\n';
    tablaHtml+=' \t\t\t</tr>\n';
    
    for(var i=0;i<tabla.lista.length;i++){ 
        tablaHtml +=  '\t\t\t<tr class=\"warning\">\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].tipo+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].linea+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].columan+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
    }
    tablaHtml+=' \t\t\t</tbody>\n';
    tablaHtml += '\t\t</table>\n';
 
    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function obtenerTablaErrores(){    
    var errores = require("../Errores/errores");
    return generarTablaErrores(errores);
}

function obtenerTablaSimbolos(){
    var tablaSmbolos = require('../tablaSimbolos/llenarTabla').tablaSimbolos;
    return generarTabla(tablaSmbolos);
}
 
function obtenerTablaOptimisacion(){
    var tablaSmbolos = require('../tablaOptimisacion');
    return generarTablaOptimisacion(tablaSmbolos);
}
 
exports.obtenerTablaErrores = obtenerTablaErrores;

exports.obtenerTablaOptimisacion = obtenerTablaOptimisacion;

exports.obtenerTablaSimbolos = obtenerTablaSimbolos;



function generarArbol(codigo){
   
}

exports.generarArbol = generarArbol;

function Exprecion(actual){
    actual.hijos;


    return lista;

}