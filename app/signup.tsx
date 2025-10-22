import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from './firebase';

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction:3, tension:40, useNativeDriver: true }).start();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Signup Failed", "Please fill all fields");
    }
    if (password.length < 6) {
      return Alert.alert("Signup Failed", "Password must be at least 6 characters");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.trim(),
        role: "student",
        createdAt: new Date()
      });

      Alert.alert("Signup Successful", `Welcome ${name}`);
      router.replace('/login'); // replace to prevent back navigation
    } catch (error) {
      if (error instanceof Error) {
        // Firebase errors may have 'code' and 'message'
        const code = (error as any).code || 'Unknown';
        console.error("Signup error:", code, error.message);
        Alert.alert("Signup Failed", error.message);
      } else {
        console.error("Signup error:", error);
        Alert.alert("Signup Failed", "An unknown error occurred.");
      }
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.background}>
      <View style={styles.card}>
        <MaterialIcons name="person-add" size={50} color="#4CAF50" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Signup</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
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
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </Pressable>
        </Animated.View>
        <Pressable onPress={() => router.push('/login')} style={{ marginTop: 15 }}>
          <Text style={styles.link}>Go to Login</Text>
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
