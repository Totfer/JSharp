var fs = require('fs');
var hash = require('object-hash');
var parser = require("./calc");
var  cmd = require ( 'node-cmd' ) ;
const Viz = require('./node_modules/viz.js');
const { Module, render } = require('./node_modules/viz.js/full.render.js');

cmd.run(' dot -Tpng -o '+'./grafo.png '+'./grafo.dot');

var arbol = parser.parse(" proc prueba begin t1=5+5; \n t1 = 100; \n t1 = 100;\n end t1 = 100;\n t1 = 100;\n t1 = 100; call prueba;  ");
      
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
            dot +=  "\""+actual+"\" [style=filled label =\""+child.nombre.toString().replace("\"", "").replace("\n", "")+"\"];\n";   
        }
        else{
            var temp = child; 
            if(temp != "[object Object]"){
                var nombre = child.toString();
                dot +=  "\""+actual+"\" [style=filled label =\""+nombre.toString().replace("\"", "")+"\"];\n";   
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

var grafo = graficar(arbol, contador);

exports.arbol = arbol;

exports.grafoHtml = function (cb){
    
    let viz = new Viz({ Module, render });
    var arbol = parser.parse("var ho = \"aaa\"; var ho = \'a\'; t0=3+4; t1=3+4; t2=t0+t1; ");
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

exports.Html = function (cb){
    const Viz = require('viz.js');
    const { Module, render } = require('viz.js/full.render.js');
    
    let viz = new Viz({ Module, render });

    var arbol = parser.parse("t0=3+4; t1=3+4; t2=t0+t1; ");

    viz.renderString(graficar(arbol, contador))
    .then(result => {
        cb(error);
    })
    .catch(error => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({ Module, render });

        // Possibly display the error
        console.error(error);
        cb(error);
    });
}

function generar3D(){
    
}

function Exprecion(actual){
    actual.hijos;


    return lista;

}