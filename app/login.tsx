import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from './firebase'; // make sure path is correct

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction:3, tension:40, useNativeDriver: true }).start();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Login Failed", "Please enter email and password");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("Logged in user:", userCredential.user);
      router.replace('/dashboard'); // replace to prevent going back
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", (error as any).code, error.message);
        Alert.alert("Login Failed", error.message);
      } else {
        console.error("Login error:", error);
        Alert.alert("Login Failed", "An unknown error occurred.");
      }
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.background}>
      <View style={styles.card}>
        <MaterialIcons name="login" size={50} color="#4CAF50" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && { backgroundColor: '#388E3C' }]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </Animated.View>
        <Pressable onPress={() => router.push('/signup')} style={{ marginTop: 15 }}>
          <Text style={styles.link}>Go to Signup</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, justifyContent:'center', alignItems:'center' },
  card: { backgroundColor:'#fff', padding:30, borderRadius:20, width:'90%', alignItems:'center',
          shadowColor:'#000', shadowOffset:{width:0,height:5}, shadowOpacity:0.3, shadowRadius:10, elevation:10 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', padding:10, marginBottom:10, borderRadius:5 },
  button: { backgroundColor:'#4CAF50', padding:15, borderRadius:25, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold', fontSize:16 },
  link: { color:'#4CAF50', fontWeight:'bold', textAlign:'center' }
});
