import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelloScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7541/7541673.png' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome back!</Text>
                <Text style={styles.subtitle}>
                    Order your favorite meals quickly and earn rewards.
                </Text>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Existing User"
                        onPress={() => router.push('/login')}
                        style={styles.loginButton}
                    />
                    <CustomButton
                        title="New User"
                        onPress={() => router.push('/signup')}
                        variant="outline"
                        style={styles.signupButton}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: Spacing.xl,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
    },
    buttonContainer: {
        width: '100%',
        gap: Spacing.md,
    },
    loginButton: {
        width: '100%',
    },
    signupButton: {
        width: '100%',
    },
});
