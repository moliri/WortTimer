"use strict";

var firstPhase;

/* Input page events and functions */
/* starting script for input page */
$(document).on('pageinit', '#timeInput', function(){
	
	$('#hop1').slider('disable');
	$('#hop1').slider('refresh');
	$('#hop2').slider('disable');
	$('#hop1').slider('refresh');
	$('#hop3').slider('disable');
	$('#hop1').slider('refresh');
	$('#hop4').slider('disable');
	$('#hop1').slider('refresh');
	$('#hop5').slider('disable');
	$('#hop1').slider('refresh');
	
	$('#hopTimes').click(function () {
		
		var val = document.getElementById("numHops");
		var numHops = val.options[val.selectedIndex].value;
		console.log(numHops);
		
		switch(numHops) {
		
			case 1:
				$('#hop1').slider('enable');
				break;
			case 2:
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				break;
			case 3:
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				$('#hop3').slider('enable');
				break;
			case 4:
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				$('#hop3').slider('enable');
				$('#hop4').slider('enable');
				break;
			case 5:
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				$('#hop3').slider('enable');
				$('#hop4').slider('enable');
				$('#hop5').slider('enable');
				break;
			default:
				alert("Please enter hop times!");
		}
	});
	
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
	$("#CountDownTimer2").TimeCircles().addListener(timeElapsed, "visible");
});

function timeElapsed(unit, value, total) {
    if (total === 0) {
        alert("Time is up!");
    }
}
