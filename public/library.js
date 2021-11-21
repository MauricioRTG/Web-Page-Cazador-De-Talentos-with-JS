
var EDIT = undefined;

function edit( id )
{
    EDIT = id;
    
    $.ajax({type: 'GET', url: '/books/update?id=' + id}).done(function(book) {
        $("#books_title").attr("value", book.title);
        $("#books_price").attr("value", book.price);
        $("#books_subject").val(book.subject);
        $("#books_description").text(book.description);
    });
}

function drop( id )
{
    var form = $(this).parent();
    reset(form);
    
    if(!confirm('Are you sure ?')) {
        return false;
    }
    
    $.ajax({type: 'DELETE', url: '/books/delete?id=' + id}).done(function(list) {
        $("#books").remove();
        $("#list").prepend(list);
    });
}

function registerEvents()
{
    $(':button').click(function(event) {
        event.preventDefault();
        var form = $(this).parent();
        reset(form);
    });
    
    $('form').submit(function(event) {
        event.preventDefault();
        var form = $(this);
        var blockData = form.serialize();
        
        $.ajax({type: 'PUT', url: '/books/update?id=' + EDIT, data: blockData}).done( function(book) {
            if(EDIT === undefined) {
               $("#books").append(book);
            } else {
               $("#books li a")[book.index].text = book.name;
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
