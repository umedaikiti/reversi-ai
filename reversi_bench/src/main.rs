extern crate reversi_ai;
extern crate rand;
extern crate time;

use reversi_ai::reversi::{ReversiBoard, U64Board, Color, Move};
use rand::Rng;

fn player1(b : &U64Board, c : Color) -> Move {
        let ms = b.valid_moves(c);
        if ms.is_empty() {
            return Move::Pass;
        }
        else{
            let i = rand::thread_rng().gen_range(0, ms.len());
            return *ms.get(i).unwrap();
        }
}

fn player2(b : &U64Board, c : Color) -> Move {
    return reversi_ai::reversi::reversi_ai::best_move(b, c);
}

fn player3(b : &U64Board, c : Color) -> Move {
    return reversi_ai::reversi::reversi_ai::best_move_alpha_beta(b, c);
}

fn battle<F1, F2>(player_first : &F1, player_second : &F2) -> (u32, u32)
where F1 : Fn(&U64Board, Color) -> Move, F2 : Fn(&U64Board, Color) -> Move
{
    let mut b = U64Board::new();
    let mut passed = false;
    let mut c = Color::X;
    loop {
        let start = time::precise_time_ns();
        let m = if c == Color::X {
            player_first(&b, c)
        } else {
            player_second(&b, c)
        };
        let end = time::precise_time_ns();
        println!("{:?}ns", end-start);
        if m == Move::Pass {
            if passed {
                break;
            }
            passed = true;
        } else {
            passed = false;
        }
        println!("{:?}", m);
        b.do_move(m, c);
        b.print();
        c = c.opposite_color();
    }
    let (so, sx) = b.result();
    return (sx, so);
}

fn main() {
    let mut p1 = 0;
    let mut p2 = 0;
    for i in 0..100 {
        let (s1, s2) = if i % 2 == 0 {
            battle(&player2, &player3)
        }
        else{
            let (s2, s1) = battle(&player3, &player2);
            (s1, s2)
        };
        println!("result: {:?}", (s1, s2));
        if s1 > s2 {
            p1 += 1;
        }
        if s2 > s1 {
            p2 += 1;
        }
    }
    println!("Final result: {:?} vs {:?}", p1, p2);
}
