import Colors from '@/shred/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Plus, Send } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialMessages = [
    { role: 'user', content: 'Hello, who are you?' },
    { role: 'assistant', content: 'I am good, what about you ?' },
]

export default function ChatUI() {
    const navigation = useNavigation();
    const { agentName, agentPrompt, agentInitialText, agentId } = useLocalSearchParams();
    const [messages, setMessages] = React.useState(initialMessages);
    const [input, setInput] = useState<string>();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: agentName || 'Chat',
            headerBackTitle: 'Back',
            headerRight: () => (
                <Plus />
            )
        })
    })

    const onSendMessage = () => {
        if(!input?.trim()) return;

        const newMessage = { role: 'user', content: input.trim() };
        setMessages([...messages, newMessage]);
        setInput('');
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, padding:10 }}  keyboardVerticalOffset={80} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <FlatList data={messages} renderItem={({ item, index }) => (
                <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]} >
                    <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>{item.content}</Text>
                </View>
            )}>

            </FlatList>

            {/* Input area can be added here */}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderTopWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "white"
            }}>
                {/* Camera Button */}
                <TouchableOpacity style={{ marginRight: 8 }}>
                    <Camera size={26} color="#555" />
                </TouchableOpacity>

                {/* Text Input */}
                <TextInput
                    style={{
                        flex: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: "#f2f2f2",
                        borderRadius: 20,
                        fontSize: 16
                    }}
                    placeholder="Type a message..."
                    onChange={(v)=>setInput(v.nativeEvent.text)}
                    value={input}
                    placeholderTextColor="#888"
                />

                {/* Send Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: "#007bff",
                        padding: 10,
                        borderRadius: 20,
                        marginLeft: 8
                    }}
                    onPress={onSendMessage}
                >
                    <Send size={18} color="white" />
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 12,
    },
    assistantMessage: {
        backgroundColor: Colors.LIGHT_GRAY,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 2,
        color: Colors.BLACK

    },
    userMessage: {
        backgroundColor: Colors.PRIMARY,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 2,
    },
    userText: { color: Colors.WHITE },
    messageText: { fontSize: 16 },
    assistantText: { color: Colors.BLACK },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 12
    },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: Colors.WHITE,
        marginRight: 8,
        paddingHorizontal: 15,
    }
});