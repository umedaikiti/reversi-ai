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

fn main() {
    let mut p1_color = Color::O;
    let mut p1 = 0;
    let mut p2 = 0;
    for _ in 0..100 {
        let mut b = U64Board::new();
        let mut passed = false;
        let mut c = Color::O;
        loop {
            let start = time::precise_time_ns();
            let m = if c == p1_color {
                player2(&b, c)
            } else {
                player3(&b, c)
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
        let (s1, s2) = if p1_color == Color::O {
            (so, sx)
        }
        else {
            (sx, so)
        };
        println!("result: {:?}", (s1, s2));
        if s1 > s2 {
            p1 += 1;
        }
        if s2 > s1 {
            p2 += 1;
        }
        p1_color = p1_color.opposite_color();
    }
    println!("Final result: {:?} vs {:?}", p1, p2);
}
