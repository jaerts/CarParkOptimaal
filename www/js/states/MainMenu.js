
BasicGame.MainMenu = function (game) {

	this.bg;
	//this.music = null;

};

var level;

function listener (_sprite) {
	levele.tint = 0x888888
	levelm.tint = 0x888888
	levelh.tint = 0x888888
	levelc.tint = 0x888888
    _sprite.tint =  0xffffff;
	
	if (_sprite.key == 'b_easy') {
		localStorage.setItem('level', 'easy');
	}
	else if (_sprite.key == 'b_medium') {
		localStorage.setItem('level', 'medium');
	}
	else if (_sprite.key == 'b_hard') {
		localStorage.setItem('level', 'hard');
	}
	else if (_sprite.key == 'b_crazy') {
		localStorage.setItem('level', 'crazy');
	}	 
}

function doRsetStorage (_sprite) {
	// level rest
	localStorage.clear();
	
	localStorage.setItem('level', 'easy');
	// currenty level = 0 
	localStorage.setItem('currentLevel',0);
}




function GetProgresPerNiveau1(niveau) {
	var progressLevels;
	if (localStorage.getItem(niveau + 'progres'))
	{
    	progressLevels = JSON.parse(localStorage.getItem(niveau + 'progres'));
    } 
	else 
	{
    	progressLevels = Array(500).fill(0);
    }

	var x = progressLevels.sort().indexOf(1);
	return x;
}


BasicGame.MainMenu.prototype = {

	create: function () {

	//	this.music = this.add.audio('bgm');
     //   this.music.loop = true;
     //   this.music.play();
		screen.orientation.lock('portrait');
		
		this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');

		var text = this.add.text(this.game.width * 0.5, this.game.world.height/16, 'Select a difficulty level', {
			font: '16px Arial', fill: '#ffffff', align: 'center'
		});
		text.anchor.set(0.5);

		var maxx = this.game.world.width;
		var afstand = this.game.world.height;
		
		if (localStorage.getItem('level') === null){
			localStorage.setItem('level', 'easy');
			}
		level = localStorage.getItem('level');
		
		var n = GetProgresPerNiveau1('easy')
		if (n==-1) {
			n = 500; 
		}
		levele = this.game.add.sprite(0, 0, 'b_easy');
		levele.anchor.set(0.5);
		levele.x = this.game.world.width/2;
		levele.y = this.game.world.height/8;
		levele.inputEnabled = true;
		levele.tint = 0x888888
		levele.events.onInputDown.add(listener, this);
		//levele.events.onInputOver.add(listener , this);
		var texte = this.add.text(this.game.width * 0.5, this.game.world.height/8 + 33, '500 levels / '+n +' unsolved', {
			font: '12px Arial', fill: '#ffffff', align: 'center'
		});
		texte.anchor.set(0.5);
	
		n = GetProgresPerNiveau1('medium')
		if (n==-1) { 
			n = 500; 
		}
		levelm = this.game.add.sprite(0, 0, 'b_medium');
		levelm.anchor.set(0.5);
		levelm.x = this.game.world.width/2;
		levelm.y = 2*this.game.world.height/8;
		levelm.inputEnabled = true;
		levelm.tint = 0x888888
		levelm.events.onInputDown.add(listener, this);
		//levelm.events.onInputOver.add(listener , this);
		var textm = this.add.text(this.game.width * 0.5, 2*this.game.world.height/8 + 33, '500 levels / '+n +' unsolved', {
			font: '12px Arial', fill: '#ffffff', align: 'center'
		});
		textm.anchor.set(0.5);
		
		n = GetProgresPerNiveau1('hard')
		if (n==-1) { 
			n = 500; 
		}
		levelh = this.game.add.sprite(0, 0, 'b_hard');
		levelh.anchor.set(0.5);
		levelh.x = this.game.world.width/2;
		levelh.y = 3*this.game.world.height/8;
		levelh.inputEnabled = true;
		levelh.tint = 0x888888
		levelh.events.onInputDown.add(listener , this);
		//levelh.events.onInputOver.add(listener , this);
		var texth = this.add.text(this.game.width * 0.5, 3*this.game.world.height/8 + 33, '500 levels / '+n +' unsolved', {
			font: '12px Arial', fill: '#ffffff', align: 'center'
		});
		texth.anchor.set(0.5);
		
		n = GetProgresPerNiveau1('crazy')
		if (n==-1) { n = 500; }
		levelc = this.game.add.sprite(0, 0, 'b_crazy');
		levelc.anchor.set(0.5);
		levelc.x = this.game.world.width/2;
		levelc.y = 4*this.game.world.height/8;
		levelc.inputEnabled = true;
		levelc.tint = 0x888888
		levelc.events.onInputDown.add(listener, this);
		//levelc.events.onInputOver.add(listener , this);
		var textc = this.add.text(this.game.width * 0.5, 4*this.game.world.height/8 + 33, '500 levels / '+n +' unsolved', {
			font: '12px Arial', fill: '#ffffff', align: 'center'
		});
		textc.anchor.set(0.5);

		if (level == 'easy') {
			levele.tint = 0xffffff
		} 
		else if (level == 'medium') {
			levelm.tint = 0xffffff
		}
		else if (level == 'hard') {
			levelh.tint = 0xffffff
		}
		else if (level == 'crazy') {
			levelc.tint = 0xffffff
		}
		
		start = this.game.add.sprite(0, 0, 'b_start');
		start.anchor.set(0.5);
		start.x = this.game.world.width/2;
		start.y = 6*this.game.world.height/8;
		start.inputEnabled = true;
		start.events.onInputDown.add(this.startGame, this);
		
		exit= this.game.add.sprite(0, 0, 'b_exit');
		exit.anchor.set(0.5);
		exit.x = this.game.world.width/2;
		exit.y = 7*this.game.world.height/8;
		exit.inputEnabled = true;
		exit.events.onInputDown.add(this.endGame, this);
			
		
		
		// links onderin Reset knop
		resetStorage = this.game.add.sprite(0, 0, 'b_clear');
		resetStorage.anchor.set(0.5);
		resetStorage.x = this.game.world.width/8;
		resetStorage.y = 7*this.game.world.height/8;
		resetStorage.inputEnabled = true;
		resetStorage.events.onInputDown.add(doRsetStorage, this);
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
	},

	endGame: function () {
	//	this.music.stop();
		navigator.app.exitApp();
	}

};
