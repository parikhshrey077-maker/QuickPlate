
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function CustomButton({
    title,
    onPress,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}: CustomButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return Colors.light.border;
        switch (variant) {
            case 'primary': return Colors.light.primary;
            case 'secondary': return Colors.light.secondary;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return Colors.light.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.light.textSecondary;
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return '#FFFFFF';
            case 'outline': return Colors.light.primary;
            case 'ghost': return Colors.light.primary;
            default: return '#FFFFFF';
        }
    };

    const borderStyle = variant === 'outline' ? { borderWidth: 1, borderColor: Colors.light.primary } : {};

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                borderStyle,
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
        marginVertical: Spacing.xs,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});
