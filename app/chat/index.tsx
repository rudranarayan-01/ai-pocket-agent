import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const initialMessages = [
    {
        id: '1',
        text: 'Hello! How can I assist you today?',
        sender: 'agent',
        timestamp: '2023-10-01T10:00:00Z',  
    },
]

export default function ChatUI() {
    const navigation = useNavigation();
    const {agentName, agentPrompt, agentInitialText, agentId} = useLocalSearchParams();

    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle: agentName || 'Chat',
            headerBackTitle: 'Back',
            headerRight:()=>(
                <Plus/>
            )
        })
    })

    return (
        <View>
            <Text>Chat index</Text>
        </View>
    )
}