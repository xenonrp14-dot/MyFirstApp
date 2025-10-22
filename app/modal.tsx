import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.background}>
      <View style={styles.card}>
        <MaterialIcons name="info" size={50} color="#4CAF50" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>This is a modal</Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && { backgroundColor: '#388E3C' }]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Link href="/" dismissTo style={styles.link}>
              <Text style={styles.buttonText}>Go to Home Screen</Text>
            </Link>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent:'center', alignItems:'center' },
  card: { backgroundColor:'#fff', padding:30, borderRadius:20, width:'90%', alignItems:'center',
          shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.3, shadowRadius:10, elevation:10 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20 },
  button: { backgroundColor:'#4CAF50', padding:15, borderRadius:25, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold', fontSize:16 },
  link: { textAlign:'center' }
});
