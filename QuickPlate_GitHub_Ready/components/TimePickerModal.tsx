
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface TimePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectTime: (time: string) => void;
}

export function TimePickerModal({ visible, onClose, onSelectTime }: TimePickerModalProps) {
    // Generate time slots (e.g., next few hours in 15 min intervals)
    const generateTimeSlots = () => {
        const slots = [];
        const start = new Date();
        start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15);
        start.setSeconds(0);
        start.setMilliseconds(0);

        for (let i = 0; i < 12; i++) { // Next 3 hours
            const time = new Date(start.getTime() + i * 15 * 60000);
            slots.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        return slots;
    };

    const slots = generateTimeSlots();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Select Pickup Time</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <IconSymbol name="xmark" size={24} color={Colors.light.text} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={slots}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.timeSlot}
                                        onPress={() => {
                                            onSelectTime(item);
                                            onClose();
                                        }}
                                    >
                                        <Text style={styles.timeText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        height: '50%',
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
        paddingBottom: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    listContent: {
        paddingBottom: Spacing.xl,
    },
    timeSlot: {
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.surfaceHighlight,
    },
    timeText: {
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
    },
});
