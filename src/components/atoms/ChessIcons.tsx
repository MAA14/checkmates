const chessIcons = {
  king: "♔",
  pawn: "♙",
  rook: "♘",
  knight: "♖",
  queen: "♕",
};

type TChessIcon = "king" | "pawn" | "rook" | "knight" | "queen";

export function ChessIcons(piece: TChessIcon) {
  return (
    <span className="chess-piece-icon" aria-hidden="true">
      {chessIcons[piece]}
    </span>
  );
}
