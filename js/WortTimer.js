"use strict";

var firstPhase;

/* start page events and functions */
/* starting script for intro page */
$(document).on('pageinit', '#timeInput', function(){
	$('#submitTime').click(function () {
		//alert($('#firstPhase').val());
		$('#CountDownTimer').attr('data-timer', $('#firstPhase').val());
		$.mobile.changePage('#timer');
	});
});

/* Timer page events and functions */
/* starting script for timer page */
$(document).on('pageinit','#timer',function() {
            $("#CountDownTimer").TimeCircles({
            	"time" : { "Days": { "show": false }, "Hours": { "show": false }},
            	"count_past_zero": false
            });
            //$("#CountDownTimer").TimeCircles().stop();
            
            // Start and stop are methods applied on the public TimeCircles instance
            $(".startTimer").click(function() {
                $("#CountDownTimer").TimeCircles().start();
            });
           
            $(".stopTimer").click(function() {
                $("#CountDownTimer").TimeCircles().stop();
            });       
});
