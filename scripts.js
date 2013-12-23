$(function () {

	$('#closestRest').hide();
	$('#bestRest').hide();
	$('#closestBar').hide();
	$('#bestBar').hide();
	$('.mapOne').hide();
	$('.mapTwo').hide();
	
	$('#restaurantIcon').click(function () {
		$('#closestRest').slideToggle();
		$('#bestRest').slideToggle();
	})

	$('#closestRest').click(function() {
		$('.mapOne').slideToggle();
	})
	$('#bestRest').click(function() {
		$('.mapOne').slideToggle();
	})

	$('#barIcon').click(function () {
		$('#closestBar').slideToggle();
		$('#bestBar').slideToggle();
	})

	$('#closestBar').click(function() {
		$('.mapTwo').slideToggle();
	})
	$('#bestBar').click(function () {
		$('.mapTwo').slideToggle();
	})
})