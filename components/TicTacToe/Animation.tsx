import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor(width / 12);

// Компонент для анимации победы с золотистым свечением
export const VictoryGlow: React.FC = () => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          backgroundColor: '#FFD70033', // золотистый свет
          opacity: glow,
        },
      ]}
    />
  );
};

// Компонент для анимации появления ячейки
export const CellAppearAnimation: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

// Компонент для анимации пульсации
export const PulseAnimation: React.FC<{ color?: string }> = ({ color = '#4CAF50' }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          backgroundColor: color,
          opacity: 0.3,
          transform: [{ scale: pulse }],
        },
      ]}
    />
  );
};

// Компонент для анимации вращения
export const RotationAnimation: React.FC = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          borderWidth: 2,
          borderColor: '#FFD700',
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};

// Экспорт по умолчанию для обратной совместимости
export default VictoryGlow;
  