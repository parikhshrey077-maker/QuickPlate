import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function LoginScreen() {
    const [sapId, setSapId] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ sapId?: string; password?: string }>({});

    const { signIn, isLoading } = useAuth();
    const router = useRouter();

    const validateForm = () => {
        const newErrors: { sapId?: string; password?: string } = {};
        if (!sapId) newErrors.sapId = 'SAP ID is required';
        else if (!/^\d{6,11}$/.test(sapId)) newErrors.sapId = 'Invalid SAP ID format';

        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            await signIn(sapId, password);
            // Router automatic redirect handled in AuthContext default or here if needed, 
            // but usually AuthContext state change triggers navigation.
            // If explicit redirect needed: router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Please try again');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={Colors.light.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Existing User Sign In</Text>
                <Text style={styles.subtitle}>
                    Enter your credentials to sign in
                </Text>

                <View style={styles.form}>
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>SAP ID</Text>
                            <TextInput
                                style={[styles.input, errors.sapId ? styles.inputError : null]}
                                placeholder="Enter SAP ID"
                                value={sapId}
                                onChangeText={(text) => {
                                    setSapId(text);
                                    if (errors.sapId) setErrors({ ...errors, sapId: undefined });
                                }}
                                keyboardType="numeric"
                                maxLength={11}
                                editable={!isLoading}
                            />
                            {errors.sapId && <Text style={styles.errorText}>{errors.sapId}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={[styles.input, errors.password ? styles.inputError : null]}
                                placeholder="Enter Password"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({ ...errors, password: undefined });
                                }}
                                secureTextEntry
                                editable={!isLoading}
                            />
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        <CustomButton
                            title={isLoading ? 'Logging In...' : 'Sign In'}
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={{ marginTop: Spacing.lg }}
                        />
                    </View>
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
    header: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
    },
    backButton: {
        padding: Spacing.sm,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        marginBottom: Spacing.xxl,
    },
    form: {
        gap: Spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: 16,
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    errorText: {
        color: Colors.light.error,
        fontSize: 12,
        marginTop: 4,
    },
});
