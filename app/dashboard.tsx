// app/dashboard.js
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { auth, db } from './firebase';

type UserData = {
  name: string;
  email: string;
  role: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) {
        router.replace('/login');
        return;
      }

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        console.warn('No user data found!');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Logout Failed', 'Unable to logout. Try again.');
    }
  };

  if (!userData) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.background}>
      <View style={styles.card}>
        <MaterialIcons name="dashboard" size={50} color="#4CAF50" style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Welcome, {userData.name}!</Text>
        <Text style={styles.info}>Email: {userData.email}</Text>
        <Text style={styles.info}>Role: {userData.role}</Text>

        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 5 },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
