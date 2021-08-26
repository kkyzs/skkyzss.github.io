/* Smile/ Frown with Raphael Graphics */

console.log("send help");

var paper = new Raphael(document.getElementById("mySVGCanvas"));
// Find get paper dimensions
var dimX = paper.width;
var dimY = paper.height;


//-------------------------------//

//step 1
let bg = paper.rect(0, 0, dimX, dimY);

bg.attr({
"stroke": "#444444",
"stroke-width": 10,
"fill" : "#ED2939"
});

//step 4
let drawMouth = function(bx, by){
	let string = `M ${dimX/3},${2*dimY/3} Q ${bx},${by} ${2*dimX/3},${2*dimY/3}`;

	return string;
};

//smile coordinates
let smiling = {
	"x": 1*dimX/2,
	"y": 4*dimY/5,
}

//frown coordinates
let frowning = {
	"x": 1*dimX/2,
	"y": 2*dimY/5,
};

//step 2 (& 5, after swapping in the new string)

//let mouth = paper.path(`M ${dimX/3},${2*dimY/3} Q ${2*dimX/2},${4*dimY/5} ${2*dimX/3},${2*dimY/3}`);

let mouth = paper.path(drawMouth(smiling.x,smiling.y));

//step 3, 4, 6, 8 & 9 (all animations on click)
//0 = smile, 1 = frown
let btnstate = 0

let button = document.getElementById("togglebtn");

//caption text
let caption = document.getElementById("caption");

button.addEventListener("click", function(ev){
	//console.log("got a click");
	if (btnstate === 0){
		button.value = "FROWN";
		btnstate = 1;
		mouth.animate({
			"path": drawMouth(frowning.x,frowning.y),
		}, 200, "linear");
		blink(leftEye, rightEye, 0.1);
		dot.animate({
			"cx": frowning.x,
			"cy": frowning.y,
		}, 200);
		caption.innerHTML = "ME 90MINUTES LATER WHEN THEY LOSE";
		togglebtn.style.backgroundImage = "url(http://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max)";
	} else {
		button.value = "SMILE";
		btnstate = 0;
		mouth.animate({
			"path": drawMouth(smiling.x,smiling.y),
		}, 200, "linear");
		blink(leftEye, rightEye, 50);
		dot.animate({
			"cx": smiling.x,
			"cy": smiling.y,
		}, 200);
		caption.innerHTML = "ME GETTING READY FOR DISAPPOINTMENT AGAIN";
		togglebtn.style.backgroundImage = "url(https://cdn.hipwallpaper.com/i/78/42/ENmtT2.jpg)";
	}
});

//step 7
let leftEye = paper.ellipse(dimX/4, 2*dimY/5, 30, 50).attr({
	"fill": "white",
});

let rightEye = paper.ellipse(3*dimX/4, 2*dimY/5, 30, 50).attr({
	"fill": "white",
});

//step 8
let blink = function(e1, e2, ry){
	leftEye.animate({
		"ry": ry,
	}, 50);
	rightEye.animate({
		"ry": ry,
	}, 50);
};

//step 9
let dot = paper.circle(smiling.x, smiling.y, 10).attr({
	"fill": "#444",
});

//step 10 & 11
//1 = mousedown, 0 = mouseup
let draggingDot = 0

dot.node.addEventListener("mousedown", function(ev){
	//console.log("mousedown active");
	draggingDot = 1;
});

dot.node.addEventListener("mouseup", function(ev){
	//console.log("mouseup active");
	draggingDot = 0;
	console.log("Dot is no longer draggable - State is 0")
});

//using bg so it doesn't lose tracking when moving too quickly
bg.node.addEventListener("mousemove", function(ev){
	if (draggingDot === 1){
		console.log("Dot is now draggable - State is 1")
		dot.attr({
			"cx": ev.offsetX,
			"cy": ev.offsetY,
		});
		mouth.animate({
			"path": drawMouth(ev.offsetX,ev.offsetY),
		});
	};
});