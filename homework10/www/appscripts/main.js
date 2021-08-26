
let iosocket = io.connect();

let chatBox = document.getElementById("chatBox");
let typingBox = document.getElementById("typingBox");

let name = prompt("Please enter your name");
name = name || "anon";

//on is similar to addEventListener (very commonly used - loads function on 'connect' event)
iosocket.on('connect', function () {
    console.log("Yo.........connected!");

    // MESSAGE PROCESSING HERE --------------
    iosocket.on('message', function(ev) {
        //console.log("You received a message: " + ev.data)
        //console.log(ev.datatype);

        if (ev.datatype === "chatText"){
            chatBox.value += ev.username + "> " + ev.data + "\n";
        };

        if (ev.datatype === "drawing"){
            raphaelPath = paper.path(ev.data).attr({"stroke": ev.color, "stroke-width": ev.strokewidth});
        };

        if (ev.datatype === "clearing"){
            paper.clear();
        };
    });

    //---------------------------------------
    
    iosocket.on('disconnect', function() {
        console.log("Disconnected")
    });
});


// When the user is typing and hits 'return', add the 
//     message to the chat window and send the text to the server (and thus to others)
typingBox.addEventListener('keypress', function(event){
	var mymessage; // holds tet from the typingBox
	if(event.which == 13) {  // 'return' key
		event.preventDefault();

        //-----------get text, construct message object and send ------------------------------
        myMessage = typingBox.value;
        chatBox.value += name + "> " + myMessage + "\n";
        typingBox.value = "";
        //-------------------------------------------------------------
        iosocket.send({"username" : name, "data" : myMessage, "datatype" : "chatText"});
	};
});


//---------------------------------------------
// Drawing chat 
//---------------------------------------------

let svgDiv = document.getElementById("svgcanvas");

var paper = new Raphael(svgcanvas);
var raphaelPath; // for holding path
var pathString; // for path string
var mousePushed = false; //tracking state

//mousedown
svgDiv.addEventListener("mousedown", function(ev){
    mousePushed = true;
    pathString = `M ${ev.offsetX}, ${ev.offsetY}`;

    //color string
    var colorString = "hsl(" + hue.value + "," + saturation.value + "," + lightness.value + ")";

    raphaelPath = paper.path(pathString).attr({"stroke": colorString, "stroke-width" : strokewidth.value});
});

//mousemove
svgDiv.addEventListener("mousemove", function(ev){
    if (mousePushed){
        pathString += `L ${ev.offsetX}, ${ev.offsetY}`;
        raphaelPath.attr({"path": pathString});
    };
});

//mouseup
svgDiv.addEventListener("mouseup", function(ev){
    if (mousePushed){
        pathString += `L ${ev.offsetX}, ${ev.offsetY}`;
        raphaelPath.attr({"path": pathString});

        //color string
        var colorString = "hsl(" + hue.value + "," + saturation.value + "," + lightness.value + ")";

        //when pathString ends
        iosocket.send({"data" : pathString, "datatype" : "drawing", "color" : colorString, "strokewidth" : strokewidth.value});
    };

    mousePushed = false;
});

//clearing canvas
let clear = document.getElementById("clear").addEventListener("click", function(ev){
    paper.clear();

    iosocket.send({"datatype": "clearing"})
});

//sliders
let hue = document.getElementById("hue");
let saturation = document.getElementById("saturation");
let lightness = document.getElementById("lightness");
let strokewidth = document.getElementById("stroke")