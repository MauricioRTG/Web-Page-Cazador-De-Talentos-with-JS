
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

app.get('/books/show_subject', function(request, response) {
    response.send( html_page(showSubject(request.query.id)) );
});

app.route('/books/update')

   .get(function(request, response) {
        var id = request.query.id;
        
        response.send({ title: LIBRARY.getBook(id).getTitle(),
                        price: LIBRARY.getBook(id).getPrice(),
                        subject: LIBRARY.getSubjectIndex(LIBRARY.getBook(id).getSubject()),
                        description: LIBRARY.getBook(id).getDescription() });
    })

   .put(function(request, response) {
        response.send( update(request) );
    });

app.delete('/books/delete', function(request, response) {
    LIBRARY.remove( LIBRARY.getBook(request.query.id) );
    response.send( listBooks() );
});

app.listen(8080, function() { console.log("Running Express"); });

/*-----------------------------------------------------------------------------
 * model section
 *----------------------------------------------------------------------------*/
var LIBRARY = (function() {
    var box = {};
    var subjects = ['Physics', 'Mathematics', 'Chemistry', 'Psychology', 'Geography'];
    
    return {
        getSubjects: function() { return subjects; },
        getSubjectIndex: function( s ) { return subjects.indexOf(s); },
        getBook: function( i ) { return box[i]; },
        
        getPosition: function( id ) {
            var keys = Object.keys(box);
            
            for(var k = 0; k < keys.length; k++) {
                if(keys[k] === id) {
                   return { index: k, title: box[keys[k]].getTitle() };
                }
            }
            throw "INTERNAL ERROR: Book " + id + " does not exist!";
        },
        
        getBooks: function() {
            var list = [];
            var keys = Object.keys(box);
            
            for(var k = 0; k < keys.length; k++) {
                if(!isNaN( keys[k] )) { list.push(box[ keys[k] ]); }
            }
            return list;
        },
        
        add: function( b ) {
            if(box[b.getTitle()] === undefined) {
               box[b.getId()] = b;
               box[b.getTitle()] = b;
            } else {
               throw "This title already exists!";
            }
        },
               
        update: function( n, b ) { // si el título fue actualizado, actualiza "box"
            if(box[n] === undefined) {
               delete box[b.getTitle()];
               box[n] = b;
            }
        },
        
        remove: function( b ) {
            delete box[b.getId()];
            delete box[b.getTitle()];
        },
               
               test: function() { return box;}
    }
})();
//Para cazador, talento, proyecto, contrato
var BOOK = (function(t, p, s, d) {
    BOOK.counter = (BOOK.counter || 1);
    var id = BOOK.counter;
    
    var title;
    var price;
    var subject;
    var description;
    var created_at;
    
    function initialize(t, p, s, d) {
        title = t;
        price = parseFloat(p);
        subject = LIBRARY.getSubjects().includes(s) ? s : null;
        description = d;
        created_at = new Date();
        if(isNaN(price)) { throw "Invalid price!"; }
        if(!title || title.length === 0) { throw "Invalid title!"; }
    }
    
    initialize(t, p, s, d);
    BOOK.counter ++; // sólo se incrementa si la inicialización tiene éxito
    
    return {
        getId: function() { return id; },
        getTitle: function() { return title; },
        getPrice: function() { return price; },
        getSubject: function() { return subject; },
        getDescription: function() { return description; },
        getCreatedAt: function() { return created_at; },
        updateBook: function(t, p, s, d) { LIBRARY.update(t,this); initialize(t, p, s, d); }
    }
});

var PROYECTO = (function(n, d, nu, c) {
    PROYECTO.counter = (PROYECTO.counter || 1);
    var id = PROYECTO.counter;
    
    var nombre_proyecto;
    var descripcion;
    var numero_tarjeta;
    var codigo;
    
    function initialize(n, d, nu, c) {
        nombre_proyecto = n;
        descripcion = d;
        numero_tarjeta = nu;

        if(isNaN(codigo)) { throw "codigo invalido"; }
        if(isNaN(numero_tarjeta)) { throw "Numero de tarjeta invalido!"; }
        if(!nombre_proyecto || nombre_proyecto.length === 0) { throw "Nombre invalido!"; }
    }
    
    initialize(n, d, nu, c);
    PROYECTO.counter ++; // sólo se incrementa si la inicialización tiene éxito
    
    return {
        getId: function() { return id; },
        getNombreProyecto: function() { return title; },
        getDescripcion: function() { return description; },
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
        getProyectos: function() { return talentos;},
        addProyectos: function(a) { talentos.push(a); return a },
    }
})();

var CAZADOR= (function(n, c, con, e, d) {
    CAZADOR.counter = (CAZADOR.counter || 1);
    var id = CAZADOR.counter;
    
    var nombre;
    var correo;
    var contraseña;
    var empresa;
    var direccion;
    var reputacion;
    var avgReputacion;
    
    function initialize(n, c, con, e, d) {
        nombre = n;
        correo = c;
        contraseña = con;
        empresa = e;
        direccion = d;
        reputacion = 0;
        avgReputacion = 0;

        if(!contraseña || contraseña.length === 0) { throw "Contraseña invalida!"; }
        if(!nombre || nombre.length === 0) { throw "Nombre invalido!"; }
    }
    
    initialize(n, c, con, e, d);
    CAZADOR.counter ++; // sólo se incrementa si la inicialización tiene éxito
    
    return {
        getId: function() { return id; },
        getNombre: function() { return nombre; },
        getCorreo: function() { return correo; },
        getContraseña: function() { return contraseña},
        getEmpresa: function() { return empresa; },
        getDireccion: function() { return direccion; },
        setReputacion: function(b) { reputacion = reputacion + b; 
                                     avgReputacion = (reputacion / 5); }
    }
});

var TALENTO= (function(n, c, con, a, c, dis, dir, cos) {
    TALENTO.counter = (TALENTO.counter || 1);
    var id = TALENTO.counter;
    
    var nombre;
    var correo;
    var contraseña;
    var actividad_Profesional;
    var capacidades;
    var disponibilidad;
    var direccion;
    var costo;

    
    function initialize(n, c, con, a, c, dis, dir, cos) {
        nombre = n;
        correo = c;
        contraseña = con;
        actividad_Profesional = a;
        capacidades = c;
        disponibilidad  = dis;
        direccion = dir;
        costo = cos;

        if(isNaN(costo)) { throw "costo invalido"; }
        if(!contraseña || contraseña.length === 0) { throw "Contraseña invalida!"; }
        if(!nombre || nombre.length === 0) { throw "Nombre invalido!"; }
    }
    
    initialize(n, c, con, a, c, dis, dir, cos);
    TALENTO.counter ++; // sólo se incrementa si la inicialización tiene éxito
    
    return {
        getId: function() { return id; },
        getNombre: function() { return nombre; },
        getCorreo: function() { return correo; },
        getContraseña: function() { return contraseña},
        getActividadprofesional: function() { return actividad_Profesional; },
        getCapacidades: function() { return capacidades; },
        getDisponibilidad: function() { return disponibilidad; },
        getDireccion: function() { return direccion; },
        getCosto: function() { return costo;}
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
    CONTRATO.counter ++; // sólo se incrementa si la inicialización tiene éxito
    
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
    
    
    HTML_expr += "<div id='list'>" + listBooks();
    HTML_expr += "</div><br/><h1>Registrarse como Cazador de Talentos</h1>";

    HTML_expr += "<form><p><label for='Nombre'>Nombre Completo</label>:";
    HTML_expr += "<input type='text' name='book[Nombre]' id='Nombre'/></p>";

    HTML_expr += "<p><label for='receiver-email'>Correo electrónico</label>:";
    HTML_expr += "<input type='email' name='book[receiver-email]' id='receiver-email'/></p>";

    HTML_expr += "<p><label for='Contrasena'>Contraseña</label>:";
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
    
    HTML_expr += "<div id='list'>" + listBooks();
    HTML_expr += "</div><br/><h1>Registro de Proveedor de Talentos</h1>";

    HTML_expr += "<form><p><label for='Nombre'>Nombre Completo</label>:";
    HTML_expr += "<input type='text' name='book[title]' id='Nombre'/></p>";

    HTML_expr += "<p><label for='receiver-email'>Correo electrónico</label>:";
    HTML_expr += "<input type='email' name='book[price]' id='receiver-email'/></p>";

    HTML_expr += "<p><label for='Contrasena'>Contraseña</label>:";
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
    HTML_expr += "<div id='list'>" + listBooks();
    HTML_expr += "</div><br/><h1>Anunciar Proyecto</h1>";

    HTML_expr += "<form><p><label for='NombreProyecto'>Nombre del Proyecto</label>:";
    HTML_expr += "<input type='text' name='book[title]' id='NombreProyecto'/></p>";

    HTML_expr += "<p><label for='Descripcion'>Descripcion del proyecto</label><br/>";
    HTML_expr += "<textarea name='book[description]' id='Descripcion'></textarea></p>";

    HTML_expr += "<p><label for='Tarjeta'>Numero de tarjeta</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='Tarjeta'/></p>";

    HTML_expr += "<p><label for='Codigo'>Codigo de seguridad</label>:";
    HTML_expr += "<input type='text' name='book[price]' id='Codigo'/></p>";

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
    
    HTML_expr = "<br/><h1>Evaluación de experiencia</h1>";

    HTML_expr += "<form><p><label for='experiencia'>¿Cuál fue tu experiencia? (Del 1 al 5)</label>:";
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
    HTML_expr += "<ul class='referencias-historial>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Reputación en el tiempo</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialGiros'>Historial de giros</a></li></ul>";
    HTML_expr += "<h3>Promedios de reputación al mes:</h3>";
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
    HTML_expr += "<ul class='referencias-historial>";
    HTML_expr += "<li><a href='/speedDating/HistorialReputacion'>Reputación en el tiempo</a></li>";
    HTML_expr += "<li><a href='/speedDating/HistorialGiros'>Historial de giros</a></li></ul>";
    
    //ToDO: Poner los nombres, actividad profesional y correos de personas con quienes iniciaron un contrato y en que proyecto.
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
    
    
    //ToDO: Poner los nombres, actividad profesional y correos de personas de talentos que se registraron.
    return HTML_expr;
}

function listBooks()
{
    var HTML_expr = "<ul id='books'>";
    var cazadores = USUARIO.getCazadores();
    
    for(var i=0; i < cazadores.length; i++) {
        HTML_expr += listBook(cazadores[i]);
    }
    return HTML_expr + "</ul>";
}

function listBook( b )
{
    var HTML_expr = "<li>" + b.getId() + "'>" + b.getNombre() + "</li>";
    
    return HTML_expr;
}

function showBook( id )
{
    var HTML_expr = "<h1>" + LIBRARY.getBook(id).getTitle() + "</h1>";
    
    HTML_expr += "<p><strong>Price: </strong>$";
    HTML_expr += LIBRARY.getBook(id).getPrice() + "<br/>";
    HTML_expr += "<strong>Subject: </strong><a href='/books/show_subject?id=";
    HTML_expr += LIBRARY.getSubjectIndex(LIBRARY.getBook(id).getSubject()) + "'>";
    HTML_expr += LIBRARY.getBook(id).getSubject() + "</a><br/>";
    HTML_expr += "<strong>Created Date: </strong>";
    HTML_expr += LIBRARY.getBook(id).getCreatedAt() + "<br/></p>";
    HTML_expr += "<p>" + LIBRARY.getBook(id).getDescription() + "</p><hr/>";
    
    return HTML_expr + "<a href='/books/list'>Back</a>";
}

function showSubject( s )
{
    var HTML_expr = "<h1>" + LIBRARY.getSubjects()[s] + "</h1><ul>";
    var books = LIBRARY.getBooks();
    
    for(var i=0; i < books.length; i++) {
        if(books[i].getSubject() == LIBRARY.getSubjects()[s]) {
            HTML_expr += "<li><a href='/books/show?id=" + books[i].getId() + "'>";
            HTML_expr += books[i].getTitle() + "</a></li>";
        }
    }
    return HTML_expr + "</ul><a href='/books/list'>Back</a>";
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
