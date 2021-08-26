
console.log("Yo, I am alive!");

// Grab the div where we will put our Raphael paper
var centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(centerDiv);

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
//---------------------------------------------------------------------
let map = function (x, a, b, m, n){
    let range = n-m;
    // x is 'proportion' of the way from a to b
    let proportion = (x-a)/(b-a);
    return (m + proportion*range);
};

let distance = function(p1, p2){
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
};

// Just create a nice black background
var bgRect = paper.rect(0,0,pWidth, pHeight);
bgRect.attr({"fill": "black"});

let numDisks = 50;
let diskArray = [];

for (let i = 0; i < numDisks; i++){
    let disk = paper.circle(pWidth/2, pHeight/2, 20);
    
    // color
    disk.hsl = `hsl(${Math.random()*0.9}, ${1}, ${0.7})`
    // console.log(disk.hsl)
    disk.attr({"fill": disk.hsl});

    // Add some properties to disk just to keep track of it's "state"
    disk.xpos=pWidth/2;
    disk.ypos=pHeight/2;

    // Add properties to keep track of the rate the disk is moving
    disk.xrate= map(Math.random(), 0, 1, -10, 10);
    disk.yrate= map(Math.random(), 0, 1, -10, 10);
    //need to use map, if just use Math.random()*10 only gives you one direction

    disk.move = function(){
    //console.log("disk pos is ["+disk.xpos + "," + disk.ypos + "]");

    // Update the position where we want our disk to be
    disk.xpos += disk.xrate;
    disk.ypos += disk.yrate;

    // Now actually move the disk using our 'state' variables
    disk.attr({'cx': disk.xpos, 'cy': disk.ypos});

    // keep the object on the paper
    if (disk.xpos > pWidth) {disk.xrate = - disk.xrate;}
    if (disk.ypos > pHeight) {disk.yrate = - disk.yrate};
    if (disk.xpos < 0) {disk.xrate = - disk.xrate;}
    if (disk.ypos < 0) (disk.yrate = - disk.yrate);
}
    
    diskArray.push(disk); //adding to array 50 times
};

// our drawing routine, will use as a callback for the interval timer
var draw = function(){
     
    for (let i = 0; i < numDisks; i++){
        diskArray[i].move()
        
        let circleD = distance(mouseState, {"x":diskArray[i].xpos, "y":diskArray[i].ypos})

        if (mouseState.pushed === true && circleD < 100){
            diskArray[i].attr({"fill": "white"});
        } else {
            diskArray[i].attr({"fill": diskArray[i].hsl})
        };
    };

};

// Call draw() periodically
setInterval(draw, 20);

var transRect = paper.rect(0,0, pWidth, pHeight).attr({"fill": "black", "fill-opacity": 0})

var mouseState = {
    "x" : 0,
    "y" : 0,
    "pushed" : false,
};

let clickcircle = paper.circle(0,0,100).attr({
    "stroke-width": 5,
    "stroke": "white",
})

clickcircle.hide()    
transRect.node.addEventListener("mousedown",function(ev){
    mouseState.pushed = true;
    clickcircle.show();
});

transRect.node.addEventListener("mousemove",function(ev){
    mouseState.x = ev.offsetX;
    mouseState.y = ev.offsetY;
    clickcircle.attr({
        "cx": mouseState.x,
        "cy": mouseState.y,
    })
});

transRect.node.addEventListener("mouseup",function(ev){
    mouseState.pushed = false;
    clickcircle.hide();
});

console.log(mouseState.x)