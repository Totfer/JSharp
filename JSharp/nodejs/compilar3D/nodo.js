function Nodo() {
    this.nombre = '';
    this.padre = Nodo;
    this.linea = '';
    this.columna = '';
    this.hijos = [];

    this.ejecutar = function () {
        return "Edgar gay :v";
    }


    this.generar3D = function generar3D(actual, cont) {
        for (let i = 0; actual.hijos.length; i++) {
            generar3D(actual.hijos[i]);
        }
        return "";
    }
}

var memoria = require("../memoria");
var monticulo = require("../monticulo/monticulo");
var estaticos = require("../monticulo/estaticos");
var tablaSimbolos = require("../tablaSimbolos/lista").lista;

var tabla = require("../compilar3D/tablaSimbolos").lista;
var texto = require("../imprimir").texto;

var tablaOptimisacion = require("../tablaOptimisacion").lista;

var saltos = [];
var ts = [];

var enFuncion = 0;
var fns;
function compilar(actual) {
    texto = '';
    gSaltos(actual.hijos[0]);
    fns = actual.hijos[0];
    _3d(actual.hijos[0]);

    console.log(texto);
    return texto;
}

function gSaltos(actual) {
    if (actual == undefined) { return; }
    for (var i = 0; i < actual.hijos.length; i++) {
        if (actual.hijos[i].nombre == 'salto') {
            for (var j = 0; j < actual.hijos[i].hijos.length; j++) {
                saltos.push({ posicion: i, nombre: actual.hijos[i].hijos[j].nombre });
            }
        }
        if (actual.hijos[i].nombre == 'invocacion metodo') {
            gSaltos(actual.hijos[i].hijos[1]);
        } else {
            gSaltos(actual.hijos[i]);
        }
    }
}

function obtenerValor(valor) {
    if (valor.nombre == undefined) {
        for (var i = 0; i < tabla.length; i++) {
            if (tabla[i].id == valor) {
                return tabla[i].valor[tabla[i].valor.length - 1];
            }
        }
    }
    else if (valor.nombre == 'id') {
        for (var i = 0; i < tabla.length; i++) {
            if (tabla[i].id == valor.hijos[0].nombre) {
                return tabla[i].valor[tabla[i].valor.length - 1];
            }
        }
    }
    else if (valor.nombre == 'decimal' || valor.nombre.toLowerCase() == 'entero') {
        return parseFloat(valor.hijos[0].nombre);
    }
}

function IF(actual) {
    let op1 = obtenerValor(actual.hijos[0]);
    let op2 = obtenerValor(actual.hijos[2]);
    switch (actual.hijos[1].nombre) {
        case '<':
            if (obtenerValor(actual.hijos[0]) < obtenerValor(actual.hijos[2])) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '>':

            if (op1 > op2) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '>=':
            if (obtenerValor(actual.hijos[0]) <= obtenerValor(actual.hijos[2])) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '<=':
            if (obtenerValor(actual.hijos[0]) <= obtenerValor(actual.hijos[2])) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '==':
            if (op1 == op2) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '!=':
            if (obtenerValor(actual.hijos[0]) != obtenerValor(actual.hijos[2])) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
    }
}

function IFFalse(actual) {
    let op1 = obtenerValor(actual.hijos[0]);
    let op2 = obtenerValor(actual.hijos[2]);
    switch (actual.hijos[1].nombre) {
        case '<':
            if (!(obtenerValor(actual.hijos[0]) < obtenerValor(actual.hijos[2]))) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '>':

            if (!(op1 > op2)) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '>=':
            if (!(obtenerValor(actual.hijos[0]) <= obtenerValor(actual.hijos[2]))) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '<=':
            if (!(obtenerValor(actual.hijos[0]) <= obtenerValor(actual.hijos[2]))) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '==':
            if (!(op1 == op2)) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
        case '!=':
            if (!(obtenerValor(actual.hijos[0]) != obtenerValor(actual.hijos[2]))) {
                return actual.hijos[3].nombre;
            }
            else {
                return '';
            }
    }
}

function EXP(op, e1, e2) {
    switch (op) {
        case '+':
            return e1 + e2;
        case '-':
            return e1 - e2;
        case '*':
            return e1 * e2;
        case '/':
            return e1 / e2;
        case '%':
            return e1 % e2;

        case '<':
            if (e1 < e2) {
                return '1';
            }
            return '0';
        case '>':
            if (e1 > e2) {
                return '1';
            }
            return '0';
        case '>=':
            if (e1 >= e2) {
                return '1';
            }
            return '0';
        case '<=':
            if (e1 <= e2) {
                return '1';
            }
            return '0';
        case '==':
            if (e1 == e2) {
                return '1';
            }
            return '0';
        case '!=':
            if (e1 != e2) {
                return '1';
            }
            return '0';
        default:
    }
}

function ASIGNACION2(actual) {
    if (actual.hijos.length = 4) {
        var valor = EXP(actual.hijos[2].nombre, obtenerValor(actual.hijos[1]), obtenerValor(actual.hijos[3]));

        var elemento = { id: actual.hijos[0].nombre, valor: [valor] };

        for (var i = 0; i < tabla.length; i++) {
            if (tabla[i].id == actual.hijos[0].nombre) {
                if (enFuncion != 0 && tabla[i].id != 'p' && tabla[i].id != 'h') {

                    tabla[i].valor[tabla[i].valor.length] = valor;

                    ts.push(tabla[i].id);
                }
                else {
                    tabla[i].valor[tabla[i].valor.length - 1] = valor;
                }
                return;
            }
        }
        tabla.push(elemento);
    }
}

function ASIGNACION1(actual) {
    var valor = obtenerValor(actual.hijos[1]);
    var elemento = { id: actual.hijos[0].nombre, valor: [valor] };

    for (var i = 0; i < tabla.length; i++) {
        if (tabla[i].id == actual.hijos[0].nombre) {
            if (enFuncion != 0) {
                tabla[i].valor[tabla[i].valor.length] = valor;
                ts.push(tabla[i].id);
            }
            else {
                tabla[i].valor[tabla[i].valor.length - 1] = valor;
            }
            return;
        }
    }
    tabla.push(elemento);
}

function ASIGNACION3(actual) {
    if (actual.hijos[0].nombre == 'parametrosx') {
        ts.push('-');
    }
    var valor = obtenerValor(actual.hijos[1]);

    var elemento = { id: actual.hijos[0].nombre, valor: [valor] };

    for (var i = 0; i < tabla.length; i++) {
        if (tabla[i].id == actual.hijos[0].nombre) {
            if (enFuncion != 0) {
                tabla[i].valor[tabla[i].valor.length] = valor;
                ts.push(tabla[i].id);
            }
            else {
                tabla[i].valor[tabla[i].valor.length - 1] = valor;
            }
            return;
        }
    }
    tabla.push(elemento);
}

function IMPRIMIR(actual) {
    //console.log(memoria);
    var imprimir = obtenerValor(actual.hijos[1].nombre);

    switch (actual.hijos[0].nombre) {
        case 'c':
            imprimir = String.fromCharCode(parseInt(imprimir, 10));
            break;
        case 'e':
            break;
        case 'd':
            break;
    }

    if (parseInt(imprimir, 10) > 99999999) {
        imprimir = imprimir.toExponential(8);
        if ('' == '') {

        }
    }
    // console.log(imprimir);
    texto += imprimir;
}

function STACK1(actual) {
    for (var i = 0; i < tabla.length; i++) {
        if (actual.hijos[0].hijos[0].nombre == tabla[i].id) {
            var aux = obtenerValor(actual.hijos[0]);
            if (obtenerValor(actual.hijos[1]) < 0) {
                temp = { signo: '-', valor: obtenerValor(actual.hijos[1]) * (-1) };
                memoria.memoria.memori[aux] = temp;
                break;
            }
            else {
                temp = { signo: '+', valor: obtenerValor(actual.hijos[1]) };
                var aux2 = actual.hijos[0].hijos[0].nombre;
                memoria.memoria.memori[aux] = temp;
                break;
            }
        }
    }
}

function HEAP1(actual) {
    for (var i = 0; i < tabla.length; i++) {
        if (actual.hijos[0].hijos[0].nombre == tabla[i].id) {
            monticulo.monticulo.lista[tabla[i].valor[tabla[i].valor.length - 1]] = obtenerValor(actual.hijos[1]);
            return;
        }
    }
}

function STACK2(actual) {
    for (var i = 0; i < tabla.length; i++) {
        if (actual.hijos[1].hijos[0].nombre == tabla[i].id) {
            var existe = true;
            for (var j = 0; j < tabla.length; j++) {
                if (tabla[j].id == actual.hijos[0].hijos[0].nombre) {
                    if (memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].signo == '-') {
                        if (enFuncion != 0) {

                            ts.push(tabla[j].id);
                            tabla[j].valor[tabla[j].valor.length] = memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].valor * (-1);

                        }
                        else {
                            tabla[j].valor[tabla[j].valor.length - 1] = memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].valor * (-1);

                        }
                        return;
                    }
                    else {
                        if (enFuncion != 0) {
                            ts.push(tabla[j].id);
                            var index = tabla[i].valor[tabla[i].valor.length - 1];
                            tabla[j].valor[tabla[j].valor.length] = memoria.memoria.memori[index].valor;

                        }
                        else {
                            tabla[j].valor[tabla[j].valor.length - 1] = memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].valor;
                        }
                        existe = false;
                        return;
                    }
                }
            }
            if (existe) {
                var vsr = '';
                if (memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].signo == '-') {
                    vsr = memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].valor * (-1);
                } else {
                    vsr = memoria.memoria.memori[tabla[i].valor[tabla[i].valor.length - 1]].valor;
                }
                var elemento = { id: actual.hijos[0].hijos[0].nombre, valor: [vsr] };
                tabla.push(elemento);
                return;
            }
        }
    }
}

function HEAP2(actual) {
    for (var i = 0; i < tabla.length; i++) {
        if (actual.hijos[1].hijos[0].nombre == tabla[i].id) {
            var existe = true;
            for (var j = 0; j < tabla.length; j++) {
                if (tabla[j].id == actual.hijos[0].hijos[0].nombre) {
                    if (enFuncion != 0) {

                        tabla[j].valor[tabla[j].valor.length] = monticulo.monticulo.lista[obtenerValor(actual.hijos[1])];
                        ts.push(tabla[j].id);
                    }
                    else {
                        tabla[j].valor[tabla[j].valor.length - 1] = monticulo.monticulo.lista[obtenerValor(actual.hijos[1])];
                    }
                    existe = false;
                    return;
                }
            }
            if (existe) {
                var elemento = { id: actual.hijos[0].hijos[0].nombre, valor: [monticulo.monticulo.lista[obtenerValor(actual.hijos[1])]] };
                tabla.push(elemento);
                return;
            }
        }
    }
}

function _3d(actual) {
    var salto = '';
    for (var i = 0; i < actual.hijos.length; i++) {
        switch (actual.hijos[i].nombre) {
            case 'declaracion variable asignacion':
                ASIGNACION3(actual.hijos[i]);
                break;
            case 'asignacion2':
                ASIGNACION2(actual.hijos[i]);
                break;
            case 'asignacion1':
                ASIGNACION1(actual.hijos[i]);
                break;
            case 'print':
                IMPRIMIR(actual.hijos[i]);
                break;
            case 'if':
                salto = IF(actual.hijos[i]);
                if (salto == "") { break; }
                for (var l = 0; l < saltos.length; l++) {
                    if (saltos[l].nombre == salto) {
                        i = saltos[l].posicion;
                        break;
                    }
                }
                break;
            case 'ifFalse':
                salto = IFFalse(actual.hijos[i]);
                if (salto == "") { break; }
                for (var l = 0; l < saltos.length; l++) {
                    if (saltos[l].nombre == salto) {
                        i = saltos[l].posicion;
                        break;
                    }
                }
                break;
            case 'stack1':
                STACK1(actual.hijos[i]);
                break;
            case 'stack2':
                STACK2(actual.hijos[i]);
                break;
            case 'heap2':
                HEAP2(actual.hijos[i]);
                break;
            case 'heap1':
                HEAP1(actual.hijos[i]);
                break;
            case 'saltar':
                salto = actual.hijos[i].hijos[0].nombre;
                for (var l = 0; l < saltos.length; l++) {
                    if (actual.hijos[i].hijos[0].nombre == saltos[l].nombre) {
                        i = saltos[l].posicion;
                        break;
                    }
                }
                break;
            case 'invocacion metodo':
                enFuncion += 1;
                CALL(fns, actual.hijos[i]);
                PopTabla();
                enFuncion -= 1;
                break;
            case 'end':
                PopTabla();
                break;
        }
    }
}

function PopTabla() {
    var salir = 0;
    for (var j = ts.length - 1; j > 0; j--) {
        if (ts[j] == '-') {
            break;
        }
        for (var i = 0; i < tabla.length; i++) {
            if (tabla[i].id == ts[j]) {
                tabla[i].valor.pop();
            }
        }
    }

    for (var j = ts.length - 1; j > -1; j--) {
        if (ts[j] == '-') {
            ts.pop();
            return;
        }
        ts.pop();
    }
}

function CALL(actual, llamada) {
    for (var i = 0; i < actual.hijos.length; i++) {
        var op1 = actual.hijos[i].nombre;
        var op2 = llamada.hijos[0].nombre;
        var op3 = actual.hijos[i].hijos[0].nombre;
        if (op1 == 'declaracion metodo' && op2 == op3) {
            _3d(actual.hijos[i].hijos[1]);
            break;
        }
    }
}

exports.compilar = compilar;

exports.Nodo = Nodo;


function optimizarCodigo(actual) {
    return listaOptimisacion(actual.hijos[0]);
}

exports.optimizarCodigo = optimizarCodigo;



function obtenerValorOptimisacion(valor) {
    if (valor.nombre == undefined) {
        return valor;
    }
    else if (valor.nombre == 'id') {
        return valor.hijos[0].nombre;
    }
    else if (valor.nombre == 'decimal' || valor.nombre.toLowerCase() == 'entero') {
        return parseFloat(valor.hijos[0].nombre);
    }
}


function listaOptimisacion(actual) {
    var cadena = '';
    let omitir = []
    for (var i = 0; i < actual.hijos.length; i++) {
        let omite = false;
        for (let j = 0; j < omitir.length; j++) {
            if (i == omitir[j]) {
                omite = true;
            }
        }
        if (omite) {
            omite = false;
            continue
        }
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                cadena += optimisacionesAlgebraicas(actual.hijos[i]) + '\n';
                break;
            case 'if':
                var op = true;
                if (actual.hijos[i + 1] != undefined) {
                    if (actual.hijos[i + 1].nombre == 'saltar') {
                        if (actual.hijos[i + 2] != undefined) {
                            if (actual.hijos[i + 2].nombre == 'salto') {

                                if (actual.hijos[i].hijos[3].nombre == actual.hijos[i + 2].hijos[0].nombre) {
                                    if (actual.hijos[i].hijos[1].nombre == '==') {
                                        if (actual.hijos[i].hijos[0].hijos[0].nombre != undefined && actual.hijos[i].hijos[2].hijos[0].nombre != undefined) {
                                            if ((actual.hijos[i].hijos[1].nombre == '<' || actual.hijos[i].hijos[1].nombre == '<=' || actual.hijos[i].hijos[1].nombre == '>=' || actual.hijos[i].hijos[1].nombre == '>' || actual.hijos[i].hijos[1].nombre == '==' || actual.hijos[i].hijos[1].nombre == '!=')) {
                                                var operador = '';
                                                switch (actual.hijos[i].hijos[1].nombre) {
                                                    case '<':
                                                        operador = '>=';
                                                        break;
                                                    case '<=':
                                                        operador = '>';
                                                        break;
                                                    case '>':
                                                        operador = '<=';
                                                        break;
                                                    case '>=':
                                                        operador = '<';
                                                        break;
                                                    case '==':
                                                        operador = '<>';
                                                        break;
                                                    case '<>':
                                                        operador = '==';
                                                        break;
                                                }
                                                let opt = { exp: '', result: '', regla: 0 };
                                                opt.regla = 3;
                                                opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + operador + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                                opt.exp += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                                opt.exp += actual.hijos[i + 2].hijos[0].nombre + ':\n';

                                                opt.result += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                                tablaOptimisacion.push(opt);
                                                cadena += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + operador + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                                i++;
                                                i++;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (actual.hijos[i + 1] != undefined) {
                    if (actual.hijos[i + 1].nombre == 'saltar') {
                        if (actual.hijos[i].hijos[1].nombre == '==') {
                            if (actual.hijos[i].hijos[0].hijos[0].nombre != undefined && actual.hijos[i].hijos[2].hijos[0].nombre != undefined) {
                                if ((actual.hijos[i].hijos[2].nombre == 'decimal' || actual.hijos[i].hijos[2].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[2].nombre == 'char') && (actual.hijos[i].hijos[0].nombre == 'decimal' || actual.hijos[i].hijos[0].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[0].nombre == 'char')) {
                                    var valor = EXP(actual.hijos[i].hijos[1].nombre, obtenerValor(actual.hijos[i].hijos[0]), obtenerValor(actual.hijos[i].hijos[2]));

                                    if (valor == '1') {
                                        cadena += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 4;
                                        opt.result += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i++;
                                        break;
                                    }
                                    if (valor == '0') {
                                        cadena += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 5;
                                        opt.result += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i++;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                var op2 = true;
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[3].nombre) {
                                if (actual.hijos[j + 1] != undefined) {
                                    if (actual.hijos[j + 1].nombre == 'saltar') {
                                        cadena += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 7;
                                        opt.result += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        opt.result += '...\n';
                                        opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += '...\n';
                                        opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        op2 = false;
                                        tablaOptimisacion.push(opt);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (op2) {
                    cadena += 'if(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                }
                break;

            case 'ifFalse':
                cadena += 'ifFalse(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n'
                break;
            case 'saltar':
                var op = true;
                var op2 = true;
                for (j = i; j < actual.hijos.length; j++) {
                    if (actual.hijos[j].nombre == 'salto') {
                        if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                            if (actual.hijos[j + 1] != undefined) {
                                if (actual.hijos[j + 1].nombre == 'saltar') {
                                    cadena += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    let opt = { exp: '', result: '', regla: 0 };
                                    opt.regla = 6;
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    opt.result += '...\n';
                                    opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                    opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                    opt.exp += '...\n';
                                    opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    op = false;
                                    op2 = false;
                                    tablaOptimisacion.push(opt);
                                    break;
                                }
                            }
                        }
                    }
                    else if (actual.hijos[j].nombre == 'declaracion metodo') {
                        op = false;
                        op2 = true;
                        break;
                    }
                }
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            op2 = false
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                                cadena += actual.hijos[j].hijos[0].nombre;

                                for (var x = 1; x < actual.hijos[j].hijos.length; x++) {
                                    cadena += ',' + actual.hijos[j].hijos[x].nombre;
                                }
                                cadena += ':\n';
                                i = j;
                                let opt = { exp: '', result: '', regla: 0 };
                                opt.regla = 2;
                                opt.result = actual.hijos[j].hijos[0].nombre + ':\n';

                                opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                opt.exp += '...\n';
                                opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';

                                tablaOptimisacion.push(opt);
                                break;
                            }
                            else {
                                cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                break;
                            }
                        }
                    }
                }

                if (op2) {
                    cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                }
                break;
            case 'asignacion1':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                let posOm = optimizacion1(i + 1, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre)
                if (posOm != '') {
                    omitir.push(posOm)
                }
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'stack2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=stack[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'salto':
                cadena += actual.hijos[i].hijos[0].nombre;

                for (var x = 1; x < actual.hijos[i].hijos.length; x++) {
                    cadena += ',' + actual.hijos[i].hijos[x].nombre;
                }
                cadena += ':\n';
                break;
            case 'print':
                cadena += 'print(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'println':
                cadena += 'println(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'invocacion metodo':
                cadena += 'call ' + actual.hijos[i].hijos[0].nombre + ';\n';
                break;
            case 'declaracion metodo':
                cadena += 'proc ' + actual.hijos[i].hijos[0].nombre + ' begin\n';
                cadena += listaOptimisacion(actual.hijos[i].hijos[1]);
                cadena += 'end\n';
                break;
            case 'declaracion variable asignacion':
                cadena += 'var ' + actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=heap[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'param':
                cadena += 'param;\n';
                break;
        }
    }
    return cadena;
}

function optimisacionesAlgebraicas(actual) {
    switch (actual.hijos[2].nombre) {
        case '+':
            if (actual.hijos[3].hijos[0].nombre == '0') {
                if (actual.hijos[0].nombre == actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 8;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return '';
                }
                else if (actual.hijos[0].nombre != actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 12;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre;
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + ';';
                }
            }
            if (actual.hijos[1].hijos[0].nombre == '0') {
                if (actual.hijos[0].nombre == actual.hijos[3].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 8;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return '';
                }
                else if (actual.hijos[0].nombre != actual.hijos[3].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 12;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre;
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre + ';';
                }
            }
            return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '+' + actual.hijos[3].hijos[0].nombre + ';';
        case '-':
            if (actual.hijos[3].hijos[0].nombre == '0') {
                if (actual.hijos[0].nombre == actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 9;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);

                    return '';
                }
                else if (actual.hijos[0].nombre != actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 13;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre;
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + ';';
                }
            }
            return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '-' + actual.hijos[3].hijos[0].nombre + ';';
        case '*':
            if (actual.hijos[3].hijos[0].nombre == '0') {
                let opt = { exp: '', result: '', regla: 0 };
                opt.regla = 17;
                opt.result = actual.hijos[0].nombre + '=0;';
                opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                tablaOptimisacion.push(opt);
                return actual.hijos[0].nombre + '=0;';
            }
            else if (actual.hijos[1].hijos[0].nombre == '0') {
                let opt = { exp: '', result: '', regla: 0 };
                opt.regla = 17;
                opt.result = actual.hijos[0].nombre + '=0;';
                opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                tablaOptimisacion.push(opt);
                return actual.hijos[0].nombre + '=0;';
            }
            else if (actual.hijos[1].hijos[0].nombre == '1') {
                if (actual.hijos[0].nombre == actual.hijos[3].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 10;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);

                    return '';
                }
                else if (actual.hijos[0].nombre != actual.hijos[3].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 14;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre;
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);

                    return actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre + ';';
                }
            }
            else if (actual.hijos[3].hijos[0].nombre == '1') {
                if (actual.hijos[0].nombre == actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 10;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);

                    return '';
                }
                else if (actual.hijos[0].nombre != actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 14;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre;
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);

                    return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + ';';
                }
            }
            else if (actual.hijos[3].hijos[0].nombre == '2') {
                let opt = { exp: '', result: '', regla: 0 };
                opt.regla = 16;
                opt.result = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '+' + actual.hijos[1].hijos[0].nombre + ';';
                opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                tablaOptimisacion.push(opt);
                return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '+' + actual.hijos[1].hijos[0].nombre + ';';
            }
            else if (actual.hijos[1].hijos[0].nombre == '2') {
                let opt = { exp: '', result: '', regla: 0 };
                opt.regla = 16;
                opt.result = actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre + '+' + actual.hijos[3].hijos[0].nombre + ';';
                opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                tablaOptimisacion.push(opt);
                return actual.hijos[0].nombre + '=' + actual.hijos[3].hijos[0].nombre + '+' + actual.hijos[3].hijos[0].nombre + ';';
            }
            return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '*' + actual.hijos[3].hijos[0].nombre + ';';
        case '/':
            if (actual.hijos[1].hijos[0].nombre == '0') {
                let opt = { exp: '', result: '', regla: 0 };
                opt.regla = 18;
                opt.result = actual.hijos[0].nombre + '=0;';
                opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                tablaOptimisacion.push(opt);
                return actual.hijos[0].nombre + '=0;';
            }
            else if (actual.hijos[3].hijos[0].nombre == '1') {
                if (actual.hijos[0].nombre == actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 11;
                    opt.result = '';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return '';
                }
                if (actual.hijos[0].nombre != actual.hijos[1].hijos[0].nombre) {
                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 15;
                    opt.result = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + ';';
                    opt.exp = actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

                    tablaOptimisacion.push(opt);
                    return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + ';';
                }
            }
            return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + '/' + actual.hijos[3].hijos[0].nombre + ';';
        default:
            return actual.hijos[0].nombre + '=' + actual.hijos[1].hijos[0].nombre + actual.hijos[2].nombre + actual.hijos[3].hijos[0].nombre + ';';

    }

}

function optimizacion1(contador, actual, t1, t2) {
    for (let i = contador; i < actual.hijos.length; i++) {
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                if (t1 == actual.hijos[i].hijos[0].nombre) {
                    return ''
                }
                break;
            case 'asignacion1':
                let tm1 = actual.hijos[i].hijos[0].nombre;
                let tm2 = actual.hijos[i].hijos[1].hijos[0].nombre;
                if (t2 == tm1 && t1 == tm2) {

                    let opt = { exp: '', result: '', regla: 0 };
                    opt.regla = 1;
                    opt.result = t1 + '=' + t2 + ';\n'
                    opt.result += '...\n';

                    opt.exp += t1 + '=' + t2 + ';\n'
                    opt.exp += '...\n';
                    opt.exp += t2 + '=' + t1 + ';\n'

                    tablaOptimisacion.push(opt);

                    return i
                }
                else if (t2 == actual.hijos[i].hijos[0].nombre &&
                    t1 != actual.hijos[i].hijos[1].hijos[0].nombre) {
                    return ''
                }
                break;
            case 'salto':
                return '';
        }
    }
    return ''
}


function crearGrafo(actual) {
    var grafo = "digraph G {\n";
    grafo += recorrerArbol(actual.hijos[0]);
    grafo += '}'

    console.log(grafo);

    return grafo;
}
exports.crearGrafo = crearGrafo;

var contC = 0;
function recorrerArbol(actual) {
    var cadena = '';
    let dot = ''
    let omitir = []
    let l = '';
    let l2 = 0;
    let actualL = ''
    let ln = 1;
    for (var i = 0; i < actual.hijos.length; i++) {
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                cadena += optimisacionesAlgebraicas(actual.hijos[i]) + '\\n';
                break;
            case 'if':
                if (l2 == 1) {
                    dot += "\"" + actualL + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";
                    l2 = 0;
                    cadena = '';
                    dot += "\"" + actualL + "\"->\"g" + actual.hijos[i].hijos[3].nombre + "\";\n"
                    actualL = ''
                }

                cadena += 'if(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\\n';

                dot += "\"g" + actual.hijos[i].hijos[3].nombre + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";
                dot += "\"g" + actual.hijos[i].hijos[3].nombre + "\"->\"" + actual.hijos[i].hijos[3].nombre + "\";\n"

                l = actual.hijos[i].hijos[3].nombre;
                cadena = ''

                break;
            case 'saltar':
                if (l2 == 1) {
                    dot += "\"" + actualL + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";
                    l2 = 0;
                    cadena = '';
                    ln = 0;
                    dot += "\"" + actualL + "\"->\"g" + actual.hijos[i].hijos[0].nombre + "\";\n"
                    actualL = ''
                }

                if (l != '') {
                    dot += "\"g" + l + "\"->\"g" + actual.hijos[i].hijos[0].nombre + "\";\n"
                }

                cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\\n';

                dot += "\"g" + actual.hijos[i].hijos[0].nombre + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";
                dot += "\"g" + actual.hijos[i].hijos[0].nombre + "\"->\"" + actual.hijos[i].hijos[0].nombre + "\";\n"

                cadena = '';

                break;
            case 'asignacion1':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\\n';
                let posOm = optimizacion1(i + 1, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre)
                if (posOm != '') {
                    omitir.push(posOm)
                }
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\\n';
                break;
            case 'stack2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=stack[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\\n';
                break;
            case 'salto':

                if (actualL != '') {
                    dot += "\"" + actualL + "\"->\"" + actual.hijos[i].hijos[0].nombre + "\";\n"

                    dot += "\"" + actualL + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";
                }
                actualL = actual.hijos[i].hijos[0].nombre;
                l2 = 1

                cadena = ''
                break;
            case 'print':
                cadena += 'print(\\"%' + actual.hijos[i].hijos[0].nombre + '\\",' + actual.hijos[i].hijos[1].nombre + ');\\n';
                break;
            case 'println':
                cadena += 'println(\\"%' + actual.hijos[i].hijos[0].nombre + '\\",' + actual.hijos[i].hijos[1].nombre + ');\\n';
                break;
            case 'invocacion metodo':
                cadena += 'call ' + actual.hijos[i].hijos[0].nombre + ';\\n';
                break;
            case 'declaracion metodo':

                cadena += 'proc ' + actual.hijos[i].hijos[0].nombre + ' begin\\n';
                dot += "subgraph cluster_" + contC + " {\n"
                dot += 'label = \"' + actual.hijos[i].hijos[0].nombre + '\";\n'
                dot += 'color=green;\n'
                contC++;
                dot += recorrerArbol(actual.hijos[i].hijos[1]);
                dot += '}\n'

                cadena += 'end\n';
                break;
            case 'declaracion variable asignacion':
                cadena += 'var ' + actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\\n';
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\\n';
                break;
            case 'heap2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=heap[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\\n';
                break;
            case 'param':
                cadena += 'param;\\n';
                break;
        }
    }
    dot += "\"" + actualL + "\" [color=blue shape=Msquare label =\"" + cadena + "\"];\n";

    return dot;
}


function optimizarCodigo2(actual) {
    return listaOptimisacion2(actual.hijos[0]);
}

function listaOptimisacion2(actual) {
    var cadena = '';
    let omitir = []
    for (var i = 0; i < actual.hijos.length; i++) {
        let omite = false;
        for (let j = 0; j < omitir.length; j++) {
            if (i == omitir[j]) {
                omite = true;
            }
        }
        if (omite) {
            omite = false;
            continue
        }
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                let op21 = optimizacion21(i, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre, actual.hijos[i].hijos[3].hijos[0].nombre, actual.hijos[i].hijos[2].nombre);
                cadena += op21.cadena;
                i = op21.i
                break;
            case 'if':
                var op = true;
                var del = true;
                if (actual.hijos[i + 1] != undefined) {
                    if (actual.hijos[i + 1].nombre == 'saltar') {
                        if (actual.hijos[i].hijos[1].nombre == '==') {
                            if (actual.hijos[i].hijos[0].hijos[0].nombre != undefined && actual.hijos[i].hijos[2].hijos[0].nombre != undefined) {
                                if ((actual.hijos[i].hijos[2].nombre == 'decimal' || actual.hijos[i].hijos[2].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[2].nombre == 'char') && (actual.hijos[i].hijos[0].nombre == 'decimal' || actual.hijos[i].hijos[0].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[0].nombre == 'char')) {
                                    var valor = EXP(actual.hijos[i].hijos[1].nombre, obtenerValor(actual.hijos[i].hijos[0]), obtenerValor(actual.hijos[i].hijos[2]));

                                    if (valor == '1') {
                                        cadena += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 4;
                                        opt.result += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i++;
                                        break;
                                    }
                                    if (valor == '0') {
                                        let ret = optimizacion19(i, actual, actual.hijos[i].hijos[3].nombre)
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 19;
                                        opt.result += '';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += '...\n';
                                        opt.exp += actual.hijos[i].hijos[3].nombre + ':\n'
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i = ret.i;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                var op2 = true;
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[3].nombre) {
                                if (actual.hijos[j + 1] != undefined) {
                                    if (actual.hijos[j + 1].nombre == 'saltar') {
                                        cadena += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 7;
                                        opt.result += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        opt.result += '...\n';
                                        opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += '...\n';
                                        opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        op2 = false;
                                        tablaOptimisacion.push(opt);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (op2) {
                    let cadIf = 'if(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';

                    cadena += cadIf
                    let op20 = optimizacion20(i + 1, actual)
                    cadena += op20.cadena;
                    i = op20.i;
                    if (op20.cadena != '') {

                        let opt = { exp: '', result: '', regla: 0 };
                        opt.regla = 20;
                        opt.result = cadIf
                        opt.result += op20.cadena

                        opt.exp += cadIf
                        opt.exp += op20.cadena;
                        opt.exp += '...\n';

                        tablaOptimisacion.push(opt);
                    }
                }
                break;

            case 'ifFalse':
                cadena += 'ifFalse(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n'
                break;
            case 'saltar':
                var op = true;
                var op2 = true;
                for (j = i; j < actual.hijos.length; j++) {
                    if (actual.hijos[j].nombre == 'salto') {
                        if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                            if (actual.hijos[j + 1] != undefined) {
                                if (actual.hijos[j + 1].nombre == 'saltar') {
                                    cadena += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    let opt = { exp: '', result: '', regla: 0 };
                                    opt.regla = 6;
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    opt.result += '...\n';
                                    opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                    opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                    opt.exp += '...\n';
                                    opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    op = false;
                                    op2 = false;
                                    tablaOptimisacion.push(opt);
                                    break;
                                }
                            }
                        }
                    }
                    else if (actual.hijos[j].nombre == 'declaracion metodo') {
                        op = false;
                        op2 = true;
                        break;
                    }
                }
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            op2 = false
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                                cadena += actual.hijos[j].hijos[0].nombre;

                                for (var x = 1; x < actual.hijos[j].hijos.length; x++) {
                                    cadena += ',' + actual.hijos[j].hijos[x].nombre;
                                }
                                cadena += ':\n';
                                i = j;
                                let opt = { exp: '', result: '', regla: 0 };
                                opt.regla = 2;
                                opt.result = actual.hijos[j].hijos[0].nombre + ':\n';

                                opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                opt.exp += '...\n';
                                opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';

                                tablaOptimisacion.push(opt);
                                break;
                            }
                            else {
                                cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                break;
                            }
                        }
                    }
                }

                if (op2) {
                    cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                }
                break;
            case 'asignacion1':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                let posOm = optimizacion1(i + 1, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre)
                if (posOm != '') {
                    omitir.push(posOm)
                }
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'stack2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=stack[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'salto':
                cadena += actual.hijos[i].hijos[0].nombre;

                for (var x = 1; x < actual.hijos[i].hijos.length; x++) {
                    cadena += ',' + actual.hijos[i].hijos[x].nombre;
                }
                cadena += ':\n';
                break;
            case 'print':
                cadena += 'print(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'println':
                cadena += 'println(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'invocacion metodo':
                cadena += 'call ' + actual.hijos[i].hijos[0].nombre + ';\n';
                break;
            case 'declaracion metodo':
                cadena += 'proc ' + actual.hijos[i].hijos[0].nombre + ' begin\n';
                cadena += listaOptimisacion2(actual.hijos[i].hijos[1]);
                cadena += 'end\n';
                break;
            case 'declaracion variable asignacion':
                cadena += 'var ' + actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=heap[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'param':
                cadena += 'param;\n';
                break;
        }
    }
    return cadena;
}


function optimizarCodigo3(actual) {
    return listaOptimisacion3(actual.hijos[0]);
}

function listaOptimisacion3(actual) {
    var cadena = '';
    let omitir = []
    for (var i = 0; i < actual.hijos.length; i++) {
        let omite = false;
        for (let j = 0; j < omitir.length; j++) {
            if (i == omitir[j]) {
                omite = true;
            }
        }
        if (omite) {
            omite = false;
            continue
        }
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                let op21 = optimizacion22(i, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre, actual.hijos[i].hijos[3].hijos[0].nombre, actual.hijos[i].hijos[2].nombre);
                cadena += op21.cadena;
                i = op21.i
                break;
            case 'if':
                var op = true;
                var del = true;
                if (actual.hijos[i + 1] != undefined) {
                    if (actual.hijos[i + 1].nombre == 'saltar') {
                        if (actual.hijos[i].hijos[1].nombre == '==') {
                            if (actual.hijos[i].hijos[0].hijos[0].nombre != undefined && actual.hijos[i].hijos[2].hijos[0].nombre != undefined) {
                                if ((actual.hijos[i].hijos[2].nombre == 'decimal' || actual.hijos[i].hijos[2].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[2].nombre == 'char') && (actual.hijos[i].hijos[0].nombre == 'decimal' || actual.hijos[i].hijos[0].nombre.toLowerCase() == 'entero' || actual.hijos[i].hijos[0].nombre == 'char')) {
                                    var valor = EXP(actual.hijos[i].hijos[1].nombre, obtenerValor(actual.hijos[i].hijos[0]), obtenerValor(actual.hijos[i].hijos[2]));

                                    if (valor == '1') {
                                        cadena += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 4;
                                        opt.result += 'goto ' + actual.hijos[i].hijos[3].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += 'goto ' + actual.hijos[i + 1].hijos[0].nombre + ';\n';
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i++;
                                        break;
                                    }
                                    if (valor == '0') {
                                        let ret = optimizacion19(i, actual, actual.hijos[i].hijos[3].nombre)
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 19;
                                        opt.result += '';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += '...\n';
                                        opt.exp += actual.hijos[i].hijos[3].nombre + ':\n'
                                        tablaOptimisacion.push(opt);
                                        op = false;
                                        i = ret.i;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                var op2 = true;
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[3].nombre) {
                                if (actual.hijos[j + 1] != undefined) {
                                    if (actual.hijos[j + 1].nombre == 'saltar') {
                                        cadena += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        let opt = { exp: '', result: '', regla: 0 };
                                        opt.regla = 7;
                                        opt.result += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        opt.result += '...\n';
                                        opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                        opt.exp += 'if(' + actual.hijos[i].hijos[0].hijos[0].nombre + actual.hijos[i].hijos[1].nombre + actual.hijos[i].hijos[2].hijos[0].nombre + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';
                                        opt.exp += '...\n';
                                        opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                        opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                        op2 = false;
                                        tablaOptimisacion.push(opt);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (op2) {
                    let cadIf = 'if(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n';

                    cadena += cadIf
                    let op20 = optimizacion20(i + 1, actual)
                    cadena += op20.cadena;
                    i = op20.i;
                    if (op20.cadena != '') {

                        let opt = { exp: '', result: '', regla: 0 };
                        opt.regla = 20;
                        opt.result = cadIf
                        opt.result += op20.cadena

                        opt.exp += cadIf
                        opt.exp += op20.cadena;
                        opt.exp += '...\n';

                        tablaOptimisacion.push(opt);
                    }
                }
                break;

            case 'ifFalse':
                cadena += 'ifFalse(' + obtenerValorOptimisacion(actual.hijos[i].hijos[0]) + actual.hijos[i].hijos[1].nombre + obtenerValorOptimisacion(actual.hijos[i].hijos[2]) + ') goto ' + actual.hijos[i].hijos[3].nombre + ';\n'
                break;
            case 'saltar':
                var op = true;
                var op2 = true;
                for (j = i; j < actual.hijos.length; j++) {
                    if (actual.hijos[j].nombre == 'salto') {
                        if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                            if (actual.hijos[j + 1] != undefined) {
                                if (actual.hijos[j + 1].nombre == 'saltar') {
                                    cadena += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    let opt = { exp: '', result: '', regla: 0 };
                                    opt.regla = 6;
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    opt.result += '...\n';
                                    opt.result += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.result += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';

                                    opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                    opt.exp += '...\n';
                                    opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';
                                    opt.exp += 'goto ' + actual.hijos[j + 1].hijos[0].nombre + ';\n';
                                    op = false;
                                    op2 = false;
                                    tablaOptimisacion.push(opt);
                                    break;
                                }
                            }
                        }
                    }
                    else if (actual.hijos[j].nombre == 'declaracion metodo') {
                        op = false;
                        op2 = true;
                        break;
                    }
                }
                if (op) {
                    for (j = i; j < actual.hijos.length; j++) {
                        if (actual.hijos[j].nombre == 'salto') {
                            op2 = false
                            if (actual.hijos[j].hijos[0].nombre == actual.hijos[i].hijos[0].nombre) {
                                cadena += actual.hijos[j].hijos[0].nombre;

                                for (var x = 1; x < actual.hijos[j].hijos.length; x++) {
                                    cadena += ',' + actual.hijos[j].hijos[x].nombre;
                                }
                                cadena += ':\n';
                                i = j;
                                let opt = { exp: '', result: '', regla: 0 };
                                opt.regla = 2;
                                opt.result = actual.hijos[j].hijos[0].nombre + ':\n';

                                opt.exp += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                opt.exp += '...\n';
                                opt.exp += actual.hijos[j].hijos[0].nombre + ':\n';

                                tablaOptimisacion.push(opt);
                                break;
                            }
                            else {
                                cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                                break;
                            }
                        }
                    }
                }

                if (op2) {
                    cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
                }
                break;
            case 'asignacion1':
                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                let posOm = optimizacion1(i + 1, actual, actual.hijos[i].hijos[0].nombre, actual.hijos[i].hijos[1].hijos[0].nombre)
                if (posOm != '') {
                    omitir.push(posOm)
                }
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'stack2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=stack[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'salto':
                cadena += actual.hijos[i].hijos[0].nombre;

                for (var x = 1; x < actual.hijos[i].hijos.length; x++) {
                    cadena += ',' + actual.hijos[i].hijos[x].nombre;
                }
                cadena += ':\n';
                break;
            case 'print':
                cadena += 'print(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'println':
                cadena += 'println(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'invocacion metodo':
                cadena += 'call ' + actual.hijos[i].hijos[0].nombre + ';\n';
                break;
            case 'declaracion metodo':
                cadena += 'proc ' + actual.hijos[i].hijos[0].nombre + ' begin\n';
                cadena += listaOptimisacion3(actual.hijos[i].hijos[1]);
                cadena += 'end\n';
                break;
            case 'declaracion variable asignacion':
                cadena += 'var ' + actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'heap2':
                cadena += actual.hijos[i].hijos[0].hijos[0].nombre + '=heap[' + actual.hijos[i].hijos[1].hijos[0].nombre + '];\n';
                break;
            case 'param':
                cadena += 'param;\n';
                break;
        }
    }
    return cadena;
}


function optimizacion22(contador, actual, t, v1, v2, op) {
    let devolver = true;
    let cadena = '';
    let lR = ''
    let opt = { exp: '', result: '', regla: 0 };
    for (let i = contador + 1; i < actual.hijos.length; i++) {
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                if (actual.hijos[i].hijos[0].nombre == t) {
                    return { i: i - 1, cadena: cadena }
                }
                else {
                    if (lR == '') {
                        if (actual.hijos[i].hijos[1].hijos[0].nombre == v1 &&
                            actual.hijos[i].hijos[3].hijos[0].nombre == v2 &&
                            actual.hijos[i].hijos[2].nombre == op) {
                            lR = actual.hijos[i].hijos[0].nombre;
                            opt.result = actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                        }
                        else {
                            cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                        }
                    }
                    else {
                        if (actual.hijos[i].hijos[0].nombre == lR) {
                            return { i: contador, cadena: '' }
                        }
                        else {
                            if (actual.hijos[i].hijos[1].hijos[0].nombre == lR) {
                                cadena += actual.hijos[i].hijos[0].nombre + '=' + t + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                                opt.result += actual.hijos[i].hijos[0].nombre + '=' + t + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                            }
                            if (actual.hijos[i].hijos[3].hijos[0].nombre == lR) {
                                cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + t + ';\n'
                                opt.result += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + t + ';\n'       
                            }

                            opt.regla = 22;

                            opt.exp = opt.result = actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'       
                            
                            tablaOptimisacion.push(opt);

                            return { i: i, cadena: cadena }
                        }
                    }
                }
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'print':
                cadena += 'print(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'println':
                cadena += 'println(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            default:
                return { i: i - 1, cadena: cadena }
        }
    }
    return { i: contador, cadena: '' }
}

function optimizacion21(contador, actual, t, v1, v2, op) {
    let devolver = true;
    let cadena = '';
    for (let i = contador + 1; i < actual.hijos.length; i++) {
        switch (actual.hijos[i].nombre) {
            case 'asignacion2':
                if (actual.hijos[i].hijos[0].nombre == t) {
                    return { i: i - 1, cadena: cadena }
                }
                else {
                    if (actual.hijos[i].hijos[1].hijos[0].nombre == v1 &&
                        actual.hijos[i].hijos[3].hijos[0].nombre == v2 &&
                        actual.hijos[i].hijos[2].nombre == op) {
                        cadena += actual.hijos[i].hijos[0].nombre + '=' + t + ';\n'

                        let opt = { exp: '', result: '', regla: 0 };
                        opt.regla = 21;
                        opt.result = actual.hijos[i].hijos[0].nombre + '=' + t + ';\n'

                        opt.exp += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n';

                        tablaOptimisacion.push(opt);

                        return { i: i, cadena: cadena }
                    } else {
                        cadena += actual.hijos[i].hijos[0].nombre + '=' + actual.hijos[i].hijos[1].hijos[0].nombre + actual.hijos[i].hijos[2].nombre + actual.hijos[i].hijos[3].hijos[0].nombre + ';\n'
                    }
                }
                break;
            case 'heap1':
                cadena += 'heap[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            case 'print':
                cadena += 'print(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'println':
                cadena += 'println(\"%' + actual.hijos[i].hijos[0].nombre + '\",' + actual.hijos[i].hijos[1].nombre + ');\n';
                break;
            case 'stack1':
                cadena += 'stack[' + actual.hijos[i].hijos[0].hijos[0].nombre + ']=' + actual.hijos[i].hijos[1].hijos[0].nombre + ';\n';
                break;
            default:
                return { i: contador, cadena: '' }
        }
    }
    return { i: contador, cadena: '' }
}

function optimizacion20(contador, actual) {
    let devolver = true;
    let cadena = '';
    for (let i = contador; i < actual.hijos.length; i++) {
        if (contador == i && actual.hijos[i].nombre == 'saltar') {
            cadena += 'goto ' + actual.hijos[i].hijos[0].nombre + ';\n';
            devolver = false;
        }
        if (actual.hijos[i].nombre == 'salto') {
            return { i: i - 1, cadena: cadena }
        }
        if (devolver) {
            return { i: contador-1, cadena: '' }
        }
    }
    return { i: contador-1, cadena: '' }
}

function optimizacion19(contador, actual, l) {
    for (let i = contador; i < actual.hijos.length; i++) {
        if (actual.hijos[i].nombre == 'salto') {
            if (l == actual.hijos[i].hijos[0].nombre) {
                return { i: i }
            }
        }
    }
    return { i: actual.hijos.length }
}

exports.optimizarCodigo2 = optimizarCodigo2;
exports.optimizarCodigo3 = optimizarCodigo3;