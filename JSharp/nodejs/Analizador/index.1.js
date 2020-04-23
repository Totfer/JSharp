var fs = require('fs');
var hash = require('object-hash');
var parser = require("./calc");
var  cmd = require ( 'node-cmd' ) ;
const Viz = require('./node_modules/viz.js');
const { Module, render } = require('./node_modules/viz.js/full.render.js');

cmd.run(' dot -Tpng -o '+'./grafo.png '+'./grafo.dot');

//var arbol = parser.parse("abstract public class _hola { public static void main(int a,int b){} int var4,var6,var8 = {{2,1},{1,2},{1,1}}; int a; public abstract double vari,var2,var3[][][] = new double[2][2][3] ; public abstract int _hol(int a, int b){ this(4+3,3+5); super(4+3,3+5); arr1 = new int[1]; arr22={1,2,2,3}; lk = new linkedlist<>(); try{ int a[]; }catch(){ int a[]; int a[]; a=5+5; continue; break; return; return 5+3+4;  if(4+5){ int a; }else if(3+5){int b;}else{int cccc;}  switch(1+4){case 1: int a; case 2: int b; default: int c;} while(1+2){int a; do{int aaaa;}while(1+1+1);  for(int a; 1+2; 2+1+2;){ int aaaaaa; } for( int a : 3+2 ){ int aaaaaa; } for( int a : 3+2 ){  } print(1+2); println(1+2); read(a); obj ob=new obj();  obj ob [] = new obj[1]; } }  }  } ");
//var arbol = parser.parse("public class _hola { abstract int _hol(){ try{ int a[]; }catch(){ int a[]; int a[]; a=5+5; continue; break; return; return 5+3+4;  if(4+5){ int a; }else if(3+5){int b;}else{int cccc;}  switch(1+4){case 1: int a; case 2: int b; default: int c;} while(1+2){int a; do{int aaaa;}while(1+1+1);  for(int a; 1+2; 2+1+2;){ int aaaaaa; } for( int a : 3+2 ){ int aaaaaa; } for( int a : 3+2 ){  } print(1+2); println(1+2); read(a); obj ob=new obj();  obj ob [] = new obj[1]; } }  } } ");
//var codigo = "abstract public aaa extends bbb { int c; }   abstract public class _hola { int c = 4>5? 3+3:2+2;  public int funcion(){ print(3); println(3); } int b[] = new int[1];  int bbb[] = 5;  int b[]; int a,cc,s[][][][]; a=12+2;} ";
var codigo = "abstract public class _hola { int g= new int(6);  int aa=5+5; int b,c,e; } ";
//var codigo = "abstract public class _hola { public int a[][][][]; } ";
//modificadores_archivo ID 'extends' ID '{' cuerpo_clase '}'
var arbol = parser.parse(codigo);
//var arbol = parser.parse("abstract public class _hola { if(true){int a = true&&true;}  } ");
       
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

var grafo = graficar(arbol, contador);

exports.arbol = arbol;

exports.grafoHtml = function (cb){
    
    let viz = new Viz({ Module, render });
  //  var arbol = parser.parse("abstract public class _hola { public static void main(int a,int b){} int var4,var6,var8 = {{2,1},{1,2},{1,1}}; int a; public abstract double vari,var2,var3[][][] = new double[2][2][3] ; public abstract int _hol(int a, int b){ this(4+3,3+5); super(4+3,3+5); arr1 = new int[1]; arr22={1,2,2,3}; lk = new linkedlist<>(); try{ int a[]; }catch(){ int a[]; int a[]; a=5+5; continue; break; return; return 5+3+4;  if(4+5){ int a; }else if(3+5){int b;}else{int cccc;}  switch(1+4){case 1: int a; case 2: int b; default: int c;} while(1+2){int a; do{int aaaa;}while(1+1+1);  for(int a; 1+2; 2+1+2;){ int aaaaaa; } for( int a : 3+2 ){ int aaaaaa; } for( int a : 3+2 ){  } print(1+2); println(1+2); read(a); obj ob=new obj();  obj ob [] = new obj[1]; } }  }  } ");

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
    tablaHtml+=' \t\t<table class=\"table\">\n';

    tablaHtml+=' \t\t\t<thead class=\"thead-dark\">\n';
    
    tablaHtml+=' \t\t\t<tr>\n';
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
    tablaHtml+=' \t\t\t</thead>\n';
    

    for(var i=0;i<tabla.lista.length;i++){
        tablaHtml +=  '\t\t\t<tr>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].nombre+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].tipo+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].rol+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
    }
    tablaHtml += '\t\t</table>\n';
    tablaHtml += '\t</body>\n';
    tablaHtml += '</html>\n';
    return tablaHtml;
}

function generarTablaErrores(tabla){
    var tablaHtml ='<html>\n';
    tablaHtml += '\t<body>\n';
    tablaHtml += '\t\t<table>\n';
    tablaHtml+=' \t\t\t<tr>\n';
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
        tablaHtml +=  '\t\t\t<tr>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].tipo+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].fila+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
        
        tablaHtml +=  '\t\t\t\t<td>\n';
        tablaHtml +=  '\t\t\t\t\t'+tabla.lista[i].columna+'\n';
        tablaHtml +=  '\t\t\t\t</td>\n';
    
        tablaHtml +=  '\t\t\t</tr>\n';   
    }
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
    var tablaSmbolos = require('../tablaSimbolos/lista');
    return generarTabla(tablaSmbolos);
}
 
exports.obtenerTablaErrores = obtenerTablaErrores;

exports.obtenerTablaSimbolos = obtenerTablaSimbolos;




function Exprecion(actual){
    actual.hijos;


    return lista;

}