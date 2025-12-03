import Colors from '@/shred/Colors'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

type Props = {
    agent: Agent
}

export type Agent = {
    id: number,
    name: string,
    desc: string,
    image: string,
    initialText: string,
    prompt: string,
    type: string,
    featured?: boolean
}

export default function AgentCard({ agent }: Props) {
    const router = useRouter();
    return (
        <View style={{ padding: 15, minHeight: 200, backgroundColor: Colors.WHITE, borderRadius: 10,}}>
            <View style={{ padding: 15, backgroundColor: Colors.WHITE, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderRadius: 10, }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{agent.name}</Text>
                <Text numberOfLines={2} style={{ color: Colors.GRAY, marginTop: 2 }}>{agent.desc}</Text>
            </View>
            <View style={{ right: 0, bottom: 0, position: 'absolute' }}>

                {/* @ts-ignore */}
                <Image source={agent.image} style={{ width: 100, height: 100, resizeMode: 'contain', marginTop: 10 }} />
            </View>
        </View>
    )
}