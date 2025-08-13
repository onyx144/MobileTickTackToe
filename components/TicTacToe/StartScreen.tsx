import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundWrapper from './litlecomponent/BackgroundWrapper';
import PlayIcon from '@/assets/svg/play-icon';
import globalStyles from '@/styles/global-styles';
type StartScreenProps = {
  onStart: () => void;
};

const { width } = Dimensions.get('window');

// Rotating clock component
const Clock: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: spin }],
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: '#C780FF',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 4,
          width: 2,
          height: size / 2 - 4,
          backgroundColor: '#C780FF',
          borderRadius: 1,
        }}
      />
    </Animated.View>
  );
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const loadingIconRotation = useRef(new Animated.Value(0)).current;

  const progressWidth = useMemo(
    () =>
      progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    [progressAnimation]
  );

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (isLoading) {
      loadingIconRotation.setValue(0);
      loop = Animated.loop(
        Animated.timing(loadingIconRotation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isLoading, loadingIconRotation]);

  const handleStart = () => {
    setIsLoading(true);
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onStart();
      }
    });
  };

  return (
    <BackgroundWrapper>
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.overlayContent}>
      <LinearGradient
        colors={[
          'rgba(125,34,241,0)',        // left transparent
          'rgba(124, 34, 241, 0.09)',     // center (0.9 * 0.5)
          'rgba(124, 34, 241, 0.1)',      // peak (1 * 0.5)
          'rgba(124, 34, 241, 0.09)',     // center (0.9 * 0.5)
          'rgba(124, 34, 241, 0)',        // right transparent
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.gradientText}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
          <Text style={styles.titleText}>Tic-Tac-Toe</Text>
        </LinearGradient>

        {!isLoading && (
          <Animated.View style={[styles.playButtonContainer, { transform: [{ scale: scaleAnimation }] }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleStart}
              style={[
                globalStyles.roundButton.base,
                globalStyles.roundButton.xxl,
              ]}
              testID="start-play-button"
            >
              <PlayIcon style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={['#7500D1', '#C780FF']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.progressBarBorder}
            >
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFillWrapper, { width: progressWidth }]}>
                  <LinearGradient
                    colors={['#C780FF', '#7500D1']}
                    start={{ x: 1, y: 0.5 }}
                    end={{ x: 0, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
                <View style={styles.progressContentOverlay} pointerEvents="none">
                  <View style={styles.loadingRowInsideBar}>
                    <Animated.Image
                      source={require('@/assets/clock.png')}
                      style={{ width: 24, height: 24, marginRight: 8, transform: [{ rotate: loadingIconRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}
                      resizeMode="contain"
                    />
                    <Text style={styles.loadingTextInside}>Loading...</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.40)',
    zIndex: 100,
  },
  overlayContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  gradientText: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 32,
  },
  titleText: {
    fontFamily: 'Fredoka',
    fontSize: 48,
    width: '100%',
    fontWeight: 600,
     color: '#FFFFFF',
    textAlign: 'center',
  },
  playButtonContainer: {
    alignSelf: 'center',
  },
  playButton: {
    width: Math.min(140, width * 0.35),
    height: Math.min(140, width * 0.35),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  playIcon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  loadingContainer: {
    width: '80%',
    maxWidth: 420,
    alignItems: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 4,
  },
  loadingTextInside: {
    fontFamily: 'Fredoka',
     fontSize: 18,
     fontWeight: 600,
    lineHeight: 22, // 18 * 1.22 ≈ 21.96
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlignVertical: 'center',
    marginLeft: 8,
  },
  progressBarBorder: {
    width: '100%',
    height: 53,
    borderRadius: 20,
    padding: 2,
  },
  progressTrack: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#7500D1',
    overflow: 'hidden',
  },
  progressFillWrapper: {
    height: '100%',
  },
  progressContentOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRowInsideBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StartScreen;

