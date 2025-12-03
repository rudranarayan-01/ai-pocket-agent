import { Agents } from '@/shred/AgentList'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import NonFeaturedAgentCard from './NonFeaturedAgentCard'

export default function NonFeaturedAgentList({ isFeatured }: any) {
    const filteredAgents = Agents.filter(agent =>
            isFeatured ? agent.featured === true : agent.featured !== true
        )
    return (
        <View>
            <FlatList
                data={filteredAgents}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => router.push({
                                    pathname: '/chat',
                                    params: {
                                        agentName: item.name,
                                        agentPrompt: item.prompt,
                                        agentInitialText: item.initialText,
                                        agentId: item.id
                                    }
                                })}
                                style={{ flex: 1, padding: 5 }}>
                        <NonFeaturedAgentCard agent={item} key={index} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}