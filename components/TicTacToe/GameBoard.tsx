import React , { useEffect , useRef, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Board } from '@/types/tic-tac-toe';
import { Animated, StyleProp, ImageStyle, ImageSourcePropType } from 'react-native';
import { VictoryGlow, AnimatedStar, useLoopingRotation, useAvatarStars } from './Animation';
import { StarAdvise } from '@/assets/svg/star-advise';

type AnimatedAvatarProps = {
    source: ImageSourcePropType;
    row: number;
    col: number;
    style?: StyleProp<ImageStyle>;
    cellSize: number;
  };
const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ source, row, col, style, cellSize }) => {
    const scale = useRef(new Animated.Value(1.2)).current;
    const translateX = useRef(
      new Animated.Value(
        col === 0 ? -cellSize * 0.8 : col === 2 ? cellSize * 0.8 : 0
      )
    ).current;
    const opacity = useRef(new Animated.Value(0)).current;
  
    const handleLoad = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };
  
    return (
    
      <Animated.Image
        source={source}
        onLoad={handleLoad}
        style={[
          styles.cellImage,
          style,
          {
            opacity,
            transform: [
              { translateX },
              { scale }
            ],
          },
        ]}
      />
    );
  };

interface GameBoardProps {
  board: Board;
  onCellPress: (row: number, col: number) => void;
  winningLine: number[][] | null;
  bestMove: number[] | null;
  photo1: any;
  photo2: any;
  onLayout?: (event: any) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellPress,
  winningLine,
  bestMove,
  photo1,
  photo2,
  onLayout,
}) => {
  
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  /*Подсказка*/
  
  const [showHint, setShowHint] = useState(true); 
  const hintScale = useRef(new Animated.Value(1)).current;
  
  // Перезапускаем анимацию при изменении bestMove
  useEffect(() => {
    if (bestMove && showHint) {
      // Сбрасываем анимацию
      hintScale.setValue(1);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintScale, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(hintScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [bestMove, showHint, hintScale]);
  
  const getHintCell = (): [number, number] | null => {
    // Используем только bestMove, не делаем fallback на первую пустую клетку
    if (bestMove && board[bestMove[0]][bestMove[1]] === null) {
      return [bestMove[0], bestMove[1]];
    }
    return null;
  };
  
  
  /*Конец подсказки*/
  const isBoardEmpty = (b: Board) => b.every(row => row.every(cell => cell === null));
  const hasAnyEmpty = (b: Board) => b.some(row => row.some(cell => cell === null));
  const isGameOver = (b: Board, win: number[][] | null) => win !== null || !hasAnyEmpty(b);

  useEffect(() => {
    // start timer on mount
    if (intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000) as unknown as number;
    }
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Stop timer at game over; restart and reset when board becomes empty (new game)
    if (isGameOver(board, winningLine)) {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    } else if (isBoardEmpty(board)) {
      setElapsedSeconds(0);
      setShowHint(true); // Сбрасываем hint при новой игре
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => {
          setElapsedSeconds(prev => prev + 1);
        }, 1000) as unknown as number;
      }
    } else {
      // ensure timer running during active game
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => {
          setElapsedSeconds(prev => prev + 1);
        }, 1000) as unknown as number;
      }
    }
  }, [board, winningLine]);

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  const { width, height } = useWindowDimensions();
  const cellSize = Math.floor(width / 10);
  const WinningCellEffects: React.FC<{ isActive: boolean; isFirstPlayer: boolean }> = ({ isActive, isFirstPlayer }) => {
    const rotation = useLoopingRotation(isActive, { durationMs: 6000 });
    const { activeStars, starTriggers, removeStar } = useAvatarStars(isActive, {
      maxStars: 5,
      minIntervalMs: 500,
      maxIntervalMs: 1500,
    });

    if (!isActive) return null;

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cellRotatingBackground,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            width: cellSize + 20,
            height: cellSize + 20,
          },
        ]}
      >
        <Image
          source={isFirstPlayer ? require('@/assets/bg_player.png') : require('@/assets/bg_player2.png')}
          style={styles.bgImage}
        />
        {activeStars.map((starId) => (
          <AnimatedStar
            key={starId}
            isActive={starTriggers.includes(starId)}
            onComplete={() => removeStar(starId)}
            isFirstPlayer={isFirstPlayer}
            avatarSize={cellSize * 0.8}
          />
        ))}
      </Animated.View>
    );
  };

  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    const isHintCell = hintVisible && hintCell?.[0] === row && hintCell?.[1] === col;
    const isWinningCell = winningLine?.some(
      ([r, c]) => r === row && c === col
    );
    const isHighlighted = bestMove && bestMove[0] === row && bestMove[1] === col;

    return (
      <TouchableOpacity
  key={`${row}-${col}`}
  style={[
    styles.cell,
    { width: cellSize, height: cellSize },
  ]}
  onPress={() => onCellPress(row, col)}
  activeOpacity={0.7}
  testID={`cell-${row}-${col}`}
>
  {isWinningCell && (
    <>
      <VictoryGlow />
      <WinningCellEffects isActive={true} isFirstPlayer={cell === 'X'} />
    </>
  )}

  {cell === 'X' && (
    <AnimatedAvatar
      source={photo1}
      row={row}
      col={col}
      cellSize={cellSize}
      style={[styles.photo1Cell, { width: cellSize * 0.8, height: cellSize * 0.8, borderRadius: (cellSize * 0.8) / 2 }]}
    />
  )}
  {cell === 'O' && (
    <AnimatedAvatar
      source={photo2}
      row={row}
      col={col}
      cellSize={cellSize}
      style={[styles.photo2Cell, { width: cellSize * 0.8, height: cellSize * 0.8, borderRadius: (cellSize * 0.8) / 2 }]}
    />
  )}
  {isHintCell && (
        <Animated.View
          style={[
            styles.hintBackground,
            {
              position: 'absolute',
              left: (cellSize - 16) / 2, // центрируем иконку в клетке
              top: (cellSize - 16) / 2,
              transform: [{ scale: hintScale }],
              zIndex: 10,
            },
          ]}
        >
          <StarAdvise width={16} height={16} />
        </Animated.View>
      )}
</TouchableOpacity>
    );
  };
  const countMoves = board.flat().filter(cell => cell !== null).length;
const currentPlayer = countMoves % 2 === 0 ? 'X' : 'O';
  const hintCell = getHintCell();
  const hintVisible = showHint && hintCell !== null && currentPlayer === 'X';
  const hintPosition = hintCell ? {
    left: hintCell[1] * cellSize  + (cellSize - 15) / 2, 
    top: hintCell[0] * cellSize + (cellSize - 15) / 2,
  } : null;


  return (
    <View style={[styles.board, { width: cellSize * 3 + 10, height: cellSize * 3 + 10 }]} testID="game-board" onLayout={onLayout}>
      <View style={styles.timerContainer} pointerEvents="none">
        <View style={styles.timerPill}>
          <Animated.Text style={styles.timerText}>{minutes}:{seconds}</Animated.Text>
        </View>
      </View>
      

      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((_, colIndex) => (
            <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cellWrapper}>
              {renderCell(rowIndex, colIndex)}
              {colIndex < 2 && ( 
               <LinearGradient
               colors={[
                'rgba(183, 0, 255, 0)',       // 0% — прозрачный фиолетовый
                '#00CCFF',                    // 20.5% — яркий голубой
                '#00CCFF',                    // 76% — тот же голубой
                'rgba(183, 0, 255, 0.6)', // 100%
               ]}
               start={{ x: 0, y: 0.5 }}
               end={{ x: 1, y: 0.5 }}
               locations={[0, 0.205, 0.76, 1]}
               style={[styles.verticalLine, { height: cellSize }]}
             />
              )}
            </View>
          ))}
          {rowIndex < 2 && (
            <LinearGradient
            colors={[
                'rgba(183, 0, 255, 0)', // 0%
                '#00CCFF',              // 20.5%
                '#00CCFF',              // 76%
                'rgba(183, 0, 255, 0)', // 100%
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              locations={[0, 0.205, 0.76, 1]}
              style={[styles.horizontalLine, { width: cellSize * 3 + 6 }]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
  },
  
  row: {
    flexDirection: 'row',
    position: 'relative',
  },
  cellWrapper: {
    position: 'relative',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    backgroundColor: '#184BD933',
    borderRadius: 20,
  },
  cellImage: {
  },
  timerContainer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    right: 0,
    zIndex: 10,
    alignItems: 'flex-start',
  },
  timerPill: {
    backgroundColor: '#7500D1',
    borderWidth: 3,
    borderColor: '#C57CFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerText: {
    fontFamily: 'Fredoka',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlignVertical: 'center',
  },
  cellRotatingBackground: {
    position: 'absolute',
    top: -10,
    left: -10,
    zIndex: 0,
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
 
  highlightedCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#00CCFF',
  },
  verticalLine: {
    position: 'absolute',
    right: -1,
    top: 0,
    width: 2,
    zIndex: 1,
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    bottom: -1,
    height: 2,
    zIndex: 1,
  },
  photo1Cell: {
    borderWidth: 3,
    borderColor: '#FFE97C',
    shadowColor: '#C57CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  hintContainer: {
    position: 'absolute',
    width: 32,
    height: 32,
    zIndex: 20,
  },
  hintBackground: {
    flex: 1,
    backgroundColor: '#90A6FF99',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6876B94D',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  photo2Cell: {
    borderWidth: 3,
    borderColor: '#ADEFFF',
  },
  iconButton: {
    padding: 6,
  },
   
});

export default GameBoard;