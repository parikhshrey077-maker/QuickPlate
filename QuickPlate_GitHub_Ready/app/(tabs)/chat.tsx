import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { apiService } from '../../services/api';
import React, { useState, useRef, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
};

export default function ChatTab() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm QuickPlate AI Assistant. I can help you with menu questions, ingredients, allergens, and order information. How can I help you today?",
            isUser: false,
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Prepare conversation history
            const history = messages.slice(1).map(msg => ({
                user: msg.isUser ? msg.text : '',
                assistant: !msg.isUser ? msg.text : '',
            })).filter(h => h.user || h.assistant);

            const response = await apiService.chat(userMessage.text, history);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.message,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting. Please make sure the backend is running and you've added your Gemini API key.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickQuestions = [
        "What vegetarian options do you have?",
        "What's in the Veg Thali?",
        "How long does preparation take?",
        "Tell me about loyalty points",
    ];

    const handleQuickQuestion = (question: string) => {
        setInputText(question);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <Text style={styles.headerSubtitle}>QuickPlate Chatbot</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((message) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageBubble,
                                message.isUser ? styles.userBubble : styles.aiBubble,
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                message.isUser ? styles.userText : styles.aiText,
                            ]}>
                                {message.text}
                            </Text>
                        </View>
                    ))}
                    {isLoading && (
                        <View style={[styles.messageBubble, styles.aiBubble]}>
                            <ActivityIndicator size="small" color={Colors.light.primary} />
                        </View>
                    )}

                    {messages.length === 1 && (
                        <View style={styles.quickQuestionsContainer}>
                            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
                            {quickQuestions.map((q, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.quickQuestionButton}
                                    onPress={() => handleQuickQuestion(q)}
                                >
                                    <Text style={styles.quickQuestionText}>{q}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Ask me anything..."
                        placeholderTextColor={Colors.light.textSecondary}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
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
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        zIndex: 10,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    content: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: Spacing.md,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.light.primary,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userText: {
        color: '#FFF',
    },
    aiText: {
        color: Colors.light.text,
    },
    quickQuestionsContainer: {
        marginTop: Spacing.lg,
    },
    quickQuestionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        marginBottom: Spacing.sm,
    },
    quickQuestionButton: {
        backgroundColor: Colors.light.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    quickQuestionText: {
        fontSize: 14,
        color: Colors.light.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        backgroundColor: Colors.light.background,
        paddingBottom: Platform.OS === 'ios' ? 0 : Spacing.md,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.light.surface,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        marginRight: Spacing.sm,
        maxHeight: 100,
        fontSize: 15,
        color: Colors.light.text,
    },
    sendButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.light.border,
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
