"use strict";

var firstPhase;

document.domain = "github.io";

/* Input page events and functions */
/* starting script for input page */
$(document).on('pageinit', '#timeInput', function(){
	$('#submitTime').click(function () {
		//alert($('#firstPhase').val());
		$('#CountDownTimer').attr('data-timer', $('#firstPhase').val());
        $('#CountDownTimer2').attr('data-timer', $('#firstPhase').val());
		$.mobile.changePage('#timer');
	});
});

/* Timer page events and functions */
/* starting script for timer page */
$(document).on('pageinit','#timer', function() {
	$("#CountDownTimer").TimeCircles({
		"time" : { "Days": { "show": false }, "Hours": { "show": false },"Seconds":{"show":false}},
		"count_past_zero": false
	});

	$("#CountDownTimer2").TimeCircles({
		"time" : { "Days": { "show": false }, "Hours": { "show": false },"Minutes":{"show":false}},
		"count_past_zero": false
	});
	//$("#CountDownTimer").TimeCircles().stop();
	
	// Start and stop are methods applied on the public TimeCircles instance
	$(".startTimer").click(function() {
		$("#CountDownTimer").TimeCircles().start();
		$("#CountDownTimer2").TimeCircles().start();
	});
   
	$(".stopTimer").click(function() {
		$("#CountDownTimer").TimeCircles().stop();
		$("#CountDownTimer2").TimeCircles().stop();
	});       

	$("#CountDownTimer").TimeCircles().addListener(timeElapsed, "visible");
});

function timeElapsed(unit, value, total) {
    if (total === 0) {
        alert("Time is up!");
    }
}
