
console.log("yo, I'm alive!");

var paper = new Raphael(document.getElementById("mySVGCanvas"));
// Find get paper dimensions
var dimX = paper.width;
var dimY = paper.height;


//--------------------------------

var bg = paper.rect(0, 0, dimX, dimY);

bg.attr({
        "stroke": "#444444",
        "stroke-width": 20,
        "fill" : "#CCAAFF"        // must be filled to get mouse clicks        
});

//mouseclick
bg.node.addEventListener("mousedown", function(ev){
	console.log("The window has received a mouse click.");
});

//mid circle
let midCircleCo = {
	"x": dimX/2,
	"y": dimY/2,
};

let midCircle = paper.circle(midCircleCo.x, midCircleCo.y, 20).attr({
	"fill": "red",
});

//line
let path1 = paper.path(`M ${dimX/2} ${dimY/2} L ${150} ${100}`).attr({
	"stroke": "#444",
	"stroke-width": 15,
	"stroke-linecap": "round",
});;

//circle1
let circle1Co = {
	"x": 150,
	"y": 100,
};

let circle1 = paper.circle(circle1Co.x, circle1Co.y, 30).attr({
	"fill": "blue",
});

//state must be defined before functions are run
let blueState = 0;

circle1.node.addEventListener("mousedown", function(ev){
	//console.log("Mousedown click on the blue circle.");
	if (blueState === 0){
		console.log("State 1: Object now moveable.");
		blueState = 1;
	}
});

circle1.node.addEventListener("mouseup", function(ev){
	//console.log("Mousedown click on the blue circle.");
	if (blueState === 1){
		console.log("State 0: Object not moveable");
		blueState = 0;
	}
});

//Hi Brandon if you see this, can you explain why commenting out this portion makes the animation so choppy? Is it due to a clash of mouseover objects?
circle1.node.addEventListener("mousemove", function(ev){
	//note: make sure the variable is NOT in BRACKETS!! wasted 15mins lmao
	if (blueState ===  1){
		//console.log("ev.offsetX, ev.offsetY");
		circle1Co.x = ev.offsetX;
		circle1Co.y = ev.offsetY;
		//circle animation
		circle1.animate({
			"cx": circle1Co.x,
			"cy": circle1Co.y,
		}, 0, "linear");
		//line animation
		path1.animate({
			"path": `M ${dimX/2} ${dimY/2} L ${circle1Co.x} ${circle1Co.y}`
		})
	}
});


//animation stuck fix
//issue occurs when mouse moves faster than animation
//when mouse hover goes outside of circle, the function doesn't run anymore
bg.node.addEventListener("mousemove", function(ev){
	//note: make sure the variable is NOT in BRACKETS!! wasted 15mins lmao
	if (blueState ===  1){
		//console.log("ev.offsetX, ev.offsetY");
		circle1Co.x = ev.offsetX;
		circle1Co.y = ev.offsetY;
		//circle animation
		circle1.animate({
			"cx": circle1Co.x,
			"cy": circle1Co.y,
		}, 0, "linear");
		//line animation
		path1.animate({
			"path": `M ${dimX/2} ${dimY/2} L ${circle1Co.x} ${circle1Co.y}`
		})
	}
});
//despite making the entire bg responsive, the state is only changed on click of the circle, so clicking anywhere on the bg still doesnt work
//i took 10mins trying to figure this error out only for it to be resolved in step 6 help la T_T

//bonus
let animate1 = function(ev){
	midCircle.animate({
	"r": 20,
	"fill": "red",
	}, 3000, animate2);
};

let animate2 = function(ev){
	midCircle.animate({
	"r": 25,
	"fill": "cyan",
	}, 3000, animate1);
};

animate1();