import Colors from '@/shred/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

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
        <View>
            <FlatList data={messages} renderItem={({ item, index }) => (
                <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]} >
                    <Text>{item.role}: {item.content}</Text>
                </View>
            )}>

            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 4,
        padding: 10,
        margin:10,
        borderRadius: 12,
    },
    assistantMessage: {
        backgroundColor:Colors.LIGHT_GRAY,
        alignSelf: 'flex-start',
        borderBottomLeftRadius:2,
        color: Colors.BLACK

    },
    userMessage: {
        backgroundColor: Colors.PRIMARY,
        alignSelf: 'flex-end',
        borderBottomRightRadius:2,
    }
});