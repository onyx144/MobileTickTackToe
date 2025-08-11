import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions, Animated, View , Image } from 'react-native';
import { Player } from '@/types/tic-tac-toe';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface GameOverScreenProps {
  winner: Player | 'draw' | null;
  gameComplete: boolean;
  winGif: any;
  onPlayAgain: () => void;
  animatedStyle: any;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  gameComplete,
  winGif,
  onPlayAgain,
  animatedStyle,
}) => {
  const [showVictoryEffects, setShowVictoryEffects] = useState(false);

useEffect(() => {
  if (gameComplete && winner !== 'draw' && winner !== null) {
    // Подождать 300-500 мс перед эффектами
    const timeout = setTimeout(() => {
      setShowVictoryEffects(true);
    }, 300);

    return () => clearTimeout(timeout);
  }
}, [gameComplete, winner]);


  if (!gameComplete) return null;

  let message = "It's a draw!";
  let showWinGif = false;

  if (winner === 'X') {
    message = 'Congratulations!';
    showWinGif = true;
  } else if (winner === 'O') {
    message = 'You Lose';
  }

  return (
    <Animated.View style={[styles.gameOverContainer, animatedStyle]} testID="game-over-container">
      {showWinGif && (
        <LottieView
          source={winGif}
          autoPlay
          loop={true}
          style={styles.winGif}
          speed={0.5}
        />
      )}
     <LinearGradient
  colors={['rgba(125, 34, 241, 0)', '#7D22F1', 'rgba(125, 34, 241, 0)']}
  locations={[0.1, 0.5, 0.9]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.gradientTextContainer}
>
  <View style={styles.centeredTextWrapper}>
    <Text style={styles.gameOverText}>{message}</Text>
  </View>
</LinearGradient>

      <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain} testID="play-again-button">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.playAgainText}>Play Game Again</Text>
          <Image
            source={require('../../assets/play.png')}
            style={{ width: 24, height: 24, marginLeft: 8 }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  gradientTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  centeredTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontFamily: 'Bangers',
    fontWeight: '600',
    fontSize: 48,
    fontStyle: 'normal',
    color: 'white',
    textAlign: 'center',
    
    lineHeight: 38, // 80% of 48
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playAgainButton: {
    backgroundColor: '#FFC965',
    borderWidth: 1,
    borderColor: '#C57CFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  playAgainText: {
    color: '#C57CFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  winGif: {
    position: 'absolute',
    width: width,
    height: 300,
    left: '-50%',
    top: -100,
    zIndex: 99999,
    marginBottom: 20,
  },
});

export default GameOverScreen;
