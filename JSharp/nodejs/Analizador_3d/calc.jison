/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%


[.\n]+      /* skip over text not in quotes */
<<EOF>>     return "EOF";


\s+                   /* skip whitespace */

[0-9]+"."[0-9]+\b     return 'NUMBER';
"."                   return '.';
[0-9]+\b              return 'ENTERO';

"*"                   return '*';
"/"                   return '/';
"-"                   return '-';
"+"                   return '+';
"^"                   return '^';
"("                   return '(';
")"                   return ')';
"{"                   return '{';
"}"                   return '}';
"["                   return '[';
"]"                   return ']';
"<>"                   return '<>';
"\""                  return '\"';

"c"                   return 'c';
"i"                   return 'i';
"d"                   return 'd';

"<="                   return '<=';
">="                   return '>=';

"<"                   return '<';
">"                   return '>';

"%"                    return '%';
"&&"                   return '&&';
"||"                   return '||';

"--"                   return '--';
"++"                   return '++';
"=="                   return '==';
"?"                   return '?';
"!"                   return '!';
"true"                return 'true';
"false"                return 'false';
"null"                return 'null';

"var"                 return 'var';
"begin"               return 'begin';
"goto"                return 'goto';
"stack"               return 'stack';
"if"                  return 'if';
"heap"                return 'heap';
"call"                return 'call';
"then"                return 'then';
"proc"                return 'proc';
"print"               return 'print';
"ifFalse"             return 'ifFalse';
"end"                 return 'end';
"param"                 return 'param'
"$$_clean_scope"      return '$$_clean_scope';


"proc"                 return 'proc';
"true"                 return 'true';
"false"                return 'false';


"\""([^"]|{BSL})*"\"" return 'STRING_LITERAL';
"'"([^"]|{BSL})?"'" return 'CHAR';



":"                   return ':';
";"                   return ';';
","                   return ',';
"="                   return '=';

[_a-zA-Z][_a-zA-Z0-9]*\b    return 'ID';
<<EOF>>               return 'EOF';
/lex

/* operator associations and precedence */

 
%start inicio

%% /* language grammar */

inicio : c3d EOF{
        var temp ={nombre:'raiz',linea:'',columna:'',hijos:[$1]};
        return temp;}
;

c3d : c3d lista_c3d {$$={}; $1.hijos.push($2); $$=$1;}
    |lista_c3d
    {
        $$={nombre:'lista 3d',linea:'',columna:'',hijos:{}};
        
        $$.hijos = [$1];
    }
;

lista_c3d : declaracion_varable
    |asignacion
    |salto
    |saltar
    |condicion_salto
    |condicion_salto2
    |param
    |declaracion_metodo
    |invocacion_metodo
    |imprimir
    |clean
    |stack_heap
;

param : 'param' ';'
{$$={nombre:'param',linea:'',columna:'',hijos:[]};}
;

stack_heap : 'stack' '[' id_o_valor ']' '=' id_o_valor ';'
    {
        $$={nombre:'stack1',linea:'',columna:'',hijos:{}};
        
        $$.hijos = [$3,$6];
    }
    |'heap' '[' id_o_valor ']' '=' id_o_valor ';'
    {
        $$={nombre:'heap1',linea:'',columna:'',hijos:{}};
        
        $$.hijos = [$3,$6];
    }   
    |ID '=' 'stack' '[' id_o_valor ']' ';'
    {
        $$={nombre:'stack2',linea:'',columna:'',hijos:{}};
        
        var temp2={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};

        var temp1={nombre:'id',linea:0,columna:0,hijos:[temp2]};
   
        $$.hijos = [temp1,$5];
    }   
    |ID '=' 'heap' '[' id_o_valor ']' ';'
    {
        $$={nombre:'heap2',linea:'',columna:'',hijos:{}};
        
        var temp2={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};

        var temp1={nombre:'id',linea:0,columna:0,hijos:[temp2]};
   
        $$.hijos = [temp1,$5];
    }   
;


id_o_valor : ID
    {
        $$={nombre:'id',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |ENTERO
    {
        $$={nombre:'ENTERO',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |NUMBER
    {
        $$={nombre:'decimal',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |'null'
    {
        $$={nombre:'decimal',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
;


clean : '$$_clean_scope' '(' ENTERO ',' ENTERO ')' ';'
    {
        $$={nombre:'clean scope',linea:'',columna:'',hijos:{}};
        
        var temp1 = {nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
        
        var temp2 = {nombre:$8,linea:@8.first_line,columna:@8.first_column,hijos:{}};
        
        $$.hijos=[temp1,temp2];
    }
;

imprimir : 'print' '(' '\"' '%' 'c' '\"' ',' ID ')' ';'
    {
        $$={nombre:'print',linea:'',columna:'',hijos:{}};
        
        var temp1 = {nombre:$5,linea:@5.first_line,columna:@5.first_column,hijos:{}};
        
        var temp2 = {nombre:$8,linea:@8.first_line,columna:@8.first_column,hijos:{}};
        
        $$.hijos=[temp1,temp2];
    }
    |'print' '(' '\"' '%' 'i' '\"' ',' ID ')' ';'
    {
        $$={nombre:'print',linea:'',columna:'',hijos:{}};
        
        var temp1 = {nombre:$5,linea:@5.first_line,columna:@5.first_column,hijos:{}};
        
        var temp2 = {nombre:$8,linea:@8.first_line,columna:@8.first_column,hijos:{}};
        
        $$.hijos=[temp1,temp2];
    }
    |'print' '(' '\"' '%' 'd' '\"' ',' ID ')' ';'
    {
        $$={nombre:'print',linea:'',columna:'',hijos:{}};
        
        var temp1 = {nombre:$5,linea:@5.first_line,columna:@5.first_column,hijos:{}};
        
        var temp2 = {nombre:$8,linea:@8.first_line,columna:@8.first_column,hijos:{}};
        
        $$.hijos=[temp1,temp2];
    }
;

invocacion_metodo : 'call' ID ';'
    {
        $$={nombre:'invocacion metodo',linea:'',columna:'',hijos:{}};
        
        var temp ={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        
        $$.hijos=[temp];
    }
;

declaracion_metodo : 'proc' ID 'begin' c3d 'end' 
    {
        $$={nombre:'declaracion metodo',linea:'',columna:'',hijos:{}};
        
        var temp = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        
        $$.hijos=[temp,$4];
    }
;

condicion_salto : 'if' '(' id_o_valor op id_o_valor ')' 'goto' ID ';'
    {
        $$={nombre:'if',linea:'',columna:'',hijos:{}};
        
        var temp3={nombre:$8,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        
        var temp2={nombre:$4,linea:@4.first_line,columna:@4.first_column,hijos:{}};

        $$.hijos = [$3,temp2,$5,temp3];
    }
;

condicion_salto2 : 'ifFalse' '(' id_o_valor op id_o_valor ')' 'goto' ID ';'
    {
        $$={nombre:'ifFalse',linea:'',columna:'',hijos:{}};
        
        var temp3={nombre:$8,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        
        var temp2={nombre:$4,linea:@4.first_line,columna:@4.first_column,hijos:{}};

        $$.hijos = [$3,temp2,$5,temp3];
    }
;

asignacion : ID '=' valor op valor ';'
    {
        $$={nombre:'asignacion2',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};

        var temp2={nombre:$4,linea:@4.first_line,columna:@4.first_column,hijos:{}};

        $$.hijos = [temp1,$3,temp2,$5];
    }
    | ID '=' valor ';'
    {
        $$={nombre:'asignacion1',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};

        $$.hijos = [temp1,$3];
    }
;

valor : NUMBER
    {
        $$={nombre:'decimal',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |ENTERO
    {
        $$={nombre:'entero',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |STRING_LITERAL
    {
        $$={nombre:'string',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |CHAR
    {
        $$={nombre:'char',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |'true'
    {
        $$={nombre:'booleano',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |'false'
    {
        $$={nombre:'booleano',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |ID
    {
        $$={nombre:'id',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
    |'null'
    {
        $$={nombre:'null',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
   
        $$.hijos = [temp1];
    }
;

salto : lista_salto ':'
    {
        $$=$1;
    }
;

lista_salto : lista_salto ',' ID
    {
        $$={};
        var temp={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:[]};
        $1.hijos.push(temp);
        $$=$1;
    }
    |ID
    {
        var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[]};
        $$={nombre:'salto',linea:'',columna:'',hijos:[]};
        $$.hijos = [temp1];
    }
;

saltar : 'goto' ID ';'
    {
        $$={nombre:'saltar',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};

        $$.hijos = [temp1];
    }
;

declaracion_varable : 'var' ID ';'
    {
        $$={nombre:'declaracion variable ',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};

        $$.hijos = [temp1];
    }
    |'var' ID '=' valor ';' 
    {
        $$={nombre:'declaracion variable asignacion',linea:'',columna:'',hijos:{}};
        
        var temp1={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};

        $$.hijos = [temp1,$4];
    }
;


op : '+'  {$$=$1;}
    |'-'  {$$=$1;}
    |'%'  {$$=$1;}
    |'/'  {$$=$1;}
    |'*' {$$=$1;}
    |'<>' {$$=$1;}
    |'<=' {$$=$1;}
    |'==' {$$=$1;}
    |'<'  {$$=$1;}
    |'>=' {$$=$1;}
    |'>' {$$=$1;}
;