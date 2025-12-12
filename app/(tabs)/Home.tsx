import AgentListComponent from '@/components/Home/AgentListComponent';
import CreateAgentBanner from '@/components/Home/CreateAgentBanner';
import NonFeaturedAgentList from '@/components/Home/NonFeaturedAgentList';
import Colors from '@/shred/Colors';
import { useNavigation } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                AI Pocket Agent
            </Text>),
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, gap: 6, padding: 5, paddingHorizontal: 10, borderRadius: 8, backgroundColor: Colors.PRIMARY }}>
                    <Image source={require('@/assets/images/diamond.png')} style={{ width: 25, height: 25 }} />
                    <Text style={{ fontSize: 16, color: Colors.WHITE, fontWeight: 'bold' }}>Pro</Text>
                </TouchableOpacity>),
            headerRight: () => (
                <Settings size={24} color={Colors.BLACK} style={{ marginRight: 15 }} />
            )
        });
    })
    return (
        <FlatList renderItem={null} data={[]}
            ListHeaderComponent={
                <View style={{ padding: 15 }}>
                    <AgentListComponent isFeatured={true}/>
                    <CreateAgentBanner />
                    <NonFeaturedAgentList isFeatured={false}/>
                </View>
            }>
        </FlatList>
    )
}