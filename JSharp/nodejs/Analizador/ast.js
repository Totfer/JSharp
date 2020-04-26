var fs = require('fs');
var parser = require("../Analizador/calc.js");
var c3d = '';
var error = [];
var contadorT = 0;
var contadorL = 0;

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
        let c3d = '';
        for (let i = 0; i < this.hijos.length; i++) {
            switch (this.hijos[i].identificador) {
                case 'import':
                    ambito = this.hijos[i].importar(ambito)
                case 'declaracionFuncion':
                    return this.hijos[i].declaracionFuncion(ambito)
                case 'print':
                    this.hijos[i].print(ambito);
                default:
            }
        }
    }

    declaracionFuncion = function declaracionFuncion(ambito) {

        this.hijos[2].compilar(ambito)

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
                return this.relacional(ambito);
            case '||':
                return this.relacional(ambito);
            case '!':
                return this.relacional(ambito);
            case '^':
                return this.relacional(ambito);

            case 'literal':
                return this.obtenerLiteral(ambito);
            default:
        }
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

        let retorno = this.obtenerCodigoPotencia(resultado1, resultado2)
        retorno.tipo = tipo;


        return retorno;
    }

    igualDiferente = function igualDiferente(ambito) {
        let resultado1 = this.hijos[0].obtenerExp(ambito);
        let resultado2 = this.hijos[1].obtenerExp(ambito);
        let tipo = this.obtenerTipoIgualDesigual(resultado1.tipo, resultado2.tipo);
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

        if (this.identificador == '==') {
            retorno = this.igualDiferente3d(resultado1, resultado2, '<>');
        }
        else {
            retorno = this.igualDiferente3d(resultado1, resultado2, '==');
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

    potencia3d = function potencia3d(resultado1, resultado2) {

        cadena += 't' + (contT++) + '=1;\n';
        cadena += 't' + (contT++) + '=' + temp2._t + ';\n';
        cadena += 't' + (contT++) + '=' + temp1._t + ';\n';
        cadena += 't' + (contT++) + '=' + temp1._t + ';\n';


        cadena += 'L' + (contL++) + ':\n';
        cadena += 'if(t' + (contT - 4) + '<t' + (contT - 3) + ') goto L' + (contL++) + ';\n';
        cadena += 'goto L' + (contL++) + ';\n';
        cadena += 'L' + (contL - 2) + ':\n';
        cadena += 't' + (contT - 2) + '=t' + (contT - 2) + '*t' + (contT - 1) + ';\n';
        cadena += 't' + (contT - 4) + '=1+t' + (contT - 4) + ';\n';
        cadena += 'goto L' + (contL - 3) + ';\n';
        cadena += 'L' + (contL - 1) + ':\n';
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
        if (tipo1 != 'char') {
            error.push({
                linea: this.linea,
                columna: this.columna,
                error: 'El valor debe de ser de tipo integer.'
            });
            return 'error'
        }
        if (tipo2 != undefined) {
            if (tipo2 != 'char') {
                error.push({
                    linea: this.linea,
                    columna: this.columna,
                    error: 'El valor debe de ser de tipo integer.'
                });
                return 'error'
            }
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
            case 'boolean':
                return this.hijos[0].obtenerBoleano(ambito);
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
            tipo: 'boleano'
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
            t: parseInt(this.hijos[0].identificador, 10),
            l: '',
            tipo: 'Char'
        }

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

        let retorno = this.obtenerCodigoOperadoresAritmeticos(resultado1, resultado2, '+')
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
        let ambitoRetorno = this.hijos[0].hijos[0].obtenerExp(ambito);
        let tipo
        let c3d = '';
        switch (ambitoRetorno.tipo) {
            case 'integer':
                tipo = '\"%i\"'
                break;
            case 'double':
                tipo = '\"%d\"'
                break;
            case 'char':
                tipo = '\"%c\"'
                break;
            case 'boolean':
                tipo = '\"%c\"'
                break;
        }

        if (ambitoRetorno.tipo == 'boolean') {
            c3d += ambitoRetorno.c3d;
            c3d += this.imprimirTrueFalse(ambitoRetorno.t);
        }
        else {
            c3d += ambitoRetorno.c3d + 'print(' + tipo +
                ',' + ambitoRetorno.t + ');\n';
        }

        console.log(c3d);
        return c3d;
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
            console.log(this.hijos[0].hijos[j].hijos[1].identificador)
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

} exports.AST = AST;