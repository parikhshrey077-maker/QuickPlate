
import { IconSymbol } from '../../components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCart } from '../../context/CartContext';
export default function RewardsScreen() {
    const { user } = useAuth();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.hero}>
                <Text style={styles.pointsTitle}>My Points</Text>
                <Text style={styles.pointsValue}>{user?.loyaltyPoints || 0}</Text>
                <Text style={styles.tier}>{user?.tier || 'Bronze'} Member</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>How it works</Text>

                    <View style={styles.ruleItem}>
                        <IconSymbol name="star.fill" size={24} color={Colors.light.primary} style={styles.ruleIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ruleTitle}>Earn Points</Text>
                            <Text style={styles.ruleDesc}>Get 5% of your total bill as loyalty points on every order.</Text>
                        </View>
                    </View>

                    <View style={styles.ruleItem}>
                        <IconSymbol name="indianrupeesign.circle.fill" size={24} color={Colors.light.primary} style={styles.ruleIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ruleTitle}>1 Point = ₹1</Text>
                            <Text style={styles.ruleDesc}>Your points have a direct rupee value. 1 point is equal to ₹1.</Text>
                        </View>
                    </View>

                    <View style={styles.ruleItem}>
                        <IconSymbol name="gift.fill" size={24} color={Colors.light.primary} style={styles.ruleIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.ruleTitle}>Use at Checkout</Text>
                            <Text style={styles.ruleDesc}>Simply use your points to pay for your next meal during checkout.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    hero: {
        backgroundColor: Colors.light.primary,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    pointsTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    pointsValue: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: 'bold',
    },
    tier: {
        color: Colors.light.secondary,
        backgroundColor: '#FFF',
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        borderRadius: BorderRadius.circle,
        marginTop: Spacing.sm,
        fontWeight: 'bold',
    },
    content: {
        padding: Spacing.md,
    },
    infoCard: {
        backgroundColor: Colors.light.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.light.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: Spacing.lg,
        color: Colors.light.text,
        textAlign: 'center',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
    },
    ruleIcon: {
        marginRight: Spacing.md,
        marginTop: 2,
    },
    ruleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    ruleDesc: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        lineHeight: 20,
    },
});
