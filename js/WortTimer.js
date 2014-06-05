/****************************************************************/
/* File Name: WortTimer.js					*/
/* Project:   WortTimer						*/
/* Author:    Daniel Zuo, Haodong Wang, Zachariah Straight	*/
/*            Leesha Maliakal, Dylan Hirshkowitz, Peiying Zhou	*/									 
/* Date:      6/5/2014						*/									 
/* Class:     Northwestern University 				*/
/*            EECS 394: Software Development			*/								 
/****************************************************************/

"use strict";

/* Flag for dev mode vs user testing mode, dev mode speeds the timers up by a factor of 60 */
var inDevelopmentMode = true;

/*****************************************************/
/**************** GLOBAL VARIABLES *******************/
/*****************************************************/

var brewType = 0;
var timerPhases = [];
var phaseName = [];
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

var saved = [];
var clickedIndex;
var temp;

/*****************************************************/
/****************** PAGE FUNCTIONS *******************/
/*****************************************************/

/* starting script for #home page */
$(document).on('pageinit', '#home', function(){

	$('#submit_userid').click(function() {
		userid = $("#userid_val").val();
		loadItem(userid.toString(), generate_saved_list);
		if (userid != "") { 
			$("#userid").remove(); 
		}
		$("#home").trigger("create");
	});

	$('#extract').click(function(){
		brewType = 0;
		modifyInputPage();
		resetDefault();	
		$.mobile.changePage('#inputPage');
	});
	
	$('#extractInfo').click(function(){
		alert("Extract brewing is the form of brewing used by most new brewers. Extract brewing involves the use of concentrated Malt Extract in the brewing process. The use of malt extract lets the brewer skip the mashing process, and move directly to the boil and fermentation steps. Extract brewing takes considerably less time and equipment than All Grain brewing. In extract brewing, Malt Extract is added directly to the brew pot and boiled together with Hops to create a sweet liquid called wort for fermenting. You can make very high quality beer using extract brewing, but it does not offer the full range of ingredient and process variations that are possible with All Grain brewing.");
	});
	
	$('#partialMash').click(function(){
		brewType = 1;
		modifyInputPage();
		resetDefault();
		$.mobile.changePage('#inputPage');
	});
	
	$('#partialMashInfo').click(function(){
		alert("Partial mash brewing is used by intermediate brewers who want the extra flexibility of being able to include certain malts and other ingredients, but lack the equipment or time needed for all grain brewing. Partial mash offers some of the simplicity of Extract Brewing while offering some of the flexibility of all grain brewing. Partial mash brewing follows the same steps as all grain brewing, but only specialty grains are mashed with a small amount of pale malt to provide enzymes. After mashing, extract malts are added to provide the bulk of the fermentable sugars.");
	});
	
	$('#allGrain').click(function(){
		brewType = 2;
		modifyInputPage();
		resetDefault();
		$.mobile.changePage('#inputPage');
	});

	$('#allGrainInfo').click(function(){
		alert("All grain brewing is the advanced process used by commercial and Craft Brewers to create commercial beers. With a little bit of equipment and time, the homebrewer can create all-grain brews as well. The main difference between all-grain and Extract Brewing or Partial Mash brewing is that in an all-grain brew, the entire volume of unfermented beer (called wort) is created by mashing crushed Malt and running hot water through the grain bed in a process called lautering.");
	});
	
	$('#IDInfo').click(function(){
		alert("Your User ID can be anything! Each individual ID allows you to save your favorite brewing recipes to your account.  You can continue without entering an ID, but your brewing recipes will not be saved once you exit Wort Timer.");
	});
});

/* starting script for #inputPage page */
$(document).on('pageinit', '#inputPage', function(){	

	/* hide all the sliders when then page is initialized */
	$("#hops_at").css('visibility', 'hidden');
	for (var i = 1; i <= 5; i ++) {
	    var slider = "#buying_slider_" + i.toString();
		$(slider).css('visibility', 'hidden').parent('.ui-slider').css('visibility', 'hidden');
	    $(slider).attr("max", 60).slider("refresh");
	}

	initPhaseName();
	numOfHopsValChange();
	boilTimeValChange();
	loadDefaultVal();

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
    	$('#timer_header').text(phaseName[0]);	
  		timerInit();
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
	    if (current > max) {
        	$(this).val(max-1);
        	$(this).slider('refresh');
    	}
    	if (current < min) {
        	$(this).val(min+1);
        	$(this).slider('refresh');
   		}
	});

	/* handle number of hops changes */
	$("#numHops").bind("change", numOfHopsValChange);

	/* handle boilTime changes */
	$("#boilTime").bind("change", boilTimeValChange);
});

$(document).on('pagebeforeshow','#inputPage',function (){
    timerPhases = [];
    hopTimes = [];
    phaseIndex = 0;
});

/* starting script for #timer page */
$(document).on('pagecreate','#timer', function() {

    // Start and stop are methods applied on the public TimeCircles instance
	$(".startTimer").click(function() {
		$("#CountDownTimer").TimeCircles().start();
		$("#CountDownTimer2").TimeCircles().start();
	});
   
	$(".stopTimer").click(function() {
		$("#CountDownTimer").TimeCircles().pause();
		$("#CountDownTimer2").TimeCircles().pause();
	});       

	if (phaseIndex === 0) {
    	$('#CountDownTimer').TimeCircles().pause();
    	$('#CountDownTimer2').TimeCircles().pause();
    } else {
    	$('#CountDownTimer').TimeCircles().start();
    	$('#CountDownTimer2').TimeCircles().start();
    }  
});

$(document).on('pagebeforeshow','#timer', function() {    
    if (phaseIndex === 0) {
    	$('#CountDownTimer').TimeCircles().pause();
    	$('#CountDownTimer2').TimeCircles().pause();
    } else {
    	$('#CountDownTimer').TimeCircles().start();
    	$('#CountDownTimer2').TimeCircles().start();
    }
});

/* starting script for #completed page */
$(document).on('pageinit','#completed', function () {
	$("#add_to_saved").click(function () {
		if (userid === -1) {
			alert("You did not input an userid. Saving is not enabled.")
		} else {
			var user = userid.toString();
			var type = brewType.toString();
			var name = $("#brewName").val();
			var firstPhase = timerPhases[0];
			var secondPhase;
			var boilTime;
			if (type == "2") {
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
			$("#popupForm").popup("close");
		}
	});
	$("#back_home").click(function() {
		loadItem(userid.toString(), generate_saved_list);
		$.mobile.changePage("#home");	
	});
});


/*****************************************************/
/**************** HELPER FUNCTIONS *******************/
/*****************************************************/

/* generate the list for saved items */
function generate_saved_list(list) {
	saved = list;
	$("#savedList").empty();
	$("#savedList").append('<h3 style="margin-bottom: 10px;"> Saved List </h3>');
	if (list.length === 0) {
		$('#savedList').append('<p> You have no saved items! </p>');
	} else {
		for (var i=0; i < list.length; i++) {
			var name = list[i].attributes.name;
			var objectId = list[i].id;
			var str = '<li><a href="#" onClick="GetIndex(this)"><h2>' + name + '</h2><a href="#" data-rel="popup" data-position-to="window" data-transition="pop" class="delete" id="' + objectId + '" onClick="removeList(this)">' + objectId + '</a></li>';
			$('#savedList').append(str);
		}
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

function modifyInputPage() {
	/* adjust input page according to different type of brewing */
	if (brewType === 0) {
		$('#firstPhase').text("STEEP TIME (MIN):");
		$('div').remove('#sparging');
		$('#inputPage').trigger('refresh');
	} else if (brewType === 1) {
		$('#firstPhase').text("MASH WAIT TIME (MIN):");
		$('div').remove('#sparging');
		$('#inputPage').trigger('refresh');
	} else {
		$('#firstPhase').text("MASH WAIT TIME (MIN):");
		$('div').remove('#sparging');
		var str = '<div data-role="fieldcontain" id="sparging"><label for="spargingTime"> Sparging Time (min): </label> <input id="spargingTime" name="spargingTime" value="' + def_phase_2 + '" type="text"/></div>';
		$(str).insertAfter("#firstPhaseForm");
	}
	$('#inputPage').trigger('create');
}

function initPhaseName() {
	phaseName = [];
	
	switch(brewType) {
		case 0:
			phaseName.push("STEEPING");
			phaseName.push("BOILING");
			break;
		case 1:
			phaseName.push("MASH WAITING");
			phaseName.push("BOILING");
			break;
		case 2:
			phaseName.push("MASH WAITING");
			phaseName.push("SPARGING");
			phaseName.push("BOILING");
			break;
		default:
			console.error("Unknown brewType occurred in initPhaseName()");
			return -1;
	}
	
	/*if (brewType === 0) {
		phaseName.push("STEEPING");
		phaseName.push("BOILING");
	} else if (brewType === 1) {
		phaseName.push("MASH WAITING");
		phaseName.push("BOILING");
	} else if (brewType === 2) {
		phaseName.push("MASH WAITING");
		phaseName.push("SPARGING");
		phaseName.push("BOILING");
	} else {
		console.error("Unknown brewType occurred in initPhaseName()");
		return -1;
	}*/
}

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

function timerInit() {
	$('#CountDownTimer').TimeCircles().destroy();
	$('#CountDownTimer2').TimeCircles().destroy();
	$("#CountDownTimer").TimeCircles({
		"time" : { "Days": { "show": false }, "Hours": { "show": false },"Seconds":{"show":false}},
		"count_past_zero": false
    });

    $("#CountDownTimer2").TimeCircles({
        "time" : { "Days": { "show": false }, "Hours": { "show": false },"Minutes":{"show":false}},
        "count_past_zero": false
    });
	$("#CountDownTimer").TimeCircles().addListener(timeElapsed, "visible");
	$("#CountDownTimer2").TimeCircles().addListener(timeElapsed, "visible"); 
}

function timeElapsed(unit, value, total) {
    if ($.mobile.activePage.attr('id') === 'timer') {
        if (total === 0) {
            if (phaseIndex < timerPhases.length-1) {
            	phaseIndex++;
                alert("Time is up!\nHit OK to move to the next brewing phase: " + phaseName[phaseIndex] + " TIME.");     
                $('#CountDownTimer').attr('data-timer', timerPhases[phaseIndex]);
    			$('#CountDownTimer2').attr('data-timer', timerPhases[phaseIndex]); 
    			$('#timer_header').text(phaseName[phaseIndex]);
                $.mobile.changePage('#timer', { allowSamePageTransition: true });
            }
            else {
                $.mobile.changePage('#completed');
            }
        }
        
        // Deal with the hop times!
        if (phaseIndex === timerPhases.length - 1) {
            if($.inArray(total, hopTimes) !== -1){ 
                alert("Time to add hops!");    
            }
        }
    }
}

function GetIndex(sender)
{   
    var aElements = sender.parentNode.parentNode.getElementsByTagName("a");
    var aElementsLength = aElements.length;

    var index;
    for (var i = 0; i < aElementsLength; i++)
    {
        if (aElements[i] === sender) //this condition is never true
        {
            clickedIndex = i/2;
            /* change the default values for input forms */
            brewType = parseInt(saved[clickedIndex].attributes.brewtype);
            modifyInputPage();
			def_phase_1 = saved[clickedIndex].attributes.firstPhase;
			def_phase_2 = saved[clickedIndex].attributes.secondPhase;
			def_boil = saved[clickedIndex].attributes.boilTime;
			def_num_hops = saved[clickedIndex].attributes.numOfHops;
			def_hop[0] = def_boil - saved[clickedIndex].attributes.hop1;
			def_hop[1] = def_boil  - saved[clickedIndex].attributes.hop2;
			def_hop[2] = def_boil  - saved[clickedIndex].attributes.hop3;
			def_hop[3] = def_boil  - saved[clickedIndex].attributes.hop4;
			def_hop[4] = def_boil  - saved[clickedIndex].attributes.hop5;  
			loadDefaultVal();      	
           	$.mobile.changePage("#inputPage");
            return;
        }
    }
}

function loadDefaultVal() {
	$("#steepTime").val(def_phase_1);
	if (brewType == 2) {
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
	brewType;
	timerPhases = [];
	phaseIndex = 0;
	hopTimes = [];
	def_phase_1 = 30;
	def_phase_2 = 30;
	def_boil = 60
	def_num_hops = 0;
	for (var i=0; i < 5; i++ ){
		def_hop[i] = 0;
	}
	loadDefaultVal();
}
