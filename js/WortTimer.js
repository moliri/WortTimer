"use strict";


/* start page events and functions */
/* starting script for intro page */
$(document).on('pageinit', '#intropage', function(){
    
});

/* Timer page events and functions */
/* starting script for timer page */
$(document).on('pageinit','#timer',function() {
    
});


/* about page events and functions */
/* starting script for about page */
$(document).on('pageinit','#about',function(){
    $('#favList2').click(getFavorites);
});

/* follow us page events and functions */
/* starting script for follow page */
$(document).on('pageinit','#contact',function(){
    $('#favList3').click(getFavorites);
});
