BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
};

// afmetingen 
// gewenste verhouding en coordinaat stelsel
var MyGameMaxX = 400;
var MyGameMaxY = 800;

// offset om de linkerbovenhoek te bepalen
var TopLeftX = 0;
var TopLeftY = 0;

// werkelijke maximum afmeting in pixels
var maxx; 
var maxy; 


// background images
var bg;
// bevat de layout van de de garage, of whatever
var board;
// bevat 'auto' obejecten
var car;

var	b_dialog;
var	b_yes;
var	b_no;

var spriteSize = 64;	// fysieke afmeting
var CellSize = 48;		// grid size on display
var shifty = 0; 		// de dhift die nodig is om het grod in het midden te ktrijgen
var niveau = 'easy';
var currentLevel = 0;
var allLevels = [];
var progressLevels = [];
var minMoves;
var textLevel;
var textMoves;
var textMinMoves;
var i_check;

var moves = 0;
var lastx = 0;
var lasty = 0;

var currentThema = 2;


function GetDimensions() {
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		maxx = this.game.world.width;
		maxy = this.game.world.height;
		
		var verhoudingX = maxx / MyGameMaxX;
		var verhoudingY = maxy / MyGameMaxY;
		
		if (verhoudingX < verhoudingY) 
		{
			// de orginele verhouding gebruiken op de nieuwe X om Y te vinden
			MyGameMaxY =maxx * (MyGameMaxY/ MyGameMaxX)
			MyGameMaxX = maxx;
		}
		else
		{
			// de orginele verhouding gebruiken op de nieuwe Y om X te vinden
			MyGameMaxX = maxy * (MyGameMaxX / MyGameMaxY)
			MyGameMaxY = maxy;
		}

		TopLeftX = (maxx - MyGameMaxX) / 2;
		TopLeftY = (maxy - MyGameMaxY) / 2;
			
		var style = { font: "32px Arial", fill: "#ff0044", align: "center"};
    	//text = game.add.text(maxx/2, maxy/2, "placeholder", style);
    	//text.anchor.set(0.5);
		
		var sprite = game.add.sprite(TopLeftX, TopLeftY, 'target');	
		sprite.anchor.set(0.5);
		
		sprite = game.add.sprite(TopLeftX + MyGameMaxX, TopLeftY, 'target');
		sprite.anchor.set(0.5);
		
		sprite = game.add.sprite(TopLeftX, TopLeftY + MyGameMaxY, 'target');
		sprite.anchor.set(0.5);
		
		sprite = game.add.sprite(TopLeftX + MyGameMaxX, TopLeftY + MyGameMaxY, 'target');
		sprite.anchor.set(0.5);
}

function drawBorder() {
	  // boven
    for (var i = 0; i< 7; i++) {
		var sp =this.game.add.sprite(TopLeftX + i * CellSize, (shifty-1) * CellSize, 'mushroom1');    
		sp.frame = currentThema;
		sp.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
        //BasicGame.game.add.sprite(i * CellSize, CellSize, 'mushroom1');            
    }
    // onder
    for (var i = 0; i< 8; i++) {
        sp = this.game.add.sprite(TopLeftX + i * CellSize, (6 + shifty) * CellSize, 'mushroom1');
		sp.frame = currentThema;
		sp.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
    }
    // links
    for (var i = (shifty-1); i< (6 + shifty); i++) {
        sp = this.game.add.sprite(TopLeftX, i * CellSize, 'mushroom1');            
		sp.frame = currentThema;
		sp.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
    }
    // rechts
     for (var i = (shifty-1); i< (6 + shifty); i++) {
        if (i!=(4+shifty-2))  {
            sp = this.game.add.sprite(TopLeftX +  + 7 * CellSize, i * CellSize, 'mushroom1'); 
			sp.frame = currentThema;
			sp.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
        }
    }
}

function fillLevel(level) { 
    board = [[0,0,0,0,0,0],
			 [0,0,0,0,0,0],
			 [0,0,0,0,0,0],
			 [0,0,0,0,0,0],
			 [0,0,0,0,0,0],
			 [0,0,0,0,0,0]];

	// B40v3|A02h2|02
	debugger;
	car = [];
	var carlvl = level.split('|');
	for (var c=0; c<carlvl.length - 1; c++)
	{
		var cc = {nummer: carlvl[c].substr(0,1), x:parseInt(carlvl[c].substr(1,1)), y:parseInt(carlvl[c].substr(2,1)),
				 orientation:carlvl[c].substr(3,1), lengte:parseInt(carlvl[c].substr(4,1))}
		car.push(cc);
	}
	
	minMoves = 1.0 * carlvl[carlvl.length - 1]
		/*car = [
		{ nummer:'A', x:0, y:2, orientation: 'h', lengte:2},
		{ nummer:'B', x:1, y:0, orientation: 'h', lengte:1},
		{ nummer:'C', x:2, y:0, orientation: 'h', lengte:2},
		{ nummer:'D', x:4, y:0, orientation: 'h', lengte:2},
		{ nummer:'F', x:3, y:1, orientation: 'v', lengte:2},
			
		{ nummer:'G', x:1, y:3, orientation: 'h', lengte:3},
		{ nummer:'H', x:1, y:4, orientation: 'h', lengte:3}
		];*/
}

function addToBoard(aCar) {
	// x en y gewisseld zodat het board in de debugger overeenkomt met de layout op papier
	if (aCar.orientation == 'v') {
        for(ii=0; ii< aCar.lengte; ii++) {
            board[aCar.y+ii][aCar.x] = 1;
        }
    }
    else {
        for(ii=0; ii< aCar.lengte; ii++) {
            board[aCar.y][aCar.x + ii] = 1;
        }
    }
}

function onDown(_sprite, pointer) {
	_sprite.int =  0x333333;
}

//https://phaser.io/examples/v2/input/drag-event-parameters
function onDragStart(_sprite, pointer) {

    var result = "Dragging " + _sprite.carindex;
	// get xy from Car
	// match x,y to Car
	
	if (car[_sprite.carindex].orientation == 'h') {
        // waar staat hij x,y
		var bx = car[_sprite.carindex].x; 
		var by = car[_sprite.carindex].y;
		var len = car[_sprite.carindex].lengte;
		
		// even bewaren waar ik vandaan kom
		lastx = bx;
		lasty = by;
		
		// aantal lege vakjes rechts van car
		var doorgaan = true;
		var spelling = 1;
		while (doorgaan && bx + len + spelling - 1 < 6) {
			if (board[by][bx+ len + spelling - 1]== 0) 
			{ 
				spelling++; 
			}
			else
			{
				doorgaan = false;
			}
		}
		// en een terug want boem is ho
		spelling--;
		
		// aantal vakjes links
		doorgaan = true;
		var spellingL = -1;
		while (doorgaan && bx + spellingL > -1) {
			if (board[by][bx + spellingL]== 0) 
			{ 
				spellingL--; 
			}
			else
			{
				doorgaan = false;
			}
		}
		// en een terug want boem is ho
		spellingL++;
		
		
		var bounds = new Phaser.Rectangle(TopLeftX + (bx + spellingL + 1) * CellSize, 0, (spelling - spellingL + len) * CellSize, 800); //(0 en 880) is heel scherm
    	_sprite.input.boundsRect = bounds;
		
		// XXX delete car from board
        for (cd=0; cd<len; cd++)
		{
			board[by][bx+cd]= 0
		}      
		// set the drag bounds
		
	}
	else { // (car[_sprite.carindex].orientation == 'v') {
        // waar staat hij x,y
		var bx = car[_sprite.carindex].x; 
		var by = car[_sprite.carindex].y;
		var len = car[_sprite.carindex].lengte;
		
		// even bewaren waar ik vandaan kom
		lastx = bx;
		lasty = by;
		
		// aanatal lege vakjes rechts van car
		var doorgaan = true;
		var spelling = 1;
		while (doorgaan && by + len + spelling - 1 < 6) {
			if (board[by + len + spelling - 1][bx]== 0) 
			{ 
				spelling++; 
			}
			else
			{
				doorgaan = false;
			}
		}
		// en een terug want boem is ho
		spelling--;
		
		
		// aantal vakjes links
		doorgaan = true;
		var spellingL = -1;
		while (doorgaan && by + spellingL > -1) {
			if (board[by + spellingL][bx]== 0) 
			{ 
				spellingL--; 
			}
			else
			{
				doorgaan = false;
			}
		}
		// en een terug want boem is ho
		spellingL++;
		
		// set the drag bounds. van spritestart -> len + spelling
		//var bounds = new Phaser.Rectangle((bx + spellingL + 1) * CellSize, 0, (spelling - spellingL + len) * CellSize, 800); //(0 en 880) is heel scherm
 
		var bounds = new Phaser.Rectangle(0, (by + spellingL + shifty) * CellSize, 	800, (spelling - spellingL + len) * CellSize); //(0 en 880) is heel scherm
    	_sprite.input.boundsRect = bounds;
		
		// XXX delete car from board
        for (cd=0; cd<len; cd++)
		{
			board[by+cd][bx]= 0
		}
	}
	
	// even een tintje grijzer bij dragstart
	_sprite.tint =  0xaaaaaa;
}

function onDragStop(_sprite, pointer) {
    // snap the sprite on a CellSizepixel grid
    var xx = _sprite.x;   
    xx = Math.floor((xx-TopLeftX+CellSize/2)/CellSize) * CellSize;
    //_sprite.x = x;
	
	var yy = _sprite.y;   
    yy = Math.floor((yy+CellSize/2)/CellSize) * CellSize;
    //_sprite.y = y;
	_sprite.tint =  0xffffff;
	
	// set xy in cars
	var bx =  Math.floor((xx+CellSize/2)/CellSize) * CellSize;
	var by =  Math.floor((yy+CellSize/2)/CellSize) * CellSize;
	var len = car[_sprite.carindex].lengte;

	var a = realx2boardx(bx); 
	car[_sprite.carindex].x = a; 
	var b = realy2boardy(by);
	car[_sprite.carindex].y = b;
   
		// alleen tellen als de brik ook verplaatst is
	moves++;
	if (lastx == a && lasty == b) {
		moves--;
	}
	textMoves.text = moves + " moves so far";
	
	// exit?
	var movetime = 200;
	if (a == 4 && b == 2 && car[_sprite.carindex].nummer == 'A') 
	{
		xx = 600;
		movetime = 2000;
		tween = this.game.add.tween(_sprite).to( { x: xx + TopLeftX}, movetime, Phaser.Easing.Cubic.InOut, true);
		tween2 = this.game.add.tween(_sprite).to( { y: yy }, movetime, Phaser.Easing.Cubic.InOut, true);
		
		// save progres
		progressLevels[currentLevel] = 1;
		localStorage.setItem(niveau + 'progres', JSON.stringify(progressLevels));
		
		currentLevel++;
		tween2.onComplete.add(onLevelComplete, this);
	}
	else
	{
		this.game.add.tween(_sprite).to( { x: xx + TopLeftX}, movetime, Phaser.Easing.Cubic.InOut, true);
		this.game.add.tween(_sprite).to( { y: yy }, movetime, Phaser.Easing.Cubic.InOut, true);
	}
	
	
	// put car on board
	addToBoard(car[_sprite.carindex]);
}


function boardx2realx(boardx) {
	return (boardx + 1) * CellSize + TopLeftX;
}

function boardy2realy(boardy) {
	var y =  (boardy + shifty)  * CellSize;
	//y = (boardy + 2.5)  * CellSize;
	return y;
}

function realx2boardx(realx) {
	return ((realx) / CellSize ) -1;
}

function realy2boardy(realy) {
	var y = (realy  / CellSize) - shifty;
	//y = (boardy / CellSize) - 2.5;
	return y;
}

function drawLevel() {
	
	// level al gehaald, draw checkmark
	if (progressLevels[currentLevel] == 1) {
		i_check.alpha = 1;
	}
	else {
		i_check.alpha = 0;
	}
	
	// draw level
	for (i=0; i<car.length; i++)
	{
        addToBoard(car[i]);
        
		var spritenaam = '';
		if (car[i].nummer == 'A') { 
			spritenaam = 'snail'
		}
		else if (car[i].orientation == 'h' && car[i].lengte == 2) { spritenaam = 'mushroom2h'}
		else if (car[i].orientation == 'h' && car[i].lengte == 3) { spritenaam = 'mushroom3h'}
		else if (car[i].orientation == 'v' && car[i].lengte == 2) { spritenaam = 'mushroom2v'}
		else if (car[i].orientation == 'v' && car[i].lengte == 3) { spritenaam = 'mushroom3v'}
		else if (car[i].lengte == 1) { spritenaam = 'mushroom1'}
		
		// put car in board	
		carsprite = this.game.add.sprite(boardx2realx(car[i].x), boardy2realy(car[i].y), spritenaam);
		carsprite.frame = currentThema;
		carsprite.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
		carsprite.carindex = i;
		car[i].realx = boardx2realx(car[i].x);
		car[i].realy = boardy2realy(car[i].y);
		car[i].carImage = carsprite;
		
		// blok van 1x1 is muur, unmoveable
		if (car[i].lengte > 1)
		{
			carsprite.inputEnabled = true;
			carsprite.input.enableDrag();
		
			if (car[i].orientation == 'h') {
				carsprite.input.allowVerticalDrag = false;
			} else {
				carsprite.input.allowHorizontalDrag = false;
			} 
			carsprite.events.onInputDown.add(onDown, this);
			carsprite.events.onDragStart.add(onDragStart, this);
			carsprite.events.onDragStop.add(onDragStop, this);
		}
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeCars(){
	// de sprites van vorige level verwijderen
	for (i=0; i<car.length; i++)
	{
    	car[i].carImage.destroy();
	}
}

function onLevelComplete()
{
	// de sprites van vorige level verwijderen
	removeCars();
		
	// level up
	textLevel.text = capitalizeFirstLetter(niveau) + " level " + currentLevel
	textMinMoves.text  = "minimal " + minMoves + " moves needed";
	moves = 0;
	
	// write level
	localStorage.setItem(niveau + 'currentLevel', currentLevel);
	//localStorage.setItem('progressEasy', JSON.stringify(voortgang));
	
	// draw next leve;
	fillLevel(allLevels[currentLevel]);
	drawLevel();
	moves = 0;
	textMoves.text = moves + " moves so far";
}

function GetNiveau(){
	if (localStorage.getItem('level') === null){
		localStorage.setItem('level', 'easy');
	}
	niveau = localStorage.getItem('level');
		
	
	if (localStorage.getItem(niveau + 'currentLevel') === null){
		localStorage.setItem(niveau + 'currentLevel',0);
	}
	currentLevel = localStorage.getItem(niveau + 'currentLevel');
	
	
	if (localStorage.getItem('currentThema') === null){
		localStorage.setItem('currentThema', '0');
	}
	currentThema = parseInt(localStorage.getItem('currentThema'));
		
}

function NextLevel(){
	currentLevel++;
	if (currentLevel>199) {
		currentLevel=199;
	}
	onLevelComplete();
}

function PrevLevel(){
	currentLevel--;
	if (currentLevel<0) {
		currentLevel=0;
	}
	onLevelComplete();
}

function ResetLevel(){
	onLevelComplete();
}

function setThema(buttonIndex){
	if (buttonIndex.key == 'b_wood') {
		currentThema = 0;
	} 
	else if (buttonIndex.key == 'b_car') {
		currentThema = 1;
	}
	else if (buttonIndex.key == 'b_marble') {
		currentThema = 2;
	}
	else if (buttonIndex.key == 'b_animal') {
		currentThema = 3;
	}

	localStorage.setItem('currentThema', currentThema.toString());
	
	removeCars();
	DrawBackground();
	drawBorder();
	drawLevel();
}


function onConfirm(buttonIndex) {
	// buttons en dialog terug
	b_dialog.x = game.width/2; 
	b_dialog.y = -200;
    
	b_yes.x = game.width+200;
	b_yes.y = game.world.height/2 + 40;
	
    b_no.x = -200;
	b_no.y = game.world.height/2 + 40;
		
	if (buttonIndex.key == 'b_yes') {
		game.state.start('MainMenu');	
	}
}

function ReturnToMain() {	
	
	b_dialog.bringToTop();
	b_yes.bringToTop();
	b_no.bringToTop();
	
	
	game.add.tween(b_dialog).to({y: this.game.world.height/2}, 500, Phaser.Easing.Cubic.InOut, true, 0);
	
	game.add.tween(b_yes).to({y: this.game.world.height/2 + 40}, 500, Phaser.Easing.Cubic.InOut, true, 0);
	game.add.tween(b_yes).to({x: this.game.world.width/2 + 50}, 500, Phaser.Easing.Cubic.InOut, true, 0);
	
	game.add.tween(b_no).to({y: this.game.world.height/2 + 40}, 500, Phaser.Easing.Cubic.InOut, true, 0);
	game.add.tween(b_no).to({x: this.game.world.width/2 - 50}, 500, Phaser.Easing.Cubic.InOut, true, 0);
	//tween_no.to({ y: this.game.world.height/2 + 50, x:this.game.world.width/2 + 50, 500, 'Linear', true, 0);
	
}


function SelectLevel() {	
	game.state.start('SelectLevel');	
}

function DrawBackground(){
	//gridbgImage = this.game.add.sprite(CellSize, shifty*CellSize, 'gridbg');
	//gridbgImage.frame = currentThema;
	//gridbgImage.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
}

function DrawScreen() {
	game.stage.backgroundColor = "#000000";
	var maxx = this.game.world.width;
	var maxy = this.game.world.height;
	
	// size based on screen width
	// 6 cellen en 2 voor de rand
	CellSize = maxx / 8;	
	CellSize = MyGameMaxX / 8;
	
	// bovenrand grid = 3 x celSize
	shifty = 3;
	//shifty = 0;
	
	//bg = game.add.tileSprite(this.game.width/2, this.game.height/2, 'starfield');
    //bg.anchor.setTo(0.5, 0.5);
	 
	var centerY = (7 + shifty) * CellSize + (this.game.world.height - (7 + shifty) * CellSize)/3*2
	
	b_border = game.add.sprite(3 * this.game.width/6, centerY, 'b_border');
    b_border.anchor.setTo(0.5, 0.5);
	b_border.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	
	b_prev = game.add.sprite(TopLeftX + 1 * MyGameMaxX/6, centerY, 'b_prev');
    b_prev.anchor.setTo(0.5, 0.5);
	b_prev.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_prev.inputEnabled = true;
	b_prev.events.onInputDown.add(PrevLevel, this);
	
	b_next = game.add.sprite(TopLeftX + 2 * MyGameMaxX/6, centerY, 'b_next');
    b_next.anchor.setTo(0.5, 0.5);
	b_next.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_next.inputEnabled = true;
	b_next.events.onInputDown.add(NextLevel, this);
	
	b_restart = game.add.sprite(TopLeftX + 3 * MyGameMaxX/6, centerY, 'b_restart');
    b_restart.anchor.setTo(0.5, 0.5);
	b_restart.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_restart.inputEnabled = true;
	b_restart.events.onInputDown.add(ResetLevel, this);
	
	b_list = game.add.sprite(TopLeftX + 4 * MyGameMaxX/6, centerY, 'b_list');
    b_list.anchor.setTo(0.5, 0.5);
	b_list.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_list.inputEnabled = true;
	b_list.events.onInputDown.add(SelectLevel, this);
	
	b_return = game.add.sprite(TopLeftX + 5 * MyGameMaxX/6, centerY, 'b_return');
   	b_return.anchor.setTo(0.5, 0.5);
	b_return.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_return.inputEnabled = true;
	b_return.events.onInputDown.add(ReturnToMain, this);
	
	var centerYThema = (7 + shifty) * CellSize + (this.game.world.height - (7 + shifty) * CellSize)/3
	b_wood = game.add.sprite(TopLeftX + MyGameMaxX/5, centerYThema, 'b_wood');
    b_wood.anchor.setTo(0.5, 0.5);
	b_wood.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_wood.inputEnabled = true;
	b_wood.events.onInputDown.add(setThema, this);
	
	b_car = game.add.sprite(TopLeftX + 2 * MyGameMaxX/5, centerYThema, 'b_car');
    b_car.anchor.setTo(0.5, 0.5);
	b_car.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_car.inputEnabled = true;
	b_car.events.onInputDown.add(setThema, this);
	
	b_marble = game.add.sprite(TopLeftX + 3 * MyGameMaxX/5, centerYThema, 'b_marble');
    b_marble.anchor.setTo(0.5, 0.5);
	b_marble.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_marble.inputEnabled = true;
	b_marble.events.onInputDown.add(setThema, this);
	
	b_animal = game.add.sprite(TopLeftX + 4 * MyGameMaxX/5, centerYThema, 'b_animal');
    b_animal.anchor.setTo(0.5, 0.5);
	b_animal.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_animal.inputEnabled = true;
	b_animal.events.onInputDown.add(setThema, this);
	
	i_check = game.add.sprite(2 * this.game.width/6, 18, 'i_check');
    i_check.anchor.setTo(0.5, 0.5);
	i_check.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	
	b_dialog = game.add.sprite(this.game.width/2, -200, 'b_dialog');
    b_dialog.anchor.setTo(0.5, 0.5);
	b_dialog.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	
	b_yes = game.add.sprite(this.game.width+200, this.game.world.height/2 + 40, 'b_yes');
    b_yes.anchor.setTo(0.5, 0.5);
	b_yes.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_yes.inputEnabled = true;
	b_yes.events.onInputDown.add(onConfirm, this);
	
	b_no = game.add.sprite(-200, this.game.world.height/2 + 40, 'b_no');
    b_no.anchor.setTo(0.5, 0.5);
	b_no.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
	b_no.inputEnabled = true;
	b_no.events.onInputDown.add(onConfirm, this);
	
	//var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
	//textLevel = game.add.text(game.world.centerX, 20, capitalizeFirstLetter(niveau) + " level " + currentLevel, style);
    //textLevel.anchor.set(0.5);
	
	textLevel = game.add.bitmapText(TopLeftX + MyGameMaxX/2, CellSize * 0.75, 'britanbold', "CarPark Free", 48);
    textLevel.anchor.x = 0.5;
    textLevel.anchor.y = 0.5;
	
	
	textLevel = game.add.bitmapText(TopLeftX + MyGameMaxX/2, CellSize * 1.5, 'britanbold', capitalizeFirstLetter(niveau) + " level " + currentLevel, 32);
    textLevel.anchor.x = 0.5;
    textLevel.anchor.y = 0.5;
	
	
	style = { font: "14px Arial", fill: "#ffffff", align: "center" };
	//textMinMoves = game.add.text(game.world.centerX, 50, "", style);
	textMinMoves = game.add.bitmapText(TopLeftX + MyGameMaxX/2, CellSize * 10.5, 'britanbold', "minimal " + moves + " moves needed", 24);
    textMinMoves.anchor.set(0.5);
	
	//textMoves = game.add.text(game.world.centerX, CellSize*11, "moves " + moves, style);
	textMoves = game.add.bitmapText(TopLeftX + MyGameMaxX/2, CellSize * 11, 'britanbold', moves + " moves so far", 24);
	textMoves.anchor.set(0.5);
		
	DrawBackground();
  	drawBorder();
}

function GetProgres() {
	if (localStorage.getItem(niveau + 'progres'))
	{
    	progressLevels = JSON.parse(localStorage.getItem(niveau + 'progres'));
    } 
	else 
	{
    	progressLevels = Array(500).fill(0);
    }
}

BasicGame.Game.prototype = {

create: function () {
	screen.orientation.lock('portrait');
	
	GetDimensions();
	
	GetNiveau();
	DrawScreen();
		
	GetProgres();
	
	allLevels = game.cache.getText(niveau + 'levels').split('\n');

	fillLevel(allLevels[currentLevel]);
	textMinMoves.text  = "minimal " + minMoves + " moves needed";
	drawLevel();
},

update: function () {
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
	//bg.angle -= 0.02;
},
render: function () {
         
},

quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');
	}

};
