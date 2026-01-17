
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusType = 'Preparing' | 'Ready Soon' | 'Ready for Pickup' | 'Picked Up';

export function StatusBadge({ status }: { status: string }) {
    let backgroundColor;
    let textColor = '#FFF';

    switch (status) {
        case 'Preparing':
            backgroundColor = Colors.light.warning;
            textColor = '#000';
            break;
        case 'Ready Soon':
            backgroundColor = Colors.light.secondary;
            break;
        case 'Ready for Pickup':
            backgroundColor = Colors.light.success;
            break;
        case 'Picked Up':
            backgroundColor = Colors.light.textSecondary;
            break;
        default:
            backgroundColor = Colors.light.primary;
    }

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.circle,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});
