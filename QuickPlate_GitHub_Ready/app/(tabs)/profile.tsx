
import { CustomButton } from '../../components/CustomButton';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleFAQ = () => {
        const message = "1. How to earn points? - Spend ₹100, earn 5 points.\n2. How to redeem? - Use the toggle at checkout.\n3. Pickup location? - Main Canteen Counter.";
        if (Platform.OS === 'web') {
            window.alert("Frequently Asked Questions\n\n" + message);
        } else {
            Alert.alert('Frequently Asked Questions', message, [{ text: 'OK' }]);
        }
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(prev => !prev);
    };

    const handleAbout = () => {
        const message = "QuickPlate transforms campus dining by solving everyday frustrations like long queues and cold meals. We create seamless, efficient food experiences for busy students and canteen teams alike.";
        if (Platform.OS === 'web') {
            window.alert("About QuickPlate\n\n" + message);
        } else {
            Alert.alert('About QuickPlate', message, [{ text: 'OK' }]);
        }
    };

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Are you sure you want to logout?');
            if (confirmed) {
                signOut();
            }
        } else {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: signOut },
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.id}>ID: {user?.sapId || user?.id || 'N/A'}</Text>
            </View>

            <ScrollView style={styles.menu}>
                <View style={styles.section}>
                    <MenuItem
                        icon="pencil.circle.fill"
                        title="Edit Profile"
                        onPress={() => router.push('/edit-profile')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <View style={styles.menuItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <IconSymbol name="bell.fill" size={20} color={Colors.light.text} style={{ marginRight: 12 }} />
                            <Text style={styles.menuText}>Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#d1d1d1', true: Colors.light.primary }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <MenuItem icon="questionmark.circle.fill" title="FAQ" onPress={handleFAQ} />
                    <MenuItem icon="info.circle.fill" title="About" onPress={handleAbout} />
                </View>

                <CustomButton
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    style={styles.logoutButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuItem({ title, icon, onPress }: { title: string; icon: any; onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <IconSymbol name={icon} size={20} color={Colors.light.text} style={{ marginRight: 12 }} />
            <Text style={styles.menuText}>{title}</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.textSecondary} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        padding: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.surfaceHighlight,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    id: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    menu: {
        padding: Spacing.md,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: 2,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
    },
    logoutButton: {
        marginTop: Spacing.md,
        borderColor: Colors.light.error,
    },
});
