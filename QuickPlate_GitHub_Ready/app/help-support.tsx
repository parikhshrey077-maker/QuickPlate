
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

const FAQS = [
    {
        q: "How do I place an order?",
        a: "Browse the menu, add items to your cart, select a pickup time, and proceed to checkout."
    },
    {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 5 minutes of placing them if the kitchen hasn't started preparation."
    },
    {
        q: "Where is the pickup point?",
        a: "The pickup point is at the main canteen counter. Look for the 'QuickPlate Pickup' sign."
    },
];

export default function HelpSupportScreen() {
    const router = useRouter();

    const handleEmail = () => {
        Linking.openURL('mailto:support@quickplate.com');
    };

    const handleCall = () => {
        Linking.openURL('tel:+919876543210');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {FAQS.map((faq, index) => (
                        <View key={index} style={styles.faqItem}>
                            <Text style={styles.question}>{faq.q}</Text>
                            <Text style={styles.answer}>{faq.a}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                        <View style={styles.iconCircle}>
                            <IconSymbol name="envelope.fill" size={20} color={Colors.light.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Email Support</Text>
                            <Text style={styles.contactValue}>support@quickplate.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                        <View style={styles.iconCircle}>
                            <IconSymbol name="phone.fill" size={20} color={Colors.light.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Call Us</Text>
                            <Text style={styles.contactValue}>+91 98765 43210</Text>
                        </View>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        padding: Spacing.sm,
        marginLeft: -Spacing.sm,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    content: {
        padding: Spacing.md,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: Spacing.md,
    },
    faqItem: {
        backgroundColor: Colors.light.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    answer: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        lineHeight: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    contactLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
});
