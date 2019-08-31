
BasicGame.SelectLevel = function (game) {

	this.bg;
	//this.music = null;

};

var progressLevels;
		
var spriteSize = 64;	// fysieke afmeting
var CellSize = 48;		// grid size on display
var level;
var batch = 0;

function sNextLevel(){
	batch++;
	if (batch>9) {
		batch=9;
	}
	DrawButtons();
}

function sPrevLevel(){
	batch--;
	if (batch<0) {
		batch=0;
	}
	DrawButtons();
}

function GetProgresPerNiveau(niveau) {
	if (localStorage.getItem(niveau + 'progres'))
	{
    	progressLevels = JSON.parse(localStorage.getItem(niveau + 'progres'));
    } 
	else 
	{
    	progressLevels = Array(500).fill(0);
    }
}

function listenerLVL (_sprite, pointer) 
{  
	var nextlvl = _sprite.lvl;
	localStorage.setItem(niveau + 'currentLevel', nextlvl);
	this.game.state.start("Game");
}


function DrawButtons() {
	for (var yy=1; yy<11; yy++) {		
		for (var xx=1; xx<6; xx++) {
			var start = this.game.add.sprite(0, 0, 'b_level_' + niveau);
			start.anchor.set(0.5);
			start.x = xx * this.game.world.width/6;
			start.y = (yy -0.5) * this.game.world.height/12;
			start.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
			start.inputEnabled = true;
			start.events.onInputDown.add(listenerLVL,this);
			
			start.lvl = 50 * batch + (5*(yy-1) + xx - 1);
			
			if (progressLevels[start.lvl] == 0)
			{
				start.tint = 0x666666;
			}
			
			var text2 = this.game.add.text(start.x, start.y + 3, (start.lvl).toString(), {
			font: '12px Arial', fill: '#000000', align: 'center'});
			text2.anchor.set(0.5);

			
		}
	}
	//start.events.onInputDown.add(this.startGame, this);
}

BasicGame.SelectLevel.prototype = {

	create: function () {

	//	this.music = this.add.audio('bgm');
     //   this.music.loop = true;
     //   this.music.play();
		screen.orientation.lock('portrait');

		this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');

		var text = this.add.text(this.game.width * 0.5, 15*this.game.world.height/16, 'Select a level', {
			font: '16px Arial', fill: '#ffffff', align: 'center'
		});
		text.anchor.set(0.5);

		var maxx = this.game.world.width;
		var afstand = this.game.world.height;
		
		if (localStorage.getItem('level') === null){
			localStorage.setItem('level', 'easy');
			}
		level = localStorage.getItem('level');
		
		GetProgresPerNiveau(level)
			
		b_prev = game.add.sprite(1 * this.game.width/6, text.y, 'b_prev');
    	b_prev.anchor.setTo(0.5, 0.5);
		b_prev.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
		b_prev.inputEnabled = true;
		b_prev.events.onInputDown.add(sPrevLevel, this);
	
		b_next = game.add.sprite(5 * this.game.width/6, text.y, 'b_next');
    	b_next.anchor.setTo(0.5, 0.5);
		b_next.scale.setTo(CellSize / spriteSize, CellSize / spriteSize); 
		b_next.inputEnabled = true;
		b_next.events.onInputDown.add(sNextLevel, this);
		
		var currentLevel = localStorage.getItem(niveau + 'currentLevel');
		batch = Math.floor(currentLevel/50);
		
		DrawButtons();
		
	}, 

	update: function () {

		//	Do some nice funky main menu effect here

	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.

		this.bg.width = width;
		this.bg.height = height;

 
	},

	startGame: function () {
	//	this.music.stop();
		this.state.start("Game");
	}

};
