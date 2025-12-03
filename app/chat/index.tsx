import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

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