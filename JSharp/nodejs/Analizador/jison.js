var analizador = {};

var Parser = require("jison").Parser;
var Arbol = require("../Arbol/arbol.js");
var Nodo = require("../Arbol/nodo.js");
var Padre = require("../Arbol/nodo.js");

var padre = Padre;

analizador.analizar = function analizar(){
    var grammar = {
        "lex": {
            "rules": [
    
                ["Global",                  "return 'abstract';"],
                ["break",                     "return 'break';"],
                ["case",                      "return 'case';"],
                ["catch",                     "return 'catch';"],
                ["class",                     "return 'class';"],
                ["continue",                  "return 'continue';"],
                ["default",                   "return 'default';"],
                
    
                ["do",                       "return 'do';"],
                ["double",                   "return 'double';"],
                ["else",                     "return 'else';"],
                ["extends",                  "return 'extends';"],
                ["final",                    "return 'final';"],
                ["for",                      "return 'for';"],
                ["grap_dot",                 "return 'grap_dot';"],
                ["if",                       "return 'if';"],
                ["import",                   "return 'import';"],
                ["instanceof",               "return 'instanceof';"],
    
                ["message",               "return 'message';"],            
                ["new",                   "return 'new';"],            
                ["Object",                "return 'Object';"],            
                ["pow",                   "return 'pow';"],            
                ["println",               "return 'println';"],            
                ["private",               "return 'private';"],
               
                ["protected",                "return 'protected';"],
                ["public",                   "return 'public';"],
                ["return",                   "return 'return';"],
                ["read_console",             "return 'read_console';"],
                ["read_file",                "return 'read_file';"],
                ["static",                   "return 'static';"],
                
                ["str",                   "return 'str';"],
                ["super",                 "return 'super';"],
                ["switch",                "return 'switch';"],
                ["this",                  "return 'this';"],
                ["toChar",                "return 'toChar';"],
                ["toDouble",              "return 'toDouble';"],
                ["toInt",                 "return 'toInt';"],
                ["try",                   "return 'try';"],
                ["while",                 "return 'while';"],
                ["write_file",            "return 'write_file';"],
               
    
                ["int",                      "return 'int';"],
                ["double",                   "return 'double';"],
                ["char",                     "return 'char';"],
                ["boolean",                  "return 'boolean';"],
                ["String",                   "return 'String';"],
    
    
    
    
               //expreciones
               ["\\ +",                      "/* skip whitespace */"],
               ["\\n+",                      "/* skip whitespace */"],
               ["\\r+",                      "/* skip whitespace */"],
               ["\\t+",                      "/* skip whitespace */"],
               ["\\s+",                      "/* skip whitespace */"],
               ["[0-9]+(?:\\.[0-9]+)?\\b",   "return 'NUMBER';"],
               ["[_A-Za-zñÑ][_0-9A-Za-z]*",  "return 'ID';"],
               ["\\*",                       "return '*';"],
               ["\\/",                       "return '/';"],
               ["-",                         "return '-';"],
               ["\\+",                       "return '+';"],
               ["\\^",                       "return '^';"],
               ["\\(",                       "return '(';"],
               ["\\)",                       "return ')';"],
               ["\\{",                       "return '{';"],
               ["\\}",                       "return '}';"],
               ["\\[",                       "return '[';"],
               ["\\]",                       "return ']';"],
               ["PI\\b",                     "return 'PI';"],
               ["E\\b",                      "return 'E';"],
               ["$",                         "return 'EOF';"]
            ]
        },
    
        "operators": [
            ["left", "+", "-"],
            ["left", "*", "/"],
            ["left", "^"],
            ["left", "UMINUS"]
        ],
    
        "bnf": {
            "expressions" :[
                [ "Clase_Declaracion EOF",   ""  ]
            ],
    
            "Clase_Declaracion" :[
                ["Clase_Modificadores class ID { ID }", "var padre = require(\"./Arbol/nodo.js\"); padre.valor = 'clase'; var nodo = require(\"./Arbol/nodo.js\"); nodo.valor = $1; Arbol.insertar(padre, nodo);"+
                                                                "var nodo = require(\"./Arbol/nodo.js\"); nodo.valor = $3; Arbol.insertar(padre, nodo);"+
                                                                "return padre;"],
                ["ID extends ID { ID }", "var padre = Padre; padre.valor = 'clase'; var nodo = Nodo; nodo.valor = $1; Arbol.insertar(padre, nodo); "+
                "var nodo = Nodo; nodo.valor = $2; Arbol.insertar(padre, nodo); "+
                "var nodo = Nodo; nodo.valor = $4; Arbol.insertar(padre, nodo); return padre;"]
            ],
    
            "Clase_Modificadores" :[
                ["Clase_Modificadores Clase_Modificador","Nodo = require(\"../Arbol/nodo.js\"); nodo.valor = $2; Arbol.insertar($1, Nodo); return $1;"],
                ["Clase_Modificador","var padre = Padre; padre.valor = 'lista modificacdores'; var nodo = Nodo; nodo.valor = $1; Arbol.insertar(padre, nodo); return padre;"],
                ["","return ''"]
            ],
    
            "Clase_Modificador":[
                ["public"      ,"return 'piblic'"],
                ["protected"   ,"return 'protected'"],
                ["private"     ,"return 'private'"],
                ["abstract"    ,"return 'abstract'"],
                ["static"      ,"return 'static'"],
                ["final"       ,"return 'final'"]
            ],
            /*
            "Clase_Cuerpo":[
                ["Clase_Cuerpo Clase_Cuerpo_Dec",""],
                ["Clase_Cuerpo_Dec",""]
            ],
            
            "Clase_Cuerpo_Dec":[
                ["Declaracion_Metodo",""],
                ["Declaracion_Filed",""],
                ["Declaracion_Constructor",""],
                ["Clase_Declaracion",""],
                ["Variable_Declaraciones",""]
            ],
    
            "Declaracion_Filed": [
                ["Filed_Modificadores",""],
            ],
    
            "Filed_Modificadores": [
                ["Filed_Modificadores Filed_Modificador",""],
                ["Filed_Modificador",""],
                ["",""]
            ],
    
            "Filed_Modificador": [
                ["public",""],
                ["protected",""],
                ["private",""],
                ["abstract",""],
                ["static",""],
                ["final",""]
            ],
    
            "Variable_Declaraciones": [
                ["Variable_Declaraciones, Variable_Declaracion",""],
                ["Variable_Declaracion",""]
            ],
    
            "Variable_Declaracion": [
                ["Variable_Declaracion_Id = Variable_Inicializador",""],
                ["Variable_Declaracion_Id",""]
            ],
    
            "Variable_Declaracion_Id": [
                ["Variable_Declaracion_Id []",""]
                ["ID",""]
            ],
            
            "Variable_Inicializador":[
                ["Exp",""]
                ["Array_Inicializador",""]
            ],
    
            */
               //expreciones
            "e" :[
                  [ "e + e",   "$$ = $1 + $3;" ],
                  [ "e - e",   "$$ = $1 - $3;" ],
                  [ "e * e",   "$$ = $1 * $3;" ],
                  [ "e / e",   "$$ = $1 / $3;" ],
                  [ "e ^ e",   "$$ = Math.pow($1, $3);" ],
                  [ "- e",     "$$ = -$2;", {"prec": "UMINUS"} ],
                  [ "( e )",   "$$ = $2;" ],
                  [ "NUMBER",  "$$ = Number(yytext);" ],
                  [ "E",       "$$ = Math.E;" ],
                  [ "PI",      "$$ = Math.PI;" ]
                ]
        }
    };
    var parser = new Parser(grammar);

    // generate source, ready to be written to disk
    var parserSource = parser.generate();

    // you can also use the parser directly from memory

    var a = parser.parse("class clase { asds }");
    console.log(a);
}

module.exports = analizador;