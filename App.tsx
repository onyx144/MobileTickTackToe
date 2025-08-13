import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import TicTacToe from '@/components/TicTacToe';
export default function App() {
  const [fontsLoaded] = useFonts({
    'Bangers': require('./assets/fonts/Bangers-Regular.ttf'),
    'Fredoka': require('./assets/fonts/fredoka-one.one-regular.ttf'),
  });

  
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
