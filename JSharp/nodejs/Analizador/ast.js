var fs = require('fs');
var parser = require("../Analizador/calc.js");
var tabla = require("./tablaSimbolos.js");
var error = [];
var contadorT = 0;
var contadorL = 0;

var contadorA = 0;

var contadorH = 0;
var contadorS = 0;

var funcionPrincipal;



class Error {
    constructor(error, linea, columna) {
        this.tipo = "Semantico"
        this.error = error
        this.linea = linea
        this.columna = columna
    }
}

class retornoAST {
    constructor(c3d, error, t, l, tipo) {
        this.c3d = ''
        this.error = 0
        this.t = ''
        this.l = ''
        this.tipo = ''
        this.break = ''
        this.arreglo = 0
        this.tamano = 0
    }
}

class BCR {
    constructor() {
        this.break = ''
        this.continue = ''
        this.return = ''
    }
}

var tablaS = new tabla.tablaSimbolos();

class AST {

    constructor(ident, lin, col, hi) {
        this.identificador = ident
        this.linea = lin
        this.columna = col
        this.hijos = hi
    }

    getTabla() {
        return tablaS;
    }
    getError() {
        return error;
    }

    setHijo(nodo) {
        this.hijos.push(nodo);
    }

    compilar = function compilar() {
        contadorT = 0;
        contadorL = 0;
        contadorA = 0;
        error = [];

        let retorno
        let cabecera
        try {
            retorno = this.compilarSentencia();

            cabecera = 'var ';
            for (let i = 0; i < (contadorT + 1); i++) {
                cabecera += 't' + i + ',';
            }

            cabecera = cabecera.substring(0, cabecera.length - 1) + ';\n';
            cabecera += 'var Stack[];\n';
            cabecera += 'var Heap[];\n';
            cabecera += 'var P = 1;\n';
            cabecera += 'var H = 1;\n';
            cabecera += 'H = H+' + contadorH + ';\n';

            retorno.c3d = cabecera + retorno.c3d;

            retorno.c3d += 'L0:\n'

            if (funcionPrincipal != undefined) {


                let cadena = this.llenarStack(funcionPrincipal.tamano);
                retorno.c3d += cadena
                retorno.c3d += 'P = P+' + funcionPrincipal.tamano + ';\n'

                retorno.c3d += 'call principal;'
            }
            return { error: error, codigo: retorno.c3d }

        } catch (error) {

            console.log(error)
            return { error: '', codigo: error.message }
        }
    }

    compilarSentencia = function compilarSentencia() {
        let c3d = '';
        let retorno = new retornoAST('', 0, '', '', '');
        let valor
        contadorA++

        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'inicializando variable con tipo':
                    valor = this.hijos[i].inicializandoVariable(0);
                    retorno.c3d += valor.c3d;
                    break;
                case 'inicializando variable sin tipo':
                    valor = this.hijos[i].inicializandoVariable(0);
                    retorno.c3d += valor.c3d;
                    break;
                case 'inicializando arreglo':
                    valor = this.hijos[i].inicializandoVariableArreglo(0);
                    retorno.c3d += valor.c3d;
                    break;
            }
        }
        (contadorL++)
        retorno.c3d += 'goto L0;\n'
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'import':
                    ambito.tablaSimbolos.push(this.hijos[i].importar(padre))
                    break;
                case 'declaracionFuncion':
                    valor = this.hijos[i].declaracionFuncion(0)
                    retorno.c3d += valor.c3d;
                    break;
            }
        }
        return retorno;
    }


    compilarSentenciaControl = function compilarSentenciaControl(idAmbito, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'print':
                    valor = this.hijos[i].print(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'ifInstruccion':
                    valor = this.hijos[i].sentenciaIf(idAmbito, bcr);
                    retorno.c3d += valor.c3d;
                    break;
                case 'while':
                    valor = this.hijos[i].sentenciaWhile(idAmbito, bcr);
                    retorno.c3d += valor.c3d;
                    break;
                case 'do while':
                    valor = this.hijos[i].sentenciaDoWhile(idAmbito, bcr);
                    retorno.c3d += valor.c3d;
                    break;
                case 'switch':
                    valor = this.hijos[i].sentenciaSwitch(idAmbito, bcr);
                    retorno.c3d += valor.c3d;
                    break;
                case 'for':
                    valor = this.hijos[i].sentenciaFor(idAmbito, bcr);
                    retorno.c3d += valor.c3d;
                    break;
                case 'break':
                    if (bcr.break == '') {
                        error.push(new Error('El break no puede existir fuera de ciclos o switch', this.hijos[i].linea, this.hijos[i].columna))
                    }
                    else {
                        retorno.c3d += 'goto ' + bcr.break + ';\n'
                    }
                    break;
                case 'continue':
                    if (bcr.continue == '') {
                        error.push(new Error('El continue no puede existir fuera de ciclos', this.hijos[i].linea, this.hijos[i].columna))
                    }
                    else {
                        retorno.c3d += 'goto ' + bcr.continue + ';\n'
                    }
                    break;
                case 'inicializando variable con tipo':
                    valor = this.hijos[i].inicializandoVariable2(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'inicializando variable sin tipo':
                    valor = this.hijos[i].inicializandoVariable2(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'asignacion':
                    valor = this.hijos[i].compilarAsignacion(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'asignacion arreglo':
                    valor = this.hijos[i].compilarAsignacionArreglo(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'llamadaFuncion':
                    valor = this.hijos[i].compilarLlamadaAFuncion(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'incremento':
                    valor = this.hijos[i].compilarIncremento(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'decremento':
                    valor = this.hijos[i].compilarDecremento(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'return':
                    valor = this.hijos[i].compilarRetorno(idAmbito);
                    retorno.c3d += valor.c3d;
                    retorno.c3d += 'goto ' + bcr.return + ';\n'
                    break;
                case 'inicializando arreglo':
                    valor = this.hijos[i].inicializandoVariableArreglo2(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                default:
            }
        }

        return retorno;
    }

    compilarRetorno = function compilarRetorno(idAmbito) {
        let valor = tablaS.obtenerFuncionR(idAmbito);
        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos.length == 1) {
            let resultado = this.hijos[0].obtenerExp(idAmbito);
            if (valor != 'error') {
                let retorno = new retornoAST('', 0, '', '', '');

                retorno.c3d += resultado.c3d;

                retorno.c3d += 't' + (contadorT++) + '=P-0;\n';
                retorno.t = 't' + (contadorT - 1);

                retorno.c3d += 'Stack[t' + (contadorT - 1) + ']=' + resultado.t + ';\n';

                retorno.tipo = valor.tipo
                return retorno

            }
            else {
                let err = new Error('La variable ' + this.hijos[0].identificador +
                    ' no existe', this.hijos[0].linea, this.hijos[0].columna);

                error.push(err)
            }
        }
        //retorno.c3d = 'goto L'+ ';\n' 
        return retorno
    }

    compilarIncremento = function compilarIncremento(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);
        let retorno = new retornoAST('', 0, '', '', '');

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
                retorno.c3d += 't' + (contadorT++) + '=t' + (contadorT - 2) + '+1;\n';
                retorno.c3d += 'Heap[' + valor.posicionH + ']=t' + (contadorT - 1) + ';\n';
            }
            else {
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);

                retorno.c3d += 't' + (contadorT++) + '=t' + (contadorT - 2) + '+1;\n';
                retorno.c3d += 'Stack[t' + (contadorT - 3) + ']=t' + (contadorT - 1) + ';\n';
            }

            retorno.tipo = valor.tipo
            return retorno

        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }

        return retorno
    }

    compilarDecremento = function compilarDecremento(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);
        let retorno = new retornoAST('', 0, '', '', '');

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
                retorno.c3d += 't' + (contadorT++) + '=t' + (contadorT - 2) + '-1;\n';
                retorno.c3d += 'Heap[' + valor.posicionH + ']=t' + (contadorT - 1) + ';\n';
            }
            else {
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);

                retorno.c3d += 't' + (contadorT++) + '=t' + (contadorT - 2) + '-1;\n';
                retorno.c3d += 'Stack[t' + (contadorT - 3) + ']=t' + (contadorT - 1) + ';\n';
            }

            retorno.tipo = valor.tipo
            return retorno

        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }

        return retorno
    }


    compilarLlamadaAFuncion = function compilarLlamadaAFuncion(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        if (this.hijos.length == 1) {
            retorno.c3d += 'call ' + this.hijos[0].identificador + ';\n'
            retorno.c3d += 't' + (contadorT++) + '=P-0;\n';
            //retorno.c3d += 't' + (contadorT++) + '=P-' + copia.posicionS + ';\n';
            retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
            retorno.t = 't' + (contadorT - 1)

            let resultado = tablaS.obtenerFuncion(this.hijos[0].identificador);

            retorno.c3d += 'P = P-' + resultado.tamano + ';\n';
        }
        else {
            let nombre = '';
            if (this.hijos[1].identificador == 'listaExpresiones') {
                nombre = this.hijos[0].identificador + this.hijos[1].obtenerTipoLisataExpresiones(idAmbito)


                let resultado = tablaS.obtenerFuncion(nombre);

                let copia = resultado

                if (resultado == 'error') {
                    return retorno;
                }

                let valor = tablaS.obtenerFuncion(nombre, 0);

                resultado = this.hijos[1].compilarLisataExpresiones(idAmbito, valor.tamano)

                if (resultado.error != 0) {
                    return retorno;
                }

                let cadena = this.llenarStack(valor.tamano);
                retorno.c3d += cadena
                retorno.c3d += resultado.c3d
                retorno.c3d += 'P = P+' + valor.tamano + ';\n'

                retorno.c3d += 'call ' + nombre + ';\n'
                retorno.c3d += 't' + (contadorT++) + '=P-' + copia.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1)
                retorno.tipo = copia.tipo;

                retorno.c3d += 'P = P-' + copia.tamano + ';\n';
            }
            else {

            }
        }


        return retorno;
    }

    compilarLisataExpresiones = function compilarLisataExpresiones(idAmbito, tamano) {
        let retorno = new retornoAST('', 0, '', '', '');
        for (let i = 0; i < this.hijos.length; i++) {
            let resultado = this.hijos[i].obtenerExp(idAmbito);
            if (resultado.error != 0) {
                return retorno;
            }
            retorno.c3d += resultado.c3d;
            retorno.c3d += 'P = P+' + tamano + ';\n'

            retorno.c3d += 't' + contadorT + '=P-' + (i + 1) + ';\n';
            retorno.c3d += 'Stack[t' + (contadorT++) + ']=' + resultado.t + ';\n';
            retorno.c3d += 'P = P-' + tamano + ';\n'
        }

        return retorno;
    }

    compilarLisataAsignacion = function compilarLisataAsignacion(idAmbito, tamano, ) {
        let retorno = new retornoAST('', 0, '', '', '');
        for (let i = 0; i < this.hijos.length; i++) {
            let resultado = this.hijos[i].obtenerExp(idAmbito);
            if (resultado.error != 0) {
                return retorno;
            }
            retorno.c3d += resultado.c3d;
            retorno.c3d += 'P = P+' + tamano + ';\n'

            retorno.c3d += 't' + contadorT + '=P-' + i + ';\n';
            retorno.c3d += 'Stack[t' + (contadorT++) + ']=' + resultado.t + ';\n';
            retorno.c3d += 'P = P-' + tamano + ';\n'
        }

        return retorno;
    }

    obtenerTipoLisataExpresiones = function obtenerTipoLisataExpresiones(idAmbito) {
        let cadena = '';
        for (let i = 0; i < this.hijos.length; i++) {
            let resultado = this.hijos[i].obtenerExp(idAmbito);
            cadena += '_' + resultado.tipo;
        }

        return cadena;
    }

    compilarAsignacion = function compilarAsignacion(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos[0].hijos.length == 1) {
            let posicion = tablaS.obtenerPosicionStack(this.hijos[0].hijos[0].hijos[0].identificador, idAmbito);

            if (posicion != 'error') {

                if (posicion.constante == 1) {
                    error.push(new Error("Se intent modificar un dato constante", this.hijos[0].hijos[0].hijos[0].linea, this.hijos[0].hijos[0].hijos[0].columna));
                }
                if (posicion.tipoSH == 'heap') {
                    if (this.hijos[1].identificador == 'listaExpresiones') {
                        let resultado = this.hijos[1].insertandoArreglo2(idAmbito);
                        retorno.c3d += resultado.c3d;
                        retorno.c3d += 'Heap[' + (posicion.posicionH) + '] = ' + resultado.t + ';\n';
                    }
                    else {
                        if (this.hijos[0].hijos[0].identificador == 'arreglo') {
                            let resultado2 = this.hijos[0].hijos[0].hijos[1].obtenerExp(idAmbito);
                            let resultado = this.hijos[1].obtenerExp(idAmbito);
                            retorno.c3d += resultado.c3d;
                            retorno.c3d += resultado2.c3d;
                            retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (posicion.posicionH) + '];\n';

                            retorno.c3d += 't' + (contadorT - 1) + '=1+t' + (contadorT - 1) + ';\n'
                            retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+' + resultado2.t + ';\n'

                            retorno.c3d += 'Heap[t' + (contadorT - 1) + '] = ' + resultado.t + ';\n';

                        } else {
                            let resultado = this.hijos[1].obtenerExp(idAmbito);
                            retorno.c3d += resultado.c3d;
                            retorno.c3d += 'Heap[' + posicion.posicionH + '] = ' + resultado.t + ';\n';
                        }
                    }
                }
                else {
                    if (this.hijos[1].identificador == 'listaExpresiones') {
                        let resultado = this.hijos[1].insertandoArreglo2(idAmbito);
                        retorno.c3d += resultado.c3d;
                        retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                        retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                    }
                    else {
                        if (this.hijos[0].hijos[0].identificador == 'arreglo') {
                            let resultado2 = this.hijos[0].hijos[0].hijos[1].obtenerExp(idAmbito);
                            let resultado = this.hijos[1].obtenerExp(idAmbito);
                            retorno.c3d += resultado.c3d;
                            retorno.c3d += resultado2.c3d;
                            retorno.c3d += 't' + (contadorT++) + '=P-' + (posicion.posicionS) + ';\n';
                            retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';

                            retorno.c3d += 't' + (contadorT - 1) + '=1+t' + (contadorT - 1) + ';\n'
                            retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+' + resultado2.t + ';\n'

                            retorno.c3d += 'Heap[t' + (contadorT - 1) + '] = ' + resultado.t + ';\n';

                        } else {
                            let resultado = this.hijos[1].obtenerExp(idAmbito);
                            retorno.c3d += resultado.c3d;
                            retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                            retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                        }
                    }
                }
            } else {
                error.push(Error("La variable no existe"), this.hijos[0].linea, this.hijos[0].columna);
                retorno.t = 0;
                retorno.tipo = 'integer'
            }
        }
        else {//

        }

        return retorno;
    }

    asignarPosicionArrelo = function asignarPosicionArrelo() {

    }

    sentenciaFor = function sentenciaFor(idAmbito, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let resultado1 = new retornoAST('', 0, '', '', '');
        let resultado2 = new retornoAST('', 0, '', '', '');
        let resultado3 = new retornoAST('', 0, '', '', '');

        let nuevoBCR = new BCR();
        nuevoBCR.return = bcr.return;
        nuevoBCR.break = 'L' + (contadorL++)

        let l2 = 'L' + (contadorL++)
        nuevoBCR.continue = 'L' + (contadorL++)

        idAmbito = contadorA++
        for (let i = 0; i < this.hijos[0].hijos.length; i++) {
            if (this.hijos[0].hijos[i].identificador == 'instruccion1') {
                resultado1 = this.hijos[0].hijos[i].compilarInstrucciones(idAmbito, nuevoBCR)
            }
            else if (this.hijos[0].hijos[i].identificador == 'instruccion2') {
                resultado2 = this.hijos[0].hijos[i].compilarInstrucciones(idAmbito, nuevoBCR)
            }
            else if (this.hijos[0].hijos[i].identificador == 'instruccion3') {
                resultado3 = this.hijos[0].hijos[i].compilarInstrucciones(idAmbito, nuevoBCR)
            }
        }

        retorno.c3d += resultado1.c3d

        if (resultado2.t == '') {
            resultado2.t = 't' + (contadorT++);
            resultado2.c3d += resultado2.t + '=1;\n';
        }

        let l1 = nuevoBCR.break

        let resultado4 = this.hijos[1].compilarSentenciaControl(idAmbito, nuevoBCR);
        let tipo = 'error'

        retorno.c3d += l2 + ':\n';

        retorno.c3d += resultado2.c3d;

        retorno.c3d += 'if(' + resultado2.t + '==0) goto ' + l1 + ';\n';

        retorno.c3d += resultado4.c3d;

        retorno.c3d += nuevoBCR.continue + ':\n';
        retorno.c3d += resultado3.c3d;

        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += l1 + ':\n';

        return retorno
    }

    compilarInstrucciones = function compilarInstrucciones(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '')
        let valor
        if (this.hijos[0].identificador == 'asignacion') {
            valor = this.hijos[i].compilarAsignacion(idAmbito);
            retorno.c3d += valor.c3d;
            retorno.t = valor.t
        }
        else if (this.hijos[0].identificador == 'inicializando variable con tipo') {
            valor = this.hijos[0].inicializandoVariable2(idAmbito);
            retorno.c3d += valor.c3d;
            retorno.t = valor.t
        }
        else if (this.hijos[0].identificador == 'inicializando variable sin tipo') {
            valor = this.hijos[0].inicializandoVariable2(idAmbito);
            retorno.c3d += valor.c3d;
            retorno.t = valor.t
        }
        else {
            valor = this.hijos[0].obtenerExp(idAmbito);
            retorno.c3d += valor.c3d;
            retorno.t = valor.t
        }


        return retorno
    }

    inicializandoVariableSinTipo = function inicializandoVariableSinTipo(padre) {
        let t = contadorT++;

        let retorno = new retornoAST('', 0, '', '', '');

        let resultado = this.hijos[2].hijos[0].obtenerExp(padre, idAmbito);
        retorno.c3d += resultado.c3d;

        if (this.hijos[0].identificador.toLowerCase() == 'global') {
            ambito.insertarVariableGloabal(this.hijos[1].identificador.toLowerCase(),
                t, resultado.tipo);
        }
        else {
            ambito.insertarVariable(this.hijos[1].identificador.toLowerCase(),
                t, resultado.tipo, 1);
        }

        retorno.c3d += 't' + t + '=' + resultado.t + ';\n';

        return retorno;
    }

    inicializandoVariable = function inicializandoVariable(idAmbito) {
        let t = contadorT++;

        let valor

        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos.length == 2) {
            let valor = this.obtenerTipoDefecto(this.hijos[0].identificador.toLowerCase());
            let valort = 't' + (contadorT);
            retorno.c3d += 't' + (contadorT++) + '=' + valor + ';\n'
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 'Heap[' + posicion + '] = 0;\n';
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].length; i++) {
                    let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].hijos[i].identificador, idAmbito);
                    if (posicion != 'error') {
                        retorno.c3d += 'Heap[' + posicion + '] = 0;\n';
                    }
                }
            }
        }
        else {
            let resultado = this.hijos[2].hijos[0].obtenerExp(idAmbito);
            retorno.c3d += resultado.c3d;
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 'Heap[' + posicion + '] = ' + resultado.t + ';\n';
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {
                    let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].hijos[i].identificador, idAmbito);
                    if (posicion != 'error') {
                        retorno.c3d += 'Heap[' + posicion + '] = ' + resultado.t + ';\n';
                    }
                }
            }
        }

        return retorno;
    }

    inicializandoVariableArreglo = function inicializandoVariableArreglo(idAmbito) {
        let t = contadorT++;

        let valor

        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos.length == 2) {
            let valor = this.obtenerTipoDefecto(this.hijos[0].identificador.toLowerCase());
            let valort = 't' + (contadorT);
            retorno.c3d += 't' + (contadorT++) + '=' + valor + ';\n'
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 'Heap[' + posicion + '] = 0;\n';
                }
            }
        }
        else {
            let resultado = this.hijos[2].insertandoArreglo(idAmbito);
            retorno.c3d += resultado.c3d;
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionHeap(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 'Heap[' + posicion + '] = ' + resultado.t + ';\n';
                }
            }
        }

        return retorno;
    }

    insertandoArreglo = function insertandoArreglo(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let resultado
        let ts = []
        if (this.hijos[0].identificador == 'listaExpresiones') {

            for (let i = 0; i < this.hijos[0].hijos.length; i++) {
                resultado = this.hijos[0].hijos[i].obtenerExp(idAmbito);

                retorno.c3d += resultado.c3d;
                ts.push(resultado.t)
            }

            retorno.t = 't' + (contadorT)
            retorno.c3d += 't' + (contadorT++) + ' = H;\n'
            retorno.c3d += 'Heap[H] = ' + this.hijos[0].hijos.length + ';\n';
            retorno.c3d += 'H = H + 1;\n';

            for (let i = 0; i < ts.length; i++) {
                retorno.c3d += 'Heap[H] = ' + ts[i] + ';\n';
                retorno.c3d += 'H = H + 1;\n';
            }
            return retorno;

        } else {
            resultado = this.hijos[0].obtenerExp(idAmbito);
            retorno.c3d += resultado.c3d
            retorno.t = resultado.t
            return retorno;
        }
    }

    insertandoArreglo2 = function insertandoArreglo2(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let resultado
        let ts = []
        for (let i = 0; i < this.hijos.length; i++) {
            resultado = this.hijos[i].obtenerExp(idAmbito);
            retorno.c3d += resultado.c3d;
            ts.push(resultado.t)
        }

        retorno.t = 't' + (contadorT)
        retorno.c3d += 't' + (contadorT++) + ' = H;\n'
        retorno.c3d += 'Heap[H] = ' + this.hijos.length + ';\n';
        retorno.c3d += 'H = H + 1;\n';

        for (let i = 0; i < ts.length; i++) {
            retorno.c3d += 'Heap[H] = ' + ts[i] + ';\n';
            retorno.c3d += 'H = H + 1;\n';
        }
        return retorno;
    }


    inicializandoVariableArreglo2 = function inicializandoVariableArreglo2(idAmbito) {
        let t = contadorT++;

        let valor

        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos.length == 2) {
            let valor = this.obtenerTipoDefecto(this.hijos[0].identificador.toLowerCase());
            let valort = 't' + (contadorT);
            retorno.c3d += 't' + (contadorT++) + '=' + valor + ';\n'
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionStack(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                    retorno.c3d += 'Stack[t' + (contadorT++) + '] = 0;\n';
                }
            }
        }
        else {
            let resultado = this.hijos[2].insertandoArreglo(idAmbito);
            retorno.c3d += resultado.c3d;
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionStack(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                    retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                }
            }
        }

        return retorno;
    }

    inicializandoVariable2 = function inicializandoVariable2(idAmbito) {
        let t = contadorT++;

        let valor

        let retorno = new retornoAST('', 0, '', '', '');

        if (this.hijos.length == 2) {
            let valor = this.obtenerTipoDefecto(this.hijos[0].identificador.toLowerCase());
            let valort = 't' + (contadorT);
            retorno.c3d += 't' + (contadorT++) + '=' + valor + ';\n'
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionStack(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    let tamano = tablaS.obtenerTamanoFuncion(this.hijos[1].identificador, idAmbito);
                    retorno.c3d += 't' + contadorT + '=P-' + posicion + ';\n';
                    retorno.c3d += 'Stack[t' + (contadorT++) + '] = 0;\n';
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].length; i++) {
                    let posicion = tablaS.obtenerPosicionStack(this.hijos[1].hijos[i].identificador, idAmbito);
                    if (posicion != 'error') {
                        let tamano = tablaS.obtenerTamanoFuncion(this.hijos[1].hijos[i].identificador, idAmbito);
                        retorno.c3d += 't' + contadorT + '=P-' + posicion + ';\n';
                        retorno.c3d += 'Stack[t' + (contadorT++) + '] = 0;\n';
                    }
                }
            }
        }
        else {
            let resultado = this.hijos[2].hijos[0].obtenerExp(idAmbito);
            retorno.c3d += resultado.c3d;
            if (this.hijos[1].hijos.length == 0) {
                let posicion = tablaS.obtenerPosicionStack(this.hijos[1].identificador, idAmbito);
                if (posicion != 'error') {
                    let tamano = tablaS.obtenerTamanoFuncion(this.hijos[1].identificador, idAmbito);
                    retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                    retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {
                    let posicion = tablaS.obtenerPosicionStack(this.hijos[1].hijos[i].identificador, idAmbito);
                    if (posicion != 'error') {
                        let tamano = tablaS.obtenerTamanoFuncion(this.hijos[1].hijos[i].identificador, idAmbito);
                        retorno.c3d += 't' + contadorT + '=P-' + posicion.posicionS + ';\n';
                        retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                    }
                }
            }
        }

        return retorno;
    }

    obtenerTipoDefecto = function obtenerTipoDefecto(tipo) {
        switch (tipo) {
            case 'integer':
            case 'double':
            case 'char':
            case 'boolean':
                return 0;
        }

        return null;
    }


    /*
        *
        *   -------------------------------------------      switch
        *
    */

    sentenciaSwitch = function sentenciaSwitch(idAmbito, bcr) {
        idAmbito = contadorA++
        let retorno1 = this.hijos[0].obtenerExp(idAmbito);

        let retorno2 = this.hijos[1].bloqueSwitch(idAmbito, retorno1, bcr);

        return retorno2
    }

    bloqueSwitch = function bloqueSwitch(idAmbito, valor, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');

        let nuevoBCR = new BCR();
        nuevoBCR.return = bcr.return;
        nuevoBCR.break = 'L' + (contadorL++)

        let l1 = nuevoBCR.break
        let breakL = '';
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'listaSwitch':
                    valor = this.hijos[i].cases(idAmbito, valor, nuevoBCR);
                    retorno.c3d += valor.c3d;
                    if (valor.break != '') {
                        breakL = valor.break;
                    }
                    break;
                case 'default':
                    valor = this.hijos[i].hijos[0].compilarSentenciaControl(idAmbito, nuevoBCR);
                    retorno.c3d += valor.c3d;
                    if (valor.break != '') {
                        breakL = valor.break;
                    }
                    break;
            }
        }

        retorno.c3d += l1 + ':\n';

        return retorno;

    }

    cases = function cases(idAmbito, valor, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let breakL = '';
        let l = '';
        for (let i = 0; i < this.hijos.length; i++) {
            let resultado1 = this.hijos[i].sentenciaCase(idAmbito, valor, l, bcr);
            retorno.c3d += resultado1.c3d;
            l = resultado1.l;
            if (resultado1.break != '') {
                breakL = resultado1.break;
            }
        }

        retorno.c3d += l + ':\n'

        retorno.break = breakL;

        return retorno
    }

    sentenciaCase = function sentenciaCase(idAmbito, valor, l, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');

        let resultado1 = this.hijos[0].obtenerExp(idAmbito);

        let tipo = this.obtenerTipoIgualDesigual(resultado1.tipo, valor.tipo);

        if (tipo == 'error') {
            retorno.error = 1;
            return retorno;
        }


        if (resultado1.tipo == 'string' && valor.tipo == 'string') {
            retorno = this.CompararStrings(resultado1, valor)
        }
        else {
            retorno = this.igualDiferente3d(resultado1, valor, '<>');
        }

        retorno.tipo = tipo;

        let l1 = 'L' + (contadorL++);
        let l2 = 'L' + (contadorL++);

        retorno.c3d += 'if(1<> ' + retorno.t + ') goto ' + l1 + ';\n';
        if (l != '') {
            retorno.c3d += l + ':\n'
        }
        if (this.hijos[1] != undefined) {
            let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, bcr);
            retorno.c3d += retorno2.c3d;
            if (retorno2.break != '') {
                retorno.break = retorno2.break;
            }
        }
        retorno.c3d += 'goto ' + l2 + ';\n'
        retorno.c3d += l1 + ':\n'

        retorno.l = l2;

        return retorno;
    }

    /*
        *
        *   -------------------------------------------      end switch
        *
    */

    sentenciaDoWhile = function sentenciaDoWhile(idAmbito, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');

        idAmbito = contadorA++
        let retorno1 = this.hijos[1].obtenerExp(idAmbito);

        let nuevoBCR = new BCR();
        nuevoBCR.return = bcr.return;
        nuevoBCR.break = 'L' + (contadorL++)
        nuevoBCR.continue = 'L' + (contadorL++)

        let l1 = nuevoBCR.break
        let l2 = ('L' + contadorL++)

        let retorno2 = this.hijos[0].compilarSentenciaControl(idAmbito, nuevoBCR);

        retorno.c3d += l2 + ':\n';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += nuevoBCR.continue + ':\n';

        retorno.c3d += retorno1.c3d;
        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + l1 + ';\n';
        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += l1 + ':\n';

        return retorno
    }

    sentenciaWhile = function sentenciaWhile(idAmbito, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');

        let nuevoBCR = new BCR();
        nuevoBCR.return = bcr.return;
        nuevoBCR.break = 'L' + (contadorL++)
        nuevoBCR.continue = 'L' + (contadorL++)

        idAmbito = contadorA++
        let retorno1 = this.hijos[0].obtenerExp(idAmbito);

        let l1 = nuevoBCR.break
        let l2 = nuevoBCR.continue

        let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, nuevoBCR);
        let tipo = 'error'

        retorno.c3d += l2 + ':\n';
        retorno.c3d += retorno1.c3d;

        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + l1 + ';\n';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += l1 + ':\n';

        return retorno
    }

    /*
        *
        *   -------------------------------------------      if
        *
    */

    sentenciaIf = function sentenciaIf(idAmbito, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        let l = 'L' + (contadorL++);
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'ifs':
                    valor = this.hijos[i].sentenciaIfs(idAmbito, l, bcr);
                    c3d += valor.c3d;
                    break;
                case 'else':
                    idAmbito = contadorA++
                    valor = this.hijos[i].hijos[0].compilarSentenciaControl(idAmbito, bcr);
                    c3d += valor.c3d;
                    break;
            }
        }

        c3d += l + ':\n';
        retorno.c3d += c3d;
        return retorno;
    }

    sentenciaIfs = function sentenciaIfs(idAmbito, l, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'if':
                    valor = this.hijos[i].if3d(idAmbito, l, bcr);
                    c3d += valor.c3d;
                    break;
                case 'lista else if':
                    valor = this.hijos[i].ifElse(idAmbito, l, bcr);
                    c3d += valor.c3d;
                    break;
            }
        }

        retorno.c3d += c3d;
        return retorno;
    }

    ifElse = function ifElse(idAmbito, l, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');
        let valor = new retornoAST('', 0, '', '', '');
        for (let i = 0; i < this.hijos.length; i++) {
            valor = this.hijos[i].if3d(idAmbito, l, bcr);
            retorno.c3d += valor.c3d;
        }

        return retorno;
    }

    if3d = function if3d(idAmbito, l, bcr) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(idAmbito);

        idAmbito = contadorA++
        let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, bcr);


        retorno.c3d += retorno1.c3d;
        retorno.c3d += 'if(' + retorno1.t + '==0) goto L' + (contadorL) + ';\n';
        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l + ';\n';

        retorno.c3d += 'L' + (contadorL) + ':\n';

        retorno.l = 'L' + (contadorL++) + '\n';

        return retorno
    }

    /*
        *
        *   -------------------------------------------      end if
        *
    */



    llenarStack = function llenarStack(tamano) {
        let cadena = ''

        cadena += 't' + (contadorT) + '=P;\n'
        cadena += 'L' + (contadorL++) + ':\n'
        cadena += 'if(t' + (contadorT) + '>=' + tamano + ') goto L' + (contadorL++) + ';\n'
        cadena += 'Stack[t' + (contadorT) + ']=0;\n'
        cadena += 't' + (contadorT) + '=' + 't' + (contadorT++) + '+1;\n'
        cadena += 'goto L' + (contadorL - 2) + ';\n'
        cadena += 'L' + (contadorL - 1) + ':\n'

        return cadena;
    }


    declaracionFuncion = function declaracionFuncion() {
        let idAmbito = contadorA++
        let retorno = new retornoAST('', 0, '', '', '');
        let valor

        let bcr = new BCR();

        bcr.return = 'L' + (contadorL++);

        if (this.hijos.length == 3) {
            valor = tablaS.obtenerFuncion(this.hijos[1].identificador, idAmbito);

            let cadena = this.llenarStack(valor.tamano);
            if (valor == 'error') {
                return retorno;
            }
            funcionPrincipal = valor;
            retorno = this.hijos[2].compilarSentenciaControl(idAmbito, bcr)

            retorno.c3d = 'proc ' + this.hijos[1].identificador + ' begin\n' +
                retorno.c3d;

        }
        else {
            let parametros = this.hijos[2].compilarParametros(idAmbito)
            valor = tablaS.obtenerFuncion(this.hijos[1].identificador + parametros, idAmbito);

            if (valor == 'error') {
                return retorno;
            }

            let cadena = this.llenarStack(valor.tamano);
            retorno = this.hijos[3].compilarSentenciaControl(idAmbito, bcr)

            retorno.c3d = 'proc ' + this.hijos[1].identificador + parametros + ' begin\n' +
                retorno.c3d;
        }
        retorno.c3d += bcr.return + ':\n';
        retorno.c3d += 'end\n';

        return retorno
    }

    compilarParametros = function compilarParametros(idAmbito) {
        let parametros = '';
        for (let i = 0; i < this.hijos.length; i++) {
            parametros += '_' + this.hijos[i].hijos[0].identificador
        }

        return parametros;
    }

    obtenerExp = function obtenerExp(idAmbito) {
        switch (this.identificador) {
            case '+':
                return this.suma(idAmbito);
            case '-':
                return this.resta(idAmbito);
            case '*':
                return this.multiplicacion(idAmbito);
            case '/':
                return this.divicion(idAmbito);
            case '%':
                return this.modulo(idAmbito);
            case '^^':
                return this.potencia(idAmbito);

            case '==':
                return this.igualDiferente(idAmbito);
            case '<>':
                return this.igualDiferente(idAmbito);
            case '===':
                return this.igualReferencia(idAmbito);
            case '<=':
                return this.relacional(idAmbito);
            case '>=':
                return this.relacional(idAmbito);
            case '<':
                return this.relacional(idAmbito);
            case '>':
                return this.relacional(idAmbito);

            case '&&':
                return this.logico(idAmbito);
            case '||':
                return this.logico(idAmbito);
            case '^':
                return this.logico(idAmbito);
            case '!':
                return this.logicoNeg(idAmbito);

            case '++':
                return this.logico(idAmbito);
            case '--':
                return this.logicoNeg(idAmbito);

            case 'integer':
                return this.casteoExplicito(idAmbito);
            case 'char':
                return this.casteoExplicito(idAmbito);

            case 'literal':
                return this.obtenerLiteral(idAmbito);
            default:
        }
    }

    casteoExplicito = function casteoExplicito(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);

        retorno.t = 't' + contadorT++;
        retorno.c3d += resultado1.c3d;

        retorno.c3d += 't' + (contadorT) + '=' + resultado1.t + '%1;\n';
        retorno.c3d += retorno.t + '=' + resultado1.t + '-t' + (contadorT++) + ';\n';

        return retorno;
    }

    logicoNeg = function logicoNeg(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoLogico(resultado1.tipo, 'boolean');
        let retorno;
        if (tipo == 'error') {
            retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        retorno = this.not3d(resultado1);
        retorno.tipo = tipo;

        return retorno;
    }

    logico = function logico(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoLogico(resultado1.tipo, resultado2.tipo);
        let retorno;
        if (tipo == 'error') {
            retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        if (this.identificador == '&&') {
            retorno = this.and3d(resultado1, resultado2);
        }
        else if (this.identificador == '||') {
            retorno = this.or3d(resultado1, resultado2);
        }
        else if (this.identificador == '^') {
            retorno = this.xor3d(resultado1, resultado2);
        }

        retorno.tipo = tipo;

        return retorno;
    }

    xor3d = function xor3d(t1, t2) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t1.c3d + t2.c3d;

        retorno.c3d += 't' + contadorT + '=0;\n';

        retorno.c3d += "if(" + t1.t + "==0) goto L" + (contadorL++) + ";\n";
        retorno.c3d += "if(" + t2.t + "==1) goto L" + (contadorL++) + ";\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 3) + ":\n";
        retorno.c3d += "if(" + t2.t + "==1) goto L" + (contadorL - 1) + ";\n";

        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += "t" + (contadorT++) + "=1;\n"
        retorno.c3d += "L" + (contadorL - 1) + ":\n";

        retorno.t = 't' + (contadorT - 1);
        retorno.l = 'L' + 0;

        return retorno;
    }

    or3d = function or3d(t1, t2) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t1.c3d + t2.c3d;

        retorno.c3d += "if(" + t1.t + "<>0) goto L" + (contadorL++) + ";\n";
        retorno.c3d += "if(0<>" + t2.t + ") goto L" + (contadorL++) + ";\n";

        retorno.c3d += "t" + (contadorT) + "=0;\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += "L" + (contadorL - 3) + ":\n";
        retorno.c3d += "t" + (contadorT++) + "=1;\n"
        retorno.c3d += "goto L" + (contadorL++) + ";\n";


        retorno.c3d += "L" + (contadorL - 1) + ":\n"
        retorno.c3d += "L" + (contadorL - 2) + ":\n";

        retorno.t = 't' + (contadorT - 1);
        retorno.l = 'L' + 0;

        return retorno;
    }

    not3d = function not3d(t1) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t1.c3d;

        retorno.c3d += "if(" + t1.t + "==0) goto L" + (contadorL++) + ";\n";

        retorno.c3d += t1.t + "=0;\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";
        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += t1.t + "=1;\n";
        retorno.c3d += "L" + (contadorL - 1) + ":\n";

        retorno.t = t1.t;
        retorno.l = 'L' + 0;

        return retorno;
    }

    and3d = function and3d(t1, t2) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.c3d += t1.c3d + t2.c3d;
        retorno.c3d += "if(" + t1.t + "<>0) goto L" + (contadorL++) + ";\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += "if(0<>" + t2.t + ") goto L" + (contadorL++) + ";\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += "t" + (contadorT) + "=1;\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 4) + ":\n"
        retorno.c3d += "L" + (contadorL - 2) + ":\n";
        retorno.c3d += "t" + (contadorT++) + "=0;\n";
        retorno.c3d += "goto L" + (contadorL++) + ";\n";

        retorno.c3d += "L" + (contadorL - 1) + ':\n';
        retorno.c3d += "L" + (contadorL - 2) + ":\n";

        retorno.t = 't' + (contadorT - 1);
        retorno.l = 'l' + 0;

        return retorno;
    }

    obtenerTipoLogico = function obtenerTipoLogico(tipo1, tipo2) {
        let tipoRetorno = 'error';
        if (tipo1 != 'boolean') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser te dipo boolean.'
            });
            return 'error'
        }
        if (tipo2 != 'boolean') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser te dipo boolean.'
            });
            return 'error'
        }

        return 'boolean';
    }

    relacional = function relacional(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoRelacional(resultado1.tipo, resultado2.tipo);
        let retorno;
        if (tipo == 'error') {
            retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        if (this.identificador == '<') {
            retorno = this.igualDiferente3d(resultado1, resultado2, '>=');
        }
        else if (this.identificador == '>') {
            retorno = this.igualDiferente3d(resultado1, resultado2, '<=');
        }
        else if (this.identificador == '<=') {
            retorno = this.igualDiferente3d(resultado1, resultado2, '>');
        }
        else if (this.identificador == '>=') {
            retorno = this.igualDiferente3d(resultado1, resultado2, '>');
        }

        retorno.tipo = tipo;

        return retorno;
    }

    obtenerTipoRelacional = function obtenerTipoRelacional(tipo1, tipo2) {
        let tipoRetorno = 'error';
        if (tipo1 != 'integer' && tipo1 != 'double' && tipo1 != 'char') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser te dipo integer, double o char.'
            });
            return 'error'
        }
        if (tipo2 != 'integer' && tipo2 != 'double' && tipo2 != 'char') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser te dipo integer, double o char.'
            });
            return 'error'
        }

        if ((tipo1 == 'integer' || tipo1 == 'double' || tipo1 == 'char') &&
            (tipo2 == 'integer' || tipo2 == 'double' || tipo2 == 'char')) {
            tipoRetorno = 'boolean';
        }

        return tipoRetorno;
    }

    potencia = function potencia(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoModuloPotencia(resultado1.tipo, resultado2.tipo);

        if (tipo == 'error') {
            let retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        let retorno = this.potencia3d(resultado1, resultado2)
        retorno.tipo = tipo;


        return retorno;
    }

    igualDiferente = function igualDiferente(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoIgualDesigual(resultado1.tipo, resultado2.tipo);
        let retorno = new retornoAST('', 0, '', '', '');

        if (tipo == 'error') {
            retorno.error = 1;
            return retorno;
        }

        if (this.identificador == '==') {
            if (resultado1.tipo == 'string' && resultado2.tipo == 'string') {
                retorno = this.CompararStrings(resultado1, resultado2)
            } else {
                retorno = this.igualDiferente3d(resultado1, resultado2, '<>');
            }
        }
        else {
            if (resultado1.tipo == 'string' && resultado2.tipo == 'string') {
                retorno = this.CompararStrings(resultado1, resultado2)
                retorno.c3d += "if(" + retorno.t + "==0) goto L" + (contadorL++) + ";\n";
                retorno.c3d += retorno.t + "=0;\n";
                retorno.c3d += "goto L" + (contadorL++) + ";\n";
                retorno.c3d += "L" + (contadorL - 2) + ":\n";
                retorno.c3d += retorno.t + "=1;\n";
                retorno.c3d += "L" + (contadorL - 1) + ":\n";
            } else {
                retorno = this.igualDiferente3d(resultado1, resultado2, '==');
            }
        }

        retorno.tipo = tipo;

        return retorno;
    }

    igualReferencia = function igualReferencia(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoIgual(resultado1.tipo, resultado2.tipo);
        let retorno
        if (tipo == 'error') {
            retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        retorno = this.igualDiferente3d(resultado1, resultado2, '<>')
        retorno.tipo = tipo;

        return retorno;
    }

    igualDiferente3d = function igualDiferente3d(t1, t2, operador) {
        let retorno = {
            c3d: '',
            error: 0,
            t: '',
            l: '',
            tipo: ''
        }
        let c3d = t1.c3d + t2.c3d +
            't' + contadorT + ' = 0;\n' +
            'if(' + t1.t + operador + t2.t + ') goto L' + contadorL + ';\n' +
            't' + contadorT + ' = 1;\n' +
            'L' + (contadorL++) + ':\n';

        retorno.c3d = c3d;
        retorno.t = 't' + (contadorT++);
        retorno.l = 'L' + 0;

        return retorno;
    }

    obtenerTipoIgualDesigual = function obtenerTipoIgualDesigual(tipo1, tipo2) {
        let tipoRetorno = 'error';

        if (tipo1 != 'integer' && tipo1 != 'double' && tipo1 != 'char' &&
            tipo1 != 'boolean' && tipo1 != 'string') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor no puede ser un arreglo.'
            });
            return 'error'
        }
        if (tipo2 != 'integer' && tipo2 != 'double' && tipo2 != 'char' &&
            tipo2 != 'boolean' && tipo2 != 'string') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor no puede ser un arreglo.'
            });
            return 'error'
        }

        if (((tipo1 == 'integer' || tipo1 == 'double' || tipo1 == 'char') &&
            (tipo2 == 'integer' || tipo2 == 'double' || tipo2 == 'char')) ||
            (tipo1 == 'string' && tipo2 == 'string') || (tipo1 == 'boolean' &&
                tipo2 == 'boolean')) {
            tipoRetorno = 'boolean'
        }

        return tipoRetorno;
    }

    obtenerTipoIgual = function obtenerTipoIgual(tipo1, tipo2) {
        let tipoRetorno = 'error';
        if (tipo1 != 'string' && tipo1 != 'arreglo') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor no puede ser un arreglo.'
            });
            return 'error'
        }
        if (tipo2 != 'string' && tipo2 != 'arreglo') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor no puede ser un arreglo.'
            });
            return 'error'
        }

        if ((tipo1 == 'string' && tipo2 == 'string') ||
            (tipo1 == 'arreglo' && tipo1 == 'arreglo')) {
            tipoRetorno = 'boolean';
        }

        return tipoRetorno;
    }

    potencia3d = function potencia3d(t1, t2) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t1.c3d + t2.c3d;

        retorno.c3d += 't' + (contadorT++) + '=1;\n';
        retorno.c3d += 't' + (contadorT++) + '=' + t2.t + ';\n';
        retorno.c3d += 't' + (contadorT++) + '=' + t1.t + ';\n';
        retorno.c3d += 't' + (contadorT++) + '=' + t1.t + ';\n';


        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 'if(t' + (contadorT - 4) + '<t' + (contadorT - 3) + ') goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'L' + (contadorL - 2) + ':\n';
        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '*t' + (contadorT - 1) + ';\n';
        retorno.c3d += 't' + (contadorT - 4) + '=1+t' + (contadorT - 4) + ';\n';
        retorno.c3d += 'goto L' + (contadorL - 3) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.t = 't' + (contadorT - 2);

        return retorno;
    }

    modulo = function modulo(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoModuloPotencia(resultado1.tipo, resultado2.tipo);

        if (tipo == 'error') {
            let retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        let retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '%')
        retorno.tipo = tipo;

        return retorno;
    }

    obtenerTipoModuloPotencia = function obtenerTipoModuloPotencia(tipo1, tipo2) {
        if (tipo1 != 'integer') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser de tipo integer.'
            });
            return 'error'
        }
        if (tipo2 != 'integer') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser de tipo integer.'
            });
            return 'error'
        }


        return 'integer';
    }

    /*
        *
        * -------------------------------- valores de la hojas
        * 
    */

    obtenerLiteral = function obtenerLiteral(idAmbito) {
        switch (this.hijos[0].identificador) {
            case 'entero':
                return this.hijos[0].obtenerEntero();
            case 'decimal':
                return this.hijos[0].obtenerDecimal();
            case 'caracter':
                return this.hijos[0].obtenerChar();
            case 'boleano':
                return this.hijos[0].obtenerBoleano();
            case 'cadena':
                return this.hijos[0].obtenerString();
            case 'identificacdor':
                return this.hijos[0].obtenerValorIdentificador(idAmbito);
            case 'incremento':
                return this.hijos[0].compilarIncremento(idAmbito);
            case 'decremento':
                return this.hijos[0].compilarDecremento(idAmbito);
            case 'llamadaFuncion':
                return this.hijos[0].compilarLlamadaAFuncion(idAmbito);
            case 'acceso a arreglo':
                return this.hijos[0].compilarAccesoArreglo(idAmbito);
            case 'funcion propia':
                return this.hijos[0].compilarFuncionPropia(idAmbito);
            case 'funcion length':
                return this.hijos[0].compilarFuncionArreglo(idAmbito);
            default:
        }
    }

    compilarFuncionArreglo = function compilarFuncionArreglo(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');
            let retorno1 = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
            }
            else {
                let tamano = tablaS.obtenerTamanoFuncion(this.hijos[0].identificador, idAmbito);
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);
            }

            let resultado = new retornoAST('', 0, '', '', '');
            if (this.hijos[1].identificador.toLowerCase() == 'length') {
                resultado.t  = 't'+(contadorT++);

                resultado.c3d +=resultado.t+'=Heap['+retorno.t+'];\n'; 
                
                retorno1.tipo = 'integer'
            }else{
                let err = new Error('El atrubuto ' + this.hijos[1].identificador+
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

                error.push(err)
            }

            retorno1.c3d += retorno.c3d
            retorno1.c3d += resultado.c3d
            retorno1.t = resultado.t

            return retorno1
        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }
    }

    compilarAccesoArreglo = function compilarAccesoArreglo(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');
            let retorno1 = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
            }
            else {
                let tamano = tablaS.obtenerTamanoFuncion(this.hijos[0].identificador, idAmbito);
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);
            }

            retorno1.tipo = valor.tipo
            retorno1.tamano = valor.tamanoR;

            let resultado = this.hijos[1].obtenerExp(idAmbito);
            let resultado2 = this.obtenerPoscionArreglo(retorno.t, resultado.t)

            retorno1.c3d += retorno.c3d
            retorno1.c3d += resultado.c3d
            retorno1.c3d += resultado2.c3d
            retorno1.t = resultado2.t

            return retorno1
        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }
    }

    compilarFuncionPropia = function compilarFuncionPropia(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');
            let retorno1 = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
            }
            else {
                let tamano = tablaS.obtenerTamanoFuncion(this.hijos[0].identificador, idAmbito);
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);
            }


            let resultado
            if (this.hijos[1].identificador.toLowerCase() == 'length') {
                resultado = this.funcionLength(retorno.t)
                retorno1.tipo = 'integer'
            }
            if (this.hijos[1].identificador.toLowerCase() == 'tochararray') {
                resultado = this.funciontoCharArray(retorno.t)
                retorno1.tipo = 'char'
                retorno1.arreglo = 1;
            }
            if (this.hijos[1].identificador.toLowerCase() == 'charat') {
                let exp = this.hijos[2].obtenerExp(idAmbito)
                retorno1.c3d = exp.c3d;
                resultado = this.funciontoCharAt(retorno.t, exp.t)
                retorno1.tipo = 'char'
            }
            if (this.hijos[1].identificador.toLowerCase() == 'tolowercase') {
                resultado = this.funcionTolower(retorno.t)
                retorno1.tipo = 'string'
            }
            if (this.hijos[1].identificador.toLowerCase() == 'touppercase') {
                resultado = this.funcionToUpper(retorno.t)
                retorno1.tipo = 'string'
            }

            retorno1.c3d += retorno.c3d
            retorno1.c3d += resultado.c3d
            retorno1.t = resultado.t

            return retorno1
        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }
    }

    funcionToUpper = function funcionToUpper(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.c3d += 't' + (contadorT++) + '=' + (t) + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 'if(t' + (contadorT - 1) + '<97) goto L' + (contadorL) + ';\n';
        retorno.c3d += 'if(t' + (contadorT - 1) + '>122) goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+-32;\n'

        retorno.c3d += 'Heap[t' + (contadorT - 2) + ']=t' + (contadorT - 1) + ';\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno.c3d += 'goto L' + (contadorL - 3) + ';\n';

        retorno.c3d += 'L' + (contadorL - 2) + ':\n';

        retorno.t = t;

        return retorno;

    }

    funcionTolower = function funcionTolower(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.c3d += 't' + (contadorT++) + '=' + (t) + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 'if(t' + (contadorT - 1) + '<65) goto L' + (contadorL) + ';\n';
        retorno.c3d += 'if(t' + (contadorT - 1) + '>90) goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+32;\n'

        retorno.c3d += 'Heap[t' + (contadorT - 2) + ']=t' + (contadorT - 1) + ';\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno.c3d += 'goto L' + (contadorL - 3) + ';\n';

        retorno.c3d += 'L' + (contadorL - 2) + ':\n';

        retorno.t = t;

        return retorno;

    }

    funciontoCharAt = function funciontoCharAt(t, exp) {
        let retorno = new retornoAST('', 0, '', '', '');

        let tamano = this.funcionLength(t)

        retorno.c3d += tamano.c3d;

        retorno.t = 't' + (contadorT++)

        retorno.c3d += 'if(' + tamano.t + '<' + exp + ') goto L' + (contadorL++) + ';\n'

        retorno.c3d += 't' + (contadorT) + '=' + t + '+' + exp + ';\n'

        retorno.c3d += retorno.t + '=' + 'Heap[t' + (contadorT++) + '];\n'

        retorno.c3d += 'goto L' + (contadorL++) + ';\n'
        retorno.c3d += 'L' + (contadorL - 2) + ':\n'
        retorno.c3d += retorno.t + '=0;\n'
        retorno.c3d += 'L' + (contadorL - 1) + ':\n'
        return retorno
    }

    funcionLength = function funcionLength(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.c3d = 't' + (contadorT++) + '=' + (t) + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '-' + t + ';\n';
        retorno.t = 't' + (contadorT - 2);
        return retorno;
    }

    funciontoCharArray = function funciontoCharArray(t) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.t = 't' + (contadorT++)
        let tamano = this.funcionLength(t);
        retorno.c3d += tamano.c3d

        retorno.c3d += retorno.t + '=H;\n'

        retorno.c3d += 'Heap[H]=' + tamano.t + ';\n'

        retorno.c3d += 'H=H+1;\n'

        retorno.c3d += 't' + (contadorT++) + '=' + (t) + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 'Heap[H]=t' + (contadorT - 1) + ';\n'

        retorno.c3d += 'H=H+1;\n'

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';
        return retorno;
    }

    obtenerPoscionArreglo = function obtenerPoscionArreglo(arreglo, posicion) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.t = 't' + (contadorT++)

        retorno.c3d += 't' + (contadorT++) + '=' + 'Heap[' + arreglo + '];\n'

        retorno.c3d += 't' + (contadorT++) + '=' + arreglo + '+1;\n'

        retorno.c3d += 'if(' + posicion + '>t' + (contadorT - 2) + ') goto L' + (contadorL++) + ';\n'

        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+' + posicion + ';\n'

        retorno.c3d += retorno.t + '=' + 'Heap[t' + (contadorT - 1) + '];\n'

        retorno.c3d += 'goto L' + (contadorL++) + ';\n'
        retorno.c3d += 'L' + (contadorL - 2) + ':\n'
        retorno.c3d += retorno.t + '=0;\n'
        retorno.c3d += 'L' + (contadorL - 1) + ':\n'
        return retorno
    }

    obtenerValorIdentificador = function obtenerValorIdentificador(idAmbito) {
        let valor = tablaS.obtenerSimbolo(this.hijos[0].identificador, idAmbito);

        if (valor != 'error') {
            let retorno = new retornoAST('', 0, '', '', '');


            if (valor.tipoSH == 'heap') {
                retorno.t = 't' + (contadorT);
                retorno.c3d += 't' + (contadorT++) + '=Heap[' + valor.posicionH + '];\n';
            }
            else {
                let tamano = tablaS.obtenerTamanoFuncion(this.hijos[0].identificador, idAmbito);
                retorno.c3d += 't' + (contadorT++) + '=P-' + valor.posicionS + ';\n';
                retorno.c3d += 't' + (contadorT++) + '=Stack[t' + (contadorT - 2) + '];\n';
                retorno.t = 't' + (contadorT - 1);
            }

            retorno.tipo = valor.tipo
            retorno.arreglo = valor.arreglo
            retorno.tamano = valor.tamanoR;
            return retorno
        }
        else {
            let err = new Error('La variable ' + this.hijos[0].identificador +
                ' no existe', this.hijos[0].linea, this.hijos[0].columna);

            error.push(err)
        }
    }

    obtenerEntero = function obtenerEntero() {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseInt(this.hijos[0].identificador, 10),
            l: '',
            tipo: 'integer'
        }

        return retorno;
    }

    obtenerBoleano = function obtenerBoleano() {
        let retorno = {
            c3d: '',
            error: 0,
            t: this.hijos[0].identificador == 'true' ? 1 : 0,
            l: '',
            tipo: 'boolean'
        }

        return retorno;
    }

    obtenerDecimal = function obtenerDecimal() {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseFloat(this.hijos[0].identificador, 10),
            l: '',
            tipo: 'double'
        }

        return retorno;
    }

    obtenerChar = function obtenerChar() {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseInt(this.hijos[0].identificador.charCodeAt(0), 10),
            l: '',
            tipo: 'char'
        }

        return retorno;
    }

    obtenerString = function obtenerString() {
        let retorno = this.generarString3d(this.hijos[0].identificador);

        retorno.tipo = 'string'

        return retorno;
    }


    /*
        *
        * -------------------------------- end
        * 
    */

    suma = function suma(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoSuma(resultado1.tipo, resultado2.tipo);

        if (tipo == 'error') {
            let retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        let retorno;

        if (tipo == 'string') {
            retorno = this.ConcatenarString(resultado1.tipo, resultado2.tipo, resultado1, resultado2)
        }
        else {
            retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '+')
        }

        retorno.tipo = tipo;

        return retorno;
    }

    divicion = function divicion(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoDivicion(resultado1.tipo, resultado2.tipo);

        if (tipo == 'error') {
            let retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        let retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '/')
        retorno.tipo = tipo;

        return retorno;
    }

    multiplicacion = function multiplicacion(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);
        let resultado2 = this.hijos[1].obtenerExp(idAmbito);
        let tipo = this.obtenerTipoRestaMultiplicacion(resultado1.tipo, resultado2.tipo);

        if (tipo == 'error') {
            let retorno = {
                c3d: '',
                error: 1,
                t: '',
                l: '',
                tipo: ''
            }
            return retorno;
        }

        let retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '*')
        retorno.tipo = tipo;

        return retorno;
    }

    resta = function resta(idAmbito) {
        let resultado1 = this.hijos[0].obtenerExp(idAmbito);

        let tipo;
        let retorno;
        if (this.hijos.length == 1) {
            tipo = this.obtenerTipoRestaMultiplicacion(resultado1.tipo);
            if (tipo == 'error') {
                let retorno = {
                    c3d: '',
                    error: 1,
                    t: '',
                    l: '',
                    tipo: ''
                }
                return retorno;
            }
            let c3d = 't' + contadorT + '=0-' +
                resultado1.t + ';\n';

            retorno = {
                c3d: '',
                error: 0,
                t: '',
                l: '',
                tipo: ''
            }
            retorno.c3d = resultado1.c3d + c3d;
            retorno.t = 't' + (contadorT++);
            retorno.l = 'L' + 0;
            retorno.tipo = tipo;
        }
        else {
            let resultado2 = this.hijos[1].obtenerExp(idAmbito);
            tipo = this.obtenerTipoRestaMultiplicacion(resultado1.tipo, resultado2.tipo);
            if (tipo == 'error') {
                let retorno = {
                    c3d: '',
                    error: 1,
                    t: '',
                    l: '',
                    tipo: ''
                }
                return retorno;
            }
            retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '-');
            retorno.tipo = tipo;
        }
        return retorno;
    }

    obtenerCodigoOperadoresAritmeticos = function obtenerCodigoOperadoresAritmeticos(t1, t2, operador) {
        let retorno = {
            c3d: '',
            error: 0,
            t: '',
            l: '',
            tipo: ''
        }
        let c3d = t1.c3d + t2.c3d +
            't' + contadorT + '=' +
            t1.t + operador + t2.t + ';\n';

        retorno.c3d = c3d;
        retorno.t = 't' + (contadorT++);
        retorno.l = 'L' + 0;

        return retorno;
    }

    obtenerTipoRestaMultiplicacion = function obtenerTipoRestaMultiplicacion(tipo1, tipo2) {
        let tipoRetorno = '';

        if (tipo1 != 'integer' && tipo1 != 'double' && tipo1 != 'char') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser de tipo numerico.'
            });
            return 'error'
        }
        if (tipo2 != undefined) {
            if (tipo2 != 'integer' && tipo2 != 'double' && tipo2 != 'char') {
                error.push({
                    linea: this.linea,
                    columna: this.columna,
                    error: 'El valor debe de ser de tipo numerico.'
                });
                return 'error'
            }
        }

        if (tipo2 == undefined) {
            if (tipo1 = 'char') {
                tipoRetorno = 'integer'
            }
            else {
                tipoRetorno = tipo1;
            }
        }
        else if ((tipo1 == 'integer' || tipo1 == 'char') &&
            tipo2 == 'integer') {
            tipoRetorno = 'integer'
        }
        else if ((tipo2 == 'integer' || tipo2 == 'char') &&
            tipo1 == 'integer') {
            tipoRetorno = 'integer'
        }


        else if (tipo1 == 'double' && (tipo2 == 'double' ||
            tipo2 == 'integer' || tipo2 == 'char')) {
            tipoRetorno = 'double'
        }
        else if (tipo2 == 'double' && (tipo1 == 'double' ||
            tipo1 == 'integer' || tipo1 == 'char')) {
            tipoRetorno = 'double'
        }

        else if (tipo1 == 'char' && tipo2 == 'char') {
            tipoRetorno = 'integer'
        }
        return tipoRetorno;
    }

    obtenerTipoDivicion = function obtenerTipoDivicion(tipo1, tipo2) {
        let tipoRetorno = '';

        if (tipo1 != 'integer' && tipo1 != 'double' && tipo1 != 'char') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser de tipo numerico.'
            });
            return 'error'
        }
        if (tipo2 != undefined) {
            if (tipo2 != 'integer' && tipo2 != 'double' && tipo2 != 'char') {
                error.push({
                    linea: this.linea,
                    columna: this.columna,
                    error: 'El valor debe de ser de tipo numerico.'
                });
                return 'error'
            }
        }

        return 'double';
    }

    obtenerTipoSuma = function obtenerTipoSuma(tipo1, tipo2) {
        let tipoRetorno = '';

        if (tipo1 == 'array') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor no puede ser un arreglo.'
            });
            return 'error'
        }
        if (tipo2 != undefined) {
            if (tipo2 == 'array') {
                error.push({
                    linea: this.linea,
                    columna: this.columna,
                    error: 'El valor no puede ser un arreglo.'
                });
                return 'error'
            }
        }

        if (tipo2 == undefined) {
            tipoRetorno = tipo1;
        }
        else if ((tipo1 == 'integer' || tipo1 == 'char') &&
            tipo2 == 'integer') {
            tipoRetorno = 'integer'
        }
        else if ((tipo2 == 'integer' || tipo2 == 'char') &&
            tipo1 == 'integer') {
            tipoRetorno = 'integer'
        }


        else if (tipo1 == 'double' && (tipo2 == 'double' ||
            tipo2 == 'integer' || tipo2 == 'char')) {
            tipoRetorno = 'double'
        }
        else if (tipo2 == 'double' && (tipo1 == 'double' ||
            tipo1 == 'integer' || tipo1 == 'char')) {
            tipoRetorno = 'double'
        }

        else if (tipo1 == 'char' && tipo2 == 'char') {
            tipoRetorno = 'string'
        }
        else if (tipo1 == 'string') {
            tipoRetorno = 'string'
        }
        else if (tipo2 == 'string') {
            tipoRetorno = 'string'
        }

        return tipoRetorno;
    }

    print = function print(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let ambitoRetorno = this.hijos[0].hijos[0].obtenerExp(idAmbito);
        let tipo = 'error'
        let c3d = '';
        switch (ambitoRetorno.tipo) {
            case 'integer':
                tipo = '\"%i\"'
                break;
            case 'double':
                tipo = '\"%d\"'
                break;
            case 'char':
            case 'string':
            case 'boolean':
                tipo = '\"%c\"'
                break;
        }


        c3d += ambitoRetorno.c3d;
        if (ambitoRetorno.arreglo == 1) {
            if (ambitoRetorno.tipo == 'string') {
                c3d += this.printArregloString(ambitoRetorno.t);
            } else {
                c3d += this.printArreglo(ambitoRetorno.t, tipo, ambitoRetorno.tamano);
            }
        }
        else if (ambitoRetorno.tipo == 'boolean') {
            c3d += this.imprimirTrueFalse(ambitoRetorno.t);
        }

        else if (ambitoRetorno.tipo == 'string') {
            c3d += this.printString(ambitoRetorno.t);
        }
        else {
            c3d += 'print(' + tipo +
                ',' + ambitoRetorno.t + ');\n';
        }

        retorno.c3d = c3d;

        retorno.c3d += 'print("%c",10);\n';

        return retorno;
    }

    printArregloString = function printArregloString(t, tipo) {
        let retorno = '';

        let l = (contadorL++);
        retorno += 'if(' + t + '==0) goto L' + l + ';\n'

        retorno += 't' + (contadorT) + '=Heap[' + t + '];\n';
        retorno += 't' + (contadorT) + '=t' + (contadorT) + '+' + t + ';\n';
        let t1 = (contadorT++)
        retorno += 't' + (contadorT) + '=' + t + '+1;\n';
        let t2 = (contadorT++)
        retorno += 't' + (contadorT) + '=Heap[t' + (contadorT - 1) + '];\n';
        let t3 = (contadorT++)
        retorno += 't' + (contadorT) + '=t' + (contadorT - 2) + ';\n';
        let t4 = (contadorT++)
        retorno += this.printString('t' + (contadorT - 2));

        retorno += 't' + t4 + '=t' + t4 + '+1;\n';

        let l2 = (contadorL)
        retorno += 'L' + (contadorL++) + ':\n';

        let l3 = (contadorL)
        retorno += 'if(t' + t4 + '>t' + t1 + ') goto L' + (contadorL++) + ';\n';

        retorno += 't' + (contadorT) + '=Heap[t' + t4 + '];\n';
        retorno += 'print("%c",44);\n';
        retorno += this.printString('t' + (contadorT++));

        retorno += 't' + t4 + '=t' + t4 + '+1;\n';
        retorno += 'goto L' + l2 + ';\n';

        retorno += 'L' + l + ':\n';
        retorno += 'print("%c",110);\n'
        retorno += 'print("%c",117);\n'
        retorno += 'print("%c",108);\n'
        retorno += 'print("%c",108);\n'


        retorno += 'L' + l3 + ':\n';
        return retorno;
    }

    printArreglo = function printArreglo(t, tipo) {
        let retorno = '';

        retorno += 'if(' + t + '==0) goto L' + (contadorL++) + ';\n'

        retorno += 't' + (contadorT) + '=Heap[' + t + '];\n';
        retorno += 't' + (contadorT) + '=t' + (contadorT++) + '+' + t + ';\n';

        retorno += 't' + (contadorT++) + '=' + t + '+1;\n';

        retorno += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno += 't' + (contadorT++) + '=t' + (contadorT - 3) + ';\n';

        retorno += 'print(' + tipo + ',t' + (contadorT - 2) + ');\n'

        retorno += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '+1;\n';

        retorno += 'L' + (contadorL++) + ':\n';

        retorno += 'if(t' + (contadorT - 1) + '>t' + (contadorT - 4) + ') goto L' + (contadorL++) + ';\n';

        retorno += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';
        retorno += 'print("%c",44);\n';
        retorno += 'print(' + tipo + ',t' + (contadorT - 1) + ');\n'


        retorno += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno += 'goto L' + (contadorL - 2) + ';\n';

        retorno += 'L' + (contadorL - 3) + ':\n';
        retorno += 'print("%c",110);\n'
        retorno += 'print("%c",117);\n'
        retorno += 'print("%c",108);\n'
        retorno += 'print("%c",108);\n'


        retorno += 'L' + (contadorL - 1) + ':\n';
        return retorno;
    }

    printString = function printString(t) {
        let retorno;
        retorno = 't' + (contadorT++) + '=' + (t) + ';\n';

        retorno += 'L' + (contadorL++) + ':\n';
        retorno += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno += 'print(\"%c\",t' + (contadorT - 1) + ');\n';

        retorno += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';
        retorno += 'goto L' + (contadorL - 2) + ';\n';

        retorno += 'L' + (contadorL - 1) + ':\n';

        return retorno;
    }

    imprimirTrueFalse = function imprimirTrueFalse(t) {
        let c3d = 'if(' + t + '==0) goto L' + (contadorL++) + ';\n' +
            'print("%c",116);\n' +
            'print("%c",114);\n' +
            'print("%c",117);\n' +
            'print("%c",101);\n' +
            'goto L' + (contadorL++) + ';\n' +
            'L' + (contadorL - 2) + ':\n' +
            'print("%c",102);\n' +
            'print("%c",97);\n' +
            'print("%c",108);\n' +
            'print("%c",115);\n' +
            'print("%c",101);\n' +
            'L' + (contadorL - 1) + ':\n';

        return c3d;
    }

    importar = function importar(padre) {
        for (let j = 0; j < this.hijos[0].hijos.length; j++) {
            fs.readFile('C:\\Users\\arnol\\Desktop\\entradasCompi2\\' +
                this.hijos[0].hijos[j].hijos[0].identificador +
                '.' + this.hijos[0].hijos[j].hijos[1].identificador,
                'utf-8', (err, data) => {
                    if (err) {
                        console.log('error: ', err);
                    } else {
                        console.log(data);
                        let arbol = parser.parse(data);
                        //return ambito;
                    }
                });
        }
    }

    /*
        *
        * -------------------------------- string y casteos a string
        * 
    */

    generarString3d = function generarString3d(cadena) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d = 't' + contadorT + '=H;\n';

        for (var i = 0; i < cadena.length; i++) {
            retorno.c3d += 'Heap[H]=' + cadena.charCodeAt(i) + ';\n';
            retorno.c3d += 'H=H+1;\n';
        }
        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.t = 't' + (contadorT++)

        return retorno;
    }

    realizarCasteoAString = function realizarCasteoAString(tipo, t) {
        if (tipo == 'char') {
            return this.covertirCharAStr(t)
        }
        else if (tipo == 'boolean') {
            return this.covertirBooleanAStr(t);
        }
        else if (tipo == 'integer') {
            return this.covertirIntAStr(t);
        }
        else if (tipo == 'double') {
            return this.convertiDouleString(t)
        }

        return t;
    }

    covertirCharAStr = function covertirCharAStr(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.t = 't' + (contadorT);

        retorno.c3d += t.c3d;
        retorno.c3d += 't' + (contadorT++) + '=H;\n';
        retorno.c3d += 'Heap[H]=' + t.t + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        return retorno
    }

    covertirBooleanAStr = function covertirBooleanAStr(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.t = 't' + (contadorT);

        retorno.c3d += t.c3d;
        retorno.c3d += 't' + (contadorT++) + '=H;\n';

        retorno.c3d += 'if(1<>' + t.t + ') goto L' + (contadorL++) + ';\n'

        retorno.c3d += 'Heap[H]=' + 116 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 114 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 117 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 101 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 0 + ';\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 'goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'L' + (contadorL - 2) + ':\n';

        retorno.c3d += 'Heap[H]=' + 102 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 97 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 108 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 115 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 101 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 0 + ';\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        return retorno
    }

    covertirIntAStr = function covertirIntAStr(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        let aux = 't' + contadorT;
        retorno.c3d += t.c3d;
        retorno.c3d += 't' + (contadorT++) + '=' + t.t + ';\n';

        retorno.c3d += 'if(' + t.t + '>0) goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT++) + '=1;\n';
        retorno.c3d += 't' + (contadorT++) + '=0;\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '*10;\n';
        retorno.c3d += 't' + (contadorT - 1) + '=' + (t.t) + '%t' + (contadorT - 2) + ';\n';
        retorno.c3d += 'if(' + t.t + '==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';


        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 2) + '+t' + (contadorT - 1) + ';\n';

        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 2) + '-t' + (contadorT - 1) + ';\n';
        retorno.c3d += aux + '=t' + (contadorT - 1) + ';\n';
        retorno.c3d += 'L' + (contadorL - 3) + ':\n';

        retorno.c3d += 't' + (contadorT++) + '=H;\n';
        retorno.c3d += 't' + (contadorT++) + '=0;\n';
        retorno.c3d += 't' + (contadorT++) + '=0;\n';

        retorno.c3d += 't' + (contadorT++) + '=0;\n';
        retorno.c3d += 't' + (contadorT++) + '=1;\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 't' + (contadorT - 1) + '=t' + (contadorT - 1) + '*10;\n';
        retorno.c3d += 't' + (contadorT - 4) + '=t' + (contadorT - 1) + '/10;\n';
        retorno.c3d += 't' + (contadorT - 2) + '=' + aux + '%t' + (contadorT - 1) + ';\n';

        retorno.c3d += 'if(' + aux + '==t' + (contadorT - 2) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT - 2) + '-t' + (contadorT - 3) + ';\n';
        retorno.c3d += 't' + (contadorT - 3) + '=t' + (contadorT - 3) + '+t' + (contadorT) + ';\n';
        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT) + '/t' + (contadorT - 4) + ';\n';


        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT) + '+48;\n';
        retorno.c3d += 'Heap[H]=t' + (contadorT) + ';\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.c3d += 't' + (contadorT) + '=' + (aux) + '-t' + (contadorT - 3) + ';\n';
        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT) + '/t' + (contadorT - 4) + ';\n';

        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT) + '+48;\n';

        retorno.c3d += 'Heap[H]=t' + (contadorT++) + ';\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 'if(' + t.t + '>0) goto L' + (contadorL) + ';\n';
        retorno.c3d += 'Heap[H]=45;\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 't' + (contadorT++) + '=H;\n'
        retorno.c3d += 't' + (contadorT++) + '=H-2;\n'
        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n'
        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'Heap[H]=t' + (contadorT - 1) + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '-1;\n';

        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';
        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.t = 't' + (contadorT - 3);

        retorno.tipo = 'string'

        return retorno;
    }

    convertiDouleString = function convertiDouleString(t) {
        let retorno = new retornoAST('', 0, '', '', '');

        let decimal = 't' + (contadorT);

        retorno.c3d += t.c3d;
        retorno.c3d += 't' + (contadorT++) + '=' + t.t + '%1;\n';

        retorno.c3d += 't' + (contadorT) + '=' + t.t + '-' + decimal + ';\n';

        let val1 = new retornoAST('', 0, '', '', '');
        val1.t = 't' + (contadorT++)
        let numero1 = this.covertirIntAStr(val1)

        retorno.c3d += numero1.c3d;

        let tamano = this.obtenerTamanoDecimal(decimal)

        retorno.c3d += tamano.c3d;
        retorno.c3d += 't' + (contadorT) + '=' + decimal + '*' + tamano.t + ';\n';
        retorno.c3d += 't' + (contadorT) + '=t' + (contadorT) + '*10;\n';

        val1.t = 't' + (contadorT++)
        let numero2 = this.covertirIntAStr(val1)
        retorno.c3d += numero2.c3d;

        retorno.c3d += 't' + (contadorT) + '=46;\n';

        val1.t = 't' + (contadorT++)
        let punto = this.covertirCharAStr(val1)

        retorno.c3d += punto.c3d;


        let val2 = new retornoAST('', 0, '', '', '');
        val1.t = numero1.t
        val2.t = punto.t

        let concat1 = this.ConcatenarString('string', 'string', val1, val2);

        retorno.c3d += concat1.c3d;

        val1.t = concat1.t
        val2.t = numero2.t

        let concat2 = this.ConcatenarString('string', 'string', val1, val2);

        retorno.c3d += concat2.c3d;

        retorno.t = concat2.t

        return retorno;
    }

    obtenerTamanoDecimal = function obtenerTamanoDecimal(t) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t.c3d;
        let tamano = 't' + (contadorT++)
        retorno.c3d += tamano + '=10;\n'

        let decimal = 't' + (contadorT++);

        retorno.c3d += 'L' + (contadorL++) + ':\n'
        retorno.c3d += decimal + '=' + tamano + '*' + t + ';\n';

        retorno.c3d += 't' + (contadorT) + '=' + decimal + '%1;\n';

        retorno.c3d += 'if(t' + (contadorT++) + '==0) goto L' + (contadorL++) + ';\n'
        retorno.c3d += tamano + '=' + tamano + '*10;\n'
        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n'
        retorno.c3d += 'L' + (contadorL - 1) + ':\n'

        retorno.t = tamano

        return retorno
    }


    ConcatenarString = function ConcatenarString(tipo1, tipo2, t1, t2) {
        let valor1 = this.realizarCasteoAString(tipo1, t1)
        let valor2 = this.realizarCasteoAString(tipo2, t2)

        let retorno = new retornoAST('', 0, '', '', '');

        if (tipo1 != 'string') {
            retorno.c3d += valor2.c3d + valor1.c3d;
        } else {
            retorno.c3d += valor1.c3d + valor2.c3d;
        }

        retorno.c3d += 't' + (contadorT++) + '=H;\n';

        retorno.c3d += 't' + (contadorT++) + '=' + valor1.t + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';
        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 'Heap[H]=t' + (contadorT - 1) + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';

        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.c3d += 't' + (contadorT++) + '=' + valor2.t + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 't' + (contadorT++) + '=Heap[t' + (contadorT - 2) + '];\n';

        retorno.c3d += 'if(0==t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';

        retorno.c3d += 'Heap[H]=t' + (contadorT - 1) + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 't' + (contadorT - 2) + '=t' + (contadorT - 2) + '+1;\n';

        retorno.c3d += 'goto L' + (contadorL - 2) + ';\n';
        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        //retorno.c3d += 't'+(contadorT++)+'=p;\n';

        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.t = 't' + (contadorT - 5);

        return retorno;
    }

    CompararStrings = function CompararStrings(t1, t2) {
        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += t1.c3d + t2.c3d;

        retorno.c3d += 't' + (contadorT++) + '=' + t1.t + ';\n';
        retorno.c3d += 't' + (contadorT++) + '=' + t2.t + ';\n';

        retorno.c3d += 'L' + (contadorL++) + ':\n';

        retorno.c3d += 't' + (contadorT++) + '= Heap[t' + (contadorT - 3) + '];\n';
        retorno.c3d += 't' + (contadorT++) + '= Heap[t' + (contadorT - 3) + '];\n';


        retorno.c3d += 'if(t' + (contadorT - 2) + ' <> t' + (contadorT - 1) + ') goto L' + (contadorL++) + ';\n';
        retorno.c3d += 'if(t' + (contadorT - 2) + ' == 0) goto L' + (contadorL++) + ';\n';

        retorno.c3d += 't' + (contadorT - 3) + '=t' + (contadorT - 3) + '+1;\n';
        retorno.c3d += 't' + (contadorT - 4) + '=t' + (contadorT - 4) + '+1;\n';

        retorno.c3d += 'goto L' + (contadorL - 3) + ';\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';
        retorno.c3d += 't' + (contadorT) + '=1;\n';
        retorno.c3d += 'goto L' + (contadorL++) + ';\n';


        retorno.c3d += 'L' + (contadorL - 3) + ':\n';
        retorno.c3d += 't' + (contadorT) + '=0;\n';

        retorno.c3d += 'L' + (contadorL - 1) + ':\n';

        retorno.t = 't' + (contadorT++);

        return retorno;
    }

    /*
        *
        * -------------------------------- end
        * 
    */







    //------------------- Tabla De Simbolos 

    llenarTablaSimbolos = function llenarTablaSimbolos(padre) {
        tablaS = new tabla.tablaSimbolos();
        contadorH = 0;
        contadorS = 0;
        contadorA = 0;
        error = [];
        try {
            this.globalTS();
        }
        catch (err) {
            return err.message
        }
        return '';
    }

    globalTS = function globalTS() {
        let idAmbito = contadorA++
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'import':
                    break;
                case 'declaracionFuncion':
                    this.hijos[i].declaracionFuncionTS([0])
                    break;
                case 'inicializando variable con tipo':
                    this.hijos[i].inicializandoVariableConTipoTS([0], 0);
                    break;
                case 'inicializando variable sin tipo':
                    this.hijos[i].inicializandoVariableSinTipoTS([0], 0);
                    break;
                case 'inicializando arreglo':
                    this.hijos[i].inicializandoArregloTS([0], 0);
                    break;

            }
        }

        console.log(tablaS.simbolos)
        console.log('')

    }

    inicializandoVariableConTipoTS = function inicializandoVariableConTipoTS(padre, idAmbito) {
        let simbolo;

        if (this.hijos.length == 2) {
            if (this.hijos[1].hijos.length == 0) {
                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        (contadorS++),
                        1,
                        'heap',
                        'variable',
                        0);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        0,
                        1,
                        'heap',
                        'variable',
                        0);

                }
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            (contadorS++),
                            1,
                            'heap',
                            'variable',
                            0);
                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            0,
                            1,
                            'heap',
                            'variable',
                            0);

                    }

                    let err = tablaS.insertar(simbolo)
                    if (err == 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }
        else {
            let resultado = this.hijos[2].hijos[0].obtenerExp(padre, idAmbito);
            if (this.hijos[1].hijos.length == 0) {

                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        (contadorS++),
                        1,
                        'heap',
                        'variable',
                        0);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        0,
                        1,
                        'heap',
                        'variable',
                        0);

                }
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            (contadorH++),
                            1,
                            'heap',
                            'variable',
                            0);

                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            0,
                            1,
                            'heap',
                            'variable',
                            0);
                    }
                    let err = tablaS.insertar(simbolo)
                    if (err == 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }

    }

    inicializandoVariableSinTipoTS = function inicializandoVariableSinTipoTS(padre, idAmbito) {
        let simbolo;
        let cons = 0;
        if (this.hijos[0].identificador == 'global') {
            idAmbito = 0;
            padre = [];
        }
        else if (this.hijos[0].identificador == 'const') {
            cons = 1
        }
        if (this.hijos.length == 2) {

            if (this.hijos[1].hijos.length == 0) {
                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        (contadorS++),
                        1,
                        'heap',
                        'variable',
                        cons);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        (contadorH++),
                        0,
                        1,
                        'heap',
                        'variable',
                        cons);

                }


                let err = tablaS.insertar(simbolo)
                if (err = 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            (contadorS++),
                            1,
                            'heap',
                            'variable',
                            cons);
                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            (contadorH++),
                            0,
                            1,
                            'heap',
                            'variable',
                            0);

                    }

                    let err = tablaS.insertar(simbolo)
                    if (err = 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }
        else {

            let resultado = this.hijos[2].hijos[0].obtenerExp(padre, idAmbito);
            if (this.hijos[0].identificador == 'const') {
                cons = 1;
            }

            if (this.hijos[1].hijos.length == 0) {

                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        resultado.tipo,
                        padre,
                        idAmbito,
                        (contadorH++),
                        (contadorS++),
                        1,
                        'heap',
                        'variable',
                        cons);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        resultado.tipo,
                        padre,
                        idAmbito,
                        (contadorH++),
                        0,
                        1,
                        'heap',
                        'variable',
                        cons);

                }

                let err = tablaS.insertar(simbolo)
                if (err = 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            resultado.tipo,
                            padre,
                            idAmbito,
                            (contadorH++),
                            (contadorS++),
                            1,
                            'heap',
                            'variable',
                            cons);

                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            resultado.tipo,
                            padre,
                            idAmbito,
                            (contadorH++),
                            0,
                            1,
                            'heap',
                            'variable',
                            cons);
                    }

                    let err = tablaS.insertar(simbolo)
                    if (err = 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }

    }


    inicializandoVariableConTipoTS2 = function inicializandoVariableConTipoTS(padre, idAmbito) {
        let simbolo;

        if (this.hijos.length == 2) {
            if (this.hijos[1].hijos.length == 0) {
                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        0);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        0);

                }
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            0);
                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            0);

                    }

                    let err = tablaS.insertar(simbolo)
                    if (err == 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }
        else {
            if (this.hijos[1].hijos.length == 0) {

                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        0);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        0);

                }
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorH++),
                            1,
                            'stack',
                            'variable',
                            0);

                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            0);
                    }
                    let err = tablaS.insertar(simbolo)
                    if (err == 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }

    }

    inicializandoVariableSinTipoTS2 = function inicializandoVariableSinTipoTS(padre, idAmbito) {
        let simbolo;
        let cons = 0;
        if (this.hijos[0].identificador == 'global') {
            idAmbito = 0;
            padre = [];
        }
        else if (this.hijos[0].identificador == 'const') {
            cons = 1
        }
        if (this.hijos.length == 2) {

            if (this.hijos[1].hijos.length == 0) {
                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        cons);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                        this.hijos[0].identificador,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        cons);

                }


                let err = tablaS.insertar(simbolo)
                if (err = 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            cons);
                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].identificador,
                            this.hijos[0].identificador,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            0);

                    }

                    let err = tablaS.insertar(simbolo)
                    if (err = 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }
        else {

            let resultado = this.hijos[2].hijos[0].obtenerExp(padre, idAmbito);
            if (this.hijos[0].identificador == 'const') {
                cons = 1;
            }

            if (this.hijos[1].hijos.length == 0) {

                if (this.hijos[0].identificador == 'string') {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        resultado.tipo,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        cons);

                }
                else {
                    simbolo = new tabla.simbolo(this.hijos[1].identificador,
                        resultado.tipo,
                        padre,
                        idAmbito,
                        0,
                        (contadorS++),
                        1,
                        'stack',
                        'variable',
                        cons);

                }

                let err = tablaS.insertar(simbolo)
                if (err = 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {

                    if (this.hijos[0].identificador == 'string') {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            resultado.tipo,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            cons);

                    }
                    else {
                        simbolo = new tabla.simbolo(this.hijos[1].hijos[i].identificador,
                            resultado.tipo,
                            padre,
                            idAmbito,
                            0,
                            (contadorS++),
                            1,
                            'stack',
                            'variable',
                            cons);
                    }

                    let err = tablaS.insertar(simbolo)
                    if (err = 'error') {
                        error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].hijos[i].linea, this.hijos[1].hijos[i].columna))
                    }
                }
            }
        }

    }

    declaracionFuncionTS = function declaracionFuncionTS(padre) {
        let idAmbito = contadorA++
        contadorS = 0;
        padre = [0]

        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }

        nuevoPadre.push(idAmbito)

        let posS = contadorS++

        let tamano = posS
        let simbolo


        if (this.hijos.length == 3) {

            simbolo = new tabla.simbolo(this.hijos[1].identificador,
                this.hijos[0].identificador,
                padre,
                idAmbito,
                -1,
                posS,
                tamano,
                '',
                'funcion',
                0);

            tablaS.simbolos.push(simbolo)

            tamano += this.hijos[2].compilarSentenciaControlTS(nuevoPadre, idAmbito);

            tablaS.insertarTamanoFuncion(simbolo.nombre, tamano)

        }
        else {
            let parametros = this.hijos[2].compilarParametros(idAmbito)
            simbolo = new tabla.simbolo(this.hijos[1].identificador + parametros,
                this.hijos[0].identificador,
                padre,
                idAmbito,
                -1,
                posS,
                tamano,
                '',
                'funcion',
                0);

            tablaS.simbolos.push(simbolo)

            tamano += this.hijos[2].compilarParametrosTS(padre, idAmbito)
            tamano += this.hijos[3].compilarSentenciaControlTS(nuevoPadre, idAmbito);

            tablaS.insertarTamanoFuncion(simbolo.nombre, tamano)
        }
    }

    compilarParametrosTS = function compilarParametrosTS(padre, idAmbito) {
        let simbolo;
        for (let i = 0; i < this.hijos.length; i++) {
            if (this.hijos[i].hijos[0].identificador == 'string') {
                simbolo = new tabla.simbolo(this.hijos[i].hijos[1].identificador.toLowerCase(),
                    this.hijos[i].hijos[0].identificador,
                    padre,
                    idAmbito,
                    0,
                    (contadorS++),
                    1,
                    'stack',
                    'parametro',
                    0);
            }
            else {
                simbolo = new tabla.simbolo(this.hijos[i].hijos[1].identificador.toLowerCase(),
                    this.hijos[i].hijos[0].identificador,
                    padre,
                    idAmbito,
                    0,
                    (contadorS++),
                    1,
                    'stack',
                    'parametro',
                    0);
            }
            let err = tablaS.insertar(simbolo)
            if (err == 'error') {
                error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[i].hijos[1].linea, this.hijos[i].hijos[1].columna))
            }
        }
        return this.hijos.length;
    }

    sentenciaDoWhileTS = function sentenciaDoWhileTS(padre) {

        let idAmbito = contadorA++;

        let simbolo = new tabla.simbolo('',
            '',
            padre,
            idAmbito,
            0,
            0,
            0,
            '',
            '',
            0);

        tablaS.simbolos.push(simbolo)

        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }

        nuevoPadre.push(idAmbito)

        let retorno = this.hijos[0].compilarSentenciaControlTS(nuevoPadre, idAmbito);

        return retorno;
    }

    sentenciaWhileTS = function sentenciaWhileTS(padre) {

        let idAmbito = contadorA++;

        let simbolo = new tabla.simbolo('',
            '',
            padre,
            idAmbito,
            0,
            0,
            0,
            '',
            '',
            0);

        tablaS.simbolos.push(simbolo)
        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }

        nuevoPadre.push(idAmbito)

        let retorno = this.hijos[1].compilarSentenciaControlTS(nuevoPadre, idAmbito);

        return retorno;
    }

    sentenciaIfTS = function sentenciaIfTS(padre) {
        let contadorVarables = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'ifs':
                    contadorVarables += this.hijos[i].sentenciaIfsTS(padre);
                    break;
                case 'else':
                    let idAmbito = contadorA++;

                    let nuevoPadre = []

                    for (let i = 0; i < padre.length; i++) {
                        nuevoPadre.push(padre[i])
                    }

                    nuevoPadre.push(idAmbito)

                    contadorVarables += this.hijos[i].hijos[0].compilarSentenciaControlTS(nuevoPadre, idAmbito);

                    let simbolo = new tabla.simbolo('',
                        '',
                        padre,
                        idAmbito,
                        0,
                        0,
                        0,
                        '',
                        '',
                        0);

                    tablaS.simbolos.push(simbolo)
                    break;
            }
        }

        return contadorVarables;
    }

    sentenciaIfsTS = function sentenciaIfsTS(padre) {
        let contadorVarables = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'if':
                    contadorVarables += this.hijos[i].if3dTS(padre);
                    break;
                case 'lista else if':
                    contadorVarables += this.hijos[i].ifElseTS(padre);
                    break;
            }
        }

        return contadorVarables;
    }

    ifElseTS = function ifElseTS(padre) {
        let contadorVarables = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            contadorVarables += this.hijos[i].if3dTS(padre);
        }

        return contadorVarables;
    }

    if3dTS = function if3dTS(padre) {
        let idAmbito = contadorA++;

        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }
        nuevoPadre.push(idAmbito)

        let retorno = this.hijos[1].compilarSentenciaControlTS(nuevoPadre, idAmbito);

        let simbolo = new tabla.simbolo('',
            '',
            padre,
            idAmbito,
            0,
            0,
            0,
            '',
            '',
            0);

        tablaS.simbolos.push(simbolo)
        return retorno
    }


    sentenciaForTS = function sentenciaForTS(padre) {
        let idAmbito = contadorA++;
        let simbolo = new tabla.simbolo('',
            '',
            padre,
            idAmbito,
            0,
            0,
            0,
            '',
            '',
            0);

        tablaS.simbolos.push(simbolo)
        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }

        nuevoPadre.push(idAmbito)

        let retorno = 0;

        for (let i = 0; i < this.hijos[0].hijos.length; i++) {
            retorno += this.hijos[0].hijos[i].compilarInstruccionesTS(nuevoPadre, idAmbito, this.hijos[0].hijos[i].identificador)
        }

        retorno += this.hijos[1].compilarSentenciaControlTS(nuevoPadre, idAmbito);

        return retorno;

    }

    compilarInstruccionesTS = function compilarInstruccionesTS(padre, idAmbito) {
        let contadorVarables = 0;

        if (this.hijos[0].identificador == 'asignacion') {
            contadorVarables += this.hijos[0].asignacionTS(padre, idAmbito);
        }
        else if (this.hijos[0].identificador == 'inicializando variable con tipo') {
            this.hijos[0].inicializandoVariableConTipoTS2(padre, idAmbito);
            contadorVarables += 1
        }
        else if (this.hijos[0].identificador == 'inicializando variable sin tipo') {
            contadorVarables += this.hijos[0].inicializandoVariableSinTipoTS2(padre, idAmbito);
            contadorVarables += 1
        }

        return contadorVarables
    }

    sentenciaSwitchTS = function sentenciaSwitchTS(padre) {
        let idAmbito = contadorA++;

        let simbolo = new tabla.simbolo('',
            '',
            padre,
            idAmbito,
            0,
            0,
            0,
            '',
            '',
            0);

        tablaS.simbolos.push(simbolo)

        let nuevoPadre = []

        for (let i = 0; i < padre.length; i++) {
            nuevoPadre.push(padre[i])
        }
        nuevoPadre.push(idAmbito)
        return this.hijos[1].bloqueSwitchTS(nuevoPadre, idAmbito);

    }

    bloqueSwitchTS = function bloqueSwitchTS(padre, idAmbito) {
        let contador = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'listaSwitch':
                    contador += this.hijos[i].casesTS(padre, idAmbito);
                    break;
                case 'default':
                    contador += this.hijos[i].hijos[0].compilarSentenciaControlTS(padre, idAmbito);
                    break;
            }
        }

        return contador;
    }

    casesTS = function casesTS(padre, idAmbito) {
        let contador = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            contador += this.hijos[i].compilarSentenciaControlTS(padre, idAmbito);
        }

        return contador
    }

    sentenciaCaseTS = function sentenciaCaseTS(padre, idAmbito) {
        let contador = 0;

        if (this.hijos[1] != undefined) {
            contador += this.hijos[1].compilarSentenciaControl(padre, idAmbito);
        }
        return contador;
    }

    compilarSentenciaControlTS = function compilarSentenciaControlTS(padre, idAmbito) {
        let contadorVarables = 0;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'ifInstruccion':
                    contadorVarables += this.hijos[i].sentenciaIfTS(padre);
                    break;
                case 'while':
                    contadorVarables += this.hijos[i].sentenciaWhileTS(padre);
                    break;
                case 'do while':
                    contadorVarables += this.hijos[i].sentenciaDoWhileTS(padre);
                    break;
                case 'switch':
                    contadorVarables += this.hijos[i].sentenciaSwitchTS(padre);
                    break;
                case 'for':
                    contadorVarables += this.hijos[i].sentenciaForTS(padre);
                    break;
                case 'inicializando variable con tipo':
                    this.hijos[i].inicializandoVariableConTipoTS2(padre, idAmbito);
                    contadorVarables += 1
                    break;
                case 'inicializando variable sin tipo':
                    this.hijos[i].inicializandoVariableSinTipoTS2(padre, idAmbito);
                    contadorVarables += 1
                    break;
                case 'inicializando arreglo':
                    this.hijos[i].inicializandoArregloTS2(padre, idAmbito);
                    contadorVarables += 1
                    break;
                case 'return':
                    this.hijos[i].returnTS(padre, idAmbito);
                    contadorVarables += 1;
                    break;
                default:
            }
        }

        return contadorVarables;
    }

    inicializandoArregloTS2 = function inicializandoArregloTS2(padre, idAmbito) {
        let simbolo;

        if (this.hijos.length == 2) {
            simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                this.hijos[0].identificador,
                padre,
                idAmbito,
                0,
                (contadorS++),
                1,
                'stack',
                'variable',
                0);

            simbolo.arreglo = 1;
            let err = tablaS.insertar(simbolo)
            if (err == 'error') {
                error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
            }

        }
        else {
            if (this.hijos[1].hijos.length == 0) {
                simbolo = new tabla.simbolo(this.hijos[1].identificador,
                    this.hijos[0].identificador,
                    padre,
                    idAmbito,
                    0,
                    (contadorS++),
                    1,
                    'stack',
                    'variable',
                    0);

                //simbolo.tamanoR = this.hijos[2].hijos.length;
                simbolo.arreglo = 1
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
        }
    }

    inicializandoArregloTS = function inicializandoArregloTS(padre, idAmbito) {
        let simbolo;

        if (this.hijos.length == 2) {
            simbolo = new tabla.simbolo(this.hijos[1].identificador.toLowerCase(),
                this.hijos[0].identificador,
                padre,
                idAmbito,
                (contadorH++),
                0,
                1,
                'heap',
                'variable',
                0);

            simbolo.arreglo = 1;
            let err = tablaS.insertar(simbolo)
            if (err == 'error') {
                error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
            }

        }
        else {
            if (this.hijos[1].hijos.length == 0) {
                simbolo = new tabla.simbolo(this.hijos[1].identificador,
                    this.hijos[0].identificador,
                    padre,
                    idAmbito,
                    (contadorH++),
                    0,
                    1,
                    'heap',
                    'variable',
                    0);

                simbolo.tamanoR = this.hijos[2].hijos[0].hijos.length;
                simbolo.arreglo = 1
                let err = tablaS.insertar(simbolo)
                if (err == 'error') {
                    error.push(new Error('La variable \"' + simbolo.nombre + '\" ya existe.', this.hijos[1].linea, this.hijos[1].columna))
                }
            }
        }
    }

    returnTS = function returnTS(padre, idAmbito) {
        let simbolo = new tabla.simbolo('return',
            '',
            padre,
            idAmbito,
            0,
            0,
            1,
            'stack',
            'return',
            0);

        tablaS.insertarAsignacion(simbolo);
    }

    asignacionTS = function asignacionTS(padre, idAmbito) {
        let simbolo;
        if (this.hijos[1].identificador != 'listaExpresiones') {
            return 0
        }

        if (this.hijos[0].hijos.length == 1) {
            simbolo = new tabla.simbolo(this.hijos[0].hijos[0].hijos[0].identificador,
                'arreglo',
                padre,
                idAmbito,
                0,
                (contadorS++),
                1,
                'stack',
                'variable',
                0);

        }
        tablaS.insertarAsignacion(simbolo)

        return 1;
    }

} exports.AST = AST;