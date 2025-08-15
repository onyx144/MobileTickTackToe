import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { AppState, AppStateStatus } from 'react-native';

export const useSound = () => {
  const backgroundMusic = useRef<Audio.Sound | null>(null);
  const notificationSound = useRef<Audio.Sound | null>(null);
  const victorySound = useRef<Audio.Sound | null>(null);
  const sadGameSound = useRef<Audio.Sound | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const initSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true, // музыка может играть в фоне
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound: bgMusic } = await Audio.Sound.createAsync(
          require('../assets/sounds/background-music.mp3'),
          { isLooping: true, volume: 0.5, shouldPlay: false }
        );
        backgroundMusic.current = bgMusic;

        const { sound: notifSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/notification-sound-effect.mp3'),
          { isLooping: false, volume: 0.7, shouldPlay: false }
        );
        notificationSound.current = notifSound;

        const { sound: victSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/success-fanfare-trumpets.mp3'),
          { isLooping: false, volume: 0.8, shouldPlay: false }
        );
        victorySound.current = victSound;

        const { sound: sadSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/sad-game.mp3'),
          { isLooping: false, volume: 0.8, shouldPlay: false }
        );
        sadGameSound.current = sadSound;

        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(false);
      }
    };

    initSounds();

    // Обработчик AppState для приостановки и возобновления музыки
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        // приложение уходит в фон — ставим музыку на паузу
        if (backgroundMusic.current) await backgroundMusic.current.pauseAsync();
      } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // возвращение в приложение — возобновляем музыку
        if (backgroundMusic.current) await backgroundMusic.current.playAsync();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Очистка при размонтировании
    return () => {
      subscription.remove();
      const cleanup = async () => {
        if (backgroundMusic.current) await backgroundMusic.current.unloadAsync();
        if (notificationSound.current) await notificationSound.current.unloadAsync();
        if (victorySound.current) await victorySound.current.unloadAsync();
        if (sadGameSound.current) await sadGameSound.current.unloadAsync();
      };
      cleanup();
    };
  }, []);

  const playBackgroundMusic = async () => {
    if (backgroundMusic.current && isInitialized) await backgroundMusic.current.playAsync();
  };
  const stopBackgroundMusic = async () => {
    if (backgroundMusic.current && isInitialized) await backgroundMusic.current.stopAsync();
  };
  const playNotificationSound = async () => {
    if (notificationSound.current && isInitialized) {
      await notificationSound.current.setPositionAsync(0);
      await notificationSound.current.playAsync();
    }
  };
  const playVictorySound = async () => {
    if (victorySound.current && isInitialized) {
      await victorySound.current.setPositionAsync(0);
      await victorySound.current.playAsync();
    }
  };
  const playSadGameSound = async () => {
    if (sadGameSound.current && isInitialized) {
      await sadGameSound.current.setPositionAsync(0);
      await sadGameSound.current.playAsync();
    }
  };
  const pauseBackgroundMusic = async () => {
    if (backgroundMusic.current && isInitialized) await backgroundMusic.current.pauseAsync();
  };
  const resumeBackgroundMusic = async () => {
    if (backgroundMusic.current && isInitialized) await backgroundMusic.current.playAsync();
  };

  return {
    playBackgroundMusic,
    stopBackgroundMusic,
    playNotificationSound,
    playVictorySound,
    playSadGameSound,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    isInitialized,
  };
};
