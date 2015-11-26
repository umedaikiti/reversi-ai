var $, jQuery;
//$ = jQuery = require("./jquery-2.1.4.min.js");
$ = jQuery = require("jquery");
var remote = require('remote');
var libreversi = remote.require('./reversi.js');
const ipcMain = remote.require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;

var game_state = {};

function opponent(p)
{
	if(p == 'O') {
		return 'X';
	}
	else {
		return 'O';
	}
}
function transition()
{
	var player = game_state.player;
	var ai = opponent(player);
	game_state.count++;
	player_has_moves = libreversi.has_valid_moves(player.charCodeAt(0));
	ai_has_moves = libreversi.has_valid_moves(ai.charCodeAt(0));
	var count = libreversi.count_disks();
	if(!player_has_moves && !ai_has_moves) {
		game_state.finished = true;
		var s = "GAME OVER\n"
		if(count.white == count.black){
			s += 'draw';
		}
		else{
			s += 'You ';
			if(count.white > count.black){
				s += game_state.player == 'O' ? 'win!' : 'lose!';
			}
			else{
				s += game_state.player == 'X' ? 'win!' : 'lose!';
			}
		}
		alert(s);
	}
	else if(!player_has_moves && ai_has_moves){
		game_state.turn = ai;
	}
	else if(player_has_moves && !ai_has_moves){
		game_state.turn = player;
	}
	else {
		game_state.turn = opponent(game_state.turn);
	}
	game_state.white = count.white;
	game_state.black = count.black;
	status_update(game_state);
	if(!game_state.finished && game_state.turn == ai){
		setTimeout(ai_turn_begin, 10);
	}
}

function ai_turn_begin()
{
	$('#board').css('pointer-events', 'none');
	var ai = opponent(game_state.player);
	ipcRenderer.send('ai-think', ai);
}
function ai_turn_end(event, m)
{
	var ai = opponent(game_state.player);
	set_disk(m.pass, m.x, m.y, ai);
	$('#board').css('pointer-events', 'auto');
	transition();
}
ipcMain.on('ai-think', libreversi.ai_think_event);
ipcRenderer.on('ai-reply', ai_turn_end);
function set_disk(pass, x, y, c) 
{
	var result = libreversi.set_disk(pass, x, y, c.charCodeAt(0));
	if(result) {
		var s = game_state.count.toString() + '. ';
		if(c == game_state.player){
			s = s + 'You ';
		}
		else{
			s = s + 'AI ';
		}
		if(pass){
			s = s + 'passed.';
		}
		else {
			s = s + 'placed a ';
			if(c == 'X'){
				s = s + 'black ';
			}
			else {
				s = s + 'white ';
			}
			s = s + 'disk at (' + x.toString() + ", " + y.toString() + ').';
		}
		update();
		append_log(s);
		game_state.log.push({
			x: x,
			y: y,
			color: c
		});
	}
	return result;
}
function update()
{
	for(var i=0;i<8;i++) for(var j=0;j<8;j++) {
		var c = libreversi.get_board(i, j);
		var e = $('.disk').eq(i*8+j);
		if(c == 'O'.charCodeAt(0)) {
			e.show();
			e.css('background-color', 'white');
		}
		else if(c == 'X'.charCodeAt(0)) {
			e.show();
			e.css('background-color', 'black');
		}
		else {
			e.hide();
		}
	}
}

function flush_log()
{
	var subWindow = remote.getGlobal('subWindow');
	if(subWindow !== null){
		subWindow.webContents.send('flush-log');
	}
}

function append_log(str)
{
	var subWindow = remote.getGlobal('subWindow');
	if(subWindow !== null){
		subWindow.webContents.send('appendlog', str);
	}
}

function status_update(state)
{
	var subWindow = remote.getGlobal('subWindow');
	if(subWindow !== null){
		subWindow.webContents.send('statusupdate', state);
	}
}
function reset()
{
	libreversi.reset();
	game_state = {
		'player' : 'X',
		'turn' : 'X',
		'count' : 1,
		'finished' : false,
		'white': 2,
		'black': 2,
		'log': []
	};
	//$.extend(true, game_state, game_state0);
}
function init()
{
	update();
	status_update(game_state);
}
$(function(){
	$('.row').click(function(){
		if(!game_state.finished && game_state.turn == game_state.player) {
			var i = $('.row').index($(this));
			var x = Math.floor(i / 8);
			var y = i % 8;
			var result = set_disk(false, x, y, game_state.player);
			if(result) {
				transition();
			}
		}
	});
	$(window).keydown(function(e){
		if(e.keyCode == 27){
			if(game_state.finished){
				if(window.confirm('reset?')){
					flush_log();
					reset();
					init();
				}
			}
		}
	});
	reset();
	init();
	console.log(process.type)
});

