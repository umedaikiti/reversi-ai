var $, jQuery;
//$ = jQuery = require("./jquery-2.1.4.min.js");
$ = jQuery = require("jquery");
var electron = require('electron');

$(function(){
	electron.ipcRenderer.on('flush-log', function(event){
		$("#log-list").html('');
	});
	electron.ipcRenderer.on('appendlog', function(event, message){
		var item = $("<li></li>");
		item.html(message);
		$("#log-list").prepend(item);
	});
	electron.ipcRenderer.on('statusupdate', function(event, state){
		var s = "white: " + state.white.toString(10);
		s += "<br>";
		s += "black: " + state.black.toString(10);
		if(state.finished){
			$('#status').html("game over<br>" + s);
		}
		else {
			var color = (state.turn == 'O') ? 'white' : 'black';
			if(state.turn == state.player) {
				$('#status').html("your turn (" + color + ")<br>" + s);
			}
			else {
				$('#status').html("ai's turn (" + color + ")<br>" + s);
			}
		}
	});
});
