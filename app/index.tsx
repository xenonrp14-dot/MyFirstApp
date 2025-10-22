
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // redirect to login screen
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
