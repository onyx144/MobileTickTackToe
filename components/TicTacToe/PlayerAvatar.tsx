import React, { useEffect, useRef , useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Player } from '@/types/tic-tac-toe';
import { AnimatedStar, useBlinkingOpacity, useLoopingRotation, useAvatarStars } from './Animation';
const { width } = Dimensions.get('window');
const AVATAR_SIZE = 60;

interface PlayerAvatarProps {
  photo: any;
  name: string;
  player: Player;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  animatedStyle: any; // анимация подъёма аватара
  testID: string;
  boardHeight?: number;
  isFirstPlayer?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  photo,
  name,
  player,
  currentPlayer,
  winner,
  animatedStyle,
  testID,
  boardHeight,
  isFirstPlayer,
}) => {
  const isActive = currentPlayer === player && !winner;

  // Показываем фон и звёзды только после подъёма аватара
  const [showBackground, setShowBackground] = useState(false);

  const { activeStars, starTriggers, removeStar } = useAvatarStars(isActive && showBackground, {
    maxStars: 5,
    minIntervalMs: 500,
    maxIntervalMs: 1500,
  });

  const rotation = useLoopingRotation(isActive && showBackground, { durationMs: 18000 });
  const blinkingOpacity = useBlinkingOpacity(isActive, { lowOpacity: 0.3, durationMs: 200 });

  // Очистка звезд при деактивации
  useEffect(() => {
    if (!isActive || !showBackground) {
      activeStars.forEach(starId => removeStar(starId));
    }
  }, [isActive, showBackground, activeStars, removeStar]);

  // После завершения анимации подъёма аватара включаем фон
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowBackground(true), 100); // подстраиваем под длительность animatedStyle
      return () => clearTimeout(timer);
    } else {
      setShowBackground(false);
    }
  }, [isActive]);

  // Сброс состояния при изменении игрока или сбросе игры
  useEffect(() => {
    if (!isActive) {
      setShowBackground(false);
    }
  }, [currentPlayer, winner]);

  const renderTurnIndicator = () => {
    if (currentPlayer !== player || winner) return null;

    return (
      <View style={styles.turnIndicatorAboveAvatar}>
        <Animated.Text
          style={[
            styles.turnTextAboveAvatar,
            player === 'O' && styles.turnTextSecondPlayer,
            { opacity: blinkingOpacity }, // мигание только индикатора хода
          ]}
        >
          {player === 'X' ? 'Your turn' : `${name}'s turn`}
        </Animated.Text>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.playerContainer, boardHeight ? { height: boardHeight } : undefined]} testID={testID}>
      <LinearGradient
        colors={['rgba(43, 23, 178, 0)', 'rgba(39, 25, 135, 0.3)']}
        style={styles.gradientBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {isFirstPlayer ? (
          <LinearGradient
            colors={['#4B56EF', '#9165FF', 'rgba(226, 66, 228, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0.205, 0.76, 1]}
            style={styles.leftBorder}
          />
        ) : (
          <LinearGradient
            colors={['#4B56EF', '#9165FF', 'rgba(226, 66, 228, 0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0.205, 0.76, 1]}
            style={styles.rightBorder}
          />
        )}

        <View style={styles.contentContainer}>
          {/* Фон и звёзды только после подъёма аватара */}
          {isActive && showBackground && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.rotatingBackground,
                {
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
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
                  isFirstPlayer={isFirstPlayer || false}
                />
              ))}
            </Animated.View>
          )}

          {renderTurnIndicator()}

          <Animated.View
            style={[
              styles.avatarContainer,
              currentPlayer === player
                ? isFirstPlayer
                  ? styles.activeFirstPlayerContainer
                  : styles.activeSecondPlayerContainer
                : isFirstPlayer
                ? styles.firstPlayerAvatar
                : styles.secondPlayerAvatar,
              animatedStyle,
            ]}
          >
            <Image source={photo} style={styles.avatar} />
          </Animated.View>

          <Text style={styles.playerName}>{name}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: 'center',
    width: width * 0.2,
    justifyContent: 'flex-end',
  },
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'center',
    minWidth: AVATAR_SIZE * 1.5,

    justifyContent: 'flex-end',
  },
  avatarContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
    zIndex: 801,
    position: 'relative',
  },
  activeAvatar: {
    shadowColor: '#00CCFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 50,
  },
  leftBorder: {
    position: 'absolute',
    left: -2,
    bottom: 0,
    width: 3,
    zIndex: 1000,
    height: '100%',
    borderRadius: 1,
  },
  rightBorder: {
    position: 'absolute',
    right: -2,
    width: 3,
    height: '100%',
    borderRadius: 1,
    bottom: 0,
  },
  playerName: {
    color: 'white',
     fontFamily: 'Fredoka',
     textTransform: 'uppercase',
    width: '100%',
    fontStyle: 'normal',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  turnIndicatorAboveAvatar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    maxWidth: '100%',
    fontFamily: 'Fredoka',
    position: 'absolute',
    top: '-90%',
    zIndex: 10,
  },
  turnTextAboveAvatar: {
    color: '#FFE97C',
    fontFamily: 'Fredoka',
     fontSize: 15,
    lineHeight: 18.3, // 15 * 1.22 = 18.3
    letterSpacing: 0,
    width: 100,
    height: 'auto',
    textAlign: 'center',
    verticalAlign: 'middle',
    textShadowColor: '#B14EFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  turnTextSecondPlayer: {
    fontFamily: 'Fredoka',
     fontStyle: 'normal',
    color: 'white',
    textShadowColor: '#B14EFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  firstPlayerAvatar: {
    borderWidth: 3,
    borderColor: '#FFE97C',
    shadowColor: '#C57CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    borderRadius: 50,
    shadowRadius: 10,
    elevation: 10,
  },
  secondPlayerAvatar: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ADEFFF',
  },
  raysContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 99999,
    left: 0,
    right: 0,
    height: AVATAR_SIZE + 20,
    width: AVATAR_SIZE + 20,
    bottom: 0,
    borderRadius: AVATAR_SIZE,
    backgroundColor: 'rgba(253, 248, 141, 0.4)', // светло-жёлтый glow
    shadowColor: '#FFF174',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  rotatingBackground: {
    position: 'absolute',
    top: -60,
    left: -10,
    width: AVATAR_SIZE + 50,
    height: AVATAR_SIZE + 50,
    zIndex: 800,
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  activeFirstPlayerContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 6,
    borderColor: '#FFE97C',
    shadowColor: '#C57CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  activeSecondPlayerContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 6,
    borderColor: '#B5F1FF',
  },
});

export default PlayerAvatar;