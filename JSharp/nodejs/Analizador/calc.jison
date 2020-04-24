/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%options case-insensitive
%options ranges

%s                comment

%%
// se ignoran comentarios

"//".*                /* skip comments          */
"/*"                  this.begin('comment');
<comment>"*/"         this.popState();
<comment>.            /* skip comment content   */
\s+                   /* skip whitespace        */

// Agrupacion
"("                   return '(';
")"                   return ')';
"{"                   return '{';
"}"                   return '}';
"["                   return '[';
"]"                   return ']';

// Operadores
"--"                  return '--';
"++"                  return '++';

"*"                   return '*';
"/"                   return '/';
"-"                   return '-';
"+"                   return '+';
"^^"                  return '^^';
"^"                   return '^';
"%"                   return '%';

"<"                   return '<';
">"                   return '>';
"<="                  return '<=';
">="                  return '>=';
"!>"                  return '<>';
"=="                  return '==';
"==="                  return '===';

"&&"                  return '&&';
"||"                  return '||';

"?"                   return '?';
"!"                   return '!';

// Palabras reservadas
"null"                return 'null';
"integer"             return 'integer';
"double"              return 'double';
"char"                return 'char';

"import"              return 'import';
"var"                 return 'var';
"const"               return 'const';
"global"              return 'global';

"true"                return 'true';
"false"               return 'false';
"if"                  return 'if';
"else"                return 'else';

"switch"              return 'switch';
"case"                return 'case';
"default"             return 'default';
"break"               return 'break';

"continue"            return 'continue';
"return"              return 'return';
"print"               return 'print';

"void"                return 'void';
"for"                 return 'for';
"while"               return 'while';
"define"              return 'define';

"as"                  return 'as';
"strc"                return 'strc';
"do"                  return 'do';
"try"                 return 'try';

"catch"               return 'catch';
"throw"               return 'throw';

// Simbolos
":="                  return ':=';
":"                   return ':';
";"                   return ';';
","                   return ',';
"="                   return '=';

"."                   return '.';

// Expresiones regulares

[0-9]+"."[0-9]+\b     return 'decimal';
[0-9]+\b              return 'entero';

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'cadena'; }
\'[^\"]?\'				{ yytext = yytext.substr(1,yyleng-2); return 'caracter'; }

[a-zA-ZñÑ_][a-zA-ZñÑ0-9_]*    return 'id';

<<EOF>>               return 'EOF';
/lex

// Precedencia
%left '(' ')''
%left '[' ']' 

%right '-''!' 
%right '^^'

%left '*' '/' '%'
%left '+' '-'
%left '<' '<=' '>' '>='
%left '===' '==' '!='
%left '&&'
%left '||'
%left '^'
%left '++' '--'

%right '=' 

%start inicio

%% // Gramatica

inicio : raiz EOF{return $1;}
;

raiz : listaCuerpo {$$={}; $$.nombre="raiz"; $$.hijos=[$1];}
;

listaCuerpo : listaCuerpo sentenciasCuerpo {$$={}; $1.hijos.push($2); $$=$1;}
    |sentenciasCuerpo
    {
        $$ = {nombre:'cuerpo',linea:'',columna:'',hijos:{}};
        $$.hijos=[$1];
    }
;

sentenciasCuerpo : importar		{$$ = $1;}
    |declaracion_variables      {$$ = $1;}
    |asignacion					{$$ = $1;}
    |declaracionFuncion         {$$ = $1;}
;

importar : 'import' id '.' id {yy.imprimirToquen($2); $$ = yy.crearNodo('import',0,0,[$2])}
    |'import' id '.' id ';'{$$ = yy.crearNodo('import',0,0,[$2])}
;

bloque : bloque sentenciasBloque 
		{
            yy.listaIds.push([$2,0,0])
            $$ = yy.crearNodo('bloque',0,0,[yy.listaIds])
            yy.listaIds = []
        }
	|sentenciasBloque {yy.listaIds.push([$1,0,0])}
;

sentenciasBloque : declaracion_variables	{$$ = $1;}
    |asignacion								{$$ = $1;}
    |imprmir  								{$$ = $1;}
    |sentenciasif                           {$$ = $1;}
    |sentenciaWhile                         {$$ = $1;}
    |sentenciaDoWhile                       {$$ = $1;}
    |sentenciaFor                           {$$ = $1;}
    |sentenciaSwitch                           {$$ = $1;}
;

sentenciaSwitch : 'switch' '(' EXP ')' '{' bloqueSwitch '}'
;

sentenciaFor : 'for' '(' instruccionesFor ')' '{' bloque '}'
;

instruccionesFor : inicioFor pce
    |pce
;

pce : ';' EXP ';' EXP 
    |';' EXP ';'  
    |';' ';' EXP 
    ';' ';'  
;

inicioFor : declaracionVariablesFor {$$ = $1;}
    | asignacionFor  {$$ = $1;}
;

sentenciasif : 'if' '(' EXP ')' '{' bloque '}'
        {
            bloque = yy.crearNodo('if',@1.first_line,@1.first_column,[$3,$6])
            nodoIf = yy.crearNodo('ifs',@1.first_line,@1.first_column,[bloque])      
            $$ = yy.crearNodo('ifInstruccion',@1.first_line,@1.first_column,[nodoIf])
        }
    | 'if' '(' EXP ')' '{' bloque '}' sentencaElse
        {
            nodoElse = yy.crearNodo('else',@1.first_line,@1.first_column,[$8])  
            bloque = yy.crearNodo('if',@1.first_line,@1.first_column,[$3,$6])    
            nodoIf = yy.crearNodo('ifs',@1.first_line,@1.first_column,[bloque])      
            $$ = yy.crearNodo('ifInstruccion',@1.first_line,@1.first_column,[nodoIf,nodoElse])
        }
    | 'if' '(' EXP ')' '{' bloque '}' listaElseIf sentencaElse
        {
            nodoElse = yy.crearNodo('else',@1.first_line,@1.first_column,[$8])  
            bloque = yy.crearNodo('if',@1.first_line,@1.first_column,[$3,$6])    
            nodoIf = yy.crearNodo('ifs',@1.first_line,@1.first_column,[bloque,$8])      
            $$ = yy.crearNodo('ifInstruccion',@1.first_line,@1.first_column,[nodoIf,nodoElse])
        }
    | 'if' '(' EXP ')' '{' bloque '}' listaElseIf 
        {
            nodoElse = yy.crearNodo('else',@1.first_line,@1.first_column,[$8])  
            bloque = yy.crearNodo('if',@1.first_line,@1.first_column,[$3,$6])    
            nodoIf = yy.crearNodo('ifs',@1.first_line,@1.first_column,[bloque,$8])      
            $$ = yy.crearNodo('ifInstruccion',@1.first_line,@1.first_column,[nodoIf])
        }
; 

sentenciaWhile : 'while' '(' EXP ')' '{' bloque '}'
    {
        $$ = yy.crearNodo('while',@1.first_line,@1.first_column,[$3,$6])
    }
;


sentenciaDoWhile : 'do' '{' bloque '}' 'while' '(' EXP ')' 
        {
            $$ = yy.crearNodo('do while',@1.first_line,@1.first_column,[$3,$7])
        }
    |'do' '{' bloque '}' 'while' '(' EXP ')' ';'
        {
            $$ = yy.crearNodo('do while',@1.first_line,@1.first_column,[$3,$7])
        }
;


sentencaElse : 'else' '{' bloque '}'
    {
        $$ = yy.crearNodo('else',@1.first_line,@1.first_column,[$3])
    }
;

listaElseIf : listaElseIf _elseIf
		{
            yy.listaIds.push([$2,0,0])
            $$ = yy.crearNodo('lista else if',0,0,[yy.listaIds])
            yy.listaIds = []
        }
    | _elseIf {yy.listaIds.push([$1,0,0])}
;

_elseIf : 'else' 'if' '(' EXP ')' '{' bloque '}' 
    {
        $$ = yy.crearNodo('else if',@1.first_line,@1.first_column,[$4,$7])
    }
;

imprmir : 'print' '(' EXP ')' {$$ = yy.crearNodo('print',@1.first_line,@1.first_column,[$3])}
    |'print' '(' EXP ')' ';' {$$ = yy.crearNodo('print',@1.first_line,@1.first_column,[$3])}
;

declaracionFuncion : tipoDato id '(' patametros ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[$1,[$2,@2.first_line,@2.first_column],$4,$7])
	}
    | id id '(' patametros ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[[$1,@1.first_line,@1.first_column],[$2,@2.first_line,@2.first_column],$4,$7])
	}
;

patametros : patametros ',' patametro
        {
            yy.listaIds.push([$2,@2.first_line,@2.first_column])
            $$ = yy.crearNodo('patametros',0,0,yy.listaIds)
            yy.listaIds = []
        }
	| patametro {yy.listaIds.push([$1,@1.first_line,@1.first_column])}
;

patametro : tipoDato id {$$ = yy.crearNodo('parametro',@2.first_line,@2.first_column,[$1,[$1,@1.first_line,@1.first_column]])}
;

declaracion_variables : tipoVCG id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable si tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | tipoDato listaIds inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2,$3]);
        }
    | id listaIds inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$2,@2.first_line,@2.first_column],$2,$3]);
        }
    | tipoDato id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | id id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$2,@2.first_line,@2.first_column],[$2,@1.first_line,@1.first_column],$3]);
        }
    | tipoVCG id  
        {
            $$ = yy.crearNodo('inicializando variable si tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | tipoDato listaIds  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2,$3]);
        }
    | id listaIds  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$2,@2.first_line,@2.first_column],$2,$3]);
        }
    | tipoDato id  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | id id  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$2,@2.first_line,@2.first_column],[$2,@1.first_line,@1.first_column],$3]);
        }
;

declaracionVariablesFor : tipoVCG id inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable si tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | tipoDato listaIds inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2,$3]);
        }
    | id listaIds inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$2,@2.first_line,@2.first_column],$2,$3]);
        }
    | tipoDato id inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,[$2,@1.first_line,@1.first_column],$3]);
        }
    | id id inicializadorVariableFor 
;


listaIds : id ',' listaIds2
        {
            yy.listaIds.push([$3,@3.first_line,@3.first_column])
            $$ = yy.crearNodo('lista ids',0,0,[yy.listaIds])
            yy.listaIds = []
        }
;

listaIds2 : listaIds2 ',' id
        {
            yy.listaIds.push([$3,@3.first_line,@3.first_column])
            $$ = yy.crearNodo('lista ids',0,0,yy.listaIds)
            yy.listaIds = []
        }
    | id
        {
            yy.listaIds.push([$1,@1.first_line,@1.first_column])
        }
;

inicializador_variable : ':=' EXP ';'{$$ = yy.crearNodo('EXP',0,0,[$2]);}
    | ':=' EXP      {$$ = yy.crearNodo('EXP',@1.first_line,@1.first_column,[$2]);}
    | '=' EXP ';' {$$ = yy.crearNodo('EXP',@1.first_line,@1.first_column,[$2]);}
    | '=' EXP     {$$ = yy.crearNodo('EXP',@1.first_line,@1.first_column,[$2]);}
    | ';'          {$$ = {}}
;

inicializadorVariableFor : ':=' EXP      {$$ = yy.crearNodo('EXP',@1.first_line,@1.first_column,[$2]);}
    | '=' EXP     {$$ = yy.crearNodo('EXP',@1.first_line,@1.first_column,[$2]);}
;

asignacion : listaIdVecFun '=' EXP ';'
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        } 
    | listaIdVecFun '=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        }
    | listaIdVecFun ':=' EXP ';'
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        } 
    | listaIdVecFun ':=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        }
;

asignacionFor :  listaIdVecFun '=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        }
    | listaIdVecFun ':=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[[$1,@1.first_line,@1.first_column],$3]);
        }
;

listaIdVecFun : listaIdVecFun '.' tipoId {$$ = yy.crearNodo('identificador asignacion',@2.first_line,@2.first_column,[$1,$3])}
    | tipoId {$$ = yy.crearNodo('identificador asignacion',0,0,[$1])}
;

tipoId : id 
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('identificador',@1.first_line,@1.first_column,[hoja])
		}
;

tipoDato: "integer"   {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
    |'char'           {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
    |'boolean'        {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
    |'void'           {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
;

tipoVCG : var   {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
    |const      {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
    |global     {$$ = yy.crearHoja($1,@1.first_line,@1.first_column)}
;

EXP
    : EXP '+' EXP	{$$ = yy.crearNodo('+',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '-' EXP	{$$ = yy.crearNodo('-',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '*' EXP	{$$ = yy.crearNodo('*',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '/' EXP	{$$ = yy.crearNodo('/',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '^^' EXP	{$$ = yy.crearNodo('^^',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '^' EXP	{$$ = yy.crearNodo('^',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '<' EXP	{$$ = yy.crearNodo('<',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '>' EXP	{$$ = yy.crearNodo('>',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '<=' EXP	{$$ = yy.crearNodo('<=',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '>=' EXP	{$$ = yy.crearNodo('>=',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '%' EXP	{$$ = yy.crearNodo('%',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '!=' EXP	{$$ = yy.crearNodo('!=',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '&&' EXP	{$$ = yy.crearNodo('&&',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '||' EXP	{$$ = yy.crearNodo('||',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '==' EXP  {$$ = yy.crearNodo('==',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '===' EXP {$$ = yy.crearNodo('===',@2.first_line,@2.first_column,[$1,$3])}
    | '!' EXP       {$$ = yy.crearNodo('!',@1.first_line,@1.first_column,[$2])}
	| '-' EXP %prec UMINUS {$$ = yy.crearNodo('-',@1.first_line,@1.first_column,[$2])}
	| '(' EDP ')'   {$$ = $2;}
	| literal       {$$ = yy.crearNodo('literal',0,0,[$1])}
;

literal : entero
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('entero',@1.first_line,@1.first_column,[hoja])
		}
    | decimal
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('decimal',@1.first_line,@1.first_column,[hoja])
		}
    | cadena
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('cadena',@1.first_line,@1.first_column,[hoja])
		}
    | caracter
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('caracter',@1.first_line,@1.first_column,[hoja])
		}
    | id
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('identificacdor',@1.first_line,@1.first_column,[hoja])
		}
    | 'true'
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('boleano',@1.first_line,@1.first_column,[hoja])
		}
    | 'false'
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('boleano',@1.first_line,@1.first_column,[hoja])
		}
    | 'null' 
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('nulo',@1.first_line,@1.first_column,[hoja])
		}
;