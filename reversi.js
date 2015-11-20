var FFI = require('ffi');

var libreversi = FFI.Library('./reversi_lib/target/release/libreversi', {
	'get_board': ['char', ['uint32', 'uint32']],
	'set_disk': ['bool', ['bool', 'uint32', 'uint32', 'char']],
	'ai_think': ['uint32', ['char']],
	'has_valid_moves': ['bool', ['char']]
});
module.exports = {
ai_think: function (c)
{
	var mv = libreversi.ai_think(c.charCodeAt(0));
	var r = {
		'pass' : true,
		'x' : 0,
		'y' : 0
	};
	if(mv != 0xffffffff){
		r.pass = false;
		r.x = mv >> 3;
		r.y = mv & 7;
	}
	return r;
},
has_valid_moves: libreversi.has_valid_moves,
get_board: libreversi.get_board,
set_disk: libreversi.set_disk,
count_disks: function ()
{
	var white = 0;
	var black = 0;
	for(var i=0;i<8;i++) for(var j=0;j<8;j++) {
		var c = libreversi.get_board(i, j);
		if(c == 'O'.charCodeAt(0)) {
			white++;
		}
		else if(c == 'X'.charCodeAt(0)) {
			black++;
		}
	}
	return {
		'white': white,
		'black': black
	};
}
};

//console.log(libreversi.set_disk(false, 2, 3, 'X'.charCodeAt(0)));
//console.log(String.fromCharCode(libreversi.get_board(3, 3)));
