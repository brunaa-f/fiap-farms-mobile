import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { setUser, isAuthenticated, isLoading } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isLoading) {
      return;
    }

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  return <Slot />; 
}
