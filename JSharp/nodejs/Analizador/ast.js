var fs = require('fs');
var parser = require("../Analizador/calc.js");
var tabla = require("./tablaSimbolos.js");
var error = [];
var contadorT = 0;
var contadorL = 0;

var contadorA = 0;

var contadorH = 0;
var contadorS = 0;



class Error {
    constructor(error, linea, columna) {
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

    setHijo(nodo) {
        this.hijos.push(nodo);
    }

    compilar = function compilar() {
        contadorT = 0;
        contadorL = 0;
        contadorA = 0;
        error = [];
        let retorno = this.compilarSentencia();

        let cabecera = 'var ';

        for (let i = 0; i < contadorT; i++) {
            cabecera += 't' + i + ',';
        }

        cabecera = cabecera.substring(0, cabecera.length - 1) + ';\n';
        cabecera += 'var Stack[];\n';
        cabecera += 'var Heap[];\n';
        cabecera += 'var P = 1;\n';
        cabecera += 'var H = 0;\n';
        cabecera += 'H = H+' + contadorH + ';\n';

        retorno.c3d = cabecera + retorno.c3d;

        retorno.c3d += 'call principal;'

        console.log(retorno.c3d)
    }

    compilarSentencia = function compilarSentencia() {
        let c3d = '';
        let retorno = new retornoAST('', 0, '', '', '');
        let valor
        contadorA++
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'import':
                    ambito.tablaSimbolos.push(this.hijos[i].importar(padre))
                    break;
                case 'declaracionFuncion':
                    valor = this.hijos[i].declaracionFuncion(0)
                    retorno.c3d += valor.c3d;
                    break;
                case 'inicializando variable con tipo':
                    valor = this.hijos[i].inicializandoVariable(0);
                    retorno.c3d += valor.c3d;
                    break;
                case 'inicializando variable sin tipo':
                    valor = this.hijos[i].inicializandoVariable(0);
                    retorno.c3d += valor.c3d;
                    break;
            }
        }
        return retorno;
    }


    compilarSentenciaControl = function compilarSentenciaControl(idAmbito, bl, cl) {
        let retorno = new retornoAST('', 0, '', '', '');
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'print':
                    valor = this.hijos[i].print(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'ifInstruccion':
                    valor = this.hijos[i].sentenciaIf(bl, cl, idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'while':
                    valor = this.hijos[i].sentenciaWhile(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'do while':
                    valor = this.hijos[i].sentenciaDoWhile(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'switch':
                    valor = this.hijos[i].sentenciaSwitch(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'break':
                    retorno.c3d += 'goto ' + bl + ';\n'
                    retorno.break = 'break'
                    break;
                case 'continur':
                    retorno.c3d += 'goto ' + cl + ';\n'
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
                case 'llamadaFuncion':
                    valor = this.hijos[i].compilarLlamadaAFuncion(idAmbito);
                    retorno.c3d += valor.c3d;
                    break;
                default:
            }
        }

        return retorno;
    }

    compilarLlamadaAFuncion = function compilarLlamadaAFuncion(idAmbito){
        let retorno = new retornoAST('', 0, '', '', '');
        if(this.hijos.length == 1){
            retorno.c3d += 'call ' + this.hijos[0].identificador + ';\n'
        }

        return retorno;
    }

    compilarAsignacion = function compilarAsignacion(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let resultado = this.hijos[1].obtenerExp(idAmbito);

        if (this.hijos[0].hijos.length == 1) {
            let posicion = tablaS.obtenerPosicionStack(this.hijos[0].hijos[0].hijos[0].identificador, idAmbito);

            if (posicion != 'error') {
                retorno.c3d += 't' + contadorT + '=P-' + posicion + ';\n';
                retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
            }
        }
        else {

        }

        return retorno;
    }

    sentenciaFor = function sentenciaFor(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let resultado1 = compilarInstrucciones('instruccion1', idAmbito)
        let resultado2 = compilarInstrucciones('instruccion2', idAmbito)
        let resultado3 = compilarInstrucciones('instruccion3', idAmbito)

        retorno.c3d += resultado1.c3d

        let l1 = ('L' + contadorL++)
        let l2 = ('L' + contadorL++)

        let resultado4 = this.hijos[1].compilarSentenciaControl(idAmbito, l1, l2);
        let tipo = 'error'

        retorno.c3d += resultado2.c3d;

        retorno.c3d += l2 + ':\n';
        retorno.c3d += 'if(' + resultado2.t + '==0) goto ' + l1 + ';\n';

        retorno.c3d += resultado4.c3d;
        retorno.c3d += resultado3.c3d;

        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += l1 + ':\n';

        if (resultado4.break != '') {
            retorno.c3d += resultado4.break + ':\n';
            retorno.break = '';
        }

        if (resultado4.continue != '') {
            retorno.c3d += resultado4.continue + ':\n';
            retorno.continue = '';
        }

        return retorno
    }

    compilarInstrucciones = function compilarInstrucciones(instruccion, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '')
        if (this.hijos.length != 0) {
            for (let i = 0; i < this.hijos.length; i++) {
                if (instruccion == this.hijos[i].identificador) {
                    if (this.hijos[i].hijos[0].identificador != 'asignacion') {

                    }
                    else if (this.hijos[i].hijos[0].identificador != 'inicializando variable con tipo') {
                        valor = this.hijos[i].hijos[0].inicializandoVariable(idAmbito);
                    }
                    else if (this.hijos[i].hijos[0].identificador != 'inicializando variable sin tipo') {
                        valor = this.hijos[i].hijos[0].inicializandoVariable(idAmbito);
                    }
                    else {
                        retorno = this.hijos[i].hijos[0].obtenerExp(idAmbito);
                    }
                }
            }
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
                    retorno.c3d += 't' + contadorT + '=P-' + posicion + ';\n';
                    retorno.c3d += 'Stack[t' + (contadorT++) + '] = ' + resultado.t + ';\n';
                }
            }
            else {
                for (let i = 0; i < this.hijos[1].hijos.length; i++) {
                    let posicion = tablaS.obtenerPosicionStack(this.hijos[1].hijos[i].identificador, idAmbito);
                    if (posicion != 'error') {
                        let tamano = tablaS.obtenerTamanoFuncion(this.hijos[1].hijos[i].identificador, idAmbito);
                        retorno.c3d += 't' + contadorT + '=P-' + posicion + ';\n';
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

    sentenciaSwitch = function sentenciaSwitch(padre, idAmbito) {
        let retorno1 = this.hijos[0].obtenerExp(idAmbito);

        let retorno2 = this.hijos[1].bloqueSwitch(retorno1, idAmbito);

        return retorno2
    }

    bloqueSwitch = function bloqueSwitch(valor, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let l1 = ('L' + contadorL++)
        let breakL = '';
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'listaSwitch':
                    valor = this.hijos[i].cases(idAmbito, l1, valor);
                    retorno.c3d += valor.c3d;
                    if (valor.break != '') {
                        breakL = valor.break;
                    }
                    break;
                case 'default':
                    valor = this.hijos[i].hijos[0].compilarSentenciaControl(idAmbito, l1, '');
                    retorno.c3d += valor.c3d;
                    if (valor.break != '') {
                        breakL = valor.break;
                    }
                    break;
            }
        }

        if (breakL != '') {
            retorno.c3d += l1 + ':\n';
        }

        return retorno;

    }

    cases = function cases(idAmbito, bl, valor) {
        let retorno = new retornoAST('', 0, '', '', '');
        let breakL = '';
        let l = '';
        for (let i = 0; i < this.hijos.length; i++) {
            let resultado1 = this.hijos[i].sentenciaCase(idAmbito, bl, valor, l);
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

    sentenciaCase = function sentenciaCase(idAmbito, bl, valor, l) {
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
            let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, bl, '');
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

    sentenciaDoWhile = function sentenciaDoWhile(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[1].obtenerExp(idAmbito);

        let l1 = ('L' + contadorL++)
        let l2 = ('L' + contadorL++)

        let retorno2 = this.hijos[0].compilarSentenciaControl(idAmbito, l1, l2);
        let tipo = 'error'

        retorno.c3d += retorno1.c3d;

        retorno.c3d += l2 + ':\n';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + l1 + ';\n';
        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += '' + l1 + ':\n';

        if (retorno2.break != '') {
            retorno.c3d += retorno2.break + ':\n';
            retorno.break = '';
        }

        return retorno

    }

    sentenciaWhile = function sentenciaWhile(idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(idAmbito);

        let l1 = ('L' + contadorL++)
        let l2 = ('L' + contadorL++)

        let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, l1, l2);
        let tipo = 'error'

        retorno.c3d += retorno1.c3d;

        retorno.c3d += l2 + ':\n';
        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + l1 + ';\n';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l2 + ';\n';
        retorno.c3d += l1 + ':\n';

        if (retorno2.break != '') {
            retorno.c3d += retorno2.break + ':\n';
            retorno.break = '';
        }

        return retorno

    }

    /*
        *
        *   -------------------------------------------      if
        *
    */

    sentenciaIf = function sentenciaIf(bl, cl, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        let l = 'L' + (contadorL++);
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'ifs':
                    valor = this.hijos[i].sentenciaIfs(l, bl, cl, idAmbito);
                    c3d += valor.c3d;
                    break;
                case 'else':
                    valor = this.hijos[i].hijos[0].compilarSentenciaControl(bl, cl, idAmbito);
                    c3d += valor.c3d;
                    break;
            }
        }

        c3d += l + ':\n';
        retorno.c3d += c3d;
        return retorno;
    }

    sentenciaIfs = function sentenciaIfs(l, bl, cl, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'if':
                    valor = this.hijos[i].if3d(l, bl, cl, idAmbito);
                    c3d += valor.c3d;
                    break;
                case 'lista else if':
                    valor = this.hijos[i].ifElse(l, bl, cl, idAmbito);
                    c3d += valor.c3d;
                    break;
            }
        }

        retorno.c3d += c3d;
        return retorno;
    }

    ifElse = function ifElse(l, bl, cl, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let valor = new retornoAST('', 0, '', '', '');
        for (let i = 0; i < this.hijos.length; i++) {
            valor = this.hijos[i].if3d(l, bl, cl, idAmbito);
            retorno.c3d += valor.c3d;
        }

        return retorno;
    }

    if3d = function if3d(l, bl, cl, idAmbito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(idAmbito);
        let retorno2 = this.hijos[1].compilarSentenciaControl(idAmbito, bl, cl);


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

        if (this.hijos.length == 3) {
            valor = tablaS.obtenerFuncion(this.hijos[1].identificador, idAmbito);

            let cadena = this.llenarStack(valor.tamano);
            if (valor == 'error') {
                return retorno;
            }

            retorno = this.hijos[2].compilarSentenciaControl(idAmbito, '', '')

            retorno.c3d = 'proc ' + this.hijos[1].identificador + ' begin\n' +
                cadena + 'P = P+' + valor.tamano + ';\n' + retorno.c3d;

            retorno.c3d += 'P = P-' + valor.tamano + ';\n';
        }
        else {
            let parametros = this.hijos[2].compilarParametros(idAmbito)
            valor = tablaS.obtenerFuncion(this.hijos[1].identificador + parametros, idAmbito);

            if (valor == 'error') {
                return retorno;
            }

            let cadena = this.llenarStack(valor.tamano);
            retorno = this.hijos[3].compilarSentenciaControl(idAmbito, '', '')

            retorno.c3d = 'proc ' + this.hijos[1].identificador + parametros + ' begin\n' +
                cadena + 'P = P+' + valor.tamano + ';\n' + retorno.c3d;

            retorno.c3d += 'P = P-' + valor.tamano + ';\n';
        }
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

            case 'literal':
                return this.obtenerLiteral(idAmbito);
            default:
        }
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
            default:
        }
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
            let resultado2 = this.hijos[1].obtenerExp(padre, idAmbito);
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
                c3d += ambitoRetorno.c3d;
                tipo = '\"%c\"'
                break;
        }

        if (ambitoRetorno.tipo == 'boolean') {
            c3d += this.imprimirTrueFalse(ambitoRetorno.t);
        }

        else if (ambitoRetorno.tipo == 'string') {
            c3d += this.printString(ambitoRetorno.t);
        }
        else {
            c3d += ambitoRetorno.c3d + 'print(' + tipo +
                ',' + ambitoRetorno.t + ');\n';
        }

        retorno.c3d = c3d;

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

        }

        return t;
    }

    covertirCharAStr = function covertirCharAStr(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.t = 't' + (contadorT);

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

        return retorno;
    }

    ConcatenarString = function ConcatenarString(tipo1, tipo2, t1, t2) {
        let valor1 = this.realizarCasteoAString(tipo1, t1)
        let valor2 = this.realizarCasteoAString(tipo2, t2)

        let retorno = new retornoAST('', 0, '', '', '');

        retorno.c3d += valor1.c3d + valor2.c3d;
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











    //------------------- Tabla De Simbolos 

    llenarTablaSimbolos = function llenarTablaSimbolos(padre) {
        tablaS = new tabla.tablaSimbolos();
        contadorH = 0;
        contadorS = 0;
        contadorA = 0;
        this.globalTS();

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
            let resultado = this.hijos[2].hijos[0].obtenerExp(padre, idAmbito);
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

        let tamano = 0
        let simbolo

        if (this.hijos.length == 3) {
            tamano = this.hijos[2].compilarSentenciaControlTS(nuevoPadre, idAmbito);

            simbolo = new tabla.simbolo(this.hijos[1].identificador,
                this.hijos[0].identificador,
                padre,
                idAmbito,
                -1,
                -1,
                tamano,
                '',
                'funcion',
                0);
        }
        else {
            let parametros = this.hijos[2].compilarParametros(idAmbito)
            tamano += this.hijos[2].compilarParametrosTS(padre, idAmbito)
            tamano += this.hijos[3].compilarSentenciaControlTS(nuevoPadre, idAmbito);

            simbolo = new tabla.simbolo(this.hijos[1].identificador + parametros,
                this.hijos[0].identificador,
                padre,
                idAmbito,
                -1,
                -1,
                tamano,
                '',
                'funcion',
                0);
        }


        tablaS.simbolos.push(simbolo)
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

        return retorno
    }



    sentenciaSwitchTS = function sentenciaSwitchTS(padre) {
        let idAmbito = contadorA++;

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
            contador += this.hijos[i].sentenciaCaseTS(padre, idAmbito);
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
                case 'inicializando variable con tipo':
                    this.hijos[i].inicializandoVariableConTipoTS2(padre, idAmbito);
                    contadorVarables += 1
                    break;
                case 'inicializando variable sin tipo':
                    this.hijos[i].inicializandoVariableSinTipoTS2(padre, idAmbito);
                    contadorVarables += 1
                    break;
                case 'asignacion':
                    contadorVarables += this.hijos[i].asignacionTS(padre, idAmbito);
                    break;
                default:
            }
        }

        return contadorVarables;
    }

    asignacionTS = function asignacionTS(padre, idAmbito) {
        let simbolo;

        let resultado = this.hijos[1].obtenerExp(padre, idAmbito);
        if (this.hijos[0].hijos.length == 1) {
            if (resultado.tipo == 'string') {
                simbolo = new tabla.simbolo(this.hijos[0].hijos[0].hijos[0].identificador,
                    resultado.tipo,
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
                simbolo = new tabla.simbolo(this.hijos[0].hijos[0].hijos[0].identificador,
                    resultado.tipo,
                    padre,
                    idAmbito,
                    0,
                    (contadorS++),
                    1,
                    'stack',
                    'variable',
                    0);

            }
            return tablaS.insertarAsignacion(simbolo)
        }
    }

} exports.AST = AST;