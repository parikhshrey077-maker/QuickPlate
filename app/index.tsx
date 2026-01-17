
import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Loading...</Text></View>;
    }

    // If useAuth hook implementation is correct, it should redirect. 
    // But strictly speaking, the root layout handles the stack. 
    // The 'app/index.tsx' shouldn't exist if using (tabs) as root or we redirect.
    // Actually, usually app/index redirects to app/(tabs)/

    return <Redirect href="/(tabs)" />;
}
