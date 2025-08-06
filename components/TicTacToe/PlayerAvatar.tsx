import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated , Easing  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Player } from '@/types/tic-tac-toe';
import Star from '@/svg/star';
import WhiteStar from '@/svg/whiteStart'
const { width } = Dimensions.get('window');
const AVATAR_SIZE = 60;

interface PlayerAvatarProps {
  photo: any;
  name: string;
  player: Player;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  animatedStyle: any;
  testID: string;
  boardHeight?: number;
  isFirstPlayer?: boolean;
}

const AnimatedStar = ({ 
  isActive, 
  onComplete,
  isFirstPlayer
}: { 
  isActive: boolean; 
  onComplete: () => void;
  isFirstPlayer: boolean;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      // Случайные направления и дистанция
      const angle = Math.random() * 2 * Math.PI;
      const distance = 60 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      // Сбросить значения
      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);

      // Параллельная анимация
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: dx,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: dy,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Используем setTimeout чтобы избежать обновления состояния во время рендера
        setTimeout(() => {
          onComplete();
        }, 0);
      });
    }
  }, [isActive]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!isActive) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: AVATAR_SIZE / 2 - 10,
        left: AVATAR_SIZE / 2 - 10,
        transform: [{ translateX }, { translateY }, { rotate: spin }],
        opacity,
        zIndex: 805,
      }}
    >
      {isFirstPlayer ? (
        <Star width={20} height={20} />
      ) : (
        <View style={{ width: 20, height: 20 }}>
          <WhiteStar />
        </View>
      )}
    </Animated.View>
  );
};

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
  const [activeStars, setActiveStars] = React.useState<number[]>([]);
  const [starTriggers, setStarTriggers] = React.useState<number[]>([]);
  const starCounter = useRef(0);

  const lightPulse = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Функция для создания новой звезды
  const spawnStar = () => {
    if (activeStars.length < 5) {
      const newStarId = starCounter.current++;
      setActiveStars(prev => [...prev, newStarId]);
      // Добавляем триггер для запуска анимации
      setStarTriggers(prev => [...prev, newStarId]);
    }
  };

  // Функция для удаления звезды
  const removeStar = (starId: number) => {
    setActiveStars(prev => prev.filter(id => id !== starId));
    setStarTriggers(prev => prev.filter(id => id !== starId));
  };

  useEffect(() => {
    if (currentPlayer === player && !winner) {
      // Создаем звезды с интервалом
      const interval = setInterval(() => {
        spawnStar();
      }, 500 + Math.random() * 1000);

      // Анимация пульсации света
      Animated.loop(
        Animated.sequence([
          Animated.timing(lightPulse, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(lightPulse, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Анимация вращения фона
      rotation.setValue(0); // сбросить
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 6000, // медленнее вращение, можно менять
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      return () => clearInterval(interval);
    } else {
      // Очищаем все звезды когда игрок неактивен
      setActiveStars([]);
      lightPulse.setValue(0);
      rotation.setValue(0);
    }
  }, [currentPlayer, player, winner]);
    
const blinkingOpacity = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (currentPlayer === player && !winner) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingOpacity, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkingOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  } else {
    blinkingOpacity.setValue(1); // если не текущий игрок — вернуть прозрачность в норму
  }
}, [currentPlayer, player, winner]);
  const renderTurnIndicator = () => {
    if (currentPlayer !== player || winner) return null;
    
    return (
      <View style={styles.turnIndicatorAboveAvatar}>
        <Text style={[
          styles.turnTextAboveAvatar,
          player === 'O' && styles.turnTextSecondPlayer
        ]}>
          {player === 'X' ? 'Your turn' : `${name}'s turn`}
        </Text>
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
        {isFirstPlayer && (
              <LinearGradient
                colors={['#4B56EF', '#9165FF', 'rgba(226, 66, 228, 0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                locations={[0.205, 0.76, 1]}
                style={styles.leftBorder}
              />
            )}
            {!isFirstPlayer && (
              <LinearGradient
                colors={['#4B56EF', '#9165FF', 'rgba(226, 66, 228, 0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                locations={[0.205, 0.76, 1]}
                style={styles.rightBorder}
              />
            )}
        <View style={styles.contentContainer}>
        {currentPlayer === player && !winner && (
   
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
          <Animated.View style={[
            styles.avatarContainer, 
            currentPlayer === player 
              ? (isFirstPlayer ? styles.activeFirstPlayerContainer : styles.activeSecondPlayerContainer)
              : (isFirstPlayer ? styles.firstPlayerAvatar : styles.secondPlayerAvatar),
            animatedStyle
          ]}>
          
            <Image source={photo} style={styles.avatar} />
          </Animated.View>
          <Animated.Text style={[styles.playerName, currentPlayer === player && !winner && { opacity: blinkingOpacity }]}>
           {name}
          </Animated.Text>
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
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  turnIndicatorAboveAvatar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,

    position: 'absolute',
    top: '-90%',
    zIndex: 10,
  },
  turnTextAboveAvatar: {
    color: '#FFE97C',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    fontStyle: 'normal', // SemiBold is usually fontWeight 600, fontStyle normal
    fontSize: 15,
    lineHeight: 18.3, // 15 * 1.22 = 18.3
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
    textShadowColor: '#B14EFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  turnTextSecondPlayer: {
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