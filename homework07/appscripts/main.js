// main.js

console.log(`yo`);

//step 1
var paper = new Raphael(document.getElementById("main"));
// Find get paper dimensions
var dimX = paper.width;
var dimY = paper.height;

let rect = paper.rect(0, 0, dimX, dimY).attr({"fill": "black"});

//step 2
let disk = paper.circle(dimX/2, dimY/2, 20).attr({"fill": "green"});

//step 3, 7, 8, 9, 11, 12
let count = 0

let randCl = function(a, b){
	let range = b - a;
	let frand = Math.random()*range;
	return a+Math.floor(frand);
};

let draw = function(ev){
	var nd = paper.circle(disk.posx, disk.posy, 20).attr({"fill": "white"});
	//when the cirle is created inside the function, it creates a new circle everytime the function is called
	//after a while there'll be circles across the whole paper

	count++;
	//console.log(`the draw function has been called ${count} times`);

	disk.hide(); //to hide the middle disk?

	disk.posx += disk.xrate;
	//console.log(disk.posx);
	disk.posy += disk.yrate;
	//console.log(disk.posy);

	nd.attr({
		"cx": disk.posx,
		"cy": disk.posy,
	});
	//goes off the page, movement space isn't limited
	//if hits the edge of the box, use "-="" instead?

	nd.animate({
		"fill": `hsl(${randCl(0,360)}, 100, 50)`,
		"opacity": 0,
	}, 1000, function(){nd.remove()})

	if (disk.posx > dimX || disk.posx < 0){
		disk.xrate = -(disk.xrate);
	};

	if (disk.posy > dimY || disk.posy < 0){
		disk.yrate = -(disk.yrate);
	};
};

//step 4, 10
setInterval(draw, 10);

//step 5
disk.posx = dimX/2;
disk.posy = dimY/2;

//step 6
disk.xrate = 15;
disk.yrate = 15;

//extra
let slider = document.getElementById("speed");

slider.addEventListener("input", function(ev){
	//console.log(slider.value);
	disk.xrate = Math.sign(disk.xrate)*slider.value;
	disk.yrate = Math.sign(disk.yrate)*slider.value;
});