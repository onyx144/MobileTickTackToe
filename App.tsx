import { StatusBar } from 'expo-status-bar';
import { Platform , StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';

import TicTacToe from '@/components/TicTacToe';
export default function App() {
  const [fontsLoaded] = useFonts({
    'Bangers': require('./assets/fonts/Bangers-Regular.ttf'),
    'Fredoka': require('./assets/fonts/fredoka-one.one-regular.ttf'),
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Скрыть нижнюю панель навигации
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);
  return (
    <View style={styles.container}>
       <TicTacToe 
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
