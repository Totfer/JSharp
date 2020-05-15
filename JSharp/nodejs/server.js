var http = require('http');
var fs = require('fs'); 
var path = require('path'); 
var express = require('express');
var Compilar = require('./recorrido/recorridoAST.js');
var Nodo3d   =  require('./Arbol/nodo');

var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}));

var codigo3d = '';
var tablas;
var opt;
var dotc3d
const router = new express.Router();
var retorno = '';

app.get('/',function (rec,res) {
    res.sendFile((path.join(__dirname + '/html/index.html')));
});

app.get('/codemirror/lib/codemirror.css',function (rec,res) {
    res.sendFile((path.join(__dirname + '/codemirror/lib/codemirror.css')));
});

app.get('/codemirror/lib/codemirror.js',function (rec,res) {
    res.sendFile((path.join(__dirname + '/codemirror/lib/codemirror.js')));
});
app.get('/codemirror/mode/javascript/javascript.js',function (rec,res) {
    res.sendFile((path.join(__dirname + '/codemirror/mode/javascript/javascript.js')));
});

app.get('/codemirror/theme/neo.css',function (rec,res) {
    res.sendFile((path.join(__dirname + '/codemirror/theme/neo.css')));
});

app.get('/codemirror/mode/css/css.js',function (rec,res) {
    res.sendFile((path.join(__dirname + '/codemirror/mode/css/css.js')));
});

app.get('/ast', function(req, res) {
    var string = '<html><body>$$arbol</body></html>';
    Compilar.grafoHtml(function(result){
        res.send(string.replace('$$arbol',result));
    },codigo);
});

app.get('/grafoc3d', function(req, res) {
    var string = '<html><body>$$arbol</body></html>';
    Compilar.grafoHtmlC3D(function(result){
        res.send(string.replace('$$arbol',result));
    },dotc3d);
});


app.get('/optimisaciones', function(req, res) {
    var string = '<html><body>$$arbol</body></html>';
    res.send(opt);
});

app.get('/errores', function(req, res) {
    var string = '<html><body>$$arbol</body></html>';
    res.send(tablas.errores);
});

app.get('/simbolos', function(req, res) {
    var string = '<html><body>$$arbol</body></html>';
    res.send(tablas.tablaSimbolos);
});



app.get('/abrir', function(req, res) {
    var texto = req.param.txt;
    console.log(texto);
    res.send(texto);
});


app.get('/text1', function(req, res) {
    var texto = req.query.txt;
    
	let cantidad = texto[1].split('$#@!');

	for(let i=0;i<cantidad.length;i++){
    	texto[1] = texto[1].replace('$#@!','\n');
	}
    
    tablas = Compilar.Compilar(texto[1],Nodo3d);
    codigo = texto[1];
    retorno = tablas.retorno;
    codigo3d = tablas.codigo; 
    res.send('todo bien');
});

app.post('/compilar', function(req, res) {
    var texto = req.body;

    let temp  = Compilar.compilar3D(texto.texto);
    dotc3d = temp.dotc3d
    opt = temp.optimizacion;
    retorno = temp.retorno;
    res.send(temp.retorno);
});

app.post('/compilar2', function(req, res) {
    var texto = req.body;
    
    let temp  = Compilar.compilar3D2(texto.texto);
    dotc3d = temp.dotc3d
    opt = temp.optimizacion;
    retorno = temp.retorno;
    res.send(temp.retorno);
});

app.post('/compilar3', function(req, res) {
    var texto = req.body;
    
    let temp  = Compilar.compilar3D3(texto.texto);
    dotc3d = temp.dotc3d
    opt = temp.optimizacion;
    retorno = temp.retorno;
    res.send(temp.retorno);
});


app.get('/codigo3d', function(req, res) {
    res.send(codigo3d);
});


app.post('/consola', function(req, res) {
    res.send(retorno);
});



app.get('/text2', function(req, res) {
    var texto = req.query.txt;
    
	let cantidad = texto[1].split('$#@!');

	for(let i=0;i<cantidad.length;i++){
    	texto[1] = texto[1].replace('$#@!','\n');
	}
    
    tablas = Compilar.Compilar(texto[1]);
    codigo = texto[1];
    retorno = tablas.retorno;
    codigo3d = tablas.codigo; 
    res.send(tablas.retorno);
});

app.get('/text3', function(req, res) {
    var texto = req.query.txt;
    
	let cantidad = texto[1].split('$#@!');

	for(let i=0;i<cantidad.length;i++){
    	texto[1] = texto[1].replace('$#@!','\n');
	}
    
    tablas = Compilar.Compilar(texto[1]);
    codigo = texto[1];
    retorno = tablas.retorno;
    codigo3d = tablas.codigo; 
    res.send(tablas.retorno);
});

app.get('/text4', function(req, res) {
    var texto = req.query.txt;
    
	let cantidad = texto[1].split('$#@!');

	for(let i=0;i<cantidad.length;i++){
    	texto[1] = texto[1].replace('$#@!','\n');
	}
    
    tablas = Compilar.Compilar(texto[1]);
    codigo = texto[1];
    retorno = tablas.retorno;
    codigo3d = tablas.codigo; 
    res.send(tablas.retorno);
});


app.get('/error', function(req, res) {
    res.send('error prro');
});

app.use(express.static('./html'));


app.listen(3000, function () {
    console.log('Abriendo aplicacion en el puerto 3000');
});