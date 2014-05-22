"use strict";

// Flag for dev mode vs user testing mode
// Dev mode speeds the timers up by a factor of 60
var inDevelopmentMode = false;

var brewType;
var timerPhases = [];
var phaseIndex = 0;
var hopTimes = [];

$(document).on('pageinit', '#home', function(){
	$('#extract').click(function(){
		brewType = 0;
		$('div').remove('#sparging');
		$('#inputPage').trigger('refresh');
		$.mobile.changePage('#inputPage');
	});
	//$('#partialMash').attr("disabled","disabled");
	//$('#allGrain').attr("disabled", "disabled");
	
	$('#partialMash').click(function(){
		brewType = 1;
		$('#firstPhase').text("MASH WAIT TIME (MIN):");
		$('div').remove('#sparging');
		$('#inputPage').trigger('refresh');
		$.mobile.changePage('#inputPage');
	});
	$('#allGrain').click(function(){
		brewType = 2;
		$('#firstPhase').text("MASH WAIT TIME (MIN):");
		$('div').remove('#sparging');
		var str = '<div data-role="fieldcontain" id="sparging"><label for="spargingTime"> Sparging Time (min): </label> <input id="spargingTime" name="spargingTime" value="60" type="text"/></div>'
		$(str).insertAfter("#firstPhaseForm");
		$('#inputPage').trigger('create');
		$.mobile.changePage('#inputPage');
	});
	
});

/* Input page events and functions */
/* starting script for input page */
$(document).on('pageinit', '#inputPage', function(){	

	/* hide all the sliders when then page is initialized */
	$("#hops_at").css('visibility', 'hidden');
	for (var i = 1; i <= 5; i ++) {
	    var slider = "#buying_slider_" + i.toString();
		$(slider).css('visibility', 'hidden').parent('.ui-slider').css('visibility', 'hidden');
	    $(slider).attr("max", 60).slider("refresh");
	}

	/* submit form */	
	$('#submitTime').click(function () {        
        var val = document.getElementById("numHops");
        var steepTime = parseInt($('#steepTime').val()); 
        var spargingTime = parseInt($('#spargingTime').val());
        var boilTime = parseInt($('#boilTime').val());

        // Slow the timers down if we are not in dev mode
        if(!inDevelopmentMode){
            steepTime = 60*steepTime;
            boilTime = 60*boilTime;
            spargingTime = 60*spargingTime;
        }
        
        var numHops = parseInt(val.options[val.selectedIndex].value);

        /* Input form cannot be empty */
        var missingInput = "";
        if (isNaN(steepTime)) {
        	missingInput += "Steep time cannot be empty!\n";
        } 
        if (isNaN(spargingTime) && (brewType===2)) {
        	missingInput += "Sparging time cannot be empty!\n";
        }
        if (isNaN(boilTime)) {
        	missingInput += "Boil time cannot be empty!\n";
        }
        if (isNaN(numHops) || (numHops === 0)) {
			missingInput += "Number of hops time cannot be zero!\n";
        }
        if (missingInput != "") {
        	alert(missingInput);
        	return -1;
        }
        
        timerPhases.push(steepTime);
        if (brewType === 2) {
        	timerPhases.push(spargingTime);
        }
        timerPhases.push(boilTime);
        
        for(var i = 1; i <= numHops; i++){
            var slider = "#buying_slider_" + i.toString();
            var sliderVal = parseInt($(slider).val());
            
            if(!inDevelopmentMode){
                sliderVal = 60*sliderVal;
            }
            
            hopTimes.push(boilTime - sliderVal);
        }
        
		$('#CountDownTimer').attr('data-timer', steepTime);
        $('#CountDownTimer2').attr('data-timer', steepTime);

		$.mobile.changePage('#timer');
	});

	var val = document.getElementById("numHops");
    var steepTime = parseInt($('#steepTime').val());
   	var boilTime = parseInt($('#boilTime').val());
   	if (isNaN(boilTime)) boilTime = 100;
    var numHops = parseInt(val.options[val.selectedIndex].value); 
	var handles = numHops;

	/* Constraint on handles */
	$('.BuyingSlider').change(function() {
	    var currentval = parseInt($(this).attr("slider"));
	    if(currentval == 1){
	        var min_num = 1;
	        var min = 0;
	    }else{
	        var min_num = currentval-1;
	        var min = parseInt($('#buying_slider_'+min_num).val());
	    }
	    if(currentval == handles){
	        var max_num = handles;
	        var max = boilTime;
	    }else{
	        var max_num = currentval+1;
	        var max = parseInt($('#buying_slider_'+max_num).val());
	    }
	    var current = parseInt($('#buying_slider_'+currentval).val());
	});

	/* handle number of hops changes */
	$("#numHops").bind("change", function(){
		val = document.getElementById("numHops");
	    steepTime = parseInt($('#steepTime').val());
	   	boilTime = parseInt($('#boilTime').val());
	   	if (isNaN(boilTime)) boilTime = 100;
	    numHops = parseInt(val.options[val.selectedIndex].value); 
	    for (var i = 1; i <= 5; i++) {
	    	var slider = "#buying_slider_" + i.toString();
	    	if (i <= numHops) {
				$(slider).css('visibility', '').parent('.ui-slider').css('visibility', '');
				$(slider).val((i-1) * boilTime/4);
				$(slider).slider("refresh");
	    	} else {
				$(slider).css('visibility', 'hidden').parent('.ui-slider').css('visibility', 'hidden');
				$(slider).val($(slider).attr('max'));
	    		$(slider).slider("refresh");
	    	}
	    }
	    if (numHops === 0) {
	    	$("#hops_at").css('visibility', 'hidden');
	    } else {
	    	$("#hops_at").css('visibility', '');
	    }
	});

	/* handle boilTime changes */
	$("#boilTime").bind("change", function() {
		var boilTime = parseInt($('#boilTime').val());
		if (isNaN(boilTime)) boilTime = 100;
	    for (var i = 1; i <= 5; i ++) {
	    	var slider = "#buying_slider_" + i.toString();
	    	if ($(slider).css('visibility') === 'hidden') {
	    		$(slider).val(boilTime);
	    	} else {
	    		$(slider).val((i-1) * boilTime/4);
	    	}
			$(slider).attr("max", boilTime).slider("refresh");
	    }	
	});
});

$(document).on('pagebeforeshow','#inputPage',function (){
    timerPhases = [];
    hopTimes = [];
    phaseIndex = 0;
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
        
   
});



function timeElapsed(unit, value, total) {

    if ($.mobile.activePage.attr('id') === 'timer') {
        if (total === 0) {
            if (phaseIndex < timerPhases.length-1) {
                alert("Time is up!\nHit OK to move to the next brewing phase.");
            
                phaseIndex++;
            
                $.mobile.changePage('#timer', { allowSamePageTransition: true });
            }
            else {
                alert("You're done brewing! Enjoy!");
            }
        }
        
        // Deal with the hop times!
        if (phaseIndex > 0) {
            if($.inArray(total, hopTimes) !== -1){ 
                  alert("Time to add hops!");    
            }
        }
    }
}





