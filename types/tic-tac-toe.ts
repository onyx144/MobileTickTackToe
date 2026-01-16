export type Player = 'X' | 'O' | null;
export type Board = (Player)[][];

export interface TicTacToeProps {
  backgroundImage?: string;
  name1?: string;
  name2?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  backendUrl?: string;
  winGif?: string;
  winner?: string;
  winningLine?: number[][];
  currentPlayer?: Player;
  board?: Board;
  gameState?: GameState;
  gameStarted?: boolean;
  gameEnded?: boolean;
  gameWon?: boolean;
  gameDraw?: boolean;
  gameLost?: boolean;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  winningLine: number[][] | null;
}