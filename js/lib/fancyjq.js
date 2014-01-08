$(document).on('mouseenter','#elem', function(){
    $(this).popover('show');
});

$(document).on('mouseleave','#elem', function(){
    $(this).popover('hide');
});

$(function () {

    $('#closestRest').hide();
    $('#bestRest').hide();
    $('#closestBar').hide();
    $('#bestBar').hide();

    
    $('#restaurantIcon').click(function () {
        $('#closestRest').slideToggle();
        $('#bestRest').slideToggle();
    })

    $('#barIcon').click(function () {
        $('#closestBar').slideToggle();
        $('#bestBar').slideToggle();
    })

})