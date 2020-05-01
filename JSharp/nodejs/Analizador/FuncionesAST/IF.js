
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
                    valor = this.hijos[i].hijos[0].compilar(ambito);
                    c3d += valor.c3d;
                    break;
            }
        }

        c3d += l + ':\n';
        retorno.c3d += c3d;
        console.log(retorno.c3d);
        return retorno;
    }

    sentenciaIfs = function sentenciaIfs(ambito,l) {
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
        for (let i = 0; i < 3; i++) {
            this.hijos[i].if3d(ambito, l);
        }
    }

    if3d = function if3d(ambito, l) {
        let retorno = new retornoAST('', 0, '', '', '');

        let retorno1 = this.hijos[0].obtenerExp(ambito);
        let retorno2 = this.hijos[1].compilar(ambito);


        retorno.c3d += retorno1.c3d;
        retorno.c3d += 'if(' + retorno1.t + '==0) goto L' + (contadorL) + ';\n';
        retorno.c3d += retorno2.c3d;

        retorno.c3d += 'goto ' + l + ';\n';

        retorno.c3d += 'L' + (contadorL) + ':\n';

        retorno.l = 'L' + (contadorL++) + '\n';

        return retorno
    }
