var fs = require('fs');
var parser = require("../Analizador/calc.js");
var error = [];
var contadorT = 0;
var contadorL = 0;


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

    compilar = function compilar(ambito) {
        contadorT = 0;
        contadorL = 0;
        error = [];
        let retorno = this.compilarSentencia(ambito);

        let cabecera = 'var ';

        for (let i = 0; i < contadorT; i++) {
            cabecera += 't' + i + ',';
        }

        cabecera = cabecera.substring(0, cabecera.length - 1) + ';\n';
        cabecera += 'var Stack[];\n';
        cabecera += 'var Heap[];\n';
        cabecera += 'var P = 0;\n';
        cabecera += 'var H = 0;\n';

        retorno.c3d = cabecera + retorno.c3d;

        console.log(retorno.c3d)
    }

    compilarSentencia = function compilarSentencia(ambito) {
        let c3d = '';
        let retorno;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'import':
                    ambito = this.hijos[i].importar(ambito)
                    break;
                case 'declaracionFuncion':
                    retorno = this.hijos[i].declaracionFuncion(ambito)
                    break;
            }
        }
        return retorno;
    }


    compilarSentenciaControl = function compilarSentencia(ambito) {
        let c3d = '';
        let retorno;
        let breakL = '';
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'print':
                    valor = this.hijos[i].print(ambito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'ifInstruccion':
                    valor = this.hijos[i].sentenciaIf(ambito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'while':
                    valor = this.hijos[i].sentenciaWhile(ambito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'do while':
                    valor = this.hijos[i].sentenciaDoWhile(ambito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'switch':
                    valor =  this.hijos[i].sentenciaSwitch(ambito);
                    retorno.c3d += valor.c3d;
                    break;
                case 'break':
                    if(breakL == ''){
                        breakL = 'L'+(contadorL++);
                    }
                    retorno.c3d += 'goto '+breakL+':\n'
                default:
            }
        }

        retorno.break = breakL;

        return retorno;
    }

    sentenciaSwitch = function sentenciaSwitch(ambito, l) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(ambito);
        let retorno2 = this.hijos[1].compilarSentencia(ambito);


        retorno.c3d += retorno1.c3d;
        retorno.c3d += 'if(' + retorno1.t + '==0) goto L' + (contadorL) + ';\n';
        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l + ';\n';

        retorno.c3d += 'L' + (contadorL) + ':\n';

        retorno.l = 'L' + (contadorL++) + '\n';

        return retorno
    }

    sentenciaDoWhile = function sentenciaDoWhile(ambito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[1].obtenerExp(ambito);
        let retorno2 = this.hijos[0].compilarSentencia(ambito);
        let tipo = 'error'

        retorno.c3d += retorno1.c3d;

        retorno.c3d += 'L' + (contadorL++) + ':';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + (contadorL++) + ';';
        retorno.c3d += 'goto ' + (contadorL - 2) + ';';
        retorno.c3d += 'L' + (contadorL - 1) + ':';

        retorno.l = 'L' + (contadorL++);

        return retorno

    }

    sentenciaWhile = function sentenciaWhile(ambito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(ambito);
        let retorno2 = this.hijos[1].compilarSentencia(ambito);
        let tipo = 'error'

        retorno.c3d += retorno1.c3d;


        retorno.c3d += 'L' + (contadorL++) + ':';
        retorno.c3d += 'if(' + retorno1.t + '==0) goto ' + (contadorL++) + ';';

        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + (contadorL - 2) + ';';
        retorno.c3d += 'L' + (contadorL - 1) + ':';

        retorno.l = 'L' + (contadorL++);

        return retorno

    }

    //-------------------------------------------      if

    sentenciaIf = function sentenciaIf(ambito) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        let l = 'L' + (contadorL++);
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'ifs':
                    valor = this.hijos[i].sentenciaIfs(ambito, l);
                    c3d += valor.c3d;
                    break;
                case 'else':
                    valor = this.hijos[i].hijos[0].compilarSentencia(ambito);
                    c3d += valor.c3d;
                    break;
            }
        }

        c3d += l + ':\n';
        retorno.c3d += c3d;
        return retorno;
    }

    sentenciaIfs = function sentenciaIfs(ambito, l) {
        let retorno = new retornoAST('', 0, '', '', '');
        let c3d = '';
        let valor;
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'if':
                    valor = this.hijos[i].if3d(ambito, l);
                    c3d += valor.c3d;
                    break;
                case 'lista else if':
                    valor = this.hijos[i].ifElse(ambito, l);
                    c3d += valor.c3d;
                    break;
            }
        }

        retorno.c3d += c3d;
        return retorno;
    }

    ifElse = function ifElse(ambito, l) {
        let retorno = new retornoAST('', 0, '', '', '');
        let valor = new retornoAST('', 0, '', '', '');
        for (let i = 0; i < this.hijos.length; i++) {
            valor = this.hijos[i].if3d(ambito, l);
            retorno.c3d += valor.c3d;
        }

        return retorno;
    }

    if3d = function if3d(ambito, l) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(ambito);
        let retorno2 = this.hijos[1].compilarSentencia(ambito);


        retorno.c3d += retorno1.c3d;
        retorno.c3d += 'if(' + retorno1.t + '==0) goto L' + (contadorL) + ';\n';
        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l + ';\n';

        retorno.c3d += 'L' + (contadorL) + ':\n';

        retorno.l = 'L' + (contadorL++) + '\n';

        return retorno
    }

    //-------------------------------------------      end if




    declaracionFuncion = function compilarSentenciaControl(ambito) {

        return this.hijos[2].compilarSentencia(ambito)

    }



    obtenerExp = function obtenerExp(ambito) {
        switch (this.identificador) {
            case '+':
                return this.suma(ambito);
            case '-':
                return this.resta(ambito);
            case '*':
                return this.multiplicacion(ambito);
            case '/':
                return this.divicion(ambito);
            case '%':
                return this.modulo(ambito);
            case '^^':
                return this.potencia(ambito);

            case '==':
                return this.igualDiferente(ambito);
            case '<>':
                return this.igualDiferente(ambito);
            case '===':
                return this.igualReferencia(ambito);
            case '<=':
                return this.relacional(ambito);
            case '>=':
                return this.relacional(ambito);
            case '<':
                return this.relacional(ambito);
            case '>':
                return this.relacional(ambito);

            case '&&':
                return this.logico(ambito);
            case '||':
                return this.logico(ambito);
            case '^':
                return this.logico(ambito);
            case '!':
                return this.logicoNeg(ambito);

            case '++':
                return this.logico(ambito);
            case '--':
                return this.logicoNeg(ambito);

            case 'literal':
                return this.obtenerLiteral(ambito);
            default:
        }
    }


    logicoNeg = function logicoNeg(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
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

    logico = function logico(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    relacional = function relacional(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    potencia = function potencia(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    igualDiferente = function igualDiferente(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
        let tipo = this.obtenerTipoIgualDesigual(resultado1.tipo, resultado2.tipo);
        let retorno = new retornoAST('', 0, '', '', '');
        
        if (tipo == 'error') {
            retorno .error = 1;
            return retorno;
        }

        if (this.identificador == '==') {
            if(resultado1.tipo == 'string'&& resultado2.tipo == 'string'){
                retorno = this.CompararStrings(resultado1, resultado2)
            }else{
                retorno = this.igualDiferente3d(resultado1, resultado2, '<>');
            }
        }
        else {
            if(resultado1.tipo == 'string'&& resultado2.tipo == 'string'){
                retorno = this.CompararStrings(resultado1, resultado2)
                retorno.c3d += "if(" + retorno.t + "==0) goto L" + (contadorL++) + ";\n";
                retorno.c3d += retorno.t + "=0;\n";
                retorno.c3d += "goto L" + (contadorL++) + ";\n";
                retorno.c3d += "L" + (contadorL - 2) + ":\n";
                retorno.c3d += retorno.t + "=1;\n";
                retorno.c3d += "L" + (contadorL - 1) + ":\n";
            }else{
                retorno = this.igualDiferente3d(resultado1, resultado2, '==');
            }
        }

        retorno.tipo = tipo;

        return retorno;
    }

    igualReferencia = function igualReferencia(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    modulo = function modulo(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    obtenerLiteral = function obtenerLiteral(ambito) {
        switch (this.hijos[0].identificador) {
            case 'entero':
                return this.hijos[0].obtenerEntero(ambito);
            case 'decimal':
                return this.hijos[0].obtenerDecimal(ambito);
            case 'caracter':
                return this.hijos[0].obtenerChar(ambito);
            case 'boleano':
                return this.hijos[0].obtenerBoleano(ambito);
            case 'cadena':
                return this.hijos[0].obtenerString(ambito);
            default:
        }
    }

    obtenerEntero = function obtenerEntero(ambito) {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseInt(this.hijos[0].identificador, 10),
            l: '',
            tipo: 'integer'
        }

        return retorno;
    }

    obtenerBoleano = function obtenerBoleano(ambito) {
        let retorno = {
            c3d: '',
            error: 0,
            t: this.hijos[0].identificador == 'true' ? 1 : 0,
            l: '',
            tipo: 'boolean'
        }

        return retorno;
    }

    obtenerDecimal = function obtenerDecimal(ambito) {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseFloat(this.hijos[0].identificador, 10),
            l: '',
            tipo: 'double'
        }

        return retorno;
    }

    obtenerChar = function obtenerChar(ambito) {
        let retorno = {
            c3d: '',
            error: 0,
            t: parseInt(this.hijos[0].identificador.charCodeAt(0), 10),
            l: '',
            tipo: 'char'
        }

        return retorno;
    }

    obtenerString = function obtenerString(ambito) {
        let retorno = this.generarString3d(this.hijos[0].identificador);

        retorno.tipo = 'string'

        return retorno;
    }

    suma = function suma(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    divicion = function divicion(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    multiplicacion = function multiplicacion(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    resta = function resta(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);

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
            let resultado2 = this.hijos[1].obtenerExp(ambito);
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

    print = function print(ambito) {
        let retorno = new retornoAST('', 0, '', '', '');

        let ambitoRetorno = this.hijos[0].hijos[0].obtenerExp(ambito);
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

    importar = function importar(ambito) {
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
        if (tipo == 'caracter') {
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

        retorno.c3d += 't' + (contadorT++) + '=k;\n';
        retorno.c3d += 'Heap[H]=' + t + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=0;\n';
        retorno.c3d += 'H=H+1;\n';

        return retorno
    }

    covertirBooleanAStr = function covertirBooleanAStr(t) {
        let retorno = new retornoAST('', 0, '', '', '');
        retorno.t = 't' + (contadorT);

        retorno.c3d += 't' + (contadorT++) + '=H;\n';

        retorno.c3d += 'if(1==' + t + ') goto L' + (contadorL++) + ';'

        retorno.c3d += 'Heap[H]=' + 116 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 114 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 117 + ';\n';
        retorno.c3d += 'H=H+1;\n';
        retorno.c3d += 'Heap[H]=' + 101 + ';\n';
        retorno.c3d += 'H=H+1;\n';

        retorno.c3d += 'goto L' + (contadorL++) + ':\n';
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

    CompararStrings = function CompararStrings(t1, t2){
        let retorno = new retornoAST('', 0, '', '', '');
       
        retorno.c3d += t1.c3d + t2.c3d; 

        retorno.c3d += 't'+(contadorT++) +'='+t1.t+';\n';
        retorno.c3d += 't'+(contadorT++) +'='+t2.t+';\n';
        
        retorno.c3d += 'L'+(contadorL++) +':\n';

        retorno.c3d += 't'+(contadorT++) +'= Heap[t'+(contadorT-3)+'];\n';
        retorno.c3d += 't'+(contadorT++) +'= Heap[t'+(contadorT-3)+'];\n';

        
        retorno.c3d += 'if(t'+(contadorT-2)+' <> t'+(contadorT-1)+') goto L'+(contadorL++)+';\n';
        retorno.c3d += 'if(t'+(contadorT-2)+' == 0) goto L'+(contadorL++)+';\n';

        retorno.c3d += 't'+(contadorT-3) +'=t'+(contadorT-3)+'+1;\n';
        retorno.c3d += 't'+(contadorT-4) +'=t'+(contadorT-4)+'+1;\n';
        
        retorno.c3d += 'goto L'+(contadorL-3)+';\n';        

        retorno.c3d += 'L'+(contadorL-1) +':\n';         
        retorno.c3d += 't'+(contadorT) +'=1;\n';
        retorno.c3d += 'goto L'+(contadorL++)+';\n';        


        retorno.c3d += 'L'+(contadorL-3) +':\n';        
        retorno.c3d += 't'+(contadorT) +'=0;\n';

        retorno.c3d += 'L'+(contadorL-1) +':\n';        
    
        retorno.t = 't'+(contadorT++);

        return retorno;
    }

} exports.AST = AST;