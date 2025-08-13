import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackIcon from '@/assets/svg/back-icon';
import { TicTacToeProps } from '@/types/tic-tac-toe';
import GameBoard from './TicTacToe/GameBoard';
import PlayerAvatar from './TicTacToe/PlayerAvatar';
import GameOverScreen from './TicTacToe/GameOverScreen';
import StartScreen from './TicTacToe/StartScreen';
import { useTicTacToeGame } from '../hooks/useTicTacToeGame';
import { useTicTacToeAnimations } from '../hooks/useTicTacToeAnimations';

const { width } = Dimensions.get('window');

const DEFAULT_PROPS = {
  backgroundImage: require('../assets/bg.png'),
  name1: 'Player 1',
  name2: 'Player 2',
  photo1: require('../assets/photo1.jpg'),
  photo2: require('../assets/photo2.jpg'),
  winGif: require('../assets/confetti.json'),
};

const TicTacToe: React.FC<TicTacToeProps> = (props) => {
  const {
    backgroundImage = DEFAULT_PROPS.backgroundImage,
    name1 = DEFAULT_PROPS.name1,
    name2 = DEFAULT_PROPS.name2,
    photo1 = DEFAULT_PROPS.photo1,
    photo2 = DEFAULT_PROPS.photo2,
    winGif = DEFAULT_PROPS.winGif,
  } = props;

  const [moveCount, setMoveCount] = useState(0);
  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const introAnim = useRef(new Animated.Value(0)).current;
  const backScale = useRef(new Animated.Value(1)).current; // вместо useSharedValue

  const { gameState, bestMove, gameComplete, handleCellPress, undoLastTwoMoves, resetGame } = useTicTacToeGame();

  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
    resetAnimations,
  } = useTicTacToeAnimations(
    gameState.currentPlayer,
    gameState.winner,
    gameComplete
  );

  const handleResetGame = () => {
    resetGame();
    resetAnimations();
  };

  useEffect(() => {
    if (hasStarted) {
      introAnim.setValue(0);
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [hasStarted, introAnim]);

  const introStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [{ scale: backScale }],
    opacity: 1,
  };

  const animateBackButton = (toValue: number) => {
    Animated.timing(backScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const hintScale = useRef(new Animated.Value(1)).current;

// вместо useAnimatedStyle
const hintAnimatedStyle = {
  transform: [{ scale: hintScale }],
  opacity: 1,
};

// функция для анимации нажатия
const animateHintButton = (toValue: number) => {
  Animated.timing(hintScale, {
    toValue,
    duration: 100,
    useNativeDriver: true,
  }).start();
};
const handleBackToStart = () => {
  Animated.timing(introAnim, {
    toValue: 0,
    duration: 500,
    useNativeDriver: true,
  }).start(() => {
    handleResetGame();
    setHasStarted(false);
  });
};

  return (
    <ImageBackground source={backgroundImage} style={styles.container} testID="tic-tac-toe-game">
      <Animated.View style={[styles.gameContainer, hasStarted ? introStyle : null, gameContainerStyle]} testID="game-content">
        <View>
          <Image
            source={require('../assets/ellipse.png')}
            style={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              width: '100%',
              height: Dimensions.get('window').height,
              resizeMode: 'cover',
              zIndex: 0,
            }}
          />

          <View style={styles.playersContainer}>
            <View style={{ marginRight: 20 }}>
              <PlayerAvatar
                photo={photo1}
                name={name1}
                player="X"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player1Style}
                testID="player1-container"
                boardHeight={boardHeight}
                isFirstPlayer={true}
              />
            </View>

            <GameBoard
              board={gameState.board}
              onCellPress={handleCellPress}
              winningLine={gameState.winningLine}
              bestMove={bestMove}
              photo1={photo1}
              photo2={photo2}
              onMoveCountChange={setMoveCount}
              onLayout={(event) => setBoardHeight(event.nativeEvent.layout.height)}
            />

            <View style={{ marginLeft: 20 }}>
              <PlayerAvatar
                photo={photo2}
                name={name2}
                player="O"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player2Style}
                testID="player2-container"
                boardHeight={boardHeight}
                isFirstPlayer={false}
              />
            </View>
          </View>
        </View>

        {/* Top bar icons */}
        <View style={styles.topBar} pointerEvents="box-none">
        <Animated.View style={[styles.backButton, backAnimatedStyle]}>
  <TouchableOpacity
    activeOpacity={1}
    onPressIn={() => animateBackButton(0.9)}
    onPressOut={() => {
      animateBackButton(1);
      setHasStarted(false);  
      handleResetGame(); 
    }}
  >
    <BackIcon />
  </TouchableOpacity>
</Animated.View>

          <Animated.View style={[styles.hintButton, hintAnimatedStyle]}>
  <TouchableOpacity
    activeOpacity={1}
    onPressIn={() => animateHintButton(0.9)}   // при нажатии уменьшается
    onPressOut={() => animateHintButton(1)}   // при отпускании возвращается
  >
    <View style={styles.hintGlow}>
      <View style={styles.hintBorder}>
        <LinearGradient
          colors={['#FFB380', '#D16C00']}
          style={styles.hintButtonInner}
        >
          <Text style={styles.hintText}>?</Text>
        </LinearGradient>
      </View>
    </View>
  </TouchableOpacity>
</Animated.View>
        </View>

        {moveCount >= 2 && (
          <View style={styles.imageContainer} pointerEvents="box-none">
            <TouchableOpacity onPress={undoLastTwoMoves} activeOpacity={0.8} testID="back-button">
              <Image
                source={require('../assets/back_board.png')}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      <GameOverScreen
        winner={gameState.winner}
        gameComplete={gameComplete}
        winGif={winGif}
        onPlayAgain={handleResetGame}
        animatedStyle={congratsContainerStyle}
      />
      {!hasStarted && (
        <View style={styles.startScreenContainer}>
          <StartScreen onStart={() => setHasStarted(true)} />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  backIcon: { width: 110, height: 110 },
  imageContainer: {
    position: 'absolute',
    top: '20%',
    bottom: 0,
    right: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 20,
  },
  hintButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    top: 34,
    right: 30,
  },
  hintGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: 'rgba(144, 33, 232, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  hintBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 229, 124, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
    backgroundColor: 'transparent',
  },
  hintButtonInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'FredokaSemiBold',
    textAlign: 'center',
  },
  gameContainer: { flex: 1, justifyContent: 'center', height: '80%' },
  playersContainer: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, marginTop: '10%' },
  startScreenContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 18, 18, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 34,
    left: 30,
    zIndex: 1000,
   },
  iconButton: { padding: 6 },
  topIconQuest: { width: 110, height: 110 },
});

export default TicTacToe;
