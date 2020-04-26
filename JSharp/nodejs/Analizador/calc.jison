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

"<>"                  return '<>';
"<"                   return '<';
">"                   return '>';
"<="                  return '<=';
">="                  return '>=';
"=="                  return '==';
"==="                 return '===';

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

%right '=' 

%left '++' '--'
%left '^'
%left '||'
%left '&&'
%left '===' '==' '<>'
%left '<' '<=' '>' '>='
%left '+' '-'
%left '*' '/' '%'

%right '^^'
%right '-''!' 

%left '[' ']' 

%start inicio

%% // Gramatica

inicio : raiz EOF{return $1}
;

raiz : listaCuerpo {$$ = yy.ast.hijos = $1}
;

listaCuerpo : listaCuerpo sentenciasCuerpo 
		{
            $1.setHijo($2)
            $$ = $1
        }
    | sentenciasCuerpo 
        {
            $$ = yy.crearNodo('cuerpo',0,0,[$1])
        }
;

sentenciasCuerpo : importar		{$$ = $1;}
    |declaracion_variables      {$$ = $1;}
    |asignacion					{$$ = $1;}
    |declaracionFuncion         {$$ = $1;}
;

importar : 'import' imports {yy.imprimirToquen($2); $$ = yy.crearNodo('import',0,0,[$2])}
    |'import' imports ';'{$$ = yy.crearNodo('import',0,0,[$2])}
;

imports : imports ',' nombremports
		{
            $1.setHijo($3)
            $$ = $1
        }
    | nombremports 
        {
            $$ = yy.crearNodo('imports',0,0,[$1])
        }
;

nombremports : id '.' id
    {
        $$ = yy.crearNodo('nombre',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),yy.crearHoja($3,@3.first_line,@3.first_column)])   
    }
;

bloque : bloque sentenciasBloque 
		{
            $1.setHijo($2)
            $$ = $1
        }
	| sentenciasBloque
        {
            $$ = yy.crearNodo('bloque',0,0,[$1])
        }
;

sentenciasBloque : declaracion_variables	{$$ = $1;}
    |asignacion								{$$ = $1;}
    |imprmir  								{$$ = $1;}
    |sentenciasif                           {$$ = $1;}
    |sentenciaWhile                         {$$ = $1;}
    |sentenciaDoWhile                       {$$ = $1;}
    |sentenciaFor                           {$$ = $1;}
    |sentenciaSwitch                        {$$ = $1;}
;

sentenciaSwitch : 'switch' '(' EXP ')' '{' bloqueSwitch '}'
        {
            $$ = yy.crearNodo('switch',@1.first_line,@1.first_column,[$3,$6])
        }   
;

bloqueSwitch : listaBloqueSwitch sentenciaDefault
        {
            $$ = yy.crearNodo('bloqueSwitch',@1.first_line,@1.first_column,[$1,$2])
        }   
    |listaBloqueSwitch
        {
                $$ = yy.crearNodo('bloqueSwitchCases',@1.first_line,@1.first_column,[$1])
        }
    |sentenciaDefault
        {
                $$ = yy.crearNodo('bloqueSwitchDefault',@1.first_line,@1.first_column,[$1])
        }
;

sentenciaDefault : 'default' ':' bloque
        {
            $$ = yy.crearNodo('default',@1.first_line,@1.first_column,[$3])
        }
    | 'default' ':'
        {
            $$ = yy.crearNodo('default',@1.first_line,@1.first_column,[])
        }
;

sentenciaCase : 'case' EXP ':'
        {
            $$ = yy.crearNodo('case',@1.first_line,@1.first_column,[$2])
        }
    | 'case' EXP ':' bloque  
        {
            $$ = yy.crearNodo('case',@1.first_line,@1.first_column,[$2,$4])
        }
;

listaBloqueSwitch : listaBloqueSwitch sentenciaCase
		{
            $1.setHijo($2)
            $$ = $1
        }
    | sentenciaCase  
        {
            $$ = yy.crearNodo('listaSwitch',0,0,[$1])
        }
;

sentenciaFor : 'for' '(' instruccionesFor ')' '{' bloque '}'
    {
        $$ = yy.crearNodo('for',@1.first_line,@1.first_column,[$3,$6])
    }
;

instruccionesFor : inicioFor ';' EXP ';' EXP 
        {
            instruccion1 = yy.crearNodo('instruccion1',@1.first_line,@1.first_column,[$1]) 
            instruccion2 = yy.crearNodo('instruccion2',@1.first_line,@1.first_column,[$2])    
            instruccion3 = yy.crearNodo('instruccion3',@1.first_line,@1.first_column,[$3])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion1,instruccion2,instruccion3])
        }
    | inicioFor ';' ';' EXP 
        {
            instruccion1 = yy.crearNodo('instruccion1',@1.first_line,@1.first_column,[$1])    
            instruccion3 = yy.crearNodo('instruccion3',@1.first_line,@1.first_column,[$3])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion1,instruccion3])
        }
    | inicioFor ';' EXP ';' 
        {
            instruccion1 = yy.crearNodo('instruccion1',@1.first_line,@1.first_column,[$1])    
            instruccion2 = yy.crearNodo('instruccion2',@1.first_line,@1.first_column,[$2])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion1,instruccion2])
        }
    | ';' EXP ';' EXP 
        {
            instruccion2 = yy.crearNodo('instruccion2',@1.first_line,@1.first_column,[$2])    
            instruccion3 = yy.crearNodo('instruccion3',@1.first_line,@1.first_column,[$3])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion2,instruccion3])
        }
    | ';' EXP ';'  
        {
            instruccion2 = yy.crearNodo('instruccion2',@1.first_line,@1.first_column,[$2])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion2])
        }
    | ';' ';' EXP 
        {
            instruccion3 = yy.crearNodo('instruccion3',@1.first_line,@1.first_column,[$3])    
            $$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[instruccion3])
        }
    | ';' ';'  {$$ = yy.crearNodo('instrucciones',@1.first_line,@1.first_column,[])}
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

listaElseIf : listaElseIf elseIf
		{
            $1.setHijo($2)
            $$ = $1
        }
    | elseIf   
        {
            $$ = yy.crearNodo('lista else if',0,0,[$1])
        }
;

elseIf : 'else' 'if' '(' EXP ')' '{' bloque '}' 
    {
        $$ = yy.crearNodo('else if',@1.first_line,@1.first_column,[$4,$7])
    }
;

imprmir : 'print' '(' EXP ')' {$$ = yy.crearNodo('print',@1.first_line,@1.first_column,[yy.crearNodo('EXP',@1.first_line,@1.first_column,[$3])])}
    |'print' '(' EXP ')' ';' {$$ = yy.crearNodo('print',@1.first_line,@1.first_column,[yy.crearNodo('EXP',@1.first_line,@1.first_column,[$3])])}
;

declaracionFuncion : tipoDato id '(' patametros ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$4,$7])
	}
    | id id '(' patametros ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[yy.crearHoja($1,@1.first_line,@1.first_column),yy.crearHoja($2,@2.first_line,@2.first_column),$4,$7])
	}
    |tipoDato id '(' ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$6])
	}
    | id id '(' ')' '{' bloque '}' 
	{
		$$ = yy.crearNodo('declaracionFuncion',@2.first_line,@2.first_column,[yy.crearHoja($1,@1.first_line,@1.first_column),yy.crearHoja($2,@2.first_line,@2.first_column),$6])
	}
;

patametros : patametros ',' patametro
		{
            $1.setHijo($3)
            $$ = $1
        }
	| patametro     
        {
            $$ = yy.crearNodo('patametros',0,0,[$1])
        }
;

patametro : tipoDato id {$$ = yy.crearNodo('parametro',@2.first_line,@2.first_column,[$1,yy.crearHoja($2,@2.first_line,@2.first_column)])}
;

declaracion_variables : tipoVCG id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable sin tipo',0,0,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
    | tipoDato listaIds inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2,$3]);
        }
    | id listaIds inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),$2,$3]);
        }
    | tipoDato id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
    | id id inicializador_variable 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
    | tipoVCG id  
        {
            $$ = yy.crearNodo('inicializando variable sin tipo',0,0,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
    | tipoDato listaIds  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2]);
        }
    | id listaIds  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),$2]);
        }
    | tipoDato id  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,yy.crearHoja($2,@2.first_line,@2.first_column)]);
        }
    | id id  
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[[$1,@1.first_line,@1.first_column],[$2,@2.first_line,@2.first_column]]);
        }
;

declaracionVariablesFor : tipoVCG id inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable si tipo',0,0,[$1,[$2,@2.first_line,@2.first_column],$3]);
        }
    | tipoDato listaIds inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,$2,$3]);
        }
    | id listaIds inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),$2,$3]);
        }
    | tipoDato id inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[$1,yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
    | id id inicializadorVariableFor 
        {
            $$ = yy.crearNodo('inicializando variable con tipo',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column),yy.crearHoja($2,@2.first_line,@2.first_column),$3]);
        }
;


listaIds : id ',' listaIds2
        { 
            $3.setHijo(yy.crearHoja($1,@1.first_line,@1.first_column))
            $$ = $3
        }
;

listaIds2 : listaIds2 ',' id
		{
            $1.setHijo(yy.crearHoja($3,0,0))
            $$ = $1
        }
    | id    
        {            
            $$ = yy.crearNodo('listaIds',0,0,[yy.crearHoja($1,@1.first_line,@1.first_column)])
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
            $$ = yy.crearNodo('asignacion',0,0,[$1,$3]);
        } 
    | listaIdVecFun '=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[$1,$3]);
        }
    | listaIdVecFun ':=' EXP ';'
        {
            $$ = yy.crearNodo('asignacion',0,0,[$1,$3]);
        } 
    | listaIdVecFun ':=' EXP 
        {
            $$ = yy.crearNodo('asignacion',0,0,[$1,$3]);
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

listaIdVecFun : listaIdVecFun '.' tipoId 
        {            
            $1.setHijo(yy.crearHoja($3,0,0))
        }
    | tipoId 
        {
            $$ = yy.crearNodo('identificadorAsignacion',0,0,[$1])
        }
;

tipoId : id 
		{
			hoja = yy.crearHoja($1,@1.first_line,@1.first_column)
			$$ = yy.crearNodo('identificador',@1.first_line,@1.first_column,[hoja])
		}
;

tipoDato: "integer"   {$$ = yy.crearHoja('integer',@1.first_line,@1.first_column)}
    |'char'           {$$ = yy.crearHoja('char',@1.first_line,@1.first_column)}
    |'boolean'        {$$ = yy.crearHoja('boolean',@1.first_line,@1.first_column)}
    |'void'           {$$ = yy.crearHoja('void',@1.first_line,@1.first_column)}
;

tipoVCG : 'var'   {$$ = yy.crearHoja('var',@1.first_line,@1.first_column)}
    | 'const'     {$$ = yy.crearHoja('const',@1.first_line,@1.first_column)}
    | 'global'     {$$ = yy.crearHoja('global',@1.first_line,@1.first_column)}
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
    | EXP '<>' EXP	{$$ = yy.crearNodo('<>',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '&&' EXP	{$$ = yy.crearNodo('&&',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '||' EXP	{$$ = yy.crearNodo('||',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '==' EXP  {$$ = yy.crearNodo('==',@2.first_line,@2.first_column,[$1,$3])}
    | EXP '===' EXP {$$ = yy.crearNodo('===',@2.first_line,@2.first_column,[$1,$3])}
    | '!' EXP       {$$ = yy.crearNodo('!',@1.first_line,@1.first_column,[$2])}
	| '-' EXP %prec UMINUS {$$ = yy.crearNodo('-',@1.first_line,@1.first_column,[$2])}
	| '(' EXP ')'   {$$ = $2;}
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