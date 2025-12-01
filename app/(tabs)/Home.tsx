import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Home() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({headerTitle: () => (<Text style={{fontSize:18,fontWeight:'bold'}}>
            Welcome to AI Pocket Agent
        </Text>)});
    })
    return (
        <View>
            <Text>Home</Text>
        </View>
    )
}