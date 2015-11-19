var $, jQuery;
//$ = jQuery = require("./jquery-2.1.4.min.js");
$ = jQuery = require("jquery");
var electron = require('electron');

$(function(){
	electron.ipcRenderer.on('appendlog', function(event, message){
		var item = $("<li></li>");
		item.html(message);
		$("#log-list").prepend(item);
	});
	electron.ipcRenderer.on('statusupdate', function(event, state){
		if(state.finished){
			$('#status').html("game over");
		}
		else {
			if(state.turn == state.player) {
				$('#status').html("your turn");
			}
			else {
				$('#status').html("ai's turn");
			}
		}
	});
});
