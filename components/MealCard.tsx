
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Meal } from '@/constants/MockData';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';

interface MealCardProps {
    meal: Meal;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export function MealCard({ meal, quantity, onIncrement, onDecrement }: MealCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{meal.name}</Text>
                    <Text style={styles.price}>₹{meal.price}</Text>
                </View>
                <Text style={styles.description} numberOfLines={3}>{meal.description}</Text>
                <View style={styles.footer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{meal.category}</Text>
                    </View>

                    {quantity > 0 ? (
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={onDecrement} style={styles.qtyButton}>
                                <IconSymbol name="minus" size={16} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{quantity}</Text>
                            <TouchableOpacity onPress={onIncrement} style={styles.qtyButton}>
                                <IconSymbol name="plus" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={onIncrement} style={styles.addButton}>
                            <IconSymbol name="plus" size={20} color="#FFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: BorderRadius.md,
        // overflow: 'hidden', // No longer needed
        marginBottom: Spacing.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.light.border,
        // ...Shadows.light.small, // Optional: remove shadow for a flatter, cleaner look or keep it. Let's keep it subtle.
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
            android: { elevation: 2 },
            web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }
        })
    },
    // image: { ... } Removed
    content: {
        // padding: Spacing.md, // Padding is now on the card itself
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align top if name wraps
        marginBottom: Spacing.sm,
    },
    name: {
        fontSize: 20, // Increased size
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1, // Allow text to take space
        marginRight: Spacing.sm,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: Colors.light.textSecondary,
        marginBottom: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    badge: {
        backgroundColor: Colors.light.surface, // Subtler background
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.pill,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    addButton: {
        backgroundColor: Colors.light.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.pill,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    qtyButton: {
        backgroundColor: Colors.light.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: Spacing.md,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
});

// End of file
