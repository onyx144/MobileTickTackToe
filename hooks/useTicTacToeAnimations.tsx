import { useRef, useEffect, useCallback } from 'react';
import { Animated, Dimensions } from 'react-native';
import { Player } from '@/types/tic-tac-toe';

const { height } = Dimensions.get('window');

export const useTicTacToeAnimations = (
  currentPlayer: Player,
  winner: Player | 'draw' | null,
  gameComplete?: boolean
) => {
  const gameContainerAnim = useRef(new Animated.Value(0)).current;
  const player1Anim = useRef(new Animated.Value(0)).current;
  const player2Anim = useRef(new Animated.Value(0)).current;
  const congratsAnim = useRef(new Animated.Value(0)).current;
  const backIconScale = useRef(new Animated.Value(1)).current;
  const undoButtonScale = useRef(new Animated.Value(1)).current;
  const playButtonScale = useRef(new Animated.Value(1)).current;

  const animatePlayerTurn = useCallback((player: Player) => {
    if (player === 'X') {
      Animated.parallel([
        Animated.spring(player1Anim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(player2Anim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(player1Anim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(player2Anim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [player1Anim, player2Anim]);

  const animateGameCompletion = useCallback(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(gameContainerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(congratsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [gameContainerAnim, congratsAnim]);

  const resetAnimations = useCallback(() => {
    gameContainerAnim.setValue(0);
    congratsAnim.setValue(0);
    // После сброса поднимаем аватар первого игрока по умолчанию
    player1Anim.setValue(1);
    player2Anim.setValue(0);
    // Сброс анимации кнопок
    backIconScale.setValue(1);
    undoButtonScale.setValue(1);
    playButtonScale.setValue(1);
  }, [gameContainerAnim, congratsAnim, player1Anim, player2Anim, backIconScale, undoButtonScale, playButtonScale]);

  const animateBackIcon = useCallback((toValue: number) => {
    Animated.timing(backIconScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [backIconScale]);

  const animateUndoButton = useCallback((toValue: number) => {
    Animated.timing(undoButtonScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [undoButtonScale]);

  const animatePlayButton = useCallback((toValue: number) => {
    Animated.timing(playButtonScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [playButtonScale]);

  useEffect(() => {
    animatePlayerTurn(currentPlayer);
  }, [currentPlayer, animatePlayerTurn]);

  useEffect(() => {
    if (gameComplete) {
      animateGameCompletion();
    }
  }, [gameComplete, animateGameCompletion]);

  const player1Style = {
    transform: [
      {
        translateY: player1Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -40],
        }),
      },
    ],
    opacity: player1Anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
  };

  const player2Style = {
    transform: [
      {
        translateY: player2Anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -40],
        }),
      },
    ],
    opacity: player2Anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
  };

  const gameContainerStyle = {
    transform: [
      {
        translateY: gameContainerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, height],
        }),
      },
    ],
    opacity: gameContainerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const congratsContainerStyle = {
    opacity: congratsAnim,
    transform: [
      {
        translateY: congratsAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [60, 0],
        }),
      },
    ],
  };

  const backIconStyle = {
    transform: [{ scale: backIconScale }],
    opacity: 1,
  };

  const undoButtonStyle = {
    transform: [{ scale: undoButtonScale }],
    opacity: 1,
  };

  const playButtonStyle = {
    transform: [{ scale: playButtonScale }],
    opacity: 1,
  };

  return {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
    backIconStyle,
    undoButtonStyle,
    playButtonStyle,
    animateBackIcon,
    animateUndoButton,
    animatePlayButton,
    resetAnimations,
  };
};