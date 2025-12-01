import React from 'react'
import { View } from 'react-native'

type Props = {
    agent : Agent
}

type Agent = {
    id: number,
    name: string,
    desc: string,
    image: string,
    initialText: string,
    prompt: string,
    type: string,
    featured?: boolean
}

export default function AgentCard({agent}: Props) {
    return (
        <View>
            
        </View>
    )
}