
/*-----------------------------------------------------------------------------
 * controller section
 *----------------------------------------------------------------------------*/

var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/public'));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.redirect(301,'/speedDating/RegistrarCazador');
});

app.get('/speedDating/RegistrarCazador', function(request, response) {
    response.send( html_page(RegistrarCazador()) );
});

app.get('/speedDating/RegistrarProveedor', function(request, response) {
    response.send( html_page(RegistrarProveedor()) );
});

app.get('/speedDating/EvaluacionExperiencia', function(request, response) {
    response.send( html_page(EvaluacionExperiencia()) );
});

app.get('/speedDating/AnunciarProyecto', function(request, response) {
    response.send( html_page(AnunciarProyecto()) );
});

app.get('/speedDating/SpeedDating', function(request, response) {
    response.send( html_page(speedDating()) );
});

app.get('/speedDating/HistorialGiros', function(request, response) {
    response.send( html_page(HistorialGiros()) );
});

app.get('/speedDating/HistorialReputacion', function(request, response) {
    response.send( html_page(HistorialReputacion()) );
});

app.route('/speedDating/update')

   .put(function(request, response) {
        response.send( update(request) );
    });

app.route('/speedDating/Enviarproyecto')

   .put(function(request, response) {
        response.send( updateProyecto(request) );
    });


app.listen(8080, function() { console.log("Running Express"); });

/*-----------------------------------------------------------------------------
 * model section
 *----------------------------------------------------------------------------*/

var PROYECTO = (function(n, d, nu, c) {
    PROYECTO.counter = (PROYECTO.counter || 1);
    var id = PROYECTO.counter;
    
    var Nombre;
    var descripcion;
    var numero_tarjeta;
    var codigo;
    
    function initialize(n, d, nu, c) {
        Nombre = n;
        descripcion = d;
        numero_tarjeta = nu;
        codigo = c;

        if(isNaN(codigo)) { throw "codigo invalido"; }
        if(isNaN(numero_tarjeta)) { throw "Numero de tarjeta invalido!"; }
        if(!Nombre || Nombre.length === 0) { throw "Nombre invalido!"; }
    }
    
    initialize(n, d, nu, c);
    PROYECTO.counter ++; // s??lo se incrementa si la inicializaci??n tiene ??xito
    
    return {
        getId: function() { return id; },
        getNombre: function() { return Nombre; },
        getDescripcion: function() { return descripcion; },
        getNumeroTarjeta: function() { return numero_tarjeta; },
        getNumeroCodigo: function() { return codigo; }
    }
});

var USUARIO = (function(){
    var cazadores = [];
    var talentos = [];
    var proyectos = [];

    return{
        getCazadores: function() { return cazadores; },
        addCazadores: function(a) { cazadores.push(a); return a;},
        getTalentos: function() { return talentos; },
        addTalentos: function(a) { talentos.push(a); return a},
        getProyectos: function() { return proyectos;},
        addProyectos: function(a) { proyectos.push(a); return a },
    }
})();

var CAZADOR= (function(n, c, con, e, d) {
    CAZADOR.counter = (CAZADOR.counter || 1);
    var id = CAZADOR.counter;
    
    var nombre;
    var correo;
    var contrase??a;
    var empresa;
    var direccion;
    var reputacion;
    var avgReputacion;
    
    function initialize(n, c, con, e, d) {
        nombre = n;
        correo = c;
        contrase??a = con;
        empresa = e;
        direccion = d;
        reputacion = 0;
        avgReputacion = 0;

        if(!contrase??a || contrase??a.length === 0) { throw "Contrase??a invalida!"; }
        if(!nombre || nombre.length === 0) { throw "Nombre invalido!"; }
    }
    
    initialize(n, c, con, e, d);
    CAZADOR.counter ++; // s??lo se incrementa si la inicializaci??n tiene ??xito
    
    return {
        getId: function() { return id; },
        getNombre: function() { return nombre; },
        getCorreo: function() { return correo; },
        getContrase??a: function() { return contrase??a},
        getEmpresa: function() { return empresa; },
        getDireccion: function() { return direccion; },
        getAvgReputaci??n: function() {return avgReputacion; },
        setReputacion: function(b) { reputacion = reputacion + b; 
                                     avgReputacion = (reputacion / 5); }
    }
});

var TALENTO= (function(n, c, con, a, c, dis, dir, cos) {
    TALENTO.counter = (TALENTO.counter || 1);
    var id = TALENTO.counter;
    
    var nombre;
    var correo;
    var contrase??a;
    var actividad_Profesional;
    var capacidades;
    var disponibilidad;
    var direccion;
    var costo;
    var reputacion;
    var avgReputacion;

    function initialize(n, c, con, a, c, dis, dir, cos) {
        nombre = n;
        correo = c;
        contrase??a = con;
        actividad_Profesional = a;
        capacidades = c;
        disponibilidad  = dis;
        direccion = dir;
        costo = cos;
        reputacion = 0;
        avgReputacion = 0;
        if(isNaN(costo)) { throw "costo invalido"; }
        if(!contrase??a || contrase??a.length === 0) { throw "Contrase??a invalida!"; }
        if(!nombre || nombre.length === 0) { throw "Nombre invalido!"; }
    }

    initialize(n, c, con, a, c, dis, dir, cos);
    TALENTO.counter ++; // s??lo se incrementa si la inicializaci??n tiene ??xito

    return {
        getId: function() { return id; },
        getNombre: function() { return nombre; },
        getCorreo: function() { return correo; },
        getContrase??a: function() { return contrase??a},
        getActividadprofesional: function() { return actividad_Profesional; },
        getCapacidades: function() { return capacidades; },
        getDisponibilidad: function() { return disponibilidad; },
        getDireccion: function() { return direccion; },
        getCosto: function() { return costo;},
        getAvgReputaci??n: function() {return avgReputacion; },
        setReputacion: function(b) { reputacion = reputacion + b; 
                                     avgReputacion = (reputacion / 5); }
    }
});

var CONTRATO= (function(c, p , t) {
    CONTRATO.counter = (CONTRATO.counter || 1);
    var id = CONTRATO.counter;
    
    var cazador;
    var proyecto;
    var talento;

    
    function initialize(c, p , t) {
        cazador = c;
        proyecto = p;
        talento = t;
        
    }
    
    initialize(n, c, con, a, c, dis, dir, cos);
    CONTRATO.counter ++; // s??lo se incrementa si la inicializaci??n tiene ??xito
    
    return {
        getId: function() { return id; },
        getCazador: function() { return cazador;},
        getProyecto: function() {return proyecto;},
        getTalento: function() {return talento;}
    }
});


/*-----------------------------------------------------------------------------
 * view section
 *----------------------------------------------------------------------------*/

function html_page( content )
{
    var HTML_expr = "<!DOCTYPE html><html><head>";
    
    HTML_expr += "<meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'/>";
    HTML_expr += "<meta http-equiv='Content-Language' content='en-us'/>";
    HTML_expr += "<title>Cazador de Talentos</title>";
    HTML_expr += "<link type='text/css' rel='stylesheet' href='/library.css'>";
    HTML_expr += "<script src='/library.js'></script>";
    HTML_expr += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>";
    HTML_expr += "</head><body id='library' onLoad='registerEvents()'>";
    HTML_expr += "<div id='container'><div id='header'><h1>Cazador de Talentos</h1>";
    HTML_expr += "</div><div id='content'>";
    HTML_expr += content + "</div><div id='sidebar'></div></div></body></html>";
    
    return HTML_expr;
}

function RegistrarCazador()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";
    
    
    HTML_expr += "<div id='list'>" + listCazadores();
    HTML_expr += "</div><br/><h1>Registrarse como Cazador de Talentos</h1>";

    HTML_expr += "<form id='Cazador'><p><label for='Nombre'>Nombre Completo</label>:";
    HTML_expr += "<input type='text' name='book[Nombre]' id='Nombre'/></p>";

    HTML_expr += "<p><label for='receiver-email'>Correo electr??nico</label>:";
    HTML_expr += "<input type='email' name='book[receiver-email]' id='receiver-email'/></p>";

    HTML_expr += "<p><label for='Contrasena'>Contrase??a</label>:";
    HTML_expr += "<input type='password' name='book[contrasena]' id='contrasena'/></p>";

    HTML_expr += "<p><label for='Empresa'>Empresa</label>:";
    HTML_expr += "<input type='text' name='book[Empresa]' id='Empresa'/></p>";

    HTML_expr += "<p><label for='Direccion'>Direccion</label>:";
    HTML_expr += "<input type='text' name='book[Direccion]' id='Direccion'/></p>";

    HTML_expr += "<input type='button' value='Clear'/>";
    HTML_expr += "<input type='submit' value='Enviar'/></form>";
    
    return HTML_expr;
}

function RegistrarProveedor()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";
    
    HTML_expr += "<div id='list'>" + listProyectos();
    HTML_expr += "</div><br/><h1>Registro de Proveedor de Talentos</h1>";

    HTML_expr += "<form id='Talento'><p><label for='Nombre'>Nombre Completo</label>:";
    HTML_expr += "<input type='text' name='book[title]' id='Nombre'/></p>";

    HTML_expr += "<p><label for='receiver-email'>Correo electr??nico</label>:";
    HTML_expr += "<input type='email' name='book[price]' id='receiver-email'/></p>";

    HTML_expr += "<p><label for='Contrasena'>Contrase??a</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='contrasena'/></p>";

    HTML_expr += "<p><label for='Actividad'>Actividad Profesional</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='Actividad'/></p>";

    HTML_expr += "<p><label for='Capacidades'>Capacidades</label><br/>";
    HTML_expr += "<textarea name='book[description]' id='Capacidades'></textarea></p>";
    
    HTML_expr += "<label for='Disponibilidad'>Disponibilidad</label><br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='1'>Lunes<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='2'>Martes<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='3'>Miercoles<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='4'>Jueves<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='5'>Viernes<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='6'>Sabado<br>";
    HTML_expr += "<input type='checkbox' name='Disponibilidad' value='7'>Domingo<br>";

    HTML_expr += "<p><label for='Direccion'>Direccion</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='Direccion'/></p>";

    HTML_expr += "<p><label for='Costo'>Costo por servicios / hora</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='Costo'/></p>";

    HTML_expr += "<input type='button' value='Clear'/>";
    HTML_expr += "<input type='submit' value='Enviar'/></form>";
    
    return HTML_expr;
}

function AnunciarProyecto()
{
    
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";
    //Se ponen los proyectos registrados.
    HTML_expr += "<div id='list'>" + listProyectos();
    HTML_expr += "</div><br/><h1>Anunciar Proyecto</h1>";

    HTML_expr += "<form id='Proyecto'><p><label for='Nombre'>Nombre del Proyecto</label>:";
    HTML_expr += "<input type='text' name='book[Nombre]' id='Nombre'/></p>";

    HTML_expr += "<p><label for='Descripcion'>Descripcion del proyecto</label><br/>";
    HTML_expr += "<textarea name='book[Descripcion]' id='Descripcion'></textarea></p>";

    HTML_expr += "<p><label for='Tarjeta'>Numero de tarjeta</label>:";
    HTML_expr += "<input type='text' name='book[Tarjeta]' id='Tarjeta'/></p>";

    HTML_expr += "<p><label for='Codigo'>Codigo de seguridad</label>:";
    HTML_expr += "<input type='text' name='book[Codigo]' id='Codigo'/></p>";

    HTML_expr += "<input type='button' value='Clear'/>";
    HTML_expr += "<input type='submit' value='Enviar'/></form>";
    
    return HTML_expr;
}

function EvaluacionExperiencia()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";
    
    HTML_expr += "<br/><h1>Evaluaci??n de experiencia</h1>";

    HTML_expr += "<form><p><label for='experiencia'>??Cu??l fue tu experiencia? (Del 1 al 5)</label>:";
    HTML_expr += "<input type='text' name='book[title]' id='experiencia' style='width : 2cm'/></p>";

    HTML_expr += "<input type='button' value='Clear'/>";
    HTML_expr += "<input type='submit' value='Enviar'/></form>";
    
    return HTML_expr;
}

function HistorialReputacion()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";

    HTML_expr += "<br/><h1>Historial</h1>";
    HTML_expr += "<li><a href='/speedDating/HistorialGiros'>Historial de giros</a></li> <li><a href='/speedDating/HistorialReputacion'>Reputaci??n en el tiempo</a></li>";
    HTML_expr += "<h3>Promedios de reputaci??n al mes:</h3>";
    HTML_expr += "<ul><li>Enero: 2.8</li>";
    HTML_expr += "<li>Febrero: 3.4</li>";
    HTML_expr += "<li>Marzo: 4.1</li>";
    HTML_expr += "<li>Abril: 3.6</li>"
    HTML_expr += "<li>Mayo:  3.3</li>";
    HTML_expr += "<li>Junio: 3.4</li>";
    HTML_expr += "<li>Julio: 3.0</li>";
    HTML_expr += "<li>Agosto: 2.9</li>";
    HTML_expr += "<li>Septiembre 3.8</li>";
    HTML_expr += "<li>Octubre: 3.1</li>";
    HTML_expr += "<li>Noviembre: 3.3</li>";
    HTML_expr += "<li>Diciembre:3.4</li></ul>";

    return HTML_expr;
}

function HistorialGiros()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";

    HTML_expr += "<br/><h1>Historial</h1>";
    HTML_expr += "<li><a href='/speedDating/HistorialGiros'>Historial de giros</a></li> <li><a href='/speedDating/HistorialReputacion'>Reputaci??n en el tiempo</a></li>";
    HTML_expr += "<p>Manuel Dom??nguez -  Especialista en Marketing Digital <br> Contacto: manuel@hootmail.com</p>";
    HTML_expr += "<p>Benito P??rez-  Creador de Videojuegos <br> Contacto: benito@hootmail.com</p>";
    HTML_expr += "<p>Santiago Velazco -  Desarrollador de p??ginas Web  <br> Contacto: santiago@hootmail.com</p>";
    
    return HTML_expr;
}

function speedDating()
{
    var HTML_expr = "<ul id='subjects'>";
    
    HTML_expr += "<li><a href='/speedDating/RegistrarCazador'>Registrar Cazador</a></li>";
    HTML_expr += "<li><a href='/speedDating/RegistrarProveedor'>Registrar Proveedor</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Historial</a></li>";
    HTML_expr += "<li><a href='/speedDating/AnunciarProyecto'>Anunciar Proyecto</a></li>";
    HTML_expr += "<li><a href='/speedDating/SpeedDating'>Speed Dating</a></li></ul>";

    HTML_expr += "<br/><h1>Speed Dating</h1>";
    HTML_expr += "<p>Manuel Dom??nguez -  Especialista en Marketing Digital  <a href='/speedDating/EvaluacionExperiencia'>Ingresar Reuni??n</a></li><br> Contacto: manuel@hootmail.com</p>";
    HTML_expr += "<p>Benito P??rez-  Creador de Videojuegos  <a href='/speedDating/EvaluacionExperiencia'>Ingresar Reuni??n</a></li><br> Contacto: benito@hootmail.com</p>";
    HTML_expr += "<p>Santiago Velazco -  Desarrollador de p??ginas Web  <a href='/speedDating/EvaluacionExperiencia'>Ingresar Reuni??n</a></li><br> Contacto: santiago@hootmail.com</p>";

    
    return HTML_expr;
}

function listCazadores()
{
    var HTML_expr = "<ul id='books'>";
    var cazadores = USUARIO.getCazadores();
    
    for(var i=0; i < cazadores.length; i++) {
        HTML_expr += listCazador(cazadores[i]);
    }
    return HTML_expr + "</ul>";
}


function listProyectos()
{
    var HTML_expr = "<ul id='books'>";
    var proyectos = USUARIO.getProyectos();
    
    for(var i=0; i < proyectos.length; i++) {
        HTML_expr += listProyecto(proyectos[i]);
    }
    return HTML_expr + "</ul>";
}

function listCazador( b )
{
    var HTML_expr = "<li>" + b.getId() + "'>" + b.getNombre() + "</li>";
    
    return HTML_expr;
}

function listProyecto( b )
{
    var HTML_expr = "<li>" + b.getId() + "'>" + b.getNombre() + "</li>";
    
    return HTML_expr;
}


function update( request )
{
    var n = request.body.book.Nombre;
    var c = request.body.book.correo;
    var con = request.body.book.contrasena;
    var e = request.body.book.Empresa;
    var d = request.body.book.Direccion;
    
    if( request.query.id === "undefined" ) {
       return USUARIO.addCazadores(CAZADOR(n, c, con, e, d));
        
    }
}

function updateProyecto( request )
{
    var n = request.body.proyecto.Nombre;
    var d = request.body.proyecto.descripcion;
    var nu = request.body.proyecto.numero_tarjeta;
    var c = request.body.proyecto.codigo;
    
    if( request.query.id === "undefined" ) {
       return USUARIO.addProyectos(PROYECTO(n, d, nu, c));
        
    }
}
