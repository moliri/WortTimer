
var seconds = 10;
function secondPassed() {
    var minutes = Math.round((seconds - 30)/60);
    var remainingSeconds = seconds % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;  
    }
    document.getElementById('countdown').innerHTML = minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "Time Out";
    } else {
        seconds--;
    }
    
}


function myStopFunction()
    {
    clearInterval(countdownTimer);
    }

function myContinueFunction()
    {
        var countdownTimer = setInterval('secondPassed()', 1000);
    }
