import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const showAlert = () => {
    Alert.alert("Hello!", "You pressed the button!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>
      <Button title="Press Me" onPress={showAlert} />
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
