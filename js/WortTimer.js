"use strict";

// Flag for dev mode vs user testing mode
// Dev mode speeds the timers up by a factor of 60
var inDevelopmentMode = true;

var brewType;
var timerPhases = [];
var phaseIndex = 0;
var hopTimes = [];
var userid = -1;
var def_phase_1 = 30;
var def_phase_2 = 30;
var def_boil = 60
var def_num_hops = 0;
var def_hop = new Array(5);
for (var i=0; i < 5; i++ ){
	def_hop[i] = 0;
}
var saved;

$(document).on('pageinit', '#home', function(){

	$('#submit_userid').click(function() {
		userid = $("#userid_val").val();
		loadItem(userid.toString(), generate_saved_list);
		if (userid != "") { 
			$("#userid").remove(); 
		}
	});

	$('#extract').click(function(){
		brewType = 0;
		$('#firstPhase').text("STEEP TIME (MIN):");
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

/* generate the list for saved items */
function generate_saved_list(list) {
	saved = list;
	for (var i=0; i < list.length; i++) {
		var name = list[i].attributes.name;
		var objectId = list[i].id;
		var str = '<li><a href="#" onClick="GetIndex(this)"><h2>' + name + '</h2><a href="#" data-rel="popup" data-position-to="window" data-transition="pop" class="delete" id="' + objectId + '" onClick="removeList(this)">' + objectId + '</a></li>';
		$('#savedList').append(str);
	}
	$('#savedList').listview('refresh');
}

function removeList (obj) {
    $(obj).parent("li").remove();
    $('#savedList').listview('refresh');
 	/* remove from database */
 	var objectId = $(obj).attr("id");	
 	backendDeleteItem(objectId);
}

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

	loadDefaultVal();
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
	$("#numHops").bind("change", numOfHopsValChange);

	/* handle boilTime changes */
	$("#boilTime").bind("change", boilTimeValChange);
});

function boilTimeValChange() {
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
}

function numOfHopsValChange() {
	var val = document.getElementById("numHops");
	var steepTime = parseInt($('#steepTime').val());
	var boilTime = parseInt($('#boilTime').val());
	if (isNaN(boilTime)) boilTime = 100;
	var numHops = parseInt(val.options[val.selectedIndex].value); 
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
}

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

$(document).on('pageinit','#completed', function () {
	$("#add_to_saved").click(function () {
		var user = userid.toString();
		var type = brewType.toString();
		var name = $("#brewName").val();
		var firstPhase = timerPhases[0];
		var secondPhase;
		var boilTime;
		if (type === 2) {
			secondPhase = timerPhases[1];
			boilTime = timerPhases[2];
		} else {
			secondPhase = 0;
			boilTime = timerPhases[1];
		}
		var numOfHops = hopTimes.length;
		var comment = $("#comment").val().toString();
		var hops = new Array(5);
		for (var i = 0; i < 5; i++) {
			if ((i + 1) <= numOfHops) {
				hops[i] = hopTimes[i];
			} else {
				hops[i] = 0;
			}
		}
		backendAddItem(user, type, name, firstPhase,secondPhase, boilTime, numOfHops,comment,hops[0],hops[1],hops[2],hops[3],hops[4]);
	});
	resetDefault();
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
                $.mobile.changePage('#completed');
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

var clickedIndex;
function GetIndex(sender)
{   
    var aElements = sender.parentNode.parentNode.getElementsByTagName("a");
    var aElementsLength = aElements.length;

    var index;
    for (var i = 0; i < aElementsLength; i++)
    {
        if (aElements[i] === sender) //this condition is never true
        {
            clickedIndex = i;
            /* change the default values for input forms */
			def_phase_1 = saved[i].attributes.firstPhase;
			def_phase_2 = saved[i].attributes.secondPhase;
			def_boil = saved[i].attributes.boilTime;
			def_num_hops = saved[i].attributes.numOfHops;
			def_hop[0] = saved[i].attributes.hop1;
			def_hop[1] = saved[i].attributes.hop2;
			def_hop[2] = saved[i].attributes.hop3;
			def_hop[3] = saved[i].attributes.hop4;
			def_hop[4] = saved[i].attributes.hop5;        	
           	$.mobile.changePage('#inputPage');
           	//resetDefault();
            return;
        }
    }
}

function loadDefaultVal() {
	$("#steepTime").val(def_phase_1);
	if (brewType === 2) {
		$("#spargingTime").val(def_phase_2);
	}
	$("#boilTime").val(def_boil);
	$("#numHops").val(def_num_hops);
	boilTimeValChange();
	numOfHopsValChange();
	for (var i = 1; i <= def_num_hops; i++) {
		var slider = "#buying_slider_" + i.toString();
		$(slider).val(def_hop[i-1]);
		$(slider).slider("refresh");
	} 
	$("#numHops").selectmenu('refresh', true);
}

function resetDefault() {
	def_phase_1 = 30;
	def_phase_2 = 30;
	def_boil = 60
	def_num_hops = 0;
	for (var i=0; i < 5; i++ ){
		def_hop[i] = 0;
	}
}
