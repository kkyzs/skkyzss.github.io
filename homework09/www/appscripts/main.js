
console.log("Yo, I am alive!");

//variables
let startTime;
let clicks = 0;
let timePast;
let progress = document.getElementById('myBar')


// Grab the div where we will put our Raphael paper
var centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(centerDiv);

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

// Just create a nice black background
var bgRect = paper.rect(0,0,pWidth, pHeight);
bgRect.attr({"fill": "black"});

// A dot for us to play with
var dot = paper.circle(pWidth/2, pHeight/2, 30);
dot.attr({"fill": "green"});

//-------------------
// load time
//-------------------
var loadTime=Date.now()
console.log("load time is " + loadTime/1000);

//HTML5 audio elements
var myFooter=document.getElementById("myFooter");
myFooter.innerHTML="Click to start the game"

//HTML5 audio element
var aBackgroundSnd = new Audio ("resources/342566__inspectorj__sewer-soundscape-a.wav");


var aBumpSnd = new Audio ("resources/67408__noisecollector__vibrabonk.wav");

//bonus assigning new sounds
var aHitSnd = new Audio ("resources/hit.flac");

var aCompleteSnd = new Audio ("resources/complete.wav");


//-------------------




// Add some properties to dot just to keep track of it's "state"
dot.xpos=pWidth/2;
dot.ypos=pHeight/2;
dot.xrate=3;
dot.yrate=3;

// our drawing routine, will use as a callback for the interval timer
var draw = function(){
    myFooter.innerHTML="Time: " + (Date.now()-startTime)/1000

    // Update the position where we want our dot to be
    dot.xpos += dot.xrate;
    dot.ypos += dot.yrate;

    // Now actually move the dot using our 'state' variables
    dot.attr({'cx': dot.xpos, 'cy': dot.ypos});

    //---------------------------------------------
    // Set sound parameters based on the position of the moving dots

    // When dots hit the wall, reverse direction 
    if (dot.xpos > pWidth) {
        dot.xrate = -dot.xrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    }
    if (dot.ypos > pHeight) {
        dot.yrate = - dot.yrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    };
    if (dot.xpos < 0) {
        dot.xrate = -dot.xrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    }
    if (dot.ypos < 0) {
        dot.yrate = - dot.yrate;
        aBumpSnd.pause();
        aBumpSnd.currentTime=0;
        aBumpSnd.play();
    };

    timePast = (Date.now() - startTime)/1000;

    //console.log(timePast);

    if (timePast >= 5){
        endGame();
    };

    //progress bar

    let timePercent = `${(timePast/5)*100}%`;

    //console.log(timePercent);

    progress.style.width = timePercent;
    console.log(progress.style.width)
};

// call draw() periodically
// Start the timer with a button (instead of as program loads) so that sound models have time to load before we try play or set their parameters in the draw() function.
let toggle="off";
var timer;
let startButtonID = document.getElementById("startButtonID")

startButtonID.addEventListener('click', function(ev){
    if (toggle=="off"){
        startGame();
        startButtonID.value = "STOP";

        timer=setInterval(draw, 20);
        toggle="on";
        //console.log(toggle)
        
        aBackgroundSnd.play();
        aBackgroundSnd.volume=.2;
        aBackgroundSnd.loop=true;
    } else {
        endGame();
    };
});

dot.node.addEventListener("click", function(ev){
    clicks++;
    aHitSnd.pause();
    aHitSnd.currentTime=0;
    aHitSnd.play();
});

let startGame = function(ev){
    startTime = Date.now();
    
    if (easyButton.checked){
    dot.xrate=3; 
    dot.yrate=3;
    console.log(dot.xrate, dot.yrate)
    };

    if (hardButton.checked){
        dot.xrate=10;
        dot.yrate=8;
    };
};

let endGame = function(ev){
    clearInterval(timer);

    dot.xpos=pWidth/2;
    dot.ypos=pHeight/2;
    dot.attr({
        "cx": dot.xpos,
        "cy": dot.ypos,
    });

    toggle ="off";

    startTime = Date.now();

    myFooter.innerHTML="Click to start the game"

    aBackgroundSnd.pause();
    aCompleteSnd.play();
    aCompleteSnd.volume = .2;
    alert(`You have made ${clicks} clicks!`);
    //progress.style.width = "0%";
    //console.log(progress.style.width)
    //resetting clicks
    clicks = 0;

    //adds delay to the progress bar reset, because for some reason the 0% triggers one tick before the clearInterval runs
    let resetBar = function(ev){
        progress.style.width = "0%";
    };

    setTimeout(resetBar, 200);
    startButtonID.value = "START";
};

//bonus

//if calling the variable to use separately, in this case easyButton.checked above, must add the event listener in another line
//if event listener is added immediately, the console.log message returns "undefined", possibly because it's assigning the entire event listener to the variable
//if defined first like in line 206, console.log message returns the proper object as written in the html document

let easyButton = document.getElementById("easy")

easyButton.addEventListener("change", function(ev){
    dot.xrate=3; //reset the rates because it might be negative after hitting the wall, changing starting movement.
    dot.yrate=3;
    dot.attr({
        "r": 30,
    });
});

//console.log(easyButton)

let hardButton = document.getElementById("hard")

hardButton.addEventListener("change", function(ev){
    dot.xrate=10; //reset the rates because it might be negative after hitting the wall, changing starting movement.
    dot.yrate=8;
    dot.attr({
        "r": 20,
    });
});











