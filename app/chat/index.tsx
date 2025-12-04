import Colors from '@/shred/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Plus, Send } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const initialMessages = [
    { role: 'user', content: 'Hello, who are you?' },
    { role: 'assistant', content: 'I am good, what about you ?' },
]

export default function ChatUI() {
    const navigation = useNavigation();
    const { agentName, agentPrompt, agentInitialText, agentId } = useLocalSearchParams();
    const [messages, setMessages] = React.useState(initialMessages);

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

    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE, padding: 10 }}>
            <FlatList data={messages} renderItem={({ item, index }) => (
                <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]} >
                    <Text style={[styles.messageText, item.role === 'user' ? styles.userText : styles.assistantText]}>{item.content}</Text>
                </View>
            )}>

            </FlatList>

            {/* Input area can be added here */}
            <View style={styles.inputContainer}>
                {/* Text area camera button  */}
                <TouchableOpacity style={{ marginRight: 10 }}>
                    <Camera size={27} />
                </TouchableOpacity>

                {/* Text area input field  */}
                <TextInput style={styles.input} placeholder='Type a message...' />

                {/* Text area send button  */}
                <TouchableOpacity style={{ backgroundColor: Colors.PRIMARY, padding: 7, borderRadius: 20 }}>
                    <Send color={Colors.WHITE} size={20} />
                </TouchableOpacity>
            </View>
        </View>
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
        borderColor: '#CCC'
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