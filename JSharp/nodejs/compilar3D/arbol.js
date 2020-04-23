const nodo = require('./nodo.js');
var arbol = {}

var raiz;

arbol.insertar = function insertar(padre, hijo){
    if(padre==null){
        raiz = padre;
    }
    else{
        padre.hijos.push(hijo);
        hijo.padre = padre;
    }
}

arbol.raiz = raiz;
module.exports = arbol;