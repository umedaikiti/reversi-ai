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
set_disk: libreversi.set_disk
};

//console.log(libreversi.set_disk(false, 2, 3, 'X'.charCodeAt(0)));
//console.log(String.fromCharCode(libreversi.get_board(3, 3)));
