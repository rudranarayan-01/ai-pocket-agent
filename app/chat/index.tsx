import Colors from '@/shred/Colors';
import { AIChatModel } from '@/shred/GlobalAPI';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Plus, Send } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
    role: string;
    content: string;
};

export default function ChatUI() {
    const navigation = useNavigation();
    const { agentName, agentPrompt, agentInitialText, agentId } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
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

    useEffect(() => {
        if(agentPrompt){
            setMessages((prev)=>[...prev, {role: 'assistant', content: agentPrompt.toString()}]);
        }
    }, [agentPrompt])

    const onSendMessage = async() => {
        if (!input?.trim()) return;

        const newMessage = { role: 'user', content: input};
        setMessages((prev) => [...prev, newMessage]);
        setInput('');

        const result = await AIChatModel([...messages, newMessage]);
        console.log("AI Response:", result);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, padding: 5, borderRadius: 15 }} keyboardVerticalOffset={80} behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
            {/* @ts-ignore */}
            <FlatList data={messages} renderItem={({ item, index }) => item.role !=='system' && (
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
                borderRadius: 25,
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
                    onChange={(v) => setInput(v.nativeEvent.text)}
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