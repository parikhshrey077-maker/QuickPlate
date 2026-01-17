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

export default function EditProfileScreen() {
    const { user, updateProfile } = useAuth();
    const router = useRouter();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Password Change State
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!name || !phone) {
            Alert.alert('Error', 'Name and Phone Number are required');
            return;
        }

        setIsLoading(true);
        try {
            // Update Basic Info
            await updateProfile({ name, phone });

            // Update Password if req
            if (isChangingPassword) {
                if (!oldPassword || !newPassword || !confirmNewPassword) {
                    Alert.alert('Error', 'All password fields are required');
                    setIsLoading(false);
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    Alert.alert('Error', 'New passwords do not match');
                    setIsLoading(false);
                    return;
                }

                await apiService.changePassword(user.id, oldPassword, newPassword);
            }

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.section}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter Name"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter Phone"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={[styles.section, { marginTop: Spacing.xl }]}>
                        <TouchableOpacity
                            style={styles.passwordToggle}
                            onPress={() => setIsChangingPassword(!isChangingPassword)}
                        >
                            <Text style={styles.passwordToggleText}>
                                {isChangingPassword ? 'Cancel Change Password' : 'Change Password'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isChangingPassword && (
                        <View style={styles.passwordSection}>
                            <View style={styles.section}>
                                <Text style={styles.label}>Current Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry
                                    placeholder="Enter Current Password"
                                />
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.label}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    placeholder="Enter New Password"
                                />
                            </View>
                            <View style={styles.section}>
                                <Text style={styles.label}>Confirm New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={confirmNewPassword}
                                    onChangeText={setConfirmNewPassword}
                                    secureTextEntry
                                    placeholder="Confirm New Password"
                                />
                            </View>
                        </View>
                    )}

                    <CustomButton
                        title={isLoading ? "Updating..." : "Save Changes"}
                        onPress={handleUpdateProfile}
                        disabled={isLoading}
                        style={{ marginTop: Spacing.xl }}
                    />

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.surfaceHighlight,
    },
    backButton: {
        padding: Spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.md,
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
    passwordToggle: {
        alignSelf: 'flex-start',
    },
    passwordToggleText: {
        color: Colors.light.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    passwordSection: {
        marginTop: Spacing.sm,
        padding: Spacing.md,
        backgroundColor: Colors.light.card,
        borderRadius: BorderRadius.md,
    },
});
