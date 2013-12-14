$(function () {

	$('.link').hide();
	$('.map').hide();
	
	$('.icon').click(function () {
		$('.link').slideToggle();
	})

	$('.link').click(function () {
		$('.map').slideToggle();
	})
})