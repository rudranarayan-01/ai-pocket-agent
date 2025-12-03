import Colors from '@/shred/Colors'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { Agent } from './AgentCard'

type Props = {
    agent: Agent
}

export default function NonFeaturedAgentCard({ agent }: Props) {
    return (
        <View style={{ padding: 15, minHeight: 180, backgroundColor: Colors.WHITE, borderRadius: 10, }}>
            <View>
                {/* @ts-ignore */}
                <Image source={agent.image} style={{ width: 80, height: 80, resizeMode: 'contain', marginTop: 10 }} />
            </View>
            <View style={{marginTop: 10}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{agent.name}</Text>
                <Text numberOfLines={2} style={{ color: Colors.GRAY, marginTop: 2 }}>{agent.desc}</Text>
            </View>
        </View>
    )
}