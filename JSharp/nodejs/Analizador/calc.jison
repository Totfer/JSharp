/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex


%%


[\n]+      /* skip over text not in quotes */
<<EOF>>     return "EOF";


\s+                   /* skip whitespace */

"//"([^"]|{BSL})*[\n]              return '';
"/*"([^"]|{BSL}|["\n"])*"*/"              return '';

[0-9]+"."[0-9]+\b     return 'NUMBER';
"."                   return '.';
[0-9]+\b              return 'ENTERO';
"*"                   return '*';
"/"                   return '/';

"--"                   return '--';
"++"                   return '++';

"-"                   return '-';
"+"                   return '+';
"^"                   return '^';
"("                   return '(';
")"                   return ')';
"{"                   return '{';
"}"                   return '}';
"["                   return '[';
"]"                   return ']';
"<"                   return '<';
">"                   return '>';

"<="                   return '<=';
">="                   return '>=';

"%"                   return '%';
"!="                   return '!=';
"&&"                   return '&&';
"||"                   return '||';

"=="                   return '==';
"?"                   return '?';
"!"                   return '!';
"true"                return 'true';
"false"                return 'false';
"null"                return 'null';


"PI"                  return 'PI';
"E"                   return 'E';

"class"               return 'class';
"extends"             return 'extends';
"public"              return 'public';
"protected"           return 'protected';
"private"             return 'private';
"abstract"            return 'abstract';
"static"              return 'static';
"final"               return 'final';

"int"                 return 'int';
"double"              return 'double';
"char"                return 'char';
"boolean"             return 'boolean';
"String"              return 'String';
"void"                return 'void';
"this"                return 'this';
"super"               return 'super';

"linkedlist"          return 'linkedlist';
"new"                 return 'new';
"import"              return 'import';

"try"                 return 'try';
"catch"               return 'catch';
"break"               return 'break';  
"continue"            return 'continue';  
"return"              return 'return';  

"else"              return 'else';  
"if"                return 'if';    

"switch"            return 'switch';  
"case"              return 'case';  
"default"           return 'default';  
"throw"             return 'throw';  

"while"             return 'while';  
"do"                return 'do';  

"for"               return 'for';  

"print"             return 'print';  
"println"           return 'println';  

"read_file"         return 'read_file';  
"write_file"        return 'write_file';  
"read"              return 'read';
"graph"             return 'graph';

"hol"                 return 'hol';

"str"                 return 'str';
"toDouble"            return 'toDouble';
"toInt"               return 'toInt';
"toChar"              return 'toChar';
"pow"                 return 'pow';
"instanceof"          return 'instanceof';
"equals"              return 'equals';
".equals"             return '.equals';


"\""([^"]|{BSL})*"\""     return 'STRING';
"'"([^"]|{BSL})?"'"     return 'CHAR';


":"                   return ':';
";"                   return ';';
","                   return ',';
"="                   return '=';

[_a-zA-Z][_a-zA-Z0-9]*\b    return 'ID';


<<EOF>>               return 'EOF';
/lex

/* operator associations and precedence */



%right '?' ':'
%left '.' '[' '('

%right '++' '--' '!' UMINUS

%right 'int' 'double' 'char'

%left '&&'
%left '||' '^'

%left '+' '-' '<' '<=' '>' '>='

%left '*' '/'  '%' 

%left '!=' '==' '.'


%left '.equals'


%start inicio

%% /* language grammar */

inicio : clase EOF{return $1;}
;

clase : listaClases {$$={}; $$.nombre="raiz"; $$.hijos=[$1];}
;

listaClases : listaClases declaracion_clase {$$={}; $1.hijos.push($2); $$=$1;}
    |declaracion_clase
    {
        $$ = {nombre:'clases',linea:'',columna:'',hijos:{}};
        $$.hijos=[$1];
    }
;

declaracion_clase : modificadores_archivo 'class' ID '{' cuerpo_clase '}'
        {
            $$ = {nombre:'clase',linea:'',columna:'',hijos:{}};

            $2 = {nombre:'class',linea:@2.first_line,columna:@2.first_column,hijos:{}};

            var temp = $3;
            $3 = {nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};
    
            $$.hijos=[$1,$2,$3,$5];
        }
    |modificadores_archivo 'class' ID '{''}'
        {
            $$ = {nombre:'clase',linea:'',columna:'',hijos:{}};

            $2 = {nombre:'class',linea:@2.first_line,columna:@2.first_column,hijos:{}};

            var temp = $3;
            $3 = {nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};

            var aux = {nombre:'cuerpo',linea:'',columna:'',hijos:[]};
    
            $$.hijos=[$1,$2,$3,aux];
        }
    |modificadores_archivo ID 'extends' ID '{' cuerpo_clase '}'
        {
            $$ = {nombre:'clase',linea:'',columna:'',hijos:{}};
    
            var temp = $2;
            $2 = {nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};

            $3 = {nombre:'extends',linea:@3.first_line,columna:@3.first_column,hijos:{}};

            var temp = $4;
            $4 = {nombre:temp,linea:@4.first_line,columna:@4.first_column,hijos:{}};
    
            $$.hijos=[$1,$2,$3,$4,$6];
        }
    |modificadores_archivo ID 'extends' ID '{' '}'
        {
            $$ = {nombre:'clase',linea:'',columna:'',hijos:{}};
    
            var temp = $2;
            $2 = {nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};

            $3 = {nombre:'extends',linea:@3.first_line,columna:@3.first_column,hijos:{}};

            var temp = $4;
            $4 = {nombre:temp,linea:@4.first_line,columna:@4.first_column,hijos:{}};
                    
            var aux = {nombre:'cuerpo',linea:'',columna:'',hijos:[]};
    
            $$.hijos=[$1,$2,$3,$4,aux];
    }
;

cuerpo_clase : cuerpo_clase cuerpo_clase_dec {$$={}; $1.hijos.push($2); $$=$1;}
    |cuerpo_clase_dec  
    {
        $$ = {nombre:'cuerpo',linea:'',columna:'',hijos:{}};
        $$.hijos=[$1];
    }
;

cuerpo_clase_dec : declaracion_archivo {$$ = $1;}
    |inicialisacion_archivo {$$ = $1;}
    |declaracion_metodo          {$$ = $1;}
    |declaracion_constructor     {$$ = $1;}  
    |declaracion_clase           {$$ = $1;}
    |inicializacion_exprecion_creada
    |declaracion_exprecion_creada
    |importar {$$=$1;}
;

declaracion_constructor : modificadores_archivo declarador_constructor '{' bloque_metodo '}' 
        {
            $$={nombre:'declarador constructor',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1,$2,$4];
        }
    |modificadores_archivo declarador_constructor '{' '}' 
        {
            var sent ={nombre:'sentencias',linea:'',columna:'',hijos:{}};
            
            $$={nombre:'declarador constructor',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1,$2,sent];
        }
    |declarador_constructor '{' bloque_metodo '}' 
        {
            var mods ={nombre:'modificadores',linea:'',columna:'',hijos:{}};
            
            $$={nombre:'declarador constructor',linea:'',columna:'',hijos:{}};
            $$.hijos=[mods,$1,$3];
        }
    |declarador_constructor '{' '}' 
        {
            var sent ={nombre:'sentencias',linea:'',columna:'',hijos:{}};
            var mods ={nombre:'modificadores',linea:'',columna:'',hijos:{}};
            $$={nombre:'declarador constructor',linea:'',columna:'',hijos:{}};
            $$.hijos=[mods,$1,sent];
        }
;

declarador_constructor : ID '(' parametros_formales ')' 
        {
            $$={nombre:'declaracion constructor',linea:'',columna:'',hijos:{}};

            var temp = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[temp,$3];
        }
    |ID '('')' 
        {
            $$={nombre:'declaracion constructor',linea:'',columna:'',hijos:{}};

            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2 = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};   
            
            $$.hijos=[temp,temp2];
        }
;

declaracion_metodo : cabesa_metodo '{' bloque_metodo '}' 
        {
            $$={nombre:'declaracion metodo',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1,$3];
        }
    |cabesa_metodo '{' '}' 
        {
            $$={nombre:'declaracion metodo',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1];
        }
    |cabesa_metodo ';' 
        {
            $$={nombre:'declaracion metodo',linea:'',columna:'',hijos:{}};
             
            $$.hijos=[$1];
        }
;

bloque_metodo : bloque_metodo lista_bloques {$$={}; $1.hijos.push($2); $$=$1;}
    |lista_bloques  
        {
            $$={nombre:'sentencias',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1]
        }
;

lista_bloques : imbocacion_explicita_constructor {$$=$1;}
    |linkedlist_instanciacion {$$=$1;}
    |linkedlist_declaracion {$$=$1;}
    |excepcion {$$=$1;}
    |inicialisacion_archivo {$$=$1;}
    |declaracion_archivo {$$=$1;}
    |breakA {$$=$1;}
    |continueAN {$$=$1;}
    |returnA {$$=$1;}
    |ifA {$$=$1;}
    |switchA {$$=$1;}
    |throwA {$$=$1;}
    |whileA {$$=$1;}
    |dowhile {$$=$1;}
    |forA {$$=$1;}
    |foreachA {$$=$1;}
    |printA {$$=$1;}
    |printlnA {$$=$1;}
    |write_fileA {$$=$1;}
    |readA {$$=$1;}
    |graphA {$$=$1;}
    |declaracion_exprecion_creada {$$=$1;}
    |inicializacion_exprecion_creada {$$=$1;}
    |invocacion_metodo {$$=$1;}
;

invocacion_metodo : ID '(' Lista_Exp ')' ';'
    {
            $$={nombre:'invocacion metodo',linea:'',columna:'',hijos:{}};
  
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$3];
        }
    | ID '(' ')' ';'
    {
            $$={nombre:'invocacion metodo',linea:'',columna:'',hijos:{}};
  
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var aux ={nombre:'lista exp',linea:0,columna:0,hijos:{}};
            
            $$.hijos=[$1,aux];
        }
    | ID'.'ID '(' ')' ';'
    {
            $$={nombre:'invocacion metodo variable',linea:'',columna:'',hijos:{}};
  
            var temp1 ={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2 ={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            var temp3 ={nombre:'lista exp',linea:0,columna:0,hijos:{}};
            
            $$.hijos=[temp1,temp2,temp3];
        }
    | ID'.'ID '(' Lista_Exp ')' ';'
    {
            $$={nombre:'invocacion metodo variable',linea:'',columna:'',hijos:{}};
  
            var temp1 ={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2 ={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            
            $$.hijos=[temp1,temp2,$5];
    }
    | 'this' '.' ID '(' ')' ';'
    {
            $$={nombre:'invocacion metodo variable',linea:'',columna:'',hijos:{}};
  
            var temp1 ={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2 ={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            var temp3 ={nombre:'lista exp',linea:0,columna:0,hijos:{}};
            
            $$.hijos=[temp1,temp2,temp3];
        }
    | 'this' '.' ID '(' Lista_Exp ')' ';'
    {
            $$={nombre:'invocacion metodo variable',linea:'',columna:'',hijos:{}};
  
            var temp1 ={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2 ={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            
            $$.hijos=[temp1,temp2,$5];
    }
;

Lista_Exp : Lista_Exp ',' EXP {$$={}; $1.hijos.push($3); $$=$1;}
    |EXP {$$={nombre:'lista exp',linea:'',columna:'',hijos:[$1]};}
;

inicializacion_exprecion_creada : ID '=' 'new' ID '(' ')' ';' 
        {
            $$={nombre:'inicialisacion objeto',linea:'',columna:'',hijos:{}};
  
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var temp = $4;
            $4={nombre:temp,linea:@4.first_line,columna:@4.first_column,hijos:{}};
            
            $$.hijos=[$1,$4];
        }
    |ID '=' 'new' ID dimencion_declaracion ';' 
        {
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
         
            var temp = $4;
            $4={nombre:temp,linea:@4.first_line,columna:@4.first_column,hijos:{}};

            $$={nombre:'inicialisacion objeto vector',linea:'',columna:'',hijos:{}}; 
            $$.hijos=[$1,$4,$5];
        }
    |ID '.' ID '=' EXP ';'
        {
            
            var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
         

            var temp3={nombre:'EXP',linea:'',columna:'',hijos:[$5]};

            $$={nombre:'asignacion objeto',linea:'',columna:'',hijos:{}}; 
            $$.hijos=[temp1,temp2,temp3];
        }
    |'this' '.' ID '=' EXP ';'
        {
            
            var temp1={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var temp2={nombre:$3,linea:@3.first_line,columna:@3.first_column,hijos:{}};
         

            var temp3={nombre:'EXP',linea:'',columna:'',hijos:[$5]};

            $$={nombre:'asignacion objeto',linea:'',columna:'',hijos:{}}; 
            $$.hijos=[temp1,temp2,temp3];
        }
;

declaracion_exprecion_creada : ID ID ';' 
    {
        $$={nombre:'declaracion objeto',linea:'',columna:'',hijos:{}};

        var temp = $1;
        $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};

        var temp = $2;
        $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};

        $$.hijos=[$1,$2];
    }
    |ID ID '=' 'new' ID '(' ')' ';' 
        {                
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = $2;
            $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
    
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:[]};

            $$={nombre:'declaracion objeto',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1,$2,$5];
        }
    |ID ID '=' 'new' ID '(' parametros ')' ';' 
        {                
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = $2;
            $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
    
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:[$7]};

            $$={nombre:'declaracion objeto',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1,$2,$5];
        }
    |ID ID dimencion ';' 
    {
        $$={nombre:'declaracion objeto vector',linea:'',columna:'',hijos:{}};
            
        var temp = $1;
        $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
        var temp = $2;
        $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
    
        $$.hijos=[$1,$2,$3];
    }
    |ID ID dimencion '=' 'new' ID dimencion_declaracion ';' 
    {
        $$={nombre:'declaracion objeto vector',linea:'',columna:'',hijos:{}};
        
        var temp = $1;
        $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
        var temp = $2;
        $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
    
        var temp = $6;
        $6={nombre:temp,linea:@6.first_line,columna:@6.first_column,hijos:{}};

        $$.hijos=[$1,$2,$3,$6,$7];
    }
;


graphA :'graph' '(' STRING ',' STRING ')' ';' 
    {
        $$={nombre:'graph',linea:@1.first_line,columna:@1.first_column,hijos:{}};
 
        $$.hijos=[$3,$5];
    }
    |'graph' '(' STRING ')' ';' 
        {    
            $$={nombre:'graph',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos=[$3];
        }
    |'graph' '(' ')' ';'  
        {
            $$={nombre:'graph',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }
;

readA : 'read' '(' ID ')' ';' 
        {
            $$={nombre:'read',linea:@1.first_line,columna:@1.first_column,hijos:{}};
                
            var temp = $3;
            $3={nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};
        
            $$.hijos=[$3];
        }
    |'read' '(' ')' ';' 
        {
            $$={nombre:'read',linea:@1.first_line,columna:@1.first_column,hijos:{}};     
        }
;

read_fileA : 'read_file' '(' STRING ')'  
        {
            $$={nombre:'read_file',linea:@1.first_line,columna:@1.first_column,hijos:{}};     
            $$.hijos=[$3];
        }
    |'read_file' '(' ')'  
        {
            $$={nombre:'read_file',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }
;

write_fileA : 'write_file' '(' STRING ',' STRING ')' ';'  
    {
        $$={nombre:'write_file',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        $$.hijos=[$3,$5];
    }
    |'write_file' '(' STRING ')' ';'  
        {
            $$={nombre:'write_file',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos=[$3];
        }
    |'write_file' '(' ')' ';'  
        {
            $$={nombre:'write_file',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }
;

printA : 'print' '(' EXP ')' ';' 
    { 
        $$={nombre:'print',linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

        $$.hijos=[temp];
    }
    |'print' '(' ')' ';' 
        {
            $$={nombre:'print',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }
;

printlnA : 'println' '(' EXP ')' ';' 
    { 
        $$={nombre:'println',linea:@1.first_line,columna:@1.first_column,hijos:{}};

        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

        $$.hijos=[temp];
    }
    |'println' '(' ')' ';' 
        {
            $$={nombre:'println',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }
;

foreachA : 'for' '(' parametro_formal ':' EXP ')' '{' bloque_metodo '}' 
    {
        $$={nombre:'foreach',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
        $$.hijos=[$3,$5,$8];
    }
    |'for' '(' parametro_formal ':' EXP ')' '{' '}' 
        {
            $$={nombre:'foreach',linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$5]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[$3,temp,aux];
        }
;

forA : 'for' '(' for_inici EXP ';' ID '=' EXP ')' '{' bloque_metodo '}' 
    {
        $$={nombre:'for',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
        var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[$4]};

        var temp1 = {nombre:'EXP',linea:'',columna:'',hijos:[$8]};
        var aux = {nombre:'sentencias',linea:'',columna:'',hijos:[$11]};

        $$.hijos=[$3,temp2,$6,temp1,aux];
    }
    |'for' '(' for_inici EXP ';' ID '=' EXP ')' '{' '}' 
        {
            $$={nombre:'for',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[$4]};
            var temp1 = {nombre:'EXP',linea:'',columna:'',hijos:[$8]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[$3,temp2,$6,temp1,aux];
        }
;

for_inici : declaracion_variable_local {$$=$1;}
    |inicializacion_variable_local {$$=$1;}
;

dowhile : 'do' '{' bloque_metodo '}' 'while' '(' EXP ')' ';' 
    {
        $$={nombre:'do while',linea:@1.first_line,columna:@1.first_line,hijos:{}};
        
        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$7]};

        $$.hijos=[$3,temp];
    }
    |'do' '{' '}' 'while' '(' EXP ')' ';' 
        {
            $$={nombre:'do while',linea:@1.first_line,columna:@1.first_line,hijos:{}};
        
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$6]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[aux, temp];
        }
;

whileA : 'while' '(' EXP ')' '{' bloque_metodo '}' 
    {
        $$={nombre:'while',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

        $$.hijos=[temp,$6];
    }
    |'while' '(' EXP ')' '{' '}' 
        {
            $$={nombre:'while',linea:@1.first_line,columna:@1.first_column,hijos:{}};
           
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[temp,aux];
        }
;

throwA : 'throw' EXP ";"
;

switchA: 'switch' '(' EXP ')' '{' lista_switch '}' 
    {
        $$={nombre:'switch',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

        $$.hijos=[temp,$6];
    }
    |'switch' '(' EXP ')' '{' '}' 
        {
            $$={nombre:'switch',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[temp,aux];
        }
;


lista_switch : lista_switch caso_switch {$$={}; $1.hijos.push($2); $$=$1;}
    |caso_switch 
    {
        $$={nombre:'casos',linea:'',columna:'',hijos:[$1]};
    }
;

caso_switch : 'case' EXP ':' '{' '}' 
        {
            $$={nombre:'case',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[temp,aux];
        }
    |'default' ':'  '{' '}' 
        {   
            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};
         
            $$={nombre:'default',linea:@1.first_line,columna:@1.first_column,hijos:[aux]}; 
        }

    |'case' EXP ':' '{' bloque_metodo '}' 
        {
            $$={nombre:'case',linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

            $$.hijos=[temp,$5];
        }
    |'default' ':'  '{' bloque_metodo '}' 
        {
            $$={nombre:'default',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos=[$4];
        }

    |'case' EXP ':' 
        {
            $$={nombre:'case',linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};

            $$.hijos=[temp,aux];
        }
    |'default' ':'  
        {
            var aux = {nombre:'sentencias',linea:'',columna:'',hijos:{}};
         
            $$={nombre:'default',linea:@1.first_line,columna:@1.first_column,hijos:[aux]};
        }

    |'case' EXP ':' bloque_metodo 
        {
            $$={nombre:'case',linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

            $$.hijos=[temp,$4];
        }
    |'default' ':'  bloque_metodo 
        {
            $$={nombre:'default',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos=[$3];
        }
;

ifA : lista_if 'else' '{' bloque_metodo '}' 
    {
        $$={nombre:'ifs',linea:'',columna:'',hijos:{}};
        var temp={nombre:'else',linea:@2.first_line,columna:@2.first_column,hijos:[$4]}; 
    
        $$.hijos=[$1,temp];
    }
    |lista_if 
        {
            $$={nombre:'ifs',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1];
        }
;

lista_if : lista_if 'else' 'if' '(' EXP ')' '{' bloque_metodo '}' 
    {
        $$={}; 

        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$5]};

        var temp2={nombre:'else if',linea:@2.first_line,columna:@2.first_column,hijos:[temp,$8]}; 
        $1.hijos.push(temp2); 
        $$=$1;
    }
    |'if' '(' EXP ')' '{' bloque_metodo '}' 
        {
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

            $$ = {nombre:'if',linea:@1.first_line,columna:@1.first_column,hijos:[temp,$6]};  
        }
;

returnA : 'return' ';' 
    {
        $$ = {nombre:'return',linea:@1.first_line,columna:@1.first_column,hijos:{}};
    }
    |'return' EXP ';' 
        {
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

            $$ = {nombre:'return',linea:@1.first_line,columna:@1.first_column,hijos:[temp]};
        }
;

breakA : 'break' ';'  
    {
        $$ = {nombre:'break',linea:@1.first_line,columna:@1.first_column,hijos:{}};
    }
;

continueAN : 'continue' ';'  
    {
        $$ = {nombre:'continue',linea:@1.first_line,columna:@1.first_column,hijos:{}};
    }
;

inicializacion_variable_local : ID '=' 'new' tipo '(' ')' ';' 
    {
        $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
        var temp6 = {nombre:'inicializador variable',linea:'',columna:'',hijos:[]};
        var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[]};
        
    
        var temp ={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
        temp6.hijos=[$4,temp2];
        $$.hijos=[temp,temp6];
    }
    |ID '=' 'new' tipo '(' EXP ')' ';' 
    {
        $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
        var temp1 = {nombre:"inicializador variable",linea:'',columna:'',hijos:[]};
        var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[]};
        temp2.hijos = [$6];

        var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
        temp1.hijos=[$4,temp2];
        $$.hijos=[temp,temp1];
    }
    |ID '=' EXP ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            
            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[]};
    
            var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
            $$.hijos=[temp,temp2];
        }
    |ID '++' ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            
            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[]};
    

            var temp1 = {nombre:'++post',linea:'',columna:'',hijos:[]};
            var temp2 = {nombre:'EXP',linea:'',columna:'',hijos:[temp1]};

            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
            $$.hijos=[temp,temp2];
        }
;

declaracion_variable_local : tipo ID ';' 
    {
        $$ = {nombre:'variable clase',linea:'',columna:'',hijos:{}};   
        cero = {nombre:'0',linea:'',columna:'',hijos:[]};   

        var temp5 = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[cero]};
    
        var temp4 = {nombre:'modificadores',linea:'',columna:'',hijos:{}};   
        var temp3 = {nombre:'variables',linea:'',columna:'',hijos:[temp5]};
           
        $$.hijos=[temp4,$1,temp3];
    }
    |tipo ID '=' 'new' tipo '(' ')' ';' 
    {
        $$ = {nombre:'variable clase',linea:'',columna:'',hijos:{}};
    
        var temp4 = {nombre:'modificadores',linea:'',columna:'',hijos:{}};   
        var temp5 = {nombre:'variables',linea:'',columna:'',hijos:[]};
        var temp6 = {nombre:'inicializador variable',linea:'',columna:'',hijos:[]};

        var temp7 = {nombre:'inicializando variable',linea:'',columna:'',hijos:[]};
        var temp8 = {nombre:'',linea:'',columna:'',hijos:[]};
        
        var cero = {nombre:0,linea:'',columna:'',hijos:[]};
        var idc = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        var temp3 = {nombre:'EXP',linea:'',columna:'',hijos:[temp8]};
        
        idc.hijos=[cero];
        temp5.hijos=[temp7];
        temp7.hijos=[idc,temp6];
        temp6.hijos=[$5,temp3];

        $$.hijos=[temp4,$1,temp5];
    }
    |tipo ID '=' 'new' tipo '(' EXP ')' ';' 
    {
        $$ = {nombre:'variable clase',linea:'',columna:'',hijos:{}};
       var temp3 = {nombre:'EXP',linea:'',columna:'',hijos:[$7]};
         
        var temp4 = {nombre:'modificadores',linea:'',columna:'',hijos:{}};   
        var temp5 = {nombre:'variables',linea:'',columna:'',hijos:[]};
        var temp6 = {nombre:'inicializador variable',linea:'',columna:'',hijos:[]};

        var temp7 = {nombre:'inicializando variable',linea:'',columna:'',hijos:[]};
        
       var cero = {nombre:0,linea:'',columna:'',hijos:[]};
            var idc = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[cero]};
     
        temp5.hijos=[temp7];
        temp7.hijos=[idc,temp6];

        temp6.hijos=[$5,temp3];

        $$.hijos=[temp4,$1,temp5];
    }
    |tipo ID '=' EXP ';' 
        {
            $$ = {nombre:'variable clase',linea:'',columna:'',hijos:{}};
    
            var temp2 ={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[]};
            var temp3 = {nombre:'EXP',linea:'',columna:'',hijos:[$4]};
            
            var temp4 = {nombre:'modificadores',linea:'',columna:'',hijos:{}};   
            var temp5 = {nombre:'variables',linea:'',columna:'',hijos:[]};
            var temp6 = {nombre:'inicializando variable',linea:'',columna:'',hijos:[]};

            var cero = {nombre:0,linea:'',columna:'',hijos:[]};
            var idc = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[cero]};
     
            temp6.hijos=[idc,temp3];

            temp5.hijos=[temp6];

            $$.hijos=[temp4,$1,temp5];
        }
;

asignacion_variabe : '{' asignacion_variabe2 '}' {$$=$2;}
    |'{' datos_array '}' {$$=$2;}
;

asignacion_variabe2 : asignacion_variabe2 ',' '{' datos_array '}' {$$={}; $1.hijos.push($4); $$=$1;}
    |'{' datos_array '}'  
        {
            $$ = {nombre:'asignacion vector',linea:'',columna:'',hijos:{}};

            $$.hijos=[$2];
        }
;

excepcion : 
     'try' '{' bloque_metodo '}' 'catch' '(' parametros_formales ')' '{' bloque_metodo '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $3.nombre+=1;
            $10.nombre+=2;
            $$.hijos=[$3,$7,$10];
        }
    |'try' '{' bloque_metodo '}' 'catch' '(' parametros_formales ')' '{' '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $3.nombre+=1;
            
            var aux = {nombre:'sentencias2',linea:'',columna:'',hijos:{}};
            
            $$.hijos=[$3,$7,aux];
        }
    |'try' '{' bloque_metodo '}' 'catch' '(' ')' '{' bloque_metodo '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $3.nombre +=1;
            $9.nombre +=2;
            
            var aux = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};

            $$.hijos=[$3,aux,$9];
        }
    |'try' '{' bloque_metodo '}' 'catch' '(' ')' '{' '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $3.nombre+=1;

            var aux1 = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};
            var aux2 = {nombre:'sentencias2',linea:'',columna:'',hijos:{}};

            $$.hijos=[$3,aux1,aux2];
        }
    
    |'try' '{' '}' 'catch' '(' parametros_formales ')' '{' bloque_metodo '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $9.nombre+=2;
            
            var aux = {nombre:'sentencias1',linea:'',columna:'',hijos:{}};

            $$.hijos=[aux1,$6,$9];
        }
    |'try' '{' '}' 'catch' '(' parametros_formales ')' '{' '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var aux1 = {nombre:'sentencias1',linea:'',columna:'',hijos:{}};
            
            var aux2 = {nombre:'sentencias2',linea:'',columna:'',hijos:{}};

            $$.hijos=[aux1,$6,aux2];
        }
    |'try' '{' '}' 'catch' '(' ')' '{' bloque_metodo '}' 
        {
            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $8.nombre+=2;

            var aux1 = {nombre:'sentencias',linea:'',columna:'',hijos:{}};
            
            var aux2 = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};

            $$.hijos=[aux1,aux2,$8];
        }  
    |'try' '{' '}' 'catch' '(' ')' '{' '}' 
        {
            var aux1 = {nombre:'sentencias1',linea:'',columna:'',hijos:{}};
            
            var aux2 = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};
            
            var aux3 = {nombre:'sentencias2',linea:'',columna:'',hijos:{}};

            $$ = {nombre:'excepcion',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[aux1,aux2,aux3];
        }
;

importar : 'import' STRING ';' 
    {
        $$ = {nombre:'import',linea:'',columna:'',hijos:[$2]};
    }
;

linkedlist_declaracion : 'linkedlist' '<' tipo '>' ID ';' 
        {
            $$ = {nombre:'declaracion linkedlist',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:{}};
        
            $$.hijos=[$3,$5];
        }
    |'linkedlist' '<' ID '>' ID ';' 
        {
            $$ = {nombre:'declaracion linkedlist',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
            var temp = $3;
            $3={nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};
        
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:{}};
        
            $$.hijos=[$3,$5];
        }
    |'linkedlist' '<' tipo '>' ID '=' 'new' 'linkedlist' '<' '>' '(' ')' ';'  
        { 
            $$ = {nombre:'declaracion inicialisacion linkedlist',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:{}};
            
            $$.hijos=[$3,$5];
        }
    |'linkedlist' '<' ID '>' ID '=' 'new' 'linkedlist' '<' '>' '(' ')' ';' 
        {
            $$ = {nombre:'declaracion inicialisacion linkedlist',linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
            var temp = $5;
            $5={nombre:temp,linea:@5.first_line,columna:@5.first_column,hijos:{}};
            
            var temp = $3;
            $3={nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            
            $$.hijos=[$3,$5];
        }
;

linkedlist_instanciacion : ID '=' 'new' 'linkedlist' '<' '>' '(' ')' ';' 
    {
        $$ = {nombre:'inicialisacion linkedlist',linea:'',columna:'',hijos:{}};
        
        var temp = $1;
        $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
        
        $$.hijos=[$1];
    }
;

declaracion_array: tipo ID dimencion ';' 
    { 
        $$ = {nombre:'declaracion array',linea:'',columna:'',hijos:{}};
        
        var temp = $2;
        $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
        
        $$.hijos=[$1,$2,$3];
    }
    |tipo ID dimencion '=' 'new' tipo dimencion_declaracion ';' 
        {          
            $$ = {nombre:'declaracion array',linea:'',columna:'',hijos:{}};
            
            var temp = $2;
            $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
            
            $$.hijos=[$1,$2,$3,$6,$7];
        }
    |tipo ID dimencion '=' asignacion_array ';' 
        {    
            $$ = {nombre:'declaracion array',linea:'',columna:'',hijos:{}};
            
            var temp = $2;
            $2={nombre:temp,linea:@2.first_line,columna:@2.first_column,hijos:{}};
            
            $$.hijos=[$1,$2,$3,$5];
        }
;

asignacion_array : '{' asignacion_array2 '}' {$$=$2;}
    |'{' datos_array '}' {$$=$2;}
;

asignacion_array2 : asignacion_array2 ',' '{' datos_array '}' {$$={}; $1.contador+=1; $1.hijos.push($4); $$=$1;}
    |'{' datos_array '}'  
        {
            var cont = 1;
            $$ = {nombre:'asignacion vector',linea:'',columna:'',hijos:{},contador:cont};
            $$.hijos=[$2];
        }
;

datos_array = : datos_array ',' EXP 
        {
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$3]};

            $$={}; $1.hijos.push(temp); $$=$1;
        }
    |EXP 
        { 
            $$ = {nombre:'asignacion array',linea:'',columna:'',hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$1]};
   
            $$.hijos=[temp];
        }
;

inicialisacion_array : ID '=' 'new' tipo dimencion_declaracion ';' 
    {
        $$ = {nombre:'inicialisacion array',linea:'',columna:'',hijos:{}};   
        
        var temp = $1;
        $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
        $$.hijos=[$1,$4,$5];
    }
    |ID '=' asignacion_array ';' 
        { 
            $$ = {nombre:'inicialisacion array',linea:'',columna:'',hijos:{}};   
        
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$3];
        }
;

dimencion_declaracion : dimencion_declaracion '[' EXP ']'  {$$={}; $1.hijos.push($3); $$=$1;}
    |'[' EXP ']' 
    {
        $$ = {nombre:'dimencion aclaracion',linea:'',columna:'',hijos:{}};   

        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$2]};

        $$.hijos=[temp];
    }
;

dimencion : dimencion '[' ']' {var temp = $$; temp=temp+1; $$=temp;}
    |'[' ']' {var temp = 1; $$=temp;}
;

imbocacion_explicita_constructor : 'this' '(' parametros ')' ';' 
    {
        $$ = {nombre:'imbocacion explicita constructor',linea:'',columna:'',hijos:{}};   
     
        $1 = {nombre:'this',linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
        $$.hijos=[$1,$3];
    }
    |'this' '(' ')' ';' 
        {
            $$ = {nombre:'imbocacion explicita constructor',linea:'',columna:'',hijos:{}};   
            $1 = {nombre:'this',linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
            $$.hijos=[$1];
        }
    |'super' '(' parametros ')' ';' 
        {
            $$ = {nombre:'imbocacion explicita constructor',linea:'',columna:'',hijos:{}};   
            $1 = {nombre:'super',linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
            $$.hijos=[$1,$3];
        }
    |'super' '(' ')' ';' 
        {
            $$ = {nombre:'imbocacion explicita constructor',linea:'',columna:'',hijos:{}};   
            $1 = {nombre:'super',linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
            $$.hijos=[$1];
        }
;

parametros : parametros ',' EXP {$$={}; $1.hijos.push($3); $$=$1;}
    |EXP 
        {
            $$ = {nombre:'parametros',linea:'',columna:'',hijos:{}};   
                
            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$1]};

            $$.hijos=[temp];
        }
;

cabesa_metodo : modificadores_archivo tipo declarador_metodo  
    {
        $$ = {nombre:'cabesa metodo',linea:'',columna:'',hijos:{}};   
        
        $$.hijos=[$1,$2,$3];
    }
    |modificadores_archivo 'void' declarador_metodo  
        {   
            $$ = {nombre:'cabesa metodo',linea:'',columna:'',hijos:{}};   
            var voi = {nombre:'void',linea:'',columna:'',hijos:{}};   
    
            $$.hijos=[$1,voi,$3];
        }
;

declarador_metodo : declarador_metodo '[' ']' 
    { 
        $$ = {nombre:'vector metodo',linea:'',columna:'',hijos:{}};   
    
        $$.hijos=[$1];
    }
    |ID '(' parametros_formales ')' 
        {
            $$ = {nombre:'declarador metodo',linea:'',columna:'',hijos:{}};   
    
            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$3];
        }
    |ID '(' ')' 
        {
            $$ = {nombre:'declarador metodo',linea:'',columna:'',hijos:{}};   

            var temp = $1;
            $1={nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            var aux ={nombre:'parametros formales',linea:0,columna:0,hijos:{}};

            $$.hijos=[$1,aux];
        }
;

parametros_formales : parametros_formales ',' parametro_formal 
    {
        $$={}; $1.hijos.push($3); $$=$1;
    }
    |parametro_formal 
        {
            $$ = {nombre:'parametros formales',linea:'',columna:'',hijos:{}};   
            $$.hijos=[$1];
        }
;

parametro_formal : 'final' tipo declaracion_variable_id 
    { 
        
        var aux = {nombre:$3.cantidad-1,linea:'',columna:'',hijos:{}};
        $2.hijos = [aux];

        $$ = {nombre:'parametro formales',linea:'',columna:'',hijos:{}};   
        $1 = {nombre:'final',linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
        $$.hijos=[$1,$2,$3];
    }
    |tipo declaracion_variable_id 
        {
            var aux = {nombre:$2.cantidad-1,linea:'',columna:'',hijos:{}};
            $1.hijos = [aux];

            $$ = {nombre:'parametro formales',linea:'',columna:'',hijos:{}};   
        
            $$.hijos=[$1,$2];
        }
;

modificadores_metodo : modificadores_metodo modificador_metodo 
    {
        $$={}; $1.hijos.push($2); $$=$1;
    }
    |modificador_metodo 
        {
            $$ = {nombre:'modificadores',linea:'',columna:'',hijos:{}};   
        
            $$.hijos=[$1];
        }
; 

modificador_metodo:'public'   {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'protected'              {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'private'                {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'abstract'               {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'static'                 {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'final'                  {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
;

result : tipo {$$=$1;}  
    |'void' {$$ = {nombre:$1,linea:'',columna:'',hijos:{}};}
;

declaracion_archivo : modificadores_archivo tipo declaracion_variables1 ';' {$$={}; $$.nombre="variable clase"; $$.hijos=[$1,$2,$3];}
    |tipo declaracion_variables1 ';' 
    {
        var aux = {nombre:'modificadores',linea:'',columna:'',hijos:{}};
        $$={}; 
        $$.nombre="variable clase"; 
        $$.hijos=[aux,$1,$2];
    }
    
;

inicialisacion_archivo : ID '=' inicializador_variable ';'
    {
        $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};   
        var temp =  {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};   
        
        $$.hijos=[temp,$3];
    }
    |inicialisacion_array
    |'++' ID ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            

            var temp3={nombre:$2,linea:'',columna:'',hijos:[0]};
    
            var temp1 = {nombre:'++pre',linea:'',columna:'',hijos:[temp3]};
            
            var temp={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
    
            $$.hijos=[temp,temp1];
        }
        |'--' ID ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            
            
            var temp3={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[0]};
    

            var temp1 = {nombre:'--pre',linea:'',columna:'',hijos:[temp3]};

            var temp={nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[]};
    
            $$.hijos=[temp,temp1];
        }    
        | ID'++' ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            
            var temp3={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[0]};
    

            var temp1 = {nombre:'++pos',linea:'',columna:'',hijos:[temp3]};

            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
    
            $$.hijos=[temp,temp1];
        }
        | ID '--' ';' 
        {
            $$ = {nombre:'asignacion variable',linea:'',columna:'',hijos:{}};
            
    
            var temp3={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[0]};        
            var temp1 = {nombre:'--pos',linea:'',columna:'',hijos:[temp3]};

    
            var temp={nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[0]};
    
            $$.hijos=[temp,temp1];
        }
        |ID dimencion_declaracion '=' EXP ';'
        {
            $$ = {nombre:'asignacion vector',linea:'',columna:'',hijos:{}};   
            var temp =  {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};   
            
            $$.hijos=[temp,$2,$4];
        }
;

modificadores_archivo : modificadores_archivo modificador_archivo {$$={}; $1.hijos.push($2); $$=$1;}
    |modificador_archivo {$$={}; $$.nombre="modificadores"; $$.hijos=[$1];}
;

modificador_archivo:'public' {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'protected'             {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'private'               {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'abstract'              {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'static'                {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |'final'                 {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
;

declaracion_variables : declaracion_variable_id '=' inicializador_variable 
    {
        var aux = {nombre:$1.cantidad-1,linea:'',columna:'',hijos:{}};
        $1.hijos = [aux];

        $$ = {nombre:'inicializando variable',linea:'',columna:'',hijos:{}};
        $$.hijos=[$1,$3];
    }
    |declaracion_variable_id '=' inicializador_vector 
    {
        var aux = {nombre:$1.cantidad-1,linea:'',columna:'',hijos:{}};
        $1.hijos = [aux];

        $$ = {nombre:'inicializando vector',linea:'',columna:'',hijos:{}};
        $$.hijos=[$1,$3];
    }
    |declaracion_variable_id 
        {
            var aux = {nombre:$1.cantidad-1,linea:'',columna:'',hijos:{}};
            $1.hijos = [aux]; 
            $$=$1;
        }
;

declaracion_variables1 : declaracion_variables1 ',' declaracion_variables {$$={}; $1.hijos.push($3); $$=$1;}
    |declaracion_variables 
        { 
            $$ = {nombre:'variables',linea:'',columna:'',hijos:{}};
            $$.hijos=[$1];
        }

;

inicializador_vector : 'new' tipo dimencion_declaracion 
        {
            $$ = {nombre:'inicializador vector',linea:'',columna:'',hijos:{}};

            $$.hijos=[$2,$3];
        }
    |asignacion_array {$$=$1;}
;


inicializador_variable : EXP 
    {        
        var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$1]};
        $$=temp;
    }
    |'new' tipo '(' ')' 
        {
            $$ = {nombre:'inicializador variable',linea:'',columna:'',hijos:{}};

            var tem2 = {nombre:'',linea:'',columna:'',hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[tem2]};

            $$.hijos=[$2,temp];
        }
    |'new' tipo '(' EXP ')' 
        {
            $$ = {nombre:'inicializador variable',linea:'',columna:'',hijos:{}};

            var temp = {nombre:'EXP',linea:'',columna:'',hijos:[$4]};

            $$.hijos=[$2,temp];
        }
;

declaracion_variable_id : declaracion_variable_id '[' ']' {$$.cantidad+=1;}
    |ID 
        {
            var cant=1; 
            $$ = {nombre:$1,linea:'',columna:'',hijos:{},cantidad:cant};
        }
;

tipo: int     {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |double   {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |char     {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |boolean  {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
    |String   {$$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};}
;

EXP
    :
    | ID 
        {
            $$ = {nombre:'id',linea:0,columna:0,hijos:{}};
            var temp = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [temp];
        }
    | ID '.' EXP 
        {
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]};
            $$.nombre = "objeto id"; 
            $$.hijos=[$1,$3];
        }
    | 'this' '.' EXP 
        {
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]};
            $$.nombre = "objeto id"; 
            $$.hijos=[$1,$3];
        }
    | ID '(' parametros ')' '.' EXP 
        {
            $$ = {nombre:'.',linea:'',columna:'',hijos:{}};
            
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $3 = {nombre:$3,linea:'',columna:'',hijos:{}};
            
            var aux = {nombre:'funcion exp',linea:@5.first_line,columna:@5.first_column,hijos:[$1,$3]};
            
            $$.hijos=[aux,$6];
        }
    | ID '(' ')' '.' EXP 
        {
            $$ = {nombre:'.',linea:'',columna:'',hijos:{}};
            
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            var aux = {nombre:'funcion exp',linea:@5.first_line,columna:@5.first_column,hijos:[$1]};
            
            $$.hijos=[aux,$5];
        }
    | ID '(' parametros ')' 
        {
            $$ = {nombre:'funcion',linea:'',columna:'',hijos:{}};
            
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$3];
        }
    | ID '(' ')'  
        {
            $$ = {nombre:'funcion',linea:'',columna:'',hijos:{}};
            
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1];
        }
    | 'super' '.' EXP 
        {
            $$ = {nombre:'super exp',linea:'',columna:'',hijos:{}};
            $1 = {nombre:'super',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$3];
        }
    | ID dimencion_declaracion 
        {
            $$ = {nombre:'vector',linea:'',columna:'',hijos:{}};
            
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            
            $$.hijos=[$1,$2];
        }
    | ID dimencion_declaracion '.' EXP 
        {
            $$ = {nombre:'.',linea:'',columna:'',hijos:{}};


            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};
                         
            var aux = {nombre:'vector exp',linea:'',columna:'',hijos:[$1,$2]};
  
            $$.hijos=[aux,$4];
        }
  
    | EXP '<' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '>' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '<=' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '>=' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '%' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '!=' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '&&' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '||' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | EXP '==' EXP
        { 
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3]}; 
        }
    | '!' EXP 
        {
            $$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:[$2]};
        }
    | EXP '?' EXP ':' EXP
        {
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:[$1,$3,$5]};
        }
    | 'true'
        {
            $$ = {nombre:'booleano',linea:0,columna:0,hijos:{}};
            var temp = {nombre:'1',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [temp];
        }
    | 'false'
        {
            $$ = {nombre:'booleano',linea:0,columna:0,hijos:{}};
            var temp = {nombre:'0',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [temp];
        }
    | 'null'
        {
            $$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
        }

    | EXP '--'
        {
            $$ = {nombre:"decremento",linea:'',columna:'',hijos:{}};
            $2 = {nombre:'--',linea:@2.first_line,columna:@2.first_column,hijos:{}};
            $$.hijos = [$1,$2];
        }
    | EXP '++' 
        {
            $$ = {nombre:"incremento",linea:'',columna:'',hijos:{}};
            $2 = {nombre:'++',linea:@2.first_line,columna:@2.first_column,hijos:{}};
            $$.hijos = [$1,$2];
        }
    | '--' EXP
        {
            $$ = {nombre:"decremento",linea:'',columna:'',hijos:{}};
            $1 = {nombre:'--',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$2];
        }
    | '++' EXP 
        {
            $$ = {nombre:"incremento",linea:'',columna:'',hijos:{}};
            $1 = {nombre:'++',linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$2];
        }
    | '(' 'int' ')' EXP
        {
            $$ = {nombre:"implicita",linea:'',columna:'',hijos:{}};
            $2 = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
            $$.hijos = [$2,$4];
        }
    | '(' 'char' ')' EXP
        {
            $$ = {nombre:"implicita",linea:'',columna:'',hijos:{}};
            $2 = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
            $$.hijos = [$2,$4];
        }
    | '(' 'double' ')' EXP
        {
            $$ = {nombre:"implicita",linea:'',columna:'',hijos:{}};
            $2 = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
            $$.hijos = [$2,$4];
        }

    | 'str' '(' EXP ')'
        {
            $$ = {nombre:"explicita",linea:'',columna:'',hijos:{}};
            $1 = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$3];
        }
    | 'toDouble' '(' EXP ')'
        {
            $$ = {nombre:"explicita",linea:'',columna:'',hijos:{}};
            $1 = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$3];
        }
    | 'toInt' '(' EXP ')'
        {
            $$ = {nombre:"explicita",linea:'',columna:'',hijos:{}};
            $1 = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$3];
        }
    | 'toChar' '(' EXP ')'
        {
            $$ = {nombre:"explicita",linea:'',columna:'',hijos:{}};
            $1 = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$1,$3];
        }
    
    | 'pow' '(' EXP ',' EXP ')' 
        {
            $$ = {nombre:$1,linea:@1.first_line,columna:@1.first_column,hijos:{}};
            $$.hijos = [$3,$5];
        }

    | ID 'instanceof' ID
        {
            $$ = {nombre:$2,linea:@2.first_line,columna:@2.first_column,hijos:{}};
             
            var temp = $1;
            $1 = {nombre:temp,linea:@1.first_line,columna:@1.first_column,hijos:{}};

            var temp = $3;
            $3 = {nombre:temp,linea:@3.first_line,columna:@3.first_column,hijos:{}};
            
            $$.hijos = [$1,$3];
        } 

    | EXP '.equals' '(' EXP ')'
        {
            $$ = {nombre:'equals',linea:@2.first_line,columna:@2.first_column,hijos:{}};
            
            $$.hijos = [$1,$4];
        }
;