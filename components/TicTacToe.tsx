import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TicTacToeProps } from '@/types/tic-tac-toe';
import GameBoard from './TicTacToe/GameBoard';
import PlayerAvatar from './TicTacToe/PlayerAvatar';
import GameOverScreen from './TicTacToe/GameOverScreen';
import { useTicTacToeGame } from '../hooks/useTicTacToeGame';
import { useTicTacToeAnimations } from '../hooks/useTicTacToeAnimations';

const { width } = Dimensions.get('window');

const DEFAULT_PROPS = {
  backgroundImage: require('../assets/bg.png'),
  name1: 'Player 1',
  name2: 'AI',
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

  const [boardHeight, setBoardHeight] = useState<number>(0);
  const { gameState, bestMove, gameComplete, handleCellPress, resetGame } = useTicTacToeGame();
  
  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
    resetAnimations,
  } = useTicTacToeAnimations(gameState.currentPlayer, gameState.winner);

  const handleResetGame = () => {
    resetGame();
    resetAnimations();
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} testID="tic-tac-toe-game">
      <Animated.View style={[styles.gameContainer, gameContainerStyle]} testID="game-content">
       <View >
       <Image
         source={require('../assets/ellipse.png')}
         style={{
           position: 'absolute',
           top: 0,
           left: 0,
           right: 0,
           width: '100%',
           height: Dimensions.get('window').height,
           resizeMode: 'cover',
           zIndex: 0,
         }}
       />

          <View style={styles.playersContainer}>
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
            
           
              <GameBoard
                board={gameState.board}
                onCellPress={handleCellPress}
                winningLine={gameState.winningLine}
                bestMove={bestMove}
                photo1={photo1}
                photo2={photo2}
                onLayout={(event) => setBoardHeight(event.nativeEvent.layout.height)}
              />
            
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
      </Animated.View>
      
      <GameOverScreen
        winner={gameState.winner}
        gameComplete={gameComplete}
        winGif={winGif}
        onPlayAgain={handleResetGame}
        animatedStyle={congratsContainerStyle}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingBottom: 40,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '80%',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: '10%',
  },
  ellipticPanel: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: '50%',
    backgroundColor: 'rgba(22, 16, 62, 0.5)',

    borderTopLeftRadius: width ,   // огромный радиус, чтобы создать эллипс
    borderTopRightRadius: width ,

    borderTopWidth: 2,
    borderTopColor: '#C57CFF',

    overflow: 'hidden',
  },
  boardContainer: {
    padding: 10,
    borderRadius: 10,
  },
});

export default TicTacToe;