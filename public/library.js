
var EDIT = undefined;


function registerEvents()
{
    $(':button').click(function(event) {
        event.preventDefault();
        var form = $(this).parent();
        reset(form);
    });
    
    $('form[id="Cazador"]').submit(function(event) {
        event.preventDefault();
        var form = $(this);
        var blockData = form.serialize();
        
        $.ajax({type: 'PUT', url: '/speedDating/update?id=' + EDIT, data: blockData}).done( function(cazador) {
            if(EDIT === undefined) {
               $("#books").append(cazador);
            } else {
               $("#books li a")[cazador.index].text = cazador.nombre;
            }
            reset(form);
        });
    });

    $('form[id="Proyecto"]').submit(function(event) {
        event.preventDefault();
        var form = $(this);
        var blockData = form.serialize();
        
        $.ajax({type: 'PUT', url: '/speedDating/EnviarProyecto?id=' + EDIT, data: blockData}).done( function(proyecto) {
            if(EDIT === undefined) {
               $("#books").append(proyecto);
            } else {
               $("#books li a")[proyecto.index].text = proyecto.Nombre;
            }
            reset(form);
        });
    });

}

function reset( form )
{
    EDIT = undefined;
    form.trigger('reset');
    
    $("#Nombre").attr("value", "");
    $("#receiver-email").attr("value", "");
    $("#contrasena").attr("value", "");
    $("#Empresa").attr("value", "");
    $("#Direccion").attr("value", "");
}
