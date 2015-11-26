extern crate reversi_ai;
use reversi_ai::reversi::{ReversiBoard, Color, U64Board, Move};
use reversi_ai::reversi::reversi_ai::best_move_alpha_beta2;
static mut board : U64Board = reversi_ai::reversi::U64BOARD0;

fn convert_color(color : char) -> Color {
    return if color == 'O' {
        Color::O
    }
    else {
        Color::X
    };
}
#[no_mangle]
pub unsafe extern fn reset() {
    board = reversi_ai::reversi::U64BOARD0;
}

#[no_mangle]
pub unsafe extern fn get_board(x : u32, y : u32) -> char {
    return match board.get(x, y) {
        Some(Color::O) => 'O',
        Some(Color::X) => 'X',
        None => ' ',
    };
}

#[no_mangle]
pub unsafe extern fn set_disk(pass : bool, x : u32, y : u32, color : char) -> bool {
    let color = convert_color(color);
    if pass {
        return board.do_move(Move::Pass, color);
    }
    else {
        return board.do_move(Move::Mv(x,y), color);
    }
}

#[no_mangle]
pub unsafe extern fn ai_think(color : char) -> u32 {
    return match best_move_alpha_beta2(&board, convert_color(color)) {
        Move::Pass => 0xFFFFFFFF,
        Move::Mv(x, y) => (x << 3) | y,
    };
}

#[no_mangle]
pub unsafe extern fn has_valid_moves(color : char) -> bool {
    return reversi_ai::reversi::reversi_ai::has_valid_moves(&board, convert_color(color));
}
