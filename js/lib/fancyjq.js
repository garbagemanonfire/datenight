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