let chooseGame = document.getElementById("gameselect");
let endless = document.getElementById("endless")
let pingPongPopup = document.getElementById("pingpongstart")
let bulletHellPopupC = document.getElementById("bullethellstartC")
let bulletHellPopupE = document.getElementById("bullethellstartE")
let multiplayer = document.getElementById("multiplayer")
let footer = document.getElementById("footer");
let bullethellSettings = document.getElementById("bullethellSettings");
let pongSettings = document.getElementById("pongSettings");
let inputName = document.getElementById("namebox");

//music section
let musicVolumeSlider = document.getElementById("musicSlider")
let menuMusic = new Audio ("resources/menu.mp3");
let menuMusic2 = new Audio ("resources/menu2.mp3");
let menuMusic3 = new Audio ("resources/menu3.mp3");
let pongMusic = new Audio ("resources/lth.mp3")
let bulletHellMusic = new Audio ("resources/giorno.mp3");
let selectSound = new Audio ("resources/select.mp3");
let victoryMusic = new Audio ("resources/victory.mp3");
let loseMusic = new Audio ("resources/gameover.mp3");
let musicVolume = 0.5;
let musicState = 1;

let backHome;
let playerNum;
let playerName;

musicVolumeSlider.addEventListener("input", function(ev){
	musicVolume = musicVolumeSlider.value;
	menuMusic.volume = musicVolume;
	menuMusic2.volume = musicVolume;
	menuMusic3.volume = musicVolume;
	bulletHellMusic.volume = musicVolume;
	pongMusic.volume = musicVolume;
});


let prevSong = document.getElementById("prevSong").addEventListener("click", function(ev){
	bulletHellMusic.pause();
	pongMusic.pause();
	if (musicState === 1){
		musicState = 3;
		menuMusic.pause();
		menuMusic3.currentTime = 0;
		menuMusic3.play();
	} else if (musicState === 3){
		musicState = 2;
		menuMusic3.pause();
		menuMusic2.currentTime = 0;
		menuMusic2.play();
	} else if (musicState === 2){
		musicState = 1;
		menuMusic2.pause();
		menuMusic.currentTime = 0;
		menuMusic.play();
	};
});

let nextSong = document.getElementById("nextSong").addEventListener("click", function(ev){
	bulletHellMusic.pause();
	pongMusic.pause();
	if (musicState === 1){
		musicState = 2;
		menuMusic.pause();
		menuMusic2.currentTime = 0;
		menuMusic2.play();
	} else if (musicState === 2){
		musicState = 3;
		menuMusic2.pause();
		menuMusic3.currentTime = 0;
		menuMusic3.play();
	} else if (musicState === 3){
		musicState = 1;
		menuMusic3.pause();
		menuMusic.currentTime = 0;
		menuMusic.play();
	};
});
// end of music setion -----------------------------------------------------------------------------------------------------

//chatbox
let chatBox = document.getElementById("chatBox");
let typingBox = document.getElementById("typingBox");

typingBox.addEventListener('keypress', function(event){
	let myMessage; 
		if (event.which == 13) {
			if (playerName === undefined){
				alert("fk u enter name la");
				typingBox.value = "";
			} else if (playerName !== undefined){
				event.preventDefault();
			       
			    myMessage = typingBox.value;
			    chatBox.value += playerName + "> " + myMessage + "\n";
			    typingBox.value = "";
		        
		    	iosocket.send({"playerName" : playerName, "data" : myMessage, "datatype" : "chatText"});
		    };
	};
});
//end of chatbox -----------------------------------------------------------------------------------------------------


let confirm = document.getElementById("confirm").addEventListener("click", function(ev){
	selectSound.play();
	menuMusic.play();
	menuMusic.volume = 0.3;
	menuMusic.loop = true;
	document.getElementById("playerid").style.display = "none"
	chooseGame.style.display = "block";
	playerName = inputName.value || "anon";
	chooseGame.innerHTML = `<p class="message">Welcome to the arcade, ${playerName}!<br><br>Pick which game to play!</p><div class="options"><input class="btn" type="button" value="BULLET HELL" id="bullethell">
							<input class="btn" type="button" value="PING PONG" id="pingpong"></div>`;

	iosocket.send({"datatype": "username", "data": playerName});
	let startBulletHell = document.getElementById("bullethell").addEventListener("click", function(ev){
		selectSound.play();
		bulletHell(); // if wna animate, use setTimeout() to delay this during the transition
		chooseGame.style.display = "none";
		endless.style.display = "block";
		bulletHellPopupC.style.display = "block"
		console.log(playerNum);
		menuMusic.pause();
		bulletHellMusic.currentTime = 0;
		bulletHellMusic.play();
		bulletHellMusic.volume = musicVolume;
		bullethellSettings.style.display = "block";
	});

	let startPingPong = document.getElementById("pingpong").addEventListener("click", function(ev){
		selectSound.play();
		pingPong(); // if wna animate, use setTimeout() to delay this during the transition
		chooseGame.style.display = "none";
		pingPongPopup.style.display = "block";
		multiplayer.style.display = "block";
		console.log(playerNum);
		menuMusic.pause();
		pongMusic.currentTime = 0;
		pongMusic.play();
		pongMusic.volume = musicVolume;
		pongMusic.loop =  true;
		pongSettings.style.display = "block";
	});
});

//server connection stuff
let iosocket = io.connect();

iosocket.on('message', function(ev){
	if (ev.datatype === "playerCounter"){
		playerNum = ev.data;
	};

	if (ev.datatype === "serverMessage"){
		chatBox.value += ev.data + "\n";
	};

	if (ev.datatype === "chatText"){
        chatBox.value += ev.playerName + "> " + ev.data + "\n";
    };
});

/*window.addEventListener("beforeunload", function(ev){
	iosocket.send({'datatype': 'disconnect', 'data': playerName})
});*/

//bullet hell game code -------------------------------------------------------------------------------------------------------------
let bulletHell = function(){
	let centerDiv = document.getElementById("centerDiv");
	let paper = new Raphael(centerDiv);

	let lives = 3;
	let isMouseUp = false;
	let spawn;
	let spawnLivesVariable;
	let loadTime
	let time;
	let isEndlessOn = false;
	let timeState = 0;
	let currentTime;
	let shootFunction;
	let timer;
	let explosion;
	let victoryScreen;
	let spawnRate = 100;
	let spawnRateSlider = document.getElementById("spawnRate");
	spawnRateSlider.addEventListener("input", function(ev){
		spawnRate = spawnRateSlider.value;
		document.getElementById("spawnRateInfo").innerHTML = `Spawn Rate is now: ${Math.floor(1000/spawnRate)}`
	});
	let gameDuration = 30;
	let gameDurationSlider = document.getElementById("gameDuration")
	gameDurationSlider.addEventListener("input", function(ev){
		gameDuration = gameDurationSlider.value;
		document.getElementById("gameDurationInfo").innerHTML = `Game Duration is now: ${gameDuration}s`
	});

	footer.innerHTML = `<div id="textbox"><b>Classic Mode!</b><br> Avoid all the enemy bullets to escape!</div>`

	//Width and Height
	let dimX = paper.width - 30;
	let dimY = paper.height;

	
	let startGame = function(ev){
		selectSound.play();
		bulletHellPopupC.style.display = "none"
		bulletHellPopupE.style.display = "none"
		if (isMouseUp === false && isEndlessOn === false){ //puting this in a conditional stops the spawnEnemy function from running multiple times
			isMouseUp = true;
			spawn = setInterval(spawnEnemy, spawnRate); 
			time =  setInterval(startTimer, 50)
			loadTime = Date.now();
		}; 
		if (isMouseUp === false && isEndlessOn === true){
			isMouseUp = true;
			spawn = setInterval(endlessSpawn, 100); 
			time =  setInterval(startTimer, 50)
			loadTime = Date.now();
			spawnLivesVariable = setInterval(spawnLives, 15000);
			shootFunction = setInterval(spawnBullets, 75);
		}; 
	};

	//this part is to check for collision of true or not, and then run the necessary +/- 1 etc.
	let damage = function(ev){
		collision(playerCircle, bulletArray);
		//console.log(bulletArray.length)
	};

	let oneUp = function(ev){
		collisionLife(playerCircle, lifeArray);
	};

	let shooting = function(ev){
		collisionShoot(shootArray, bulletArray);
	};

	setInterval(damage, 50);
	setInterval(oneUp, 100);
	setInterval(shooting, 50);

	//game start box
	let bhStartC = document.getElementById("BHstartC").addEventListener("click", function(ev){
		startGame();
	});
	let bhStartE = document.getElementById("BHstartE").addEventListener("click", function(ev){
		startGame();
	});

	//death and victory box
	let victoryBox = document.getElementById("victorybox")
	let deathBox = document.getElementById("deathbox")
	let victoryYes = document.getElementById("yes2").addEventListener("click", function(ev){
		selectSound.play();
		victoryBox.style.display = "none";
		isMouseUp = true;
		loadTime = Date.now();
		if (isEndlessOn === false){
			spawn = setInterval(spawnEnemy, 100); //manipulate this value to adjust spawn rate
			time =  setInterval(startTimer, 50)
		} else if (isEndlessOn){
			spawn = setInterval(endlessSpawn, 100); //manipulate this value to adjust spawn rate
			time =  setInterval(startTimer, 50)
			spawnLivesVariable = setInterval(spawnLives, 15000);
			shootFunction = setInterval(spawnBullets, 75);
		};
	});
	let victoryNo = document.getElementById("no2").addEventListener("click", function(ev){
		selectSound.play();
		victoryBox.style.display = "none";
		paper.clear();
		chooseGame.style.display = "block";
		endless.style.display = "none"
		bullethellSettings.style.display = "none";
		footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`
		bulletHellMusic.pause();
		menuMusic.currentTime = 0;
		menuMusic.play();
		menuMusic.volume = 0.3;
	});
	let deathYes = document.getElementById("yes1").addEventListener("click", function(ev){
		selectSound.play();
		deathBox.style.display = "none";
		isMouseUp = true;
		loadTime = Date.now();
		if (isEndlessOn === false){
			spawn = setInterval(spawnEnemy, 100); //manipulate this value to adjust spawn rate
			time =  setInterval(startTimer, 50)
		} else if (isEndlessOn){
			spawn = setInterval(endlessSpawn, 100); //manipulate this value to adjust spawn rate
			time =  setInterval(startTimer, 50)
			spawnLivesVariable = setInterval(spawnLives, 15000);
			shootFunction = setInterval(spawnBullets, 75);
		};
	});
	let deathNo = document.getElementById("no1").addEventListener("click", function(ev){
		selectSound.play();
		deathbox.style.display = "none";
		paper.clear();
		chooseGame.style.display = "block";
		endless.style.display = "none"
		bullethellSettings.style.display = "none";
		footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`
		bulletHellMusic.pause();
		menuMusic.currentTime = 0;
		menuMusic.play();
		menuMusic.volume = 0.3;
	});

	//Game Space
	let rect = paper.rect(0, 0, dimX, 94/100*dimY).attr({
		"fill": "url(resources/bulletbg.jpg)", "stroke-width": 0,
	});

	//Distance Function
	let distance = function(p1, p2){
		return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
	};

	//event listener to toggle on and off the endless survival modde
	endless.addEventListener("click", function(ev){
		selectSound.play();
		if (isEndlessOn === false){
			isEndlessOn = true;
			endless.value = `Classic Mode`;
			footer.innerHTML = `<div id="textbox"><b>Endless Mode!</b><br>You've gained the ability to fight back! Survive as long as possible in this bullet hell!</div>`;
			bulletHellPopupE.style.display = "block";
			bulletHellPopupC.style.display = "none";
			victoryBox.style.display = "none";
			deathBox.style.display = "none";

			isMouseUp = false;
			clearInterval(spawn);			
			clearInterval(time);
			playerCircle.attr({
				"cx": 100,
				"cy": 47/100*dimY,
				"opacity": 1,
			});
			lives = 3;
			loadTime = Date.now();
			document.getElementById("spawnRateInfo").innerHTML = `Spawn Rate is now: Auto`
			document.getElementById("gameDurationInfo").innerHTML = `Game Duration is now: ∞`
		} else {
			isEndlessOn = false;
			endless.value = `Endless Mode`;
			footer.innerHTML = `<div id="textbox"><b>Classic Mode!</b><br>Avoid all the enemy bullets for 30 seconds to escape!</div>`
			bulletHellPopupE.style.display = "none";
			bulletHellPopupC.style.display = "block";
			victoryBox.style.display = "none";
			deathBox.style.display = "none";		

			isMouseUp = false;
			clearInterval(spawn);
			clearInterval(time);
			playerCircle.attr({
				"cx": 100,
				"cy": 47/100*dimY,
				"opacity": 1,
			});
			lives = 3;
			loadTime = Date.now();
			clearInterval(spawnLivesVariable);
			clearInterval(shootFunction);
			shootSound.pause();
			document.getElementById("spawnRateInfo").innerHTML = `Spawn Rate is now: ${Math.floor(1000/spawnRate)}`
			document.getElementById("gameDurationInfo").innerHTML = `Game Duration is now: ${gameDuration}s`
		};
	});

	let playerCircle = paper.circle(100, 47/100*dimY, 15).attr({
		"fill": "white",
		"stroke-width": 0
	});

	playerCircle.node.addEventListener("mousemove", function(ev){
		if (isMouseUp) {
			playerCircle.attr({
				"cx": ev.offsetX,
				"cy": ev.offsetY,
			});

		};
	});

	//as it was in class, put event listener on bg so it doesn't lose control
	rect.node.addEventListener("mousemove", function(ev){
		if (isMouseUp) {
			playerCircle.attr({
				"cx": ev.offsetX,
				"cy": ev.offsetY,
			});
			if (playerCircle.attr("cy") > 91/100*dimY){ // this is to limit the position of the circle so it doesn't go off the grid
				playerCircle.attr({
					"cy": 91/100*dimY 
				});
			};		
		};
	});

	//Enemy and Bullets
	//Random Generator
	let random = function(a, b){
		let range = b - a;
		let rand = Math.random()*range;
		return a+Math.floor(rand);
	};

	//storing enemy images in an arary
	let enemyIcons = [];

	enemyIcons[0] = new Image();
	enemyIcons[0].src = 'resources/yellowalien.png'
	enemyIcons[1] = new Image();
	enemyIcons[1].src = 'resources/bluealien.png'
	enemyIcons[2] = new Image();
	enemyIcons[2].src = 'resources/greenalien.png'
	enemyIcons[3] = new Image();
	enemyIcons[3].src = 'resources/orangealien.png'
	enemyIcons[4] = new Image();
	enemyIcons[4].src = 'resources/pinkalien.png'

	let startTimer = function(ev){
		timer = (Date.now()-loadTime)/1000;
		if (isEndlessOn === false){
			footer.innerHTML = `<div id="textbox">Classic Mode! Avoid all enemy bullets for 30 seconds to escape!<br><br>Lives left: ${lives}<br><br>Time: ${timer}</div>`;
		};
		if (isEndlessOn){
			footer.innerHTML = `<div id="textbox">Survival Mode! Test your reflexes and survive as long as possible.<br><br>Lives left: ${lives}<br><br>Time: ${timer}</div>`;
		};
	};

	//spawning enemies and oneups
	let bulletArray = [];

	let spawnEnemy = function(ev){
		let posX = random(dimX, dimX-15);
		let posY = random(0, 94/100*dimY-30);

		let bullet = paper.circle(posX, posY, 15).attr({
			"fill": `url(${enemyIcons[random(0,5)].src})`,
			"stroke-width": 0,
		});

		bullet.animate({
			"cx": posX-dimX-60,
		}, 1000, "linear", function(){
			bullet.remove();
			bulletArray.shift(); //automatically removes the bullet to keep the total objects at about 10/11, so the page doesn't potentially overload
		});

		bulletArray.push(bullet);

		if (timer > gameDuration){
			clearInterval(time);
			footer.innerHTML = `<div id="textbox">Congratulations! You made it!</div>`
			victoryMusic.play();
			victoryMusic.volume = 0.5;
			clearInterval(spawn);
			victoryScreen = paper.image("resources/victoryscreen.gif", 0, 0, dimX, 94/100*dimY).attr({"opacity": 0});
			victoryScreen.animate({
				"opacity": 1
			}, 1000);
			let endGame = function(ev){
				victoryBox.style.display = "block";
				paper.clear();

				//after paper.clear, got to create the objects again, and i even have to redefine the event listeners...
				rect = paper.rect(0, 0, dimX, 94/100*dimY).attr({
					"fill": "url(resources/bulletbg.jpg)", "stroke-width": 0,
				});

				playerCircle = paper.circle(100, 47/100*dimY, 15).attr({
					"fill": "white",
					"stroke-width": 0
				});

				playerCircle.node.addEventListener("mousemove", function(ev){
					if (isMouseUp) {
						playerCircle.attr({
							"cx": ev.offsetX,
							"cy": ev.offsetY,
						});

					};
				});

				rect.node.addEventListener("mousemove", function(ev){
					if (isMouseUp) {
						playerCircle.attr({
							"cx": ev.offsetX,
							"cy": ev.offsetY,
						});
						if (playerCircle.attr("cy") > 91/100*dimY){ // this is to limit the position of the circle so it doesn't go off the grid
							playerCircle.attr({
								"cy": 91/100*dimY 
							});
						};		
					};
				});
				loadTime = Date.now(); //resets the current loadTime to reset timer
				isMouseUp = false;
				playerCircle.attr({
					"cx": 100,
					"cy": 47/100*dimY,
					"opacity": 1,
				});
				lives = 3;
				loadTime = Date.now();
			};
			setTimeout(endGame, 3000);
		};
	};

	let lifeArray = [];

	let spawnLives = function(ev){
		let posX = random(dimX, dimX-15);
		let posY = random(0, 94/100*dimY-30);

		let life = paper.circle(posX, posY, 15).attr({
			"fill": "url(resources/oneup.png)",
			"stroke-width": 0
		});

		life.animate({
			"cx": posX-dimX-60,
		}, 2000, "linear", function(){
			life.remove();
			lifeArray.shift(); //removes the life to keep the total objects at about 10/11, so the page doesn't potentially overload
		});

		lifeArray.push(life);

	};

	//spawning the shooter bullets, i named the enemies "bullets" initially and i'll leave it so i don't mess up the rest of my code
	let shootArray = [];
	let shootSound = new Audio ("resources/shoot.mp3")

	let spawnBullets = function(ev){
		let shoot = paper.circle(playerCircle.attr("cx")+15, playerCircle.attr("cy"), 5).attr({
			"fill": "red",
			"stroke-width": 0
		});

		shoot.animate({
			"cx": playerCircle.attr("cx")+dimX,
		}, 1000, "linear", function(){
			shoot.remove();
			shootArray.shift(); //removes the shoot to keep the total objects at about 10/11, so the page doesn't potentially overload
		});

		shootArray.push(shoot);

        shootSound.play();
        shootSound.volume=.05;
	};

	//endless mode
	let endlessSpawn = function(ev){
		let posX = random(dimX, dimX+30);
		let posY = random(0, 94/100*dimY-30);

		let bullet = paper.circle(posX, posY, 15).attr({
			"fill": `url(${enemyIcons[random(0,5)].src})`,
			"stroke": 0,
		});

		let yrate = random(0, 250)  * (Math.round(Math.random()) * 2 - 1)

		bullet.animate({
			"cx": posX-dimX-60,
			"cy": posY + yrate,
		}, 1000, "linear", function(){
			bullet.remove();
			bulletArray.shift();
		});

		bulletArray.push(bullet);

		if (timer > 10 && timeState === 0){
			clearInterval(spawn); 
			spawn = setInterval(endlessSpawn, 65)
			timeState = 1;
		} else if (timer > 20 && timeState === 1){
			clearInterval(spawn); 
			spawn = setInterval(endlessSpawn, 50)
			timeState = 2;
		} else if (timer > 30 && timeState === 2){
			clearInterval(spawn);
			spawn = setInterval(endlessSpawn, 30)
			timeState = 3;
		};
		//console.log(bulletArray);
	};

	//setting the collision
	let collision = function(a, b){
		if (Date.now() - currentTime > 3000 || !currentTime){ //this conditions sets an invincibility timer of about 3seconds after taking damage
			let playerCoords = {
			"x": a.attr("cx"),
			"y": a.attr("cy"),
		};
		for (var bullet of b){
			let bulletCoords = {
				"x": bullet.attr("cx"),
				"y": bullet.attr("cy"),
			};	
			let d = distance(playerCoords, bulletCoords);

			if (d < a.attr("r") + bullet.attr("r")){
				lives --;
				loseMusic.play();
				currentTime = Date.now(); //records the time player hits a bullet to use to measure invulnerability period
				gameOver();

				break;
				};			
			};
		};
	};

	//measuring collision with the one up spawns, same code as above
	let collisionLife = function(a, b){
		let playerCoords2 = {
			"x": a.attr("cx"),
			"y": a.attr("cy"),
		};
		for (var life of b){
			let lifeCoords = {
				"x": life.attr("cx"),
				"y": life.attr("cy"),
			};	
			let d2 = distance(playerCoords2, lifeCoords);

			if (d2 < a.attr("r") + life.attr("r")){
				lives ++;
				life.hide();

				break;
			};			
		};
	};

	let collisionShoot = function(a, b){
		for (var shoot of a){
			let shootCoords = {
				"x": shoot.attr("cx"),
				"y": shoot.attr("cy"),
			};
			for (var bullet of b){
				let bulletCoords = {
					"x": bullet.attr("cx"),
					"y": bullet.attr("cy"),
				};	
				let d2 = distance(shootCoords, bulletCoords);

				if (d2 < shoot.attr("r") + bullet.attr("r")){
					bullet.remove();

					break;
				};			
			};
		};
	};

	let gameOver = function(ev){ //this entire function is to reset the game to the original state
		if (lives === 0){
			deathBox.style.display = "block";
			isMouseUp = false;
			clearInterval(spawn);
			clearInterval(spawnLivesVariable);
			playerCircle.attr({
				"cx": 100,
				"cy": 47/100*dimY,
				"opacity": 1,
			});
			lives = 3;
			clearInterval(time);
			footer.innerHTML = `<div id="textbox">Classic Mode! Avoid all the enemy bullets for 30 seconds to escape!</div>`
			loadTime = Date.now();
			clearInterval(shootFunction);
			shootSound.pause();
			loseMusic.play();
		};
	};

	backHome = document.getElementById("home").addEventListener("click", function(ev){
		selectSound.play();
		paper.clear();
		clearInterval(spawn);
		clearInterval(shootFunction);
		clearInterval(time);
		chooseGame.style.display = "block";
		endless.style.display = "none";
		bullethellSettings.style.display = "none";
		bullethellstartC.style.display = "none";
		bullethellstartE.style.display = "none";
		footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`;
		bulletHellMusic.pause();
		shootSound.pause();
		menuMusic.pause();
		menuMusic2.pause();
		menuMusic3.pause();
		menuMusic.currentTime = 0;
		menuMusic.play();
	});
};

//-------------------------------Ping Pong Game Starts Here-------------------------------

let pingPong = function(){

	let isMouseDown;

	iosocket.on('message', function(ev){
		if (ev.datatype === "runGame"){
			selectSound.play();
			isMultiplayerOn = true;
			pingPongPopup.style.display = "none"
			isMouseDown = true;
			startTime = Date.now();
			console.log("is mouse down: " + isMouseDown)
			console.log("is multi on: " + isMultiplayerOn)
			gameRun = setInterval(draw, 20);
		};

		if (ev.datatype === "ballPos"){
			ball.attr({
				"cx": ev.dataX,
				"cy": ev.dataY
			});
		};;

		if (ev.datatype === "player1Pos"){
			playerPaddle.attr({
				"y": ev.data,
			});
		};

		if (ev.datatype === "player2Pos"){
			aiPaddle.attr({
				"y": ev.data,
			});
		};

		if (ev.datatype === "nextRound"){
			clearInterval(gameRun)
			gameRun = setInterval(draw, 20);
			pingPongTracker.style.display = "none";
			isMouseDown = true;
		};

		if (ev.datatype === "disconnect"){
			clearInterval(gameRun)
			disconnectTracker.style.display = "block"
			disconnetHome = document.getElementById("returnHome").addEventListener("click", function(ev){
				disconnectTracker.style.display = "none";
				pongSettings.style.display = "none"
				selectSound.play();
				pongMusic.pause();
				menuMusic.pause();
				menuMusic2.pause();
				menuMusic3.pause();
				menuMusic.currentTime =  0;
				menuMusic.play();
				paper.clear();
				clearInterval(gameRun);
				chooseGame.style.display = "block";
				pingPongPopup.style.display = "none";
				pingPongTracker.style.display = "none";
				multiplayer.style.display = "none";
				footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`
			});
		};
	});

	let disconnectTracker = document.getElementById("multitracker");
	let disconnetHome;

	//Creating Paper
	let centerDiv = document.getElementById("centerDiv");
	let paper = new Raphael(centerDiv);

	let playerCounter = 0;
	let aiCounter = 0;
	let hitCounter = 0;
	let startTime;
	let elapsedTime;
	let isMultiplayerOn = false;
	let gameRun;
	let startButton;

	let noRounds = 5;
	let noRoundsSlider = document.getElementById("gameRounds");
	noRoundsSlider.addEventListener("input", function(ev){
		noRounds = noRoundsSlider.value;
		document.getElementById("gameRoundsInfo").innerHTML = `${Math.floor(noRounds)} Points to Win!`
	});

	footer.innerHTML = `<div id="textbox"><b>Welcome to Ping Pong!</b><br> Test your skills against the AI or play with friends!</div>`

	//Random Generator
	let random = function(a, b){
		let range = b - a;
		let rand = Math.random()*range;
		return a+Math.floor(rand);
	};

	//Width and Height
	let dimX = paper.width - 30;
	let dimY = paper.height;

	//Game Space
	let rect = paper.rect(0, 0, dimX, 94/100*dimY).attr({
		"fill": "#28282B", "stroke-width": 0,
	});

	//Paddles &  pingpong
	let playerPaddle = paper.rect(10, 1/6*dimY, 10, 130).attr({
		"fill": "white", "stroke-width": 0,
	});

	let aiPaddle = paper.rect(dimX-20, 3/6*dimY, 10, 130).attr({
		"fill": "white", "stroke-width": 0,
	});

	let ball = paper.circle(dimX/2, dimY/2, 10).attr({
		"fill": "white",
	});

	//single or multiplayer settings
	multiplayer.addEventListener("click", function(ev){
		selectSound.play();
		if (isMultiplayerOn === false){
			isMultiplayerOn = true;
			multiplayer.value = "Single Player"
			console.log(isMultiplayerOn);
			pingPongPopup.innerHTML = `<p class="message">Multiplayer mode!<br><br></p><div class="options"><input class="btn" type="button" value="START" id="start">`
			startButton = document.getElementById("start").addEventListener("click", function(ev){ //need to redefine the variable since it's been "reset" when changing the innerHTML in the line above
				selectSound.play();
				pingPongPopup.style.display = "none"
				isMouseDown = true;
				startTime = Date.now();
				gameRun = setInterval(draw, 20);

				iosocket.send({"datatype": "runGame"})
			});
		} else if (isMultiplayerOn){
			isMultiplayerOn = false;
			multiplayer.value = "Multiplayer"
			console.log(isMultiplayerOn);
			pingPongPopup.innerHTML = `<p class="message">Single player mode!<br><br></p><div class="options"><input class="btn" type="button" value="START" id="start">`
			startButton = document.getElementById("start").addEventListener("click", function(ev){ //need to redefine the variable since it's been "reset" when changing the innerHTML in the line above
				selectSound.play();
				pingPongPopup.style.display = "none"
				isMouseDown = true;
				startTime = Date.now();
				gameRun = setInterval(draw, 20);
			});
		};
	});

	//this entire section of code tells the game whih paddle to assign control for multiplayer functionality
	rect.node.addEventListener("mousemove", function(ev){
		if (isMouseDown && playerNum > 0 && isMultiplayerOn === false){
			playerPaddle.attr({
				"y": ev.offsetY-60,
			});

			if (playerPaddle.attr("y") > 94/100*dimY-130){
				playerPaddle.attr({
					"y": 94/100*dimY-130,
				});
			};

			if (playerPaddle.attr("y") < 0){
				playerPaddle.attr({
					"y": 0,
				});
			};
		} else if (isMouseDown && playerNum === 1 && isMultiplayerOn){
			playerPaddle.attr({
				"y": ev.offsetY-60,
			});

			if (playerPaddle.attr("y") > 94/100*dimY-130){
				playerPaddle.attr({
					"y": 94/100*dimY-130,
				});
			};

			if (playerPaddle.attr("y") < 0){
				playerPaddle.attr({
					"y": 0,
				});
			};

			iosocket.send({"datatype": "player1Pos", "data": playerPaddle.attr("y")});

		} else if (isMouseDown && playerNum === 2 && isMultiplayerOn){
			aiPaddle.attr({
				"y": ev.offsetY-60,
			});

			if (aiPaddle.attr("y") > 94/100*dimY-130){
				aiPaddle.attr({
					"y": 94/100*dimY-130,
				});
			};

			if (aiPaddle.attr("y") < 0){
				aiPaddle.attr({
					"y": 0,
				});
			};

			iosocket.send({"datatype": "player2Pos", "data": aiPaddle.attr("y")});
		};
	});

	startButton = document.getElementById("start").addEventListener("click", function(ev){
		selectSound.play();
		pingPongPopup.style.display = "none"
		isMouseDown = true;
		startTime = Date.now();
		ball.xpos = dimX/2;
		ball.ypos = dimY/2;
		gameRun = setInterval(draw, 20);
	});

	let pongSound = new Audio ("resources/pong.mp3");

	let collision = function(ball, paddle){
		let distX = Math.abs(ball.attr("cx") - paddle.attr("x") - paddle.attr("width") / 2);
		let distY = Math.abs(ball.attr("cy") - paddle.attr("y") - paddle.attr("height") / 2);

		if (distX > (paddle.attr("width") / 2 + ball.attr("r"))){
			return false;
		};
		if (distY > (paddle.attr("height") / 2 + ball.attr("r"))){
			return false;
		};
		if (distX <= (paddle.attr("width") / 2)){
			return true;
		};
		if (distY <= (paddle.attr("height") / 2)){
			return true;
		};

		let dx = distX - paddle.attr("width") / 2;
		let dy = distY - paddle.attr("height") / 2;

		return (dx * dx + dy * dy <= (ball.attr("r") *ball.attr("r")));
	};

	let randomNum = 0;

	//calculates when it hits paddle to change direction and increase speed
	let collisionDetection = function(ev){
		if (collision(ball, playerPaddle) || collision(ball, aiPaddle)){
	        ball.xrate = - ball.xrate;
	        pongSound.pause();
	        pongSound.play();
	        if (hitCounter++ < 20){
	        	ball.xrate *= 1.1; //best way to increment it, addressed this issue in diary
	        	console.log(hitCounter);
	        };
		};
		if (collision(ball, playerPaddle) && hitCounter > 10){
			randomNum = random(0, 80)  * (Math.round(Math.random()) * 2 - 1); //75 is the cut off for error, so the range should be around it, manipulate this for difficulty
			// console.log(randomNum);
		};
	};

	ball.xpos = dimX/2;     
	ball.ypos = dimY/2;
	ball.xrate = -5;
	ball.yrate = -5;

	let distance = function(p1, p2){
		return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
	};

	let collisionWall = function(a, b){
	    a = {
	        "x": a.attr("x"),
	        "y": a.attr("y"),
	    };

	    b = {
	        "x": b.attr("cx"),
	        "y": b.attr("cy"),
	    };

	    let d = distance(a, b);

	    if (d < playerPaddle.attr("y") + ball.attr("r")){
	        return true;
	    } else {
	        return false;
	    };
	};

	let pingPongTracker = document.getElementById("pingpongtracker");

	let scorePoint = new Audio ("resources/pluspoints.mp3");

	//draw function to run the game
	var draw = function(ev){

	    // Update the position where we want our ball to be
	    ball.xpos += ball.xrate;
	    ball.ypos += ball.yrate;

	    // Now actually move the ball using our 'state' variables
	    ball.attr({'cx': ball.xpos, 'cy': ball.ypos});

	    collisionWall(playerPaddle, ball)

	    //collision with top and bottom
	    if (ball.ypos > 94/100*dimY-15) {
	        ball.yrate = - ball.yrate;
	    };

	    if (ball.ypos < 0) {
	        ball.yrate = - ball.yrate;
	    };

	    //resets game when one scores a point
	    if (ball.xpos < 0) {
	    	scorePoint.play();
	    	aiCounter++;
	    	hitCounter = 0;
	    	ball.xpos = dimX/2;
	    	ball.ypos = dimY/2;
	    	ball.xrate = -5;
	    	ball.yrate = -5;
	    	randomNum = 0; //resets error rate
	    	clearInterval(gameRun);    	
	    	pingPongTracker.style.display = "block";
	    	pingPongTracker.innerHTML = `<p class="message">Point for AI! AI Points: ${aiCounter}<br><br>Game will resume immediately after pressing 'OK'!</p><div class="options"><input class="btn" type="button" value="OK" id="ok"></div>`;
	    	document.getElementById("ok").addEventListener("click", function(ev){
				clearInterval(gameRun)
				gameRun = setInterval(draw, 20);
				pingPongTracker.style.display = "none";

				iosocket.send({"datatype": "nextRound"})
			});
	    	ball.attr({'cx': dimX/2, 'cy': dimY/2});
	    	if (aiCounter > Math.floor(noRounds)-1){ 
	    		loseMusic.play();
	    		aiCounter = 0
	    		isMouseDown = false;
	    		pingPongTracker.style.display = "block";
	    		pingPongTracker.innerHTML = `<p class="message">AI wins! Good luck next time!<br><br>Try again?</p><div class="options"><input class="btn" type="button" value="OK" id="ok"></div><div class="options"><br><input class="btn" type="button" value="HOME" id="home1"></div>`;
	    		scorePoint.play();
	    		document.getElementById("ok").addEventListener("click", function(ev){
					selectSound.play();
					clearInterval(gameRun)
					gameRun = setInterval(draw, 20);
					pingPongTracker.style.display = "none";
					isMouseDown = true;

					iosocket.send({"datatype": "nextRound"})
				});
				document.getElementById("home1").addEventListener("click", function(ev){
					selectSound.play();
					pongMusic.pause();
					menuMusic.currentTime = 0;
					menuMusic.play();
					paper.clear();
					clearInterval(gameRun);
					chooseGame.style.display = "block";
					pingPongTracker.style.display = "none";
					multiplayer.style.display = "none";
					pongSettings.style.display = "none";
					footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`
				});
	    	};
	    };

	    if (ball.xpos > dimX) {
	    	scorePoint.play();
	    	playerCounter++;
	    	hitCounter = 0;
	    	ball.xpos = dimX/2;
	    	ball.ypos = dimY/2;
	    	ball.xrate = 5;
	    	ball.yrate = 5;
	    	randomNum = 0; //resets error rate
	    	clearInterval(gameRun);    	
	    	pingPongTracker.style.display = "block";
	    	pingPongTracker.innerHTML = `<p class="message">Point for Player! Player Points: ${playerCounter}<br><br>Game will resume immediately after pressing 'OK'!</p><div class="options"><input class="btn" type="button" value="OK" id="ok"></div>`;
	    	document.getElementById("ok").addEventListener("click", function(ev){
	    		selectSound.play();
				clearInterval(gameRun)
				gameRun = setInterval(draw, 20);
				pingPongTracker.style.display = "none";
				isMouseDown = true;

				iosocket.send({"datatype": "nextRound"})
			});
	    	ball.attr({'cx': dimX/2, 'cy': dimY/2});
	    	if (playerCounter > Math.floor(noRounds)-1){ 
	    		victoryMusic.play();
	    		playerCounter = 0
	    		isMouseDown = false;
	    		pingPongTracker.style.display = "block";
	    		pingPongTracker.innerHTML = `<p class="message">Player wins! Good job!<br><br>Play again?</p><div class="options"><input class="btn" type="button" value="OK" id="ok"></div><div class="options"><br><input class="btn" type="button" value="HOME" id="home1"></div>`;
	    		document.getElementById("ok").addEventListener("click", function(ev){
					clearInterval(gameRun)
					gameRun = setInterval(draw, 20);
					pingPongTracker.style.display = "none";
					isMouseDown = true;

					iosocket.send({"datatype": "nextRound"})
				});
				document.getElementById("home1").addEventListener("click", function(ev){
					selectSound.play();
					pongMusic.pause();
					menuMusic.currentTime = 0;
					menuMusic.play();
					paper.clear();
					clearInterval(gameRun);
					chooseGame.style.display = "block";
					pingPongTracker.style.display = "none";
					multiplayer.style.display = "none";
					pongSettings.style.display = "none";
					footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`
				});
	    	};
	    };

	    //measuring time elapsed - to increase difficulty changing y rate
	    //not sure what i did wrong here, but using states similar to what i did in the bullet hell game didn't work
	    //likely just a careless mistake on my part, but since this work i'm leaving it, the specific values were taken after console logging the timer
	    elapsedTime = (Date.now() - startTime)/1000;
	    if (elapsedTime > 5 && elapsedTime < 5.02){
	    	ball.yrate *= 1.3;
	    } else if (elapsedTime > 10 && elapsedTime < 10.02){
	    	ball.yrate *= 1.3;
	    } else if (elapsedTime > 15 && elapsedTime < 15.02){
	    	ball.yrate *= 1.3;
	    } else if (elapsedTime > 30 && elapsedTime < 30.02){
	    	ball.yrate *= 1.3;
		};

		//making the AI move, but this equation makes it essentially faultless
		if (isMultiplayerOn === false){
			aiPaddle.attr({
				"y": (ball.attr("cy") - (aiPaddle.attr("height") / 2)) + randomNum, //this random num fixes the 'faultless' issue
			});

			if (aiPaddle.attr("y") > 94/100*dimY-130){
					aiPaddle.attr({
						"y": 94/100*dimY-130,
					});
				};

			if (aiPaddle.attr("y") < 0){
					aiPaddle.attr({
						"y": 0,
					});
				};
			};

		if (isMultiplayerOn){ //write in this condition so ball position doesn't send and clash when someone else is on the site on singleplayer
			iosocket.send({"datatype": "ballPos", "dataX": ball.xpos, "dataY": ball.ypos});
		};
	};

	setInterval(collisionDetection, 20);

	backHome = document.getElementById("home").addEventListener("click", function(ev){
		selectSound.play();
		pongMusic.pause();
		menuMusic.pause();
		menuMusic2.pause();
		menuMusic3.pause();
		menuMusic.currentTime =  0;
		menuMusic.play();
		paper.clear();
		clearInterval(gameRun);
		chooseGame.style.display = "block";
		pingPongPopup.style.display = "none";
		pingPongTracker.style.display = "none";
		multiplayer.style.display = "none";
		pongSettings.style.display = "none";
		pingPongPopup.innerHTML = `<p class="message">Single player mode!<br><br></p><div class="options"><input class="btn" type="button" value="START" id="start">`
		footer.innerHTML = `<div id="textbox">Done already? Try something else!</div>`

		if (isMultiplayerOn){
			iosocket.send({"datatype": "disconnect"});
		};
	});

};