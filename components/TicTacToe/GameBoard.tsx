import React , { useEffect , useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Board } from '@/types/tic-tac-toe';
import { Animated, StyleProp, ImageStyle, ImageSourcePropType } from 'react-native';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

// More conservative sizing to ensure everything fits
const availableWidth = width - 140; // More space for avatars
const availableHeight = height * 0.45; // Reduced from 60% to 45%
const maxBoardSize = Math.min(availableWidth, availableHeight, isLandscape ? width * 0.5 : width * 0.55);
const CELL_SIZE = Math.floor(width / 12);

type AnimatedAvatarProps = {
    source: ImageSourcePropType;
    row: number;
    col: number;
    style?: StyleProp<ImageStyle>;
  };
const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ source, row, col, style }) => {
    const scale = useRef(new Animated.Value(1.2)).current;
    const translateX = useRef(
      new Animated.Value(
        col === 0 ? -CELL_SIZE * 0.8 : col === 2 ? CELL_SIZE * 0.8 : 0
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
  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    const isWinningCell = winningLine?.some(
      ([r, c]) => r === row && c === col
    );
    const isHighlighted = bestMove && bestMove[0] === row && bestMove[1] === col;

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          isWinningCell && styles.winningCell,
          isHighlighted && styles.highlightedCell,
        ]}
        onPress={() => onCellPress(row, col)}
        activeOpacity={0.7}
        testID={`cell-${row}-${col}`}
      >
        {cell === 'X' && <AnimatedAvatar source={photo1} row={row} col={col} style={styles.photo1Cell} />}

        {cell === 'O' && <AnimatedAvatar source={photo2} row={row} col={col} style={styles.photo2Cell} />}

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.board} testID="game-board" onLayout={onLayout}>
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
               style={styles.verticalLine}
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
              style={styles.horizontalLine}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: CELL_SIZE * 3 + 10,
    height: CELL_SIZE * 3 + 10,
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
  },
  cellWrapper: {
    position: 'relative',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    backgroundColor: '#184BD933',
    borderRadius: 20,
  },
  cellImage: {
    width: CELL_SIZE * 0.8,
    height: CELL_SIZE * 0.8,
    borderRadius: (CELL_SIZE * 0.8) / 2,
  },
  winningCell: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
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
    height: CELL_SIZE,
    zIndex: 1,
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    bottom: -1,
    width: CELL_SIZE * 3 + 6,
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
  photo2Cell: {
    borderWidth: 3,
    borderColor: '#ADEFFF',
  },
});

export default GameBoard;