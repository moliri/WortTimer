"use strict";


var timerPhases = [];
var phaseIndex = 0;

$(document).on('pageinit', '#home', function(){
	$('#extract').click(function(){
		$.mobile.changePage('#extractInput');
	});
	
	$('#partialMash').click(function(){
		$.mobile.changePage('#partialMashInput');
	});
	$('#allGrain').click(function(){
		$.mobile.changePage('#allGrainInput');
	});
	
});

/* Input page events and functions */
/* starting script for input page */
$(document).on('pageinit', '#extractInput', function(){
	
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
		
		switch(parseInt(numHops)) {
		
			case 1:
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
				
				$('#hop1').slider('enable');
				break;
			case 2:
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
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				break;
			case 3:
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
				
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				$('#hop3').slider('enable');
				break;
			case 4:
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
				
				$('#hop1').slider('enable');
				$('#hop2').slider('enable');
				$('#hop3').slider('enable');
				$('#hop4').slider('enable');
				break;
			case 5:
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
        var val = document.getElementById("numHops");
        var steepTime = parseInt($('#steepTime').val());
        var boilTime = parseInt($('#boilTime').val());
        var numHops = parseInt(val.options[val.selectedIndex].value);
        
        
        timerPhases.push(steepTime);
        for(var i = 1; i < numHops+1; i++){
            timerPhases.push(boilTime);
        }
        
		$('#CountDownTimer').attr('data-timer', steepTime);
        $('#CountDownTimer2').attr('data-timer', steepTime);

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

    // Start and stop are methods applied on the public TimeCircles instance
	$(".startTimer").click(function() {
		$("#CountDownTimer").TimeCircles().start();
		$("#CountDownTimer2").TimeCircles().start();
	});
   
	$(".stopTimer").click(function() {
		$("#CountDownTimer").TimeCircles().pause();
		$("#CountDownTimer2").TimeCircles().pause();
	});       

	$("#CountDownTimer").TimeCircles().addListener(timeElapsed, "visible");
	$("#CountDownTimer2").TimeCircles().addListener(timeElapsed, "visible");
});


$(document).on('pagebeforeshow','#timer', function() {
	
    if (phaseIndex > 0) { //reset the data-timer attribute, then rebuild the objects.
        
        $('#CountDownTimer').attr('data-timer', timerPhases[phaseIndex]);
        $('#CountDownTimer2').attr('data-timer', timerPhases[phaseIndex]);        
        
        $("#CountDownTimer").TimeCircles({
            "time" : { "Days": { "show": false }, "Hours": { "show": false },"Seconds":{"show":false}},
            "count_past_zero": false
        });

        $("#CountDownTimer2").TimeCircles({
            "time" : { "Days": { "show": false }, "Hours": { "show": false },"Minutes":{"show":false}},
            "count_past_zero": false
        });
        
        $('#CountDownTimer').TimeCircles();
        $('#CountDownTimer2').TimeCircles();
        $('#CountDownTimer').TimeCircles().start();
        $('#CountDownTimer2').TimeCircles().start();
        
    }
});



function timeElapsed(unit, value, total) {
    if (total === 0  ) {
        if (phaseIndex < timerPhases.length-1) {
            alert("Time is up!\nHit OK to move to the next brewing phase.");
        
            phaseIndex++;
        
            $.mobile.changePage('#timer', { allowSamePageTransition: true });
        }
        else {
            alert("You're done brewing! Enjoy!");
        }
    }    
}




