import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Board, GameState, Player } from '@/types/tic-tac-toe';

const initialBoard: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const useTicTacToeGame = (onMovePlayed?: () => void) => {
  const [gameState, setGameState] = useState<GameState>({
    board: JSON.parse(JSON.stringify(initialBoard)),
    currentPlayer: 'X' as Player,
    winner: null,
    isGameStarted: false,
    isGameEnded: false,
    isGameWon: false,
    isGameDraw: false,
    isGameLost: false,
    winningLine: null,
  });
  const [history, setHistory] = useState<Board[]>([]);
  const [bestMove, setBestMove] = useState<number[] | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const checkWinner = useCallback((board: Board) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== null &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return { winner: board[i][0], winningLine: [[i, 0], [i, 1], [i, 2]] };
      }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] !== null &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return { winner: board[0][i], winningLine: [[0, i], [1, i], [2, i]] };
      }
    }
    
    // Check diagonals
    if (
      board[0][0] !== null &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return { winner: board[0][0], winningLine: [[0, 0], [1, 1], [2, 2]] };
    }
    
    if (
      board[0][2] !== null &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return { winner: board[0][2], winningLine: [[0, 2], [1, 1], [2, 0]] };
    }
    
    // Check for draw
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          isDraw = false;
          break;
        }
      }
    }
    
    if (isDraw) {
      return { winner: 'draw', winningLine: null };
    }
    
    return { winner: null, winningLine: null };
  }, []);

  const calculateBestMove = useCallback(() => {
    const { board, currentPlayer } = gameState;
    const opponent: Player = currentPlayer === 'X' ? 'O' : 'X';
  
    const emptyCells: number[][] = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });
  
    if (emptyCells.length === 0) {
      setBestMove(null);
      return;
    }
  
    // 1. Победа
    for (const [row, col] of emptyCells) {
      const newBoard: Board = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      if (checkWin(newBoard, currentPlayer)) {
        setBestMove([row, col]);
        return;
      }
    }
  
    // 2. Блокировка
    for (const [row, col] of emptyCells) {
      const newBoard: Board = board.map(r => [...r]);
      newBoard[row][col] = opponent;
      if (checkWin(newBoard, opponent)) {
        setBestMove([row, col]);
        return;
      }
    }
  
    // 3. Центр
    if (board[1][1] === null) {
      setBestMove([1, 1]);
      return;
    }
  
    // 4. Углы
    const corners = [
      [0, 0], [0, 2], [2, 0], [2, 2]
    ].filter(([r, c]) => board[r][c] === null);
    if (corners.length > 0) {
      setBestMove(corners[Math.floor(Math.random() * corners.length)]);
      return;
    }
  
    // 5. Случайно
    setBestMove(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
  }, [gameState]);
  

// Функция проверки победы
function checkWin(board: Board, player: Player) {
  const lines = [
    // строки
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    // колонки
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    // диагонали
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],
  ];
  
  return lines.some(line =>
    line.every(([r, c]) => board[r][c] === player)
  );
}

  const makeAIMove = useCallback(() => {
    if (gameState.winner) return;
    
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    const emptyCells: number[][] = [];
    
    newBoard.forEach((row: Player[], rowIndex: number) => {
      row.forEach((cell: Player, colIndex: number) => {
        if (cell === null) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });
    
    if (emptyCells.length > 0) {
      setHistory(prev => [...prev, JSON.parse(JSON.stringify(newBoard))]);

      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newBoard[row][col] = 'O';
      
      const result = checkWinner(newBoard);
      
      setGameState({
        board: newBoard,
        currentPlayer: 'X' as Player,
        winner: result.winner as Player | 'draw' | null,
        winningLine: result.winningLine,
      });
      
      // Воспроизводим звук при ходе ИИ
      onMovePlayed?.();
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [gameState.winner, gameState.board, checkWinner]);

  const handleCellPress = useCallback((row: number, col: number) => {
    if (
      gameState.board[row][col] !== null ||
      gameState.currentPlayer !== 'X' ||
      gameState.winner
    ) {
      return;
    }
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(gameState.board))]);
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    newBoard[row][col] = 'X';
    
    const result = checkWinner(newBoard);
    
    setGameState({
      board: newBoard,
      currentPlayer: 'O' as Player,
      winner: result.winner as Player | 'draw' | null,
      winningLine: result.winningLine,
    });
    
    setBestMove(null);
    
    // Воспроизводим звук при ходе игрока
    onMovePlayed?.();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [gameState.board, gameState.currentPlayer, gameState.winner, checkWinner, onMovePlayed]);

  const undoLastTwoMoves = useCallback(() => {
    if (history.length < 1) return; // хотя бы два хода в истории
  
    setHistory(prev => {
      const newHistory = [...prev];
      // получаем состояние два хода назад
      const prevBoard = newHistory[newHistory.length - 2];
  
      // убираем последние два хода из истории
      newHistory.splice(-2, 2);
  
      if (!prevBoard) return newHistory;
  
      // определяем чей теперь ход
      const movesCount = prevBoard.flat().filter(cell => cell !== null).length;
      const nextPlayer: Player = movesCount % 2 === 0 ? 'X' : 'O';
  
      setGameState({
        board: prevBoard.map(row => [...row]), // создаем копию
        currentPlayer: nextPlayer,
        winner: null,
        winningLine: null,
      });
  
      return newHistory;
    });
  }, [history]);
  

  const resetGame = useCallback(() => {
    setGameState({
      board: JSON.parse(JSON.stringify(initialBoard)),
      currentPlayer: 'X' as Player,
      winner: null,
      winningLine: null,
    });
    
    setGameComplete(false);
    setBestMove(null);
    setHistory([]); // Сброс истории игры
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  useEffect(() => {
    if (gameState.currentPlayer === 'X' && !gameState.winner) {
      calculateBestMove();
    }
  }, [gameState.board, gameState.currentPlayer, calculateBestMove, gameState.winner]);

  useEffect(() => {
    if (gameState.currentPlayer === 'O' && !gameState.winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.winner, makeAIMove]);

  useEffect(() => {
    if (gameState.winner) {
      // Delay showing game over by 5 minutes (300000 ms)
      const delay = setTimeout(() => {
        setGameComplete(true);
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [gameState.winner]);

  return {
    gameState,
    bestMove,
    gameComplete,
    handleCellPress,
    resetGame,
    undoLastTwoMoves,
    isGameStarted,
    setIsGameStarted,
  };
};