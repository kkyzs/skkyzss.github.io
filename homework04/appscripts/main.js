// main.js

console.log(`yo`);

/* assign3: font family for article in JavaScript */
var art=document.getElementById("articleid").style.fontFamily = "cursive,Charcoal,sans-serif";

/* assign3: center header text using javascript */
var art=document.getElementById("headerid").style.textAlign = "center";

let article = document.getElementById("articleid");

let hslString = function(a, b, c){

	let hsl = "hsl(" + a + ", " + b + "%, " + c + "%)";
	return hsl;
};

console.log("Your hsl string is " + hslString(200,50,50));

article.style.backgroundColor = hslString(200,50,50);

let hue = document.getElementById("h");
let saturation = document.getElementById("s");
let lightness = document.getElementById("l");

//hue slider 
hue.addEventListener("input", function(ev){
	let h = hue.value;
	let s = saturation.value;
	let l = lightness.value;
	console.log("Your hue is now " + h);
	article.style.backgroundColor = hslString(h,s,l);
});

//saturation slider
saturation.addEventListener("input", function(ev){
	let h = hue.value;
	let s = saturation.value;
	let l = lightness.value;
	console.log("Your saturation is now " + s);
	article.style.backgroundColor = hslString(h,s,l);
});

//lightness slider
lightness.addEventListener("input", function(ev){
	let h = hue.value;
	let s = saturation.value;
	let l = lightness.value;
	console.log("Your lightness is now " + l);
	article.style.backgroundColor = hslString(h,s,l);
});

//opacity slider
let opacity = document.getElementById("o");

article.style.opacity = opacity.value;

opacity.addEventListener("input", function(ev){
	let o = opacity.value;
	console.log("Your opacity is now " + o);
	article.style.opacity = o;
});

//mouse events
article.addEventListener("mousedown", function(ev){
	console.log("Mouse down is working");
	article.style.opacity = 1;
});

article.addEventListener("mouseup", function(ev){
	console.log("Mouse up is working");
	article.style.opacity = opacity.value;
});