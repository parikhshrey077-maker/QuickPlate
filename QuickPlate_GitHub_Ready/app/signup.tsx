
import { CustomButton } from '../components/CustomButton';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../components/ui/icon-symbol';

export default function SignupScreen() {
    const [sapId, setSapId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // const [step, setStep] = useState(1); // Removed step
    const [errors, setErrors] = useState<{ sapId?: string; name?: string; phone?: string; password?: string; confirmPassword?: string }>({});
    const [isInternalLoading, setIsInternalLoading] = useState(false);
    const [signupStatus, setSignupStatus] = useState('Sign Up');

    const { signIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const isLoading = authLoading || isInternalLoading;

    const validateInfo = () => {
        const newErrors: { sapId?: string; name?: string; phone?: string; password?: string; confirmPassword?: string } = {};
        if (!sapId) newErrors.sapId = 'SAP ID is required';
        else if (!/^\d{6,11}$/.test(sapId)) newErrors.sapId = 'Invalid SAP ID format';

        if (!name) newErrors.name = 'Name is required';
        else if (name.length < 2) newErrors.name = 'Name is too short';

        if (!phone) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Invalid phone number';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateInfo()) return;

        setSignupStatus('Creating Account...');
        setIsInternalLoading(true);
        try {
            await apiService.signup(sapId, name, password, confirmPassword, phone);

            Alert.alert(
                'Success',
                'New User Created',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            setSignupStatus('Logging In...');
                            await signIn(sapId, password);
                            // Navigation handled by useProtectedRoute in AuthContext
                        }
                    }
                ]
            );

        } catch (error: any) {
            setSignupStatus('Sign Up');
            if (Platform.OS === 'web') {
                window.alert(error.message || 'Signup failed');
            } else {
                Alert.alert('Error', error.message || 'Signup failed');
            }
        } finally {
            setIsInternalLoading(false);
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>New User Sign Up</Text>
                    <Text style={styles.subtitle}>
                        Create your account
                    </Text>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={[styles.input, errors.name ? styles.inputError : null]}
                                placeholder="Enter your name"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (errors.name) setErrors({ ...errors, name: undefined });
                                }}
                                editable={!isLoading}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

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
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={[styles.input, errors.phone ? styles.inputError : null]}
                                placeholder="Enter Phone Number"
                                value={phone}
                                onChangeText={(text) => {
                                    setPhone(text);
                                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                                }}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={!isLoading}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={[styles.input, errors.password ? styles.inputError : null]}
                                placeholder="Create Password"
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

                        <View>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                                }}
                                secureTextEntry
                                editable={!isLoading}
                            />
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        <CustomButton
                            title={isLoading ? signupStatus : 'Sign Up'}
                            isLoading={isLoading}
                            onPress={handleSignup}
                            disabled={isLoading}
                            style={{ marginTop: Spacing.lg }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl,
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
    testNote: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
        fontStyle: 'italic',
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
