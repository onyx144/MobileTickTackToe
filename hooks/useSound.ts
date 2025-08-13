import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export const useSound = () => {
  const backgroundMusic = useRef<Audio.Sound | null>(null);
  const notificationSound = useRef<Audio.Sound | null>(null);
  const victorySound = useRef<Audio.Sound | null>(null);
  const sadGameSound = useRef<Audio.Sound | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Инициализация звуков при монтировании компонента
    const initSounds = async () => {
      try {
        // Настраиваем аудио режим
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

 
        // Загружаем фоновую музыку
        try {
          const { sound: bgMusic } = await Audio.Sound.createAsync(
            require('../assets/sounds/background-music.mp3'),
            { 
              isLooping: true,
              volume: 1.0, // Увеличиваем громкость для тестирования
              shouldPlay: false
            }
          );
          backgroundMusic.current = bgMusic;
          
          // Проверяем статус загрузки
          const status = await bgMusic.getStatusAsync();
           
          if (status.isLoaded) {
             // Устанавливаем громкость после загрузки
            await bgMusic.setVolumeAsync(0.5);
          } else {
           }
        } catch (error) {
         }

        // Загружаем звук уведомления
        try {
          const { sound: notifSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/notification-sound-effect.mp3'),
            { 
              isLooping: false,
              volume: 0.7,
              shouldPlay: false
            }
          );
          notificationSound.current = notifSound;
         } catch (error) {
         }

        // Загружаем звук победы
        try {
          const { sound: victSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/success-fanfare-trumpets.mp3'),
            { 
              isLooping: false,
              volume: 0.8,
              shouldPlay: false
            }
          );
          victorySound.current = victSound;
         } catch (error) {
         }

        // Загружаем звук проигрыша бота
        try {
          const { sound: sadSound } = await Audio.Sound.createAsync(
            require('../assets/sounds/sad-game.mp3'),
            { 
              isLooping: false,
              volume: 0.8,
              shouldPlay: false
            }
          );
          sadGameSound.current = sadSound;
         } catch (error) {
         }

        setIsInitialized(true);
       } catch (error) {
         setIsInitialized(false);
      }
    };

    initSounds();

    // Очистка при размонтировании
    return () => {
      const cleanup = async () => {
        try {
          if (backgroundMusic.current) {
            await backgroundMusic.current.unloadAsync();
          }
          if (notificationSound.current) {
            await notificationSound.current.unloadAsync();
          }
          if (victorySound.current) {
            await victorySound.current.unloadAsync();
          }
          if (sadGameSound.current) {
            await sadGameSound.current.unloadAsync();
          }
        } catch (error) {
         }
      };
      cleanup();
    };
  }, []);

  const playBackgroundMusic = async () => {
    try {
      if (backgroundMusic.current && isInitialized) {
        // Проверяем статус звука
        const status = await backgroundMusic.current.getStatusAsync();
         
        if (status.isLoaded) {
          await backgroundMusic.current.playAsync();
        }
      }
    } catch (error) {
      // Ошибка воспроизведения фоновой музыки
    }
  };

  const stopBackgroundMusic = async () => {
    try {
      if (backgroundMusic.current && isInitialized) {
        await backgroundMusic.current.stopAsync();
      }
    } catch (error) {
      // Ошибка остановки фоновой музыки
    }
  };

  const playNotificationSound = async () => {
    try {
      if (notificationSound.current && isInitialized) {
        // Сбрасываем позицию перед воспроизведением
        await notificationSound.current.setPositionAsync(0);
        await notificationSound.current.playAsync();
      }
    } catch (error) {
      // Ошибка воспроизведения звука уведомления
    }
  };

  const playVictorySound = async () => {
    try {
      if (victorySound.current && isInitialized) {
        // Сбрасываем позицию перед воспроизведением
        await victorySound.current.setPositionAsync(0);
        await victorySound.current.playAsync();
      }
    } catch (error) {
      // Ошибка воспроизведения звука победы
    }
  };

  const playSadGameSound = async () => {
    try {
      if (sadGameSound.current && isInitialized) {
        // Сбрасываем позицию перед воспроизведением
        await sadGameSound.current.setPositionAsync(0);
        await sadGameSound.current.playAsync();
      }
    } catch (error) {
      // Ошибка воспроизведения звука проигрыша
    }
  };

  const pauseBackgroundMusic = async () => {
    try {
      if (backgroundMusic.current && isInitialized) {
        await backgroundMusic.current.pauseAsync();
      }
    } catch (error) {
      // Ошибка паузы фоновой музыки
    }
  };

  const resumeBackgroundMusic = async () => {
    try {
      if (backgroundMusic.current && isInitialized) {
        await backgroundMusic.current.playAsync();
      }
    } catch (error) {
      // Ошибка возобновления фоновой музыки
    }
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